import React, { useState } from 'react';
import { X, CreditCard, Loader2, CheckCircle2, AlertCircle, IndianRupee, ShieldCheck } from 'lucide-react';
import { openRazorpayCheckout } from '../../utils/razorpay';

interface PaymentCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientName: string;
  clientPhone?: string;
  clientEmail?: string;
  amount: number;
  purpose: string;
  onPaymentSuccess?: (paymentId: string) => void;
}

type ModalStep = 'review' | 'collecting' | 'success' | 'error';

export const PaymentCheckoutModal: React.FC<PaymentCheckoutModalProps> = ({
  isOpen,
  onClose,
  clientName,
  clientPhone,
  clientEmail,
  amount,
  purpose,
  onPaymentSuccess,
}) => {
  const [step, setStep] = useState<ModalStep>('review');
  const [paymentId, setPaymentId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [editAmount, setEditAmount] = useState(amount);

  if (!isOpen) return null;

  const reset = () => {
    setStep('review');
    setPaymentId('');
    setErrorMsg('');
    setEditAmount(amount);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  // Direct Razorpay Checkout (UPI, Cards, NetBanking, GPay, Paytm)
  const handlePayNow = async () => {
    setStep('collecting');
    await openRazorpayCheckout({
      amount: editAmount,
      clientName,
      clientPhone,
      clientEmail,
      purpose,
      onSuccess: (pid) => {
        setPaymentId(pid);
        setStep('success');
        onPaymentSuccess?.(pid);
      },
      onFailure: (err) => {
        if (err === 'Payment cancelled') {
          setStep('review');
        } else {
          setErrorMsg(err);
          setStep('error');
        }
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden">

        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-800 to-teal-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">Online Payment</h3>
              <p className="text-[11px] text-emerald-200">{clientName} • Razorpay Secured</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">

          {/* STEP: Review & Pay */}
          {step === 'review' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Payment For</p>
                <p className="text-sm font-extrabold text-slate-900">{purpose}</p>
                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Total Amount:</span>
                  <div className="flex items-center gap-1">
                    <IndianRupee className="w-4 h-4 text-emerald-700 font-bold" />
                    <input
                      type="number"
                      value={editAmount}
                      onChange={(e) => setEditAmount(Number(e.target.value))}
                      className="text-2xl font-black text-emerald-800 bg-transparent outline-none w-28 text-right"
                      min={1}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-500 justify-center">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>UPI (GPay, PhonePe, Paytm), Cards & Net Banking</span>
              </div>

              <button
                onClick={handlePayNow}
                className="w-full py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/10 active:scale-95"
              >
                <CreditCard className="w-4 h-4" />
                <span>Proceed to Pay ₹{editAmount.toLocaleString()}</span>
              </button>
            </div>
          )}

          {/* STEP: Collecting (loading state) */}
          {step === 'collecting' && (
            <div className="py-10 text-center space-y-4">
              <Loader2 className="w-12 h-12 text-emerald-700 animate-spin mx-auto" />
              <p className="font-extrabold text-slate-700">Opening Razorpay gateway...</p>
              <p className="text-xs text-slate-400">Please complete the payment in the secure window</p>
            </div>
          )}

          {/* STEP: Success */}
          {step === 'success' && (
            <div className="py-8 text-center space-y-4">
              <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
              <div>
                <p className="font-extrabold text-xl text-emerald-800">Payment Successful! 🎉</p>
                <p className="text-sm text-slate-500 mt-1">₹{editAmount.toLocaleString()} received from {clientName}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Transaction ID</p>
                <p className="text-xs font-mono text-slate-700 mt-0.5 break-all">{paymentId}</p>
              </div>
              <button
                onClick={handleClose}
                className="w-full py-3 rounded-2xl bg-emerald-700 text-white font-extrabold text-sm hover:bg-emerald-800 transition-all"
              >
                Done ✓
              </button>
            </div>
          )}

          {/* STEP: Error */}
          {step === 'error' && (
            <div className="py-8 text-center space-y-4">
              <AlertCircle className="w-16 h-16 text-rose-400 mx-auto" />
              <div>
                <p className="font-extrabold text-lg text-rose-700">Payment Incomplete</p>
                <p className="text-sm text-slate-500 mt-1">{errorMsg}</p>
              </div>
              <button
                onClick={reset}
                className="w-full py-3 rounded-2xl bg-slate-100 text-slate-700 font-extrabold text-sm hover:bg-slate-200 transition-all"
              >
                Try Again
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
