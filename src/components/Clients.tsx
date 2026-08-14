import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Client } from '../types';
import { EditClientModal } from './Modals/EditClientModal';
import { getClientCurrentMonthPaymentStatus } from '../utils/paymentUtils';
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
  UserCheck
} from 'lucide-react';

export const Clients: React.FC = () => {
  const { 
    clients, 
    payments,
    leaves,
    setIsAddClientOpen, 
    setSelectedClientId, 
    setIsAddPaymentOpen, 
    setPaymentModalDefaultClientId,
    markAttendance,
    toggleClientStatus
  } = useApp();

  const [viewMode, setViewMode] = useState<'cards' | 'groups'>('cards');
  const [filterStatus, setFilterStatus] = useState<'Active' | 'Discontinued' | 'All'>('Active');
  const [filterSlot, setFilterSlot] = useState<string>('All');
  const [filterType, setFilterType] = useState<string>('All');
  const [filterGroup, setFilterGroup] = useState<string>('All');
  const [search, setSearch] = useState<string>('');

  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // Extract unique Group Batch names
  const groupBatchNames = Array.from(new Set(clients.map(c => c.groupName || 'General Yoga Batch')));

  // Filter clients dynamically
  const filteredClients = clients.filter((client) => {
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
  });

  // Group clients by groupName for Group Batches View (Strictly ONLY Group Session clients!)
  const groupedBatchesMap: Record<string, Client[]> = {};
  filteredClients.forEach(client => {
    // Personal 1-on-1 clients are NOT group batches!
    if (client.sessionType === 'Personal') return;
    const key = client.groupName || 'Group Yoga Class';
    if (!key || key.toLowerCase().includes('personal')) return;
    if (!groupedBatchesMap[key]) groupedBatchesMap[key] = [];
    groupedBatchesMap[key].push(client);
  });

  const handleMarkBatchPresent = (batchClients: Client[], batchName: string) => {
    batchClients.forEach(c => markAttendance(c.id, 'Present'));
  };

  const activeCount = clients.filter(c => c.status !== 'Discontinued').length;
  const discontinuedCount = clients.filter(c => c.status === 'Discontinued').length;

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Header & Search Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-7 h-7 text-purple-600" />
            Yoga Client Journal ({activeCount} Active)
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Manage active clients, group batches, timings, and discontinued memberships.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'cards'
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              All Cards
            </button>
            
            <button
              onClick={() => setViewMode('groups')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'groups'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Group Batches ({Object.keys(groupedBatchesMap).length})
            </button>
          </div>

          <button
            onClick={() => setIsAddClientOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-xs shadow-md hover:scale-105 transition-all"
          >
            <Plus className="w-4 h-4" />
            + Add Client
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-3xl p-4 shadow-soft border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl shrink-0">
          <button
            onClick={() => setFilterStatus('Active')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterStatus === 'Active'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🟢 Active ({activeCount})
          </button>
          <button
            onClick={() => setFilterStatus('Discontinued')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterStatus === 'Discontinued'
                ? 'bg-amber-500 text-amber-950 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ⏸️ Left Class ({discontinuedCount})
          </button>
          <button
            onClick={() => setFilterStatus('All')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterStatus === 'All'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📁 All ({clients.length})
          </button>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client name, group, or goal..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Time Slot Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl">
            <span className="text-[10px] font-bold uppercase text-slate-400 px-2 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Slot:
            </span>
            {['All', 'Morning', 'Evening'].map((slot) => (
              <button
                key={slot}
                onClick={() => setFilterSlot(slot)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  filterSlot === slot
                    ? 'bg-white text-purple-700 shadow-sm font-bold'
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
        <div className="space-y-6">
          {Object.keys(groupedBatchesMap).length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-100 text-xs font-medium text-slate-400">
              No Group Batches matching filter criteria.
            </div>
          ) : (
            Object.entries(groupedBatchesMap).map(([batchTitle, batchClients]) => (
              <div
                key={batchTitle}
                className="bg-white rounded-3xl p-6 shadow-soft border border-slate-100 space-y-4 relative overflow-hidden"
              >
                {/* Batch Header Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-slate-900 text-lg">{batchTitle}</h3>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      Contains <strong className="text-purple-700">{batchClients.length} enrolled clients</strong>
                    </p>
                  </div>

                  <button
                    onClick={() => handleMarkBatchPresent(batchClients, batchTitle)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-sm transition-all"
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
                      className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-purple-200 transition-all flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={client.photoUrl}
                          alt={client.name}
                          className="w-12 h-12 rounded-2xl object-cover ring-2 ring-purple-100"
                        />
                        <div>
                          <div className="flex items-center gap-1">
                            <h5 
                              onClick={() => setSelectedClientId(client.id)}
                              className="font-extrabold text-slate-900 text-xs hover:text-purple-600 cursor-pointer"
                            >
                              {client.name}
                            </h5>
                            <span className="text-[10px] font-bold text-slate-600">
                              {client.gender === 'Female' ? '♀️' : '♂️'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                            ⏰ {client.classTime} • {client.phone}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1.5">
                        <button
                          onClick={() => setEditingClient(client)}
                          className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-purple-600 transition-colors"
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

      {/* VIEW MODE 2: ALL CARDS GRID VIEW */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => {
            const { status: currentMonthStatus, dueAmount, paidAmount } = getClientCurrentMonthPaymentStatus(client, payments, undefined, leaves);
            const isPaid = currentMonthStatus === 'Paid';
            const isDiscontinued = client.status === 'Discontinued';
            const isPerSession = client.feeType === 'Per Session';

            return (
              <div
                key={client.id}
                className={`rounded-3xl p-6 shadow-soft border transition-all flex flex-col justify-between group overflow-hidden relative ${
                  isDiscontinued
                    ? 'bg-amber-50/40 border-amber-200 opacity-90'
                    : 'bg-white border-slate-100 hover-lift'
                }`}
              >
                <div className="space-y-4">
                  
                  {/* Header: Photo, Name, Gender & Dynamic Billing Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={client.photoUrl}
                        alt={client.name}
                        className="w-14 h-14 rounded-2xl object-cover ring-2 ring-purple-100 group-hover:scale-105 transition-transform"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 
                            onClick={() => setSelectedClientId(client.id)}
                            className="font-extrabold text-slate-900 text-base hover:text-purple-600 cursor-pointer transition-colors"
                          >
                            {client.name}
                          </h3>
                          <span 
                            className={`text-xs px-1.5 py-0.5 rounded-md font-bold ${
                              client.gender === 'Female' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {client.gender === 'Female' ? '♀️' : '♂️'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-semibold mt-0.5">{client.phone}</p>
                      </div>
                    </div>

                    {isDiscontinued ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-amber-200 text-amber-950 border border-amber-300">
                        ⏸️ Left Class
                      </span>
                    ) : isPerSession ? (
                      <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm">
                        🧘 Pay-As-You-Go
                      </span>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 ${
                        isPaid 
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                          : currentMonthStatus === 'Partial'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-rose-100 text-rose-700 border border-rose-200 animate-pulse'
                      }`}>
                        {isPaid ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        {currentMonthStatus}
                      </span>
                    )}
                  </div>

                  {/* Group Batch Pill Tag */}
                  {client.groupName && client.groupName !== 'Group Batch' && client.groupName !== 'General Yoga Batch' && client.groupName !== 'Group' && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-50 text-purple-900 text-xs font-bold border border-purple-100">
                      <span>👥 {client.groupName}</span>
                    </div>
                  )}

                  {/* Class Timing & Days */}
                  <div className="bg-slate-50/80 p-3 rounded-2xl space-y-1.5 border border-slate-100">
                    <div className="flex items-center justify-between text-xs font-medium text-slate-600">
                      <span className="flex items-center gap-1.5 text-purple-700 font-bold">
                        <Clock className="w-3.5 h-3.5" />
                        {client.classTime}
                      </span>
                    </div>
                    <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3 text-slate-400" />
                      <span>Days: {client.days.join(' • ')}</span>
                    </div>
                  </div>

                  {/* Goal */}
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Health Goal:</div>
                    <div className="text-xs font-semibold text-slate-800 bg-purple-50/60 text-purple-900 p-2.5 rounded-xl border border-purple-100/60">
                      🎯 {client.goal || 'General Fitness'}
                    </div>
                  </div>

                  {/* Fee & Progress Bar */}
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-500">
                        {isPerSession ? 'Per Session Fee Rate:' : 'Monthly Fixed Fee:'}
                      </span>
                      <span className="text-slate-900 text-sm font-extrabold">
                        {isPerSession
                          ? `₹${client.perSessionFee || 800} / session`
                          : `₹${(client.monthlyFee || 0).toLocaleString()}`}
                      </span>
                    </div>

                    {isPerSession && (
                      <div className="text-[11px] font-bold text-emerald-900 bg-emerald-50 p-2 rounded-xl border border-emerald-200 flex items-center justify-between">
                        <span>Attended: <strong>{client.completedClasses} Classes</strong></span>
                        <span className="text-purple-800">Due: ₹{dueAmount}</span>
                      </div>
                    )}

                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-indigo-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${(client.completedClasses / client.totalClasses) * 100}%` }}
                      />
                    </div>
                  </div>

                </div>

                {/* Footer Action Buttons */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 mt-4">
                  <button
                    onClick={() => setSelectedClientId(client.id)}
                    className="flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Journal
                  </button>

                  {isDiscontinued ? (
                    <button
                      onClick={() => toggleClientStatus(client.id, 'Active')}
                      className="px-3 py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-xs transition-colors flex items-center gap-1"
                      title="Re-activate Client"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      Re-activate
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        const reason = window.prompt("Reason for leaving class:", "Discontinued class");
                        toggleClientStatus(client.id, 'Discontinued', reason || undefined);
                      }}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                      title="Mark Left Class"
                    >
                      <UserX className="w-3.5 h-3.5 text-slate-500" />
                    </button>
                  )}

                  <button
                    onClick={() => setEditingClient(client)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
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

      {/* Edit Client Modal */}
      <EditClientModal
        client={editingClient}
        isOpen={!!editingClient}
        onClose={() => setEditingClient(null)}
      />

    </div>
  );
};
