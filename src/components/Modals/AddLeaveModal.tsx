import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getTodayDateString } from '../../utils/dateUtils';
import { X, CalendarX, Check, Calendar, AlertCircle } from 'lucide-react';

export const AddLeaveModal: React.FC = () => {
  const { isAddLeaveOpen, setIsAddLeaveOpen, clients, addLeave } = useApp();

  const todayStr = getTodayDateString();

  const [clientId, setClientId] = useState<string>(clients[0]?.id || '');
  const [leaveMode, setLeaveMode] = useState<'single' | 'range' | 'fullMonth'>('single');
  const [startDate, setStartDate] = useState<string>(todayStr);
  const [endDate, setEndDate] = useState<string>(todayStr);
  const [isFullMonthLeave, setIsFullMonthLeave] = useState<boolean>(false);
  const [reason, setReason] = useState<string>('Out of station / Personal work');

  if (!isAddLeaveOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) return;

    let finalStartDate = startDate;
    let finalEndDate = endDate;
    let durationText = '';

    if (leaveMode === 'single') {
      finalEndDate = finalStartDate;
      durationText = `1 Day (${finalStartDate})`;
    } else if (leaveMode === 'fullMonth' || isFullMonthLeave) {
      const monthStr = (startDate || todayStr).slice(0, 7);
      finalStartDate = `${monthStr}-01`;
      finalEndDate = `${monthStr}-31`;
      durationText = `Full Month Leave (Fee Paused/Waived)`;
    } else {
      durationText = `${finalStartDate} to ${finalEndDate}`;
    }

    addLeave({
      clientId,
      reason,
      duration: durationText,
      date: finalStartDate,
      startDate: finalStartDate,
      endDate: finalEndDate,
      isFullMonthLeave: leaveMode === 'fullMonth' || isFullMonthLeave
    });

    setIsAddLeaveOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 relative overflow-hidden text-slate-900">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <CalendarX className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg">Mark Client Leave</h3>
              <p className="text-xs text-rose-100">Log single-day, date range or full month leave</p>
            </div>
          </div>

          <button
            onClick={() => setIsAddLeaveOpen(false)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Select Client</label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
            >
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.classTime} - {c.sessionType})</option>
              ))}
            </select>
          </div>

          {/* Leave Mode Tabs */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Leave Mode / Type</label>
            <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200/80 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setLeaveMode('single');
                  setIsFullMonthLeave(false);
                }}
                className={`py-2 rounded-xl transition-all ${
                  leaveMode === 'single' ? 'bg-white text-rose-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                1 Day
              </button>

              <button
                type="button"
                onClick={() => {
                  setLeaveMode('range');
                  setIsFullMonthLeave(false);
                }}
                className={`py-2 rounded-xl transition-all ${
                  leaveMode === 'range' ? 'bg-white text-rose-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Date Range
              </button>

              <button
                type="button"
                onClick={() => {
                  setLeaveMode('fullMonth');
                  setIsFullMonthLeave(true);
                }}
                className={`py-2 rounded-xl transition-all ${
                  leaveMode === 'fullMonth' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🌴 Full Month
              </button>
            </div>
          </div>

          {/* Date Pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-rose-600" /> Start Date
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  if (e.target.value > endDate) {
                    setEndDate(e.target.value);
                  }
                }}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
              />
            </div>

            {leaveMode !== 'single' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-rose-600" /> End Date
                </label>
                <input
                  type="date"
                  required
                  value={endDate}
                  min={startDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                />
              </div>
            )}
          </div>

          {/* Full Month Fee Waiver Alert & Checkbox */}
          <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 space-y-2">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isFullMonthLeave || leaveMode === 'fullMonth'}
                onChange={(e) => {
                  setIsFullMonthLeave(e.target.checked);
                  if (e.target.checked) setLeaveMode('fullMonth');
                }}
                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-purple-300"
              />
              <span className="text-xs font-bold text-purple-950">
                🌴 Full Month Leave (Waive/Pause Fee for this Month)
              </span>
            </label>

            {(isFullMonthLeave || leaveMode === 'fullMonth') && (
              <p className="text-[11px] text-purple-700 font-medium pl-6">
                ✓ Client will be excluded from <strong>Pending Fees</strong> and <strong>Fee Reminders</strong> for this month.
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Leave</label>
            <input
              type="text"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Traveling abroad, Health rest, Out of station"
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-lg transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Save Leave Entry
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
