import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getTodayDateString } from '../../utils/dateUtils';
import { X, CalendarX, Sparkles, UserX, Trash2 } from 'lucide-react';

export const AddTrainerLeaveModal: React.FC = () => {
  const { 
    isAddTrainerLeaveOpen, 
    setIsAddTrainerLeaveOpen, 
    addTrainerLeave,
    deleteTrainerLeave,
    trainerLeaves,
    trainerProfile 
  } = useApp();

  const [startDate, setStartDate] = useState<string>(getTodayDateString());
  const [endDate, setEndDate] = useState<string>(getTodayDateString());
  const [reason, setReason] = useState<string>('Personal Leave');
  const [status, setStatus] = useState<'No Class' | 'Self Practice' | 'Substitute Class'>('No Class');
  const [notes, setNotes] = useState<string>('');

  if (!isAddTrainerLeaveOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTrainerLeave({
      startDate,
      endDate: endDate < startDate ? startDate : endDate,
      reason,
      status,
      notes
    });
    setIsAddTrainerLeaveOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 relative overflow-hidden text-slate-900 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-amber-600 via-rose-600 to-purple-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <UserX className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg">Log Trainer / Instructor Leave</h3>
              <p className="text-xs text-rose-100">Mark date range when {trainerProfile.name} is absent</p>
            </div>
          </div>

          <button
            onClick={() => setIsAddTrainerLeaveOpen(false)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
          
          {/* Start Date & End Date Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Leave Start Date *</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  if (endDate < e.target.value) setEndDate(e.target.value);
                }}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Leave End Date *</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Absence *</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
            >
              <option value="Personal Leave">Personal Leave / Emergency</option>
              <option value="Out of Station">Out of Station / Travelling</option>
              <option value="Health Rest Day">Health / Rest Day</option>
              <option value="Festival Holiday">Festival / Public Holiday</option>
              <option value="Studio Maintenance">Studio Maintenance / Renewal</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Class Arrangement Status *</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'No Class', label: '🚫 No Class Today' },
                { id: 'Self Practice', label: '🧘 Self Practice' },
                { id: 'Substitute Class', label: '👤 Guest Instructor' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setStatus(opt.id as any)}
                  className={`p-3 rounded-2xl text-[11px] font-bold text-center border transition-all ${
                    status === opt.id
                      ? 'border-rose-600 bg-rose-50 text-rose-900 ring-2 ring-rose-200'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Special Instructions for Clients (Optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Resume classes on Monday at 7:00 AM"
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 via-rose-600 to-purple-600 text-white font-extrabold text-xs shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            + Log Instructor Leave Range
          </button>

          {/* Active Trainer Leaves List */}
          {trainerLeaves.length > 0 && (
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider">Logged Trainer Leaves ({trainerLeaves.length})</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {trainerLeaves.map(leave => (
                  <div key={leave.id} className="p-3 rounded-2xl bg-rose-50/60 border border-rose-100 flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        📅 {leave.startDate || leave.date} {leave.endDate && leave.endDate !== (leave.startDate || leave.date) ? `to ${leave.endDate}` : ''}
                      </p>
                      <p className="text-[11px] text-slate-500 font-medium">{leave.reason} • <strong className="text-rose-700">{leave.status}</strong></p>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteTrainerLeave(leave.id)}
                      className="p-1.5 rounded-xl hover:bg-rose-200 text-rose-500 hover:text-rose-700 transition-colors"
                      title="Delete Leave Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </form>

      </div>
    </div>
  );
};
