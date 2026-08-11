import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { PaymentRecord, PaymentMode, PaymentStatus } from '../../types';
import { X, Save, IndianRupee, CreditCard, Calendar } from 'lucide-react';

interface EditPaymentModalProps {
  payment: PaymentRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EditPaymentModal: React.FC<EditPaymentModalProps> = ({ payment, isOpen, onClose }) => {
  const { updatePayment } = useApp();

  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState<string>('');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('UPI');
  const [status, setStatus] = useState<PaymentStatus>('Paid');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (payment) {
      setAmount(payment.amount);
      setDate(payment.date);
      setPaymentMode(payment.paymentMode);
      setStatus(payment.status);
      setNotes(payment.notes || '');
    }
  }, [payment, isOpen]);

  if (!isOpen || !payment) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePayment({
      ...payment,
      amount: Number(amount),
      date,
      paymentMode,
      status,
      notes
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 relative overflow-hidden text-slate-900">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg">Edit Payment Record</h3>
              <p className="text-xs text-emerald-100">Update amount, date, mode or notes for {payment.clientName}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
          
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Client Name</label>
            <input
              type="text"
              disabled
              value={payment.clientName}
              className="w-full px-4 py-3 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-extrabold text-slate-700 cursor-not-allowed outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Payment Amount (₹) *</label>
              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="4500"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-extrabold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Payment Date *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Payment Mode</label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value as PaymentMode)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 outline-none"
              >
                <option value="UPI">📱 UPI (GPay/PhonePe/Paytm)</option>
                <option value="Cash">💵 Cash</option>
                <option value="Bank">🏦 Bank Transfer / NEFT</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Payment Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PaymentStatus)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 outline-none"
              >
                <option value="Paid">🟢 Fully Paid</option>
                <option value="Partial">🟡 Partial Payment</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Notes / Transaction ID (Optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. UPI Ref #904812 or Fee correction"
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500/20 outline-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl bg-slate-100 text-slate-600 font-bold text-xs hover:bg-slate-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-emerald-600 text-white font-extrabold text-xs shadow-md hover:bg-emerald-700 transition-all"
            >
              <Save className="w-4 h-4" />
              Save Payment Changes
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
