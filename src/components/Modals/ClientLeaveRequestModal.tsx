import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Client } from '../../types';
import { X, Calendar, MessageCircle, Check, Send, Sparkles, Clock, AlertCircle } from 'lucide-react';

interface ClientLeaveRequestModalProps {
  client: Client;
  isOpen: boolean;
  onClose: () => void;
}

const COMMON_REASONS = [
  'Out of Station / Traveling',
  'Family Event / Function',
  'Health & Medical Rest',
  'Work / Office Schedule',
  'Personal Emergency',
  'Other'
];

export const ClientLeaveRequestModal: React.FC<ClientLeaveRequestModalProps> = ({
  client,
  isOpen,
  onClose
}) => {
  const { addLeave, markAttendance, showSuccessToast, trainerProfile } = useApp();

  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [isMultiDay, setIsMultiDay] = useState(false);
  const [selectedReason, setSelectedReason] = useState(COMMON_REASONS[0]);
  const [customNotes, setCustomNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleReasonClick = (reason: string) => {
    setSelectedReason(reason);
  };

  const getEffectiveDatesText = () => {
    if (!isMultiDay || startDate === endDate) {
      return startDate;
    }
    return `${startDate} to ${endDate}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate) {
      alert('Please select a leave date.');
      return;
    }

    setIsSubmitting(true);
    try {
      const datesText = getEffectiveDatesText();
      const finalReason = customNotes.trim() ? `${selectedReason} (${customNotes.trim()})` : selectedReason;

      await addLeave({
        clientId: client.id,
        startDate,
        endDate: isMultiDay ? endDate : startDate,
        date: startDate,
        reason: finalReason,
        duration: isMultiDay ? `${startDate} to ${endDate}` : '1 Day'
      });

      // Also mark attendance for start date
      markAttendance(client.id, 'Leave', startDate);

      setSubmitted(true);
      showSuccessToast(`🏖️ Leave submitted successfully for ${client.name}!`);
    } catch (err) {
      console.warn('Leave request error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const trainerPhone = trainerProfile.phone || '919876543210';
  const cleanTrainerPhone = trainerPhone.replace(/[^0-9]/g, '');

  const whatsappMessage = `Namaste Trainer Anjali ji! 🙏

I would like to inform you that I will be on leave from yoga class on:
📅 *${getEffectiveDatesText()}*
📌 Reason: *${selectedReason}* ${customNotes ? `\n📝 Note: "${customNotes.trim()}"` : ''}

Looking forward to reconnecting on the mat upon return! 🌿🧘‍♀️
— *${client.name}* (Batch: ${client.classTime || 'Regular'})`;

  const handleSendWhatsApp = () => {
    const waUrl = `https://api.whatsapp.com/send?phone=${cleanTrainerPhone}&text=${encodeURIComponent(whatsappMessage)}`;
    window.open(waUrl, '_blank');
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn font-sans">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden text-slate-900">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-800 via-teal-700 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-white text-lg">
              🏖️
            </div>
            <div>
              <h3 className="font-extrabold text-base">Inform Class Leave</h3>
              <p className="text-xs text-emerald-200">Notify Trainer Anjali Negi of your upcoming absence</p>
            </div>
          </div>

          <button
            onClick={handleResetAndClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          /* Success Screen */
          <div className="p-8 text-center space-y-6 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-3xl mx-auto shadow-inner">
              ✨
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200 inline-block">
                LEAVE RECORDED IN STUDIO JOURNAL
              </span>
              <h4 className="font-serif font-extrabold text-2xl text-slate-900">
                Leave Request Logged!
              </h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                Your absence on <strong>{getEffectiveDatesText()}</strong> has been updated in the studio attendance system.
              </p>
            </div>

            {/* WhatsApp Notification Button */}
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200/90 text-left space-y-3">
              <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-950">
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Notify Trainer Anjali on WhatsApp</span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                Send a 1-click respectful WhatsApp notification to Trainer Anjali Negi with your leave details.
              </p>
              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all hover:scale-105 active:scale-95"
              >
                <MessageCircle className="w-4 h-4 text-white" />
                <span>Send WhatsApp Notice to Trainer</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleResetAndClose}
              className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
            >
              Done & Return to Profile
            </button>
          </div>
        ) : (
          /* Form Body */
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            
            {/* Yogi Mini Card */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
              <img
                src={client.photoUrl || '/anjali-hero.jpg'}
                alt={client.name}
                className="w-11 h-11 rounded-xl object-cover ring-2 ring-emerald-500 bg-white"
              />
              <div className="min-w-0">
                <p className="font-extrabold text-xs text-slate-900">{client.name}</p>
                <p className="text-[10px] text-slate-500 font-medium">Batch: {client.classTime || '07:00 AM'} ({client.timeSlot || 'Morning'})</p>
              </div>
            </div>

            {/* Date Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Leave Date(s) *</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsMultiDay(!isMultiDay)}
                  className="text-[11px] font-bold text-emerald-700 hover:underline"
                >
                  {isMultiDay ? 'Switch to Single Day' : '+ Multi-day Range'}
                </button>
              </div>

              {isMultiDay ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">From Date</label>
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">To Date</label>
                    <input
                      type="date"
                      required
                      value={endDate}
                      min={startDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                </div>
              ) : (
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setEndDate(e.target.value);
                  }}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                />
              )}
            </div>

            {/* Reason Chips */}
            <div className="space-y-2">
              <label className="block text-xs font-extrabold text-slate-800">Reason for Absence</label>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_REASONS.map((r) => {
                  const isSel = selectedReason === r;
                  return (
                    <button
                      type="button"
                      key={r}
                      onClick={() => handleReasonClick(r)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        isSel
                          ? 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-300'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {r}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional Note */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Optional Message for Trainer Anjali</label>
              <textarea
                rows={2}
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="Any special note or when you will resume..."
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500/20 outline-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-extrabold text-xs shadow-md hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Logging Leave...' : 'Submit Leave Request'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
