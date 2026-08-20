import React, { useState, useEffect } from 'react';
import { 
  X, 
  CreditCard, 
  Smartphone, 
  Copy, 
  Check, 
  ExternalLink, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  IndianRupee, 
  Share2, 
  ShieldCheck 
} from 'lucide-react';
import { openRazorpayCheckout, generatePaymentLink } from '../../utils/razorpay';

interface PaymentCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientName: string;
  clientPhone?: string;
  clientEmail?: string;
  amount: number;
  purpose: string;
  isTrainerMode?: boolean; // true = Trainer Panel (shows WhatsApp link option), false = Public profile
  onPaymentSuccess?: (paymentId: string) => void;
}

type ModalStep = 'choose' | 'review_direct' | 'collecting' | 'generating_link' | 'link_ready' | 'success' | 'error';

export const PaymentCheckoutModal: React.FC<PaymentCheckoutModalProps> = ({
  isOpen,
  onClose,
  clientName,
  clientPhone,
  clientEmail,
  amount,
  purpose,
  isTrainerMode = false,
  onPaymentSuccess,
}) => {
  const [step, setStep] = useState<ModalStep>(isTrainerMode ? 'choose' : 'review_direct');
  const [paymentId, setPaymentId] = useState('');
  const [paymentLink, setPaymentLink] = useState('');
  const [linkExpiry, setLinkExpiry] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const [editAmount, setEditAmount] = useState(amount);

  useEffect(() => {
    if (isOpen) {
      setStep(isTrainerMode ? 'choose' : 'review_direct');
      setEditAmount(amount);
      setPaymentId('');
      setPaymentLink('');
      setErrorMsg('');
      setLinkCopied(false);
    }
  }, [isOpen, isTrainerMode, amount]);

  if (!isOpen) return null;

  const reset = () => {
    setStep(isTrainerMode ? 'choose' : 'review_direct');
    setPaymentId('');
    setPaymentLink('');
    setErrorMsg('');
    setLinkCopied(false);
    setEditAmount(amount);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  // Direct Razorpay Checkout (UPI, Cards, NetBanking, GPay, Paytm)
  const handleCollectNow = async () => {
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
          setStep(isTrainerMode ? 'choose' : 'review_direct');
        } else {
          setErrorMsg(err);
          setStep('error');
        }
      },
    });
  };

  // Trainer Only: Generate WhatsApp payment link
  const handleGenerateLink = async () => {
    setStep('generating_link');
    const result = await generatePaymentLink({
      amount: editAmount,
      clientName,
      clientPhone,
      clientEmail,
      purpose,
      description: `Yoganjali Yoga Studio — ${purpose}`,
    });
    if (result) {
      setPaymentLink(result.link);
      setLinkExpiry(result.expiresAt);
      setStep('link_ready');
    } else {
      setErrorMsg('Payment link generate karne mein error aaya. Kripya check karein.');
      setStep('error');
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(paymentLink).catch(() => {
      const ta = document.createElement('textarea');
      ta.value = paymentLink;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    });
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 3000);
  };

  const shareOnWhatsApp = () => {
    const phone = clientPhone?.replace(/[^0-9]/g, '').slice(-10);
    const msg = `Hi ${clientName}! 🙏\n\nYour yoga class fee payment link is ready:\n\n💳 ${paymentLink}\n\nAmount: ₹${editAmount.toLocaleString()}\nFor: ${purpose}\n\nLink expires: ${linkExpiry}\n\n— Anjali Negi, Yoganjali 🧘‍♀️`;
    const waUrl = phone
      ? `https://api.whatsapp.com/send?phone=91${phone}&text=${encodeURIComponent(msg)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
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
              <h3 className="font-extrabold text-base">
                {isTrainerMode ? 'Collect Fee Payment' : 'Pay Studio Fee Online'}
              </h3>
              <p className="text-[11px] text-emerald-200">{clientName} • Razorpay Secured</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">

          {/* PUBLIC MODE: Direct Review & Pay */}
          {step === 'review_direct' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Fee Details</p>
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
                onClick={handleCollectNow}
                className="w-full py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/10 active:scale-95"
              >
                <CreditCard className="w-4 h-4" />
                <span>Proceed to Pay ₹{editAmount.toLocaleString()}</span>
              </button>
            </div>
          )}

          {/* TRAINER MODE: Choose Method (Collect Now vs WhatsApp Link) */}
          {step === 'choose' && (
            <div className="space-y-4">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Payment For</p>
                <p className="text-sm font-extrabold text-slate-900">{purpose}</p>
                <div className="flex items-center gap-1.5 pt-1">
                  <IndianRupee className="w-4 h-4 text-emerald-600" />
                  <input
                    type="number"
                    value={editAmount}
                    onChange={(e) => setEditAmount(Number(e.target.value))}
                    className="text-2xl font-extrabold text-emerald-700 bg-transparent outline-none w-32"
                    min={1}
                  />
                  <span className="text-xs text-slate-400 font-medium">(editable)</span>
                </div>
              </div>

              <p className="text-xs font-bold text-slate-500 text-center uppercase tracking-wider">Choose Option</p>

              <button
                onClick={handleCollectNow}
                className="w-full p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm transition-all flex items-center gap-3 shadow-md active:scale-95"
              >
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-extrabold">Collect Now (Razorpay)</p>
                  <p className="text-[11px] text-emerald-200 font-medium">Open checkout on this screen — UPI, Card, Net Banking</p>
                </div>
              </button>

              <button
                onClick={handleGenerateLink}
                className="w-full p-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm transition-all flex items-center gap-3 shadow-md active:scale-95"
              >
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-extrabold">Send Payment Link (WhatsApp)</p>
                  <p className="text-[11px] text-blue-200 font-medium">Client pays themselves on their phone via UPI / Card</p>
                </div>
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

          {/* TRAINER MODE: Generating link */}
          {step === 'generating_link' && (
            <div className="py-10 text-center space-y-4">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
              <p className="font-extrabold text-slate-700">Creating payment link...</p>
              <p className="text-xs text-slate-400">This will take a moment</p>
            </div>
          )}

          {/* TRAINER MODE: Link ready */}
          {step === 'link_ready' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-center">
                <Share2 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="font-extrabold text-blue-900 text-sm">Payment Link Ready!</p>
                <p className="text-[11px] text-blue-600 mt-0.5">Expires: {linkExpiry}</p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={paymentLink}
                  className="flex-1 px-3 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-[11px] font-mono outline-none border border-slate-200 select-all"
                />
                <button
                  onClick={copyLink}
                  className={`px-3 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center gap-1.5 ${linkCopied ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
                >
                  {linkCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {linkCopied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              <button
                onClick={shareOnWhatsApp}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <Smartphone className="w-4 h-4" />
                Share on WhatsApp {clientPhone ? `(${clientPhone})` : ''}
              </button>

              <a
                href={paymentLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-sm transition-all flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Preview Link
              </a>

              <button onClick={handleClose} className="w-full py-2.5 text-xs text-slate-400 hover:text-slate-600 font-bold transition-colors">
                Close
              </button>
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
