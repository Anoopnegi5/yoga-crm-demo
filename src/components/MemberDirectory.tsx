import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Client } from '../types';
import { slugifyName } from '../utils/slugUtils';
import { 
  Users, 
  Search, 
  Sparkles, 
  Trophy, 
  Flame, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  UserPlus, 
  Globe,
  ArrowRight
} from 'lucide-react';

interface MemberDirectoryProps {
  onSelectClient?: (client: Client) => void;
  onLogout?: () => void;
}

export const MemberDirectory: React.FC<MemberDirectoryProps> = ({ onSelectClient, onLogout }) => {
  const { clients, attendance, trainerProfile } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatchFilter, setSelectedBatchFilter] = useState<string>('All');

  const activeClients = clients.filter(c => c.status !== 'Discontinued');

  // Filter clients
  const filteredClients = activeClients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (client.groupName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (client.goal || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedBatchFilter === 'Morning') return matchesSearch && client.timeSlot === 'Morning';
    if (selectedBatchFilter === 'Evening') return matchesSearch && client.timeSlot === 'Evening';
    if (selectedBatchFilter === 'Personal') return matchesSearch && client.sessionType === 'Personal';
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 font-sans pb-20 selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Navigation Header */}
      <header className="bg-gradient-to-r from-[#1E3A2B] via-[#2A4D3B] to-[#1E3A2B] text-white py-5 px-4 sm:px-8 border-b border-emerald-800/40 sticky top-0 z-40 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 font-extrabold text-xl flex items-center justify-center shadow-md">
              🌿
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-extrabold text-lg sm:text-xl text-white tracking-tight">
                  {trainerProfile?.studioName || 'Studio'} Member Directory
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[10px] font-bold">
                  🔒 Trainer Only
                </span>
              </div>
              <p className="text-[11px] text-emerald-200 font-medium hidden sm:block">
                Protected studio directory of active yogis and practice journals
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/panel"
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-extrabold shadow-sm transition-all flex items-center gap-1.5"
            >
              <span>Trainer Panel</span>
            </a>
            {onLogout && (
              <button
                onClick={onLogout}
                className="px-3.5 py-2.5 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-extrabold border border-rose-400/30 transition-all flex items-center gap-1.5"
              >
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 pt-8 space-y-8 animate-fadeIn">
        
        {/* Search & Filter Hero Section */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-soft space-y-5">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-black uppercase tracking-wider border border-emerald-200">
                ✨ Official Studio Directory ({activeClients.length} Active Members)
              </span>
              <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-slate-900 mt-2 tracking-tight">
                Explore Studio Practitioners
              </h2>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search member name or batch..."
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none transition-all"
              />
            </div>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Filter Batch:</span>
            {['All', 'Morning', 'Evening', 'Personal'].map((f) => (
              <button
                key={f}
                onClick={() => setSelectedBatchFilter(f)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                  selectedBatchFilter === f
                    ? 'bg-emerald-800 text-amber-300 shadow-sm ring-2 ring-emerald-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f === 'All' ? 'All Batches' : `${f} Slot`}
              </button>
            ))}
          </div>

        </div>

        {/* Member Cards Grid */}
        {filteredClients.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl text-center border border-slate-100 space-y-3">
            <p className="text-sm font-bold text-slate-500">No active members found matching your search.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedBatchFilter('All'); }}
              className="text-xs font-extrabold text-emerald-700 hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client) => {
              const clientAtt = attendance.filter(a => a.clientId === client.id);
              const presentCount = clientAtt.filter(a => a.status === 'Present').length;
              const classesAttended = Math.max(client.completedClasses || 0, presentCount);
              const slug = slugifyName(client.name);
              const targetUrl = `/yogi/${slug}`;

              return (
                <div
                  key={client.id}
                  onClick={() => {
                    if (onSelectClient) {
                      onSelectClient(client);
                    } else {
                      window.location.href = targetUrl;
                    }
                  }}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft hover:shadow-xl hover:border-emerald-300 hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden flex flex-col justify-between"
                >
                  
                  {/* Top Header */}
                  <div className="space-y-4">
                    
                    <div className="flex items-start justify-between gap-3">
                      
                      {/* Avatar */}
                      <div className="relative">
                        <img
                          src={client.photoUrl}
                          alt={client.name}
                          className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-200 group-hover:ring-amber-400 transition-all bg-white"
                        />
                        <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] ring-2 ring-white">
                          ✓
                        </span>
                      </div>

                      {/* Rank / Consistency Badge */}
                      <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black border border-amber-200 flex items-center gap-1">
                        <Trophy className="w-3 h-3 text-amber-600" />
                        <span>Consistent</span>
                      </span>

                    </div>

                    {/* Member Details */}
                    <div>
                      <h3 className="font-serif font-extrabold text-lg text-slate-900 group-hover:text-emerald-800 transition-colors">
                        {client.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        🧘 {client.groupName || 'Group Yoga Batch'}
                      </p>
                      <p className="text-[11px] text-amber-700 font-bold mt-1">
                        📅 {client.classTime} ({client.timeSlot || 'Morning'})
                      </p>
                    </div>

                    {/* Performance Chips */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                      <div className="bg-slate-50 p-2.5 rounded-2xl text-center border border-slate-100">
                        <span className="text-[9px] font-bold text-slate-400 uppercase block">Attended</span>
                        <strong className="text-xs font-black text-slate-900">{classesAttended} Sessions</strong>
                      </div>
                      <div className="bg-emerald-50 p-2.5 rounded-2xl text-center border border-emerald-100">
                        <span className="text-[9px] font-bold text-emerald-800 uppercase block">Status</span>
                        <strong className="text-xs font-black text-emerald-900">Active Member</strong>
                      </div>
                    </div>

                  </div>

                  {/* Card Footer Button */}
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-emerald-800 group-hover:text-emerald-950">
                    <span>View Public Profile</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-200 bg-white py-10 px-4 text-center space-y-4">
        <div className="max-w-md mx-auto space-y-2">
          <p className="text-xs font-bold text-slate-800">
            Want to start your own yoga journey with {trainerProfile?.name || 'our Instructor'}?
          </p>
          <a
            href="/join"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white text-xs font-extrabold shadow-md hover:scale-105 transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Book Free Demo Class</span>
          </a>
        </div>
        <p className="text-[11px] text-slate-400 font-medium">
          © {new Date().getFullYear()} {trainerProfile?.studioName || 'Yoga Studio'} & Fee Manager • Official Member Directory
        </p>
      </footer>

    </div>
  );
};
