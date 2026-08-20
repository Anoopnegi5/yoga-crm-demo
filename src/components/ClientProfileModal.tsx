import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EditClientModal } from './Modals/EditClientModal';
import { PaymentCheckoutModal } from './Modals/PaymentCheckoutModal';
import { getClientCurrentMonthPaymentStatus } from '../utils/paymentUtils';
import { slugifyName } from '../utils/slugUtils';
import { 
  X, 
  Phone, 
  MessageCircle, 
  CreditCard, 
  CalendarX, 
  CheckCircle2, 
  XCircle,
  Clock, 
  Calendar, 
  Heart, 
  AlertTriangle, 
  Edit3, 
  Save, 
  Trash2,
  Sparkles,
  MapPin,
  Pencil,
  Activity,
  UserX,
  UserCheck,
  Globe,
  Zap
} from 'lucide-react';

export const ClientProfileModal: React.FC = () => {
  const { 
    selectedClientId, 
    setSelectedClientId, 
    clients, 
    updateClient, 
    deleteClient,
    toggleClientStatus, 
    setIsAddPaymentOpen, 
    setPaymentModalDefaultClientId,
    setIsAddLeaveOpen,
    markAttendance,
    attendance,
    leaves,
    payments,
    addPayment,
    deletePayment,
    deleteLeave,
    deleteAttendanceRecord
  } = useApp();

  const client = clients.find(c => c.id === selectedClientId);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesText, setNotesText] = useState(client?.trainerNotes || '');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPaymentCheckoutOpen, setIsPaymentCheckoutOpen] = useState(false);

  if (!client) return null;

  const handleSaveNotes = () => {
    updateClient({ ...client, trainerNotes: notesText });
    setIsEditingNotes(false);
  };

  const clientAttendance = attendance.filter(a => a.clientId === client.id);
  const clientLeaves = leaves.filter(l => l.clientId === client.id);
  const clientPayments = payments.filter(p => p.clientId === client.id);

  const presentCount = clientAttendance.filter(a => a.status === 'Present').length;
  const absentCount = clientAttendance.filter(a => a.status === 'Absent').length;
  const leaveCount = clientLeaves.length;

  const { status: currentMonthStatus, paidAmount, dueAmount } = getClientCurrentMonthPaymentStatus(client, payments, undefined, leaves);
  const isPaid = currentMonthStatus === 'Paid';
  const isDiscontinued = client.status === 'Discontinued';
  const isPerSession = client.feeType === 'Per Session';

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
        <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 relative text-slate-900">
          
          {/* Sticky Close Button */}
          <button
            onClick={() => setSelectedClientId(null)}
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Profile Header Banner */}
          <div className="relative bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-600 text-white p-8 sm:p-10 rounded-t-3xl overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <img
                src={client.photoUrl}
                alt={client.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-white/30 shadow-xl"
              />
              <div className="space-y-2 text-center sm:text-left flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{client.name}</h2>
                  
                  {/* Gender Icon Tag */}
                  <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold border border-white/30">
                    {client.gender === 'Female' ? '♀️ Female' : '♂️ Male'}
                  </span>

                  {/* Header Billing Badge */}
                  {isPerSession ? (
                    <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-emerald-400 text-emerald-950 shadow-sm border border-emerald-300">
                      🧘 Pay-As-You-Go (₹{client.perSessionFee || 800}/class)
                    </span>
                  ) : (
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      isPaid 
                        ? 'bg-emerald-400 text-emerald-950 font-extrabold' 
                        : currentMonthStatus === 'Partial'
                        ? 'bg-amber-400 text-amber-950 font-extrabold'
                        : 'bg-rose-400 text-rose-950 font-extrabold'
                    }`}>
                      This Month: {currentMonthStatus}
                    </span>
                  )}

                  {isDiscontinued ? (
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-slate-900 text-amber-300 border border-amber-400">
                      ⏸️ Left Class
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white">
                      🟢 Active Practitioner
                    </span>
                  )}

                  {/* Edit Full Profile Button */}
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="flex items-center gap-1 px-3 py-1 rounded-full bg-white text-purple-900 font-bold text-xs shadow-md hover:bg-purple-50 transition-all ml-auto"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Edit Profile
                  </button>
                </div>

                <p className="text-xs text-purple-100 font-semibold flex items-center justify-center sm:justify-start gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {client.address}
                </p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-xs text-white/90">
                  <span className="bg-white/15 px-3 py-1 rounded-xl font-bold border border-white/20">
                    ⏰ {client.classTime}
                  </span>
                  <span className="bg-white/15 px-3 py-1 rounded-xl font-semibold border border-white/20">
                    📅 {client.days.join(', ')}
                  </span>
                  <span className="bg-white/15 px-3 py-1 rounded-xl font-semibold border border-white/20">
                    🧘 {client.sessionType}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content Body */}
          <div className="p-6 sm:p-8 space-y-8">
            
            {/* Discontinued Notice Banner if Left Class */}
            {isDiscontinued && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-extrabold text-xs flex items-center gap-1.5">
                    <UserX className="w-4 h-4 text-amber-700" />
                    Client Has Left / Discontinued Yoga Class
                  </h4>
                  <p className="text-[11px] font-medium text-amber-900 mt-0.5">
                    Discontinued on: <strong>{client.leftDate || 'Recorded'}</strong> • Reason: {client.leftReason || 'Left Class'}
                  </p>
                </div>
                <button
                  onClick={() => toggleClientStatus(client.id, 'Active')}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-sm transition-all shrink-0"
                >
                  ▶️ Re-activate Class
                </button>
              </div>
            )}

            {/* Quick Action Toolbar */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <a
                href={`tel:${client.phone}`}
                className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs transition-colors"
              >
                <Phone className="w-4 h-4" />
                Call
              </a>
              <a
                href={`https://api.whatsapp.com/send?phone=${client.whatsapp.replace(/[^0-9]/g, '')}&text=${encodeURIComponent(`Hi ${client.name}! 🙏\n\nHere is your official Yoganjali yoga practice & progress journal:\n\nhttps://www.yoganjaliyoga.com/yogi/${slugifyName(client.name)}\n\nTrack your attendance record, practice consistency streak, and fee status. 🧘🌿\n\n— Anjali Negi, Yoganjali`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700 font-bold text-xs transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
              <a
                href={`/yogi/${slugifyName(client.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-xs transition-colors border border-purple-200"
              >
                <Globe className="w-4 h-4 text-purple-600" />
                Public Page
              </a>
              <button
                onClick={() => {
                  setPaymentModalDefaultClientId(client.id);
                  setIsAddPaymentOpen(true);
                }}
                className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-amber-50 text-amber-700 hover:bg-amber-100 font-bold text-xs transition-colors"
              >
                <CreditCard className="w-4 h-4" />
                Add Fee
              </button>
              <button
                onClick={() => setIsPaymentCheckoutOpen(true)}
                className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 font-bold text-xs transition-colors shadow-sm"
              >
                <Zap className="w-4 h-4" />
                Collect Online
              </button>
              <button
                onClick={() => setIsAddLeaveOpen(true)}
                className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs transition-colors"
              >
                <CalendarX className="w-4 h-4" />
                Mark Leave
              </button>

              {isDiscontinued ? (
                <button
                  onClick={() => toggleClientStatus(client.id, 'Active')}
                  className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-extrabold text-xs transition-colors"
                >
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  Re-activate
                </button>
              ) : (
                <button
                  onClick={() => {
                    const reason = window.prompt("Reason for leaving class (Optional):", "Discontinued class");
                    toggleClientStatus(client.id, 'Discontinued', reason || undefined);
                  }}
                  className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                >
                  <UserX className="w-4 h-4 text-slate-500" />
                  Left Class
                </button>
              )}
            </div>

            {/* Attendance & Leave Summary Counter Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
                <p className="text-[11px] font-bold text-emerald-700 uppercase">Present Days</p>
                <h4 className="text-2xl font-extrabold text-emerald-900 mt-1">🟢 {presentCount}</h4>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-center">
                <p className="text-[11px] font-bold text-rose-700 uppercase">Absent Days</p>
                <h4 className="text-2xl font-extrabold text-rose-900 mt-1">🔴 {absentCount}</h4>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 text-center">
                <p className="text-[11px] font-bold text-amber-700 uppercase">Leaves Taken</p>
                <h4 className="text-2xl font-extrabold text-amber-900 mt-1">🟡 {leaveCount}</h4>
              </div>
            </div>

            {/* Custom Financial Breakdown Based on FeeType */}
            {isPerSession ? (
              <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-emerald-200/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-emerald-600 text-white font-extrabold text-xs">
                      🧘 Pay-As-You-Go
                    </span>
                    <div>
                      <h4 className="font-extrabold text-emerald-950 text-sm">Per Session Billing Summary</h4>
                      <p className="text-[11px] text-emerald-700 font-medium">Fee accumulates per attended class</p>
                    </div>
                  </div>

                  <span className="text-xs font-extrabold text-emerald-900 bg-white px-3 py-1.5 rounded-xl border border-emerald-300">
                    Rate: ₹{client.perSessionFee || 800} / session
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 bg-white/90 rounded-2xl border border-emerald-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Sessions Attended</span>
                    <p className="text-lg font-extrabold text-slate-900 mt-0.5">{client.completedClasses} Classes</p>
                  </div>

                  <div className="p-3 bg-white/90 rounded-2xl border border-emerald-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Total Billed</span>
                    <p className="text-lg font-extrabold text-purple-700 mt-0.5">₹{(dueAmount || 0).toLocaleString()}</p>
                  </div>

                  <div className="p-3 bg-white/90 rounded-2xl border border-emerald-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Total Paid So Far</span>
                    <p className="text-lg font-extrabold text-emerald-700 mt-0.5">₹{(paidAmount || 0).toLocaleString()}</p>
                  </div>

                  <div className={`p-3 rounded-2xl border ${
                    Math.max(0, dueAmount - paidAmount) > 0 ? 'bg-rose-50 border-rose-200' : 'bg-emerald-100 border-emerald-300'
                  }`}>
                    <span className="text-[10px] font-bold uppercase text-slate-500">{Math.max(0, dueAmount - paidAmount) > 0 ? 'Unpaid Balance' : '✅ Fully Paid'}</span>
                    <p className={`text-lg font-extrabold mt-0.5 ${
                      Math.max(0, dueAmount - paidAmount) > 0 ? 'text-rose-700' : 'text-emerald-800'
                    }`}>
                      {Math.max(0, dueAmount - paidAmount) > 0 ? `₹${Math.max(0, dueAmount - paidAmount).toLocaleString()}` : '₹0'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-500 uppercase tracking-wider">Billing Model:</span>
                  <span className="text-purple-700 font-extrabold bg-purple-100 px-3 py-1 rounded-xl">
                    💳 Monthly Fixed Plan (₹{(client.monthlyFee || 0).toLocaleString()}/month)
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-500">Current Month Status:</span>
                  <span className={`px-2.5 py-0.5 rounded-md text-xs font-extrabold ${
                    isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {currentMonthStatus} (Paid: ₹{paidAmount} / Due: ₹{dueAmount})
                  </span>
                </div>
              </div>
            )}

            {/* Main Health Goal & Reasons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-purple-50/60 p-5 rounded-3xl border border-purple-100/60 space-y-2">
                <h4 className="font-extrabold text-purple-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  Main Health Goal
                </h4>
                <p className="text-xs font-bold text-purple-900 leading-relaxed">
                  🎯 {client.goal || 'General Fitness & Well-being'}
                </p>
              </div>

              <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 space-y-2">
                <h4 className="font-extrabold text-slate-700 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-rose-500" />
                  Reasons for Joining Yoga
                </h4>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {client.reasonsForJoining && client.reasonsForJoining.length > 0 ? (
                    client.reasonsForJoining.map((r, idx) => (
                      <span key={idx} className="text-xs font-bold text-slate-700 bg-white px-3 py-1 rounded-xl border border-slate-200">
                        {r}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 font-medium">General Wellness</span>
                  )}
                </div>
              </div>
            </div>

            {/* Trainer Notes */}
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple-600" />
                  Trainer Journal Notes
                </h4>
                
                {!isEditingNotes ? (
                  <button
                    onClick={() => setIsEditingNotes(true)}
                    className="text-xs font-bold text-purple-600 hover:underline flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit Notes
                  </button>
                ) : (
                  <button
                    onClick={handleSaveNotes}
                    className="px-3 py-1 rounded-xl bg-purple-600 text-white font-bold text-xs flex items-center gap-1"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Save Notes
                  </button>
                )}
              </div>

              {!isEditingNotes ? (
                <p className="text-xs text-slate-700 font-medium leading-relaxed bg-white p-4 rounded-2xl border border-slate-200">
                  {client.trainerNotes || 'No specific notes logged yet.'}
                </p>
              ) : (
                <textarea
                  rows={4}
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-white border border-purple-300 text-xs font-medium focus:ring-2 focus:ring-purple-500/20 outline-none"
                />
              )}
            </div>

            {/* Danger Zone: Delete Client */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => {
                  if (window.confirm(`Are you sure you want to permanently delete ${client.name}?`)) {
                    deleteClient(client.id);
                  }
                }}
                className="flex items-center gap-1.5 text-xs font-bold text-rose-500 hover:text-rose-700 px-3 py-1.5 rounded-xl hover:bg-rose-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Permanently Delete Client
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Edit Full Profile Modal */}
      <EditClientModal
        client={client}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />

      {/* Razorpay Online Payment Modal */}
      <PaymentCheckoutModal
        isOpen={isPaymentCheckoutOpen}
        onClose={() => setIsPaymentCheckoutOpen(false)}
        clientName={client.name}
        clientPhone={client.whatsapp || client.phone || ''}
        amount={Math.max(dueAmount - paidAmount, dueAmount || (client.monthlyFee || 0))}
        purpose={`${isPerSession ? 'Per Session Fee' : 'Monthly Fee'} — ${client.name}`}
        isTrainerMode={true}
        onPaymentSuccess={(paymentId, paidAmt) => {
          const today = new Date().toISOString().slice(0, 10);
          addPayment({
            clientId: client.id,
            clientName: client.name,
            amount: paidAmt,
            date: today,
            month: today.slice(0, 7),
            paymentMode: 'UPI',
            status: 'Paid',
            notes: `Online Payment via Razorpay (Ref: ${paymentId})`,
          });
          setIsPaymentCheckoutOpen(false);
        }}
      />
    </>
  );
};
