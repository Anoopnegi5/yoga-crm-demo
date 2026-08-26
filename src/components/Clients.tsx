import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Client } from '../types';
import { EditClientModal } from './Modals/EditClientModal';
import { getClientCurrentMonthPaymentStatus } from '../utils/paymentUtils';
import { getRecordRecencyScore } from '../utils/cloudSync';
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  MessageCircle, 
  CreditCard, 
  Eye, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Filter,
  Pencil,
  Grid,
  Layers,
  Sparkles,
  UserX,
  UserCheck,
  Table,
  TrendingUp,
  Activity,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const Clients: React.FC = () => {
  const { 
    clients, 
    payments,
    leaves,
    attendance,
    setSelectedClientId, 
    setIsAddPaymentOpen, 
    setPaymentModalDefaultClientId,
    markAttendance,
    toggleClientStatus,
    showSuccessToast
  } = useApp();

  const [viewMode, setViewMode] = useState<'cards' | 'groups' | 'table'>('cards');
  const [filterStatus, setFilterStatus] = useState<'Active' | 'Discontinued' | 'All'>('Active');
  const [filterSlot, setFilterSlot] = useState<string>('All');
  const [filterType, setFilterType] = useState<string>('All');
  const [filterGroup, setFilterGroup] = useState<string>('All');
  const [search, setSearch] = useState<string>('');

  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // Extract unique Group Batch names
  const groupBatchNames = Array.from(new Set(clients.map(c => c.groupName || 'General Yoga Batch')));

  // Filter clients dynamically and sort newly added clients at the very TOP
  const filteredClients = clients
    .filter((client) => {
      if (!client) return false;
      const matchesSearch = 
        (client.name || '').toLowerCase().includes((search || '').toLowerCase()) ||
        (client.phone || '').includes(search) ||
        (client.groupName || '').toLowerCase().includes((search || '').toLowerCase()) ||
        (client.goal || '').toLowerCase().includes((search || '').toLowerCase());

      const matchesStatus = 
        filterStatus === 'All' ? true :
        filterStatus === 'Discontinued' ? client.status === 'Discontinued' :
        client.status !== 'Discontinued';

      const matchesSlot = filterSlot === 'All' || 
        client.timeSlot === filterSlot || 
        (filterSlot === 'Morning' && (client.classTime || '').toUpperCase().includes('AM')) || 
        (filterSlot === 'Evening' && (client.classTime || '').toUpperCase().includes('PM'));
      const matchesType = filterType === 'All' || client.sessionType === filterType;
      const matchesGroup = filterGroup === 'All' || client.groupName === filterGroup;

      return matchesSearch && matchesStatus && matchesSlot && matchesType && matchesGroup;
    })
    .sort((a, b) => getRecordRecencyScore(b) - getRecordRecencyScore(a));

  // Group clients by groupName for Group Batches View
  const groupedBatchesMap: Record<string, Client[]> = {};
  filteredClients.forEach(client => {
    if (client.sessionType === 'Personal') return;
    const key = client.groupName || 'Group Yoga Class';
    if (!key || key.toLowerCase().includes('personal')) return;
    if (!groupedBatchesMap[key]) groupedBatchesMap[key] = [];
    groupedBatchesMap[key].push(client);
  });

  const handleMarkBatchPresent = (batchClients: Client[], batchName: string) => {
    batchClients.forEach(c => {
      markAttendance(c.id, 'Present');
    });
    showSuccessToast(`Marked entire ${batchName} present today!`);
  };

  const activeCount = clients.filter(c => c.status !== 'Discontinued').length;
  const discontinuedCount = clients.filter(c => c.status === 'Discontinued').length;

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Streamlined Filter & View Switcher Bar */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        
        {/* Left Side: Status Pills & View Mode */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl">
            <button
              onClick={() => setFilterStatus('Active')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterStatus === 'Active'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🟢 Active ({activeCount})
            </button>
            <button
              onClick={() => setFilterStatus('Discontinued')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterStatus === 'Discontinued'
                  ? 'bg-amber-500 text-amber-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ⏸️ Left ({discontinuedCount})
            </button>
            <button
              onClick={() => setFilterStatus('All')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterStatus === 'All'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📁 All ({clients.length})
            </button>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl">
            <button
              onClick={() => setViewMode('cards')}
              title="Visual Cards Grid View"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'cards'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
            
            <button
              onClick={() => setViewMode('groups')}
              title="Group Batches View"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'groups'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Batches ({Object.keys(groupedBatchesMap).length})</span>
            </button>

            <button
              onClick={() => setViewMode('table')}
              title="Compact Table List"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>
        </div>

        {/* Right Side: Search Input & Timing Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search yogis, phone, goal..."
              className="w-full pl-9 pr-4 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Time Slot Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl shrink-0">
            {['All', 'Morning', 'Evening'].map((slot) => (
              <button
                key={slot}
                onClick={() => setFilterSlot(slot)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterSlot === slot
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* VIEW MODE 1: GROUP BATCHES VIEW */}
      {viewMode === 'groups' && (
        <div className="space-y-6 animate-fadeIn">
          {Object.keys(groupedBatchesMap).length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 text-xs font-medium text-slate-400">
              No Group Batches matching filter criteria.
            </div>
          ) : (
            Object.entries(groupedBatchesMap).map(([batchTitle, batchClients]) => (
              <div
                key={batchTitle}
                className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4 relative overflow-hidden"
              >
                {/* Batch Header Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-slate-900 text-lg">{batchTitle}</h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
                        {batchClients.length} Yogis Enrolled
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleMarkBatchPresent(batchClients, batchTitle)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-sm transition-all active:scale-95"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Mark Entire Batch Present Today
                  </button>
                </div>

                {/* Batch Clients Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                  {batchClients.map(client => (
                    <div
                      key={client.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-300 transition-all flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={client.photoUrl}
                          alt={client.name}
                          className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-100 group-hover:scale-105 transition-transform"
                        />
                        <div>
                          <div className="flex items-center gap-1">
                            <h5 
                              onClick={() => setSelectedClientId(client.id)}
                              className="font-extrabold text-slate-900 text-xs hover:text-emerald-700 cursor-pointer"
                            >
                              {client.name}
                            </h5>
                            <span className="text-[10px] font-bold text-slate-500">
                              {client.gender === 'Female' ? '♀' : '♂'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                            ⏰ {client.classTime} • {client.phone}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setSelectedClientId(client.id)}
                          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-emerald-600 hover:border-emerald-200 transition-colors"
                          title="View Profile"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingClient(client)}
                          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-emerald-600 transition-colors"
                          title="Edit Client"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* VIEW MODE 2: REDESIGNED BEAUTIFUL CARDS GRID VIEW */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
          {filteredClients.map((client) => {
            const { status: currentMonthStatus, dueAmount, paidAmount } = getClientCurrentMonthPaymentStatus(client, payments, undefined, leaves);
            const isPaid = currentMonthStatus === 'Paid';
            const isDiscontinued = client.status === 'Discontinued';
            const isPerSession = client.feeType === 'Per Session';

            return (
              <div
                key={client.id}
                className={`rounded-3xl p-6 shadow-sm border transition-all flex flex-col justify-between group overflow-hidden relative ${
                  isDiscontinued
                    ? 'bg-amber-50/40 border-amber-200/80 opacity-90'
                    : 'bg-white border-slate-200/80 hover:border-emerald-500/40 hover:shadow-xl hover:-translate-y-1'
                }`}
              >
                {/* Card Top Section */}
                <div className="space-y-4">
                  
                  {/* Top Row: Avatar + Name + Contact + Payment Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div className="relative shrink-0">
                        <img
                          src={client.photoUrl}
                          alt={client.name}
                          className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500/30 group-hover:ring-emerald-500 group-hover:scale-105 transition-all shadow-xs bg-slate-50"
                        />
                        <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full ring-2 ring-white ${
                          isDiscontinued ? 'bg-amber-500' : 'bg-emerald-500'
                        }`} />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 
                            onClick={() => setSelectedClientId(client.id)}
                            className="font-extrabold text-slate-900 text-base hover:text-emerald-700 cursor-pointer transition-colors leading-tight truncate"
                          >
                            {client.name}
                          </h3>
                          <span 
                            className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold shrink-0 ${
                              client.gender === 'Female' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {client.gender === 'Female' ? '♀' : '♂'}
                          </span>
                        </div>
                        
                        {/* Phone with direct WhatsApp click */}
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-500 font-semibold">{client.phone}</span>
                          <a
                            href={`https://api.whatsapp.com/send?phone=${client.whatsapp?.replace(/[^0-9]/g, '') || client.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded-md text-emerald-600 hover:bg-emerald-50 transition-colors"
                            title="Chat on WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Payment Status Pill */}
                    {isDiscontinued ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 text-amber-900 border border-amber-300 shrink-0">
                        ⏸️ Left
                      </span>
                    ) : isPerSession ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-teal-50 text-teal-800 border border-teal-200 shadow-xs shrink-0 flex items-center gap-1">
                        <span>⚡ Pay-As-You-Go</span>
                      </span>
                    ) : (
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shrink-0 ${
                        isPaid 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs' 
                          : currentMonthStatus === 'Partial'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {isPaid ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        <span>{isPaid ? 'PAID' : currentMonthStatus}</span>
                      </span>
                    )}
                  </div>

                  {/* Session Type & Group Batch Chip */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {(client.sessionType === 'Personal' || (client.groupName || '').toLowerCase().includes('personal')) ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-purple-50 text-purple-800 border border-purple-200/80 shadow-xs">
                        <span>👥 Personal class</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-xs">
                        <span>👥 {client.groupName || 'Group Yoga Class'}</span>
                      </span>
                    )}
                  </div>

                  {/* Timing & Schedule Box */}
                  <div className="bg-slate-50/90 p-3 rounded-2xl space-y-1.5 border border-slate-100">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span className="flex items-center gap-1.5 text-emerald-700">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" />
                        {client.classTime}
                      </span>
                      <span className="text-[11px] font-bold text-slate-500">
                        {client.timeSlot}
                      </span>
                    </div>
                    <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>Days: {client.days.join(' • ')}</span>
                    </div>
                  </div>

                  {/* Health Goal Focus */}
                  {client.goal && (
                    <div className="space-y-1">
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                        Health Goal
                      </div>
                      <div className="text-xs font-bold text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-100 truncate" title={client.goal}>
                        🎯 {client.goal}
                      </div>
                    </div>
                  )}

                  {/* Fee & Class Progress */}
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-500">
                        {isPerSession ? 'Session Rate:' : 'Monthly Fee:'}
                      </span>
                      <span className="text-slate-900 text-sm font-extrabold">
                        {isPerSession
                          ? `₹${client.perSessionFee || 800} / class`
                          : `₹${(client.monthlyFee || 0).toLocaleString()} / mo`}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                        <span>Attendance Progress</span>
                        <span className="text-slate-700">{client.completedClasses || 0} / {client.totalClasses || 30} Classes</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, ((client.completedClasses || 0) / (client.totalClasses || 30)) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                </div>

                {/* Card Bottom Actions */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 mt-4">
                  {/* View Profile Button */}
                  <button
                    onClick={() => setSelectedClientId(client.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-extrabold text-xs transition-all active:scale-95"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Profile</span>
                  </button>

                  {/* Status Toggle or Edit */}
                  {isDiscontinued ? (
                    <button
                      onClick={() => toggleClientStatus(client.id, 'Active')}
                      className="px-3 py-2 rounded-2xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-xs transition-colors flex items-center gap-1"
                      title="Re-activate Client"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Re-activate</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        const reason = window.prompt("Reason for leaving class:", "Discontinued class");
                        toggleClientStatus(client.id, 'Discontinued', reason || undefined);
                      }}
                      className="p-2.5 rounded-2xl bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-colors"
                      title="Mark Left Class"
                    >
                      <UserX className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={() => setEditingClient(client)}
                    className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                    title="Edit Profile & Fees"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW MODE 3: COMPACT TABLE LIST VIEW */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden animate-fadeIn">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 uppercase font-extrabold text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Client Name</th>
                  <th className="px-6 py-4">Session & Timing</th>
                  <th className="px-6 py-4">Days</th>
                  <th className="px-6 py-4">Fee Details</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredClients.map(client => {
                  const { status: currentMonthStatus } = getClientCurrentMonthPaymentStatus(client, payments, undefined, leaves);
                  const isPaid = currentMonthStatus === 'Paid';
                  const isPerSession = client.feeType === 'Per Session';

                  return (
                    <tr key={client.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={client.photoUrl}
                            alt={client.name}
                            className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200"
                          />
                          <div>
                            <p 
                              onClick={() => setSelectedClientId(client.id)}
                              className="font-extrabold text-slate-900 hover:text-emerald-700 cursor-pointer"
                            >
                              {client.name} {client.gender === 'Female' ? '♀' : '♂'}
                            </p>
                            <p className="text-slate-400 font-semibold text-[11px]">{client.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800">
                          {(client.sessionType === 'Personal' || (client.groupName || '').toLowerCase().includes('personal')) ? 'Personal class' : (client.sessionType || 'Group')} • {client.classTime}
                        </p>
                        <p className="text-slate-500 text-[11px]">
                          {(client.sessionType === 'Personal' || (client.groupName || '').toLowerCase().includes('personal')) ? 'Personal' : (client.groupName || 'Group Yoga Class')}
                        </p>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-600">
                        {client.days.join(', ')}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-extrabold text-slate-900">
                          {isPerSession ? `₹${client.perSessionFee || 800}/session` : `₹${(client.monthlyFee || 0).toLocaleString()}/mo`}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                          isPaid ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          {isPaid ? 'PAID' : currentMonthStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedClientId(client.id)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold"
                          >
                            View
                          </button>
                          <button
                            onClick={() => setEditingClient(client)}
                            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Client Modal */}
      <EditClientModal
        client={editingClient}
        isOpen={!!editingClient}
        onClose={() => setEditingClient(null)}
      />

    </div>
  );
};

