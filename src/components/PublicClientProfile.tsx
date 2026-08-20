import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Client } from '../types';
import { slugifyName } from '../utils/slugUtils';
import { getClientCurrentMonthPaymentStatus, getClientBillingCycles } from '../utils/paymentUtils';
import { 
  Award, 
  Flame, 
  Star, 
  Trophy, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Share2, 
  Copy, 
  Check, 
  MessageCircle, 
  Sparkles, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight,
  Activity, 
  HeartHandshake, 
  Globe, 
  Lock,
  Zap,
  CreditCard,
  CalendarDays,
  CalendarX,
  XCircle,
  Instagram,
  Youtube
} from 'lucide-react';
import { PaymentCheckoutModal } from './Modals/PaymentCheckoutModal';

interface PublicClientProfileProps {
  clientSlug?: string;
  clientId?: string;
  onBackToDirectory?: () => void;
}

export const PublicClientProfile: React.FC<PublicClientProfileProps> = ({ 
  clientSlug, 
  clientId,
  onBackToDirectory 
}) => {
  const { clients, attendance, leaves, trainerLeaves, payments, addPayment, showSuccessToast } = useApp();
  const [copied, setCopied] = useState(false);
  const [isPaymentCheckoutOpen, setIsPaymentCheckoutOpen] = useState(false);

  // Find target client by slug or ID
  const activeClients = clients.filter(c => c.status !== 'Discontinued');
  const targetClient: Client | undefined = activeClients.find(c => {
    if (clientId && c.id === clientId) return true;
    if (clientSlug && slugifyName(c.name) === clientSlug.toLowerCase()) return true;
    return false;
  }) || activeClients[0]; // fallback to first client if direct match not found

  if (!targetClient) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 max-w-md space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-2xl mx-auto">
            🧘
          </div>
          <h3 className="font-serif font-extrabold text-2xl text-slate-900">Yogi Profile Not Found</h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            The requested member profile could not be found or has been updated.
          </p>
          <a
            href="/members"
            className="inline-block px-6 py-3 rounded-2xl bg-emerald-800 text-white font-extrabold text-xs shadow-md hover:bg-emerald-900 transition-all"
          >
            Explore Member Directory
          </a>
        </div>
      </div>
    );
  }

  // 📊 CALCULATE PUBLIC PERFORMANCE METRICS
  const clientAtt = attendance.filter(a => a.clientId === targetClient.id);
  const presentCount = clientAtt.filter(a => a.status === 'Present').length;
  const absentCount = clientAtt.filter(a => a.status === 'Absent').length;
  const leavesCount = leaves.filter(l => l.clientId === targetClient.id).length;

  const classesAttended = Math.max(targetClient.completedClasses || 0, presentCount);
  const totalClassesTarget = targetClient.totalClasses || 30;
  const attendanceRate = Math.min(100, Math.round((classesAttended / Math.max(1, classesAttended + absentCount)) * 100));

  // Streak Calculation (100% Real data from actual attendance records)
  const sortedAtt = [...clientAtt].sort((a, b) => b.date.localeCompare(a.date));
  let streak = 0;
  for (const a of sortedAtt) {
    if (a.status === 'Present') streak++;
    else if (a.status === 'Absent') break;
  }
  const displayStreak = streak;

  // Consistency Score
  let consistencyScore = 'Outstanding 🏆';
  if (attendanceRate >= 90) consistencyScore = 'Outstanding 🏆';
  else if (attendanceRate >= 80) consistencyScore = 'Excellent ⭐';
  else if (attendanceRate >= 70) consistencyScore = 'Strong 💪';
  else consistencyScore = 'Regular 🌱';

  // Badges Earned
  const achievements = [
    {
      id: 'top',
      title: 'Top Performer',
      icon: '🏆',
      earned: attendanceRate >= 85,
      desc: 'Ranked in top studio regularity percentile'
    },
    {
      id: 'warrior',
      title: 'Attendance Warrior',
      icon: '🔥',
      earned: displayStreak >= 3 || classesAttended >= 5,
      desc: 'Maintained consecutive attended yoga classes'
    },
    {
      id: 'champion',
      title: 'Consistency Champion',
      icon: '⭐',
      earned: attendanceRate >= 80,
      desc: 'Demonstrated high discipline & commitment'
    },
    {
      id: 'star',
      title: 'Monthly Star',
      icon: '🥇',
      earned: classesAttended >= 8,
      desc: 'Completed regular guided yoga sessions'
    },
    {
      id: 'yogi',
      title: 'Dedicated Yogi',
      icon: '🧘',
      earned: true,
      desc: 'Official active practitioner at Yoganjali Studio'
    }
  ];

  // Real August 2026 Leaderboard (June/July removed as per studio data availability)
  const rankedClients = [...activeClients].sort((a, b) => {
    const aAtt = Math.max(a.completedClasses || 0, attendance.filter(x => x.clientId === a.id && x.status === 'Present').length);
    const bAtt = Math.max(b.completedClasses || 0, attendance.filter(x => x.clientId === b.id && x.status === 'Present').length);
    return bAtt - aAtt;
  });

  const clientRankIndex = rankedClients.findIndex(c => c.id === targetClient.id);
  const currentRank = clientRankIndex >= 0 ? clientRankIndex + 1 : 1;
  const rankMedal = currentRank === 1 ? '🥇' : currentRank === 2 ? '🥈' : currentRank === 3 ? '🥉' : '⭐';

  const leaderboardHistory = [
    { 
      month: 'August 2026 (Current Cycle)', 
      rank: `Rank #${currentRank} ${rankMedal}`, 
      badge: currentRank <= 3 ? 'Top Performer' : 'Active Practitioner' 
    }
  ];

  // Profile URL & Sharing
  const currentSlug = slugifyName(targetClient.name);
  const publicProfileUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/yogi/${currentSlug}`
    : `https://www.yoganjaliyoga.com/yogi/${currentSlug}`;

  useEffect(() => {
    if (targetClient?.name) {
      document.title = `🧘 ${targetClient.name} • Official Yogi Profile | Yoganjali`;
    }
  }, [targetClient]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicProfileUrl);
    setCopied(true);
    showSuccessToast('📋 Yogi Profile Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const message = `Hi ${targetClient.name}! 🙏\n\nHere is your official Yoganjali yoga practice & progress journal:\n\n${publicProfileUrl}\n\nTrack your attendance record, practice consistency streak, and fee status. 🧘🌿\n\n— Anjali Negi, Yoganjali`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
  };

  const { status: currentMonthStatus, dueAmount, paidAmount } = getClientCurrentMonthPaymentStatus(targetClient, payments, undefined, leaves);
  const isPaid = currentMonthStatus === 'Paid';
  const isPerSession = targetClient.feeType === 'Per Session';

  // Multi-month continuous billing cycles calculation
  const billingCycles = getClientBillingCycles(targetClient, payments, leaves);
  const pendingCycles = billingCycles.filter(c => c.status === 'Pending' || c.status === 'Overdue' || c.status === 'Partial');
  const totalOutstandingDue = pendingCycles.reduce((sum, c) => sum + Math.max(0, c.dueAmount - c.paidAmount), 0);
  const hasOutstandingDue = totalOutstandingDue > 0;

  const scrollToBilling = () => {
    const el = document.getElementById('billing-cycle-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('ring-4', 'ring-amber-400', 'transition-all', 'duration-500');
      setTimeout(() => {
        el.classList.remove('ring-4', 'ring-amber-400');
      }, 2500);
    }
  };

  // --- MONTHLY ATTENDANCE & LEAVE CALENDAR STATE & DATA ---
  const [calDate, setCalDate] = useState(() => new Date(2026, 7, 1)); // Default to August 2026

  const calYear = calDate.getFullYear();
  const calMonth = calDate.getMonth();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const calDaysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const firstDayOfMonth = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const calMonthPrefix = `${calYear}-${String(calMonth + 1).padStart(2, '0')}`;

  const handlePrevCalMonth = () => {
    setCalDate(new Date(calYear, calMonth - 1, 1));
  };
  const handleNextCalMonth = () => {
    setCalDate(new Date(calYear, calMonth + 1, 1));
  };
  const handleCurrentCalMonth = () => {
    setCalDate(new Date());
  };

  // Month Statistics for selected calendar month
  const calMonthPresent = clientAtt.filter(a => a.date.startsWith(calMonthPrefix) && a.status === 'Present').length;
  const calMonthAbsent = clientAtt.filter(a => a.date.startsWith(calMonthPrefix) && a.status === 'Absent').length;
  const calMonthLeaves = leaves.filter(l => l.clientId === targetClient.id && ((l.startDate && l.startDate.startsWith(calMonthPrefix)) || (l.date && l.date.startsWith(calMonthPrefix)))).length;
  const calMonthPayments = payments.filter(p => p.clientId === targetClient.id && p.date.startsWith(calMonthPrefix) && p.status === 'Paid');
  const calMonthPaidTotal = calMonthPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

  // Real Instructor Leave Days
  const instructorLeavesCount = trainerLeaves.reduce((acc, leave) => {
    if (leave.startDate && leave.endDate) {
      const s = new Date(leave.startDate);
      const e = new Date(leave.endDate);
      const diff = Math.max(1, Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1);
      return acc + diff;
    }
    return acc + 1;
  }, 0);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 font-sans pb-20 selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Top Banner Navigation */}
      <header className="bg-gradient-to-r from-[#1E3A2B] via-[#2A4D3B] to-[#1E3A2B] text-white py-4 px-4 sm:px-8 border-b border-emerald-800/40 sticky top-0 z-40 shadow-md">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            {onBackToDirectory ? (
              <button
                onClick={onBackToDirectory}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1.5 text-xs font-bold"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back to Directory</span>
              </button>
            ) : (
              <div className="flex items-center gap-2.5">
                <img
                  src="/yoganjali-logo.png"
                  alt="Yoganjali Logo"
                  className="w-8 h-8 rounded-full bg-white object-contain p-0.5 shadow-sm ring-1 ring-amber-400"
                />
                <div>
                  <h2 className="font-serif font-extrabold text-sm sm:text-base text-white tracking-tight leading-tight">
                    Yoganjali Studio
                  </h2>
                  <p className="text-[10px] text-emerald-200 font-medium leading-none">
                    Official Member Practice Portal
                  </p>
                </div>
              </div>
            )}
            <div className="hidden sm:block h-4 w-px bg-emerald-700/60" />
            <span className="hidden sm:inline text-xs font-bold text-amber-300 tracking-wider uppercase">
              {targetClient.name}'s Profile
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={scrollToBilling}
              className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-black shadow-md hover:shadow-lg transition-all flex items-center gap-2 hover:scale-105 active:scale-95 ${
                hasOutstandingDue
                  ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-slate-950 ring-2 ring-amber-300/80 animate-pulse'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-white border border-emerald-400/40'
              }`}
            >
              <CreditCard className={`w-4 h-4 ${hasOutstandingDue ? 'text-slate-950' : 'text-white'}`} />
              <span>
                {hasOutstandingDue 
                  ? `💳 Pay Pending Fee (₹${totalOutstandingDue.toLocaleString()})` 
                  : '✓ Fee Paid • View Status'}
              </span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-8 pt-8 space-y-8 animate-fadeIn">
        
        {/* 1. PUBLIC PROFILE HEADER CARD (Forest Green & Soft Gold Theme) */}
        <div className="bg-gradient-to-br from-[#1E3A2B] via-[#2D4F3C] to-[#162E22] rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden border border-emerald-700/50">
          
          {/* Subtle Background Pattern Elements */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8 text-center md:text-left">
            
            {/* Yogi Avatar with Ring */}
            <div className="relative shrink-0">
              <img
                src={targetClient.photoUrl}
                alt={targetClient.name}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover ring-4 ring-amber-400 shadow-2xl bg-white"
              />
              <div className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-lg font-black shadow-md ring-2 ring-emerald-950">
                ✨
              </div>
            </div>

            {/* Yogi Info */}
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  Active Studio Yogi
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-[11px] font-bold">
                  Member Since {targetClient.joiningDate || 'July 2026'}
                </span>
              </div>

              <div>
                <h1 className="font-serif font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
                  {targetClient.name}
                </h1>
                <p className="text-xs sm:text-sm text-emerald-200 font-medium mt-1">
                  🧘 {targetClient.groupName || 'Group Yoga Batch'} • Class Slot: <strong className="text-amber-300">{targetClient.classTime} ({targetClient.timeSlot || 'Morning'})</strong>
                </p>
              </div>

              {/* Main Health Goal */}
              <div className="pt-1 flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="text-xs font-bold text-slate-300">Health Focus Goal:</span>
                <span className="px-3 py-1 rounded-xl bg-white/10 border border-white/15 text-xs font-extrabold text-amber-300">
                  {targetClient.goal || 'Flexibility, Back Pain Relief & Posture'}
                </span>
              </div>

              {/* Action Bar inside card — Big Prominent Payment & Billing Status Button */}
              <div className="pt-3 flex flex-wrap items-center justify-center md:justify-start">
                <button
                  onClick={scrollToBilling}
                  className={`w-full sm:w-auto px-7 py-3.5 rounded-2xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2.5 shadow-xl hover:scale-105 active:scale-95 ${
                    hasOutstandingDue
                      ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 text-slate-950 ring-4 ring-amber-400/40 hover:ring-amber-300'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white ring-2 ring-emerald-400/30'
                  }`}
                >
                  <CreditCard className={`w-5 h-5 ${hasOutstandingDue ? 'text-slate-950' : 'text-white'}`} />
                  <span>
                    {hasOutstandingDue 
                      ? `💳 Pay Pending Studio Fee & View Billing History (₹${totalOutstandingDue.toLocaleString()})` 
                      : '✓ Studio Fee Paid • View Billing Cycle Records'}
                  </span>
                  <ChevronRight className="w-4 h-4 opacity-75" />
                </button>
              </div>

            </div>

          </div>
        </div>


        {/* 2. MONTHLY PERFORMANCE METRICS GRID */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-extrabold text-xl sm:text-2xl text-slate-900 flex items-center gap-2">
              <Activity className="w-6 h-6 text-emerald-700" />
              Monthly Practice Performance
            </h3>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
              {consistencyScore}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            
            {/* Box 1: Attendance Rate */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm text-center space-y-1.5 hover:shadow-md transition-shadow">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Attendance Rate</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-800">{attendanceRate}%</p>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${attendanceRate}%` }} />
              </div>
            </div>

            {/* Box 2: Classes Attended */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm text-center space-y-1 hover:shadow-md transition-shadow">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Attended</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{classesAttended}</p>
              <span className="text-[10px] text-slate-500 font-medium">Classes Completed</span>
            </div>

            {/* Box 3: Leaves Taken */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm text-center space-y-1 hover:shadow-md transition-shadow">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Leaves</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-600">{leavesCount}</p>
              <span className="text-[10px] text-slate-500 font-medium">Approved Leaves</span>
            </div>

            {/* Box 4: Absences */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm text-center space-y-1 hover:shadow-md transition-shadow">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Absences</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-rose-600">{absentCount}</p>
              <span className="text-[10px] text-slate-500 font-medium">Unexcused Missed</span>
            </div>

            {/* Box 5: Attendance Streak */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm text-center space-y-1 hover:shadow-md transition-shadow">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Practice Streak</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-500 flex items-center justify-center gap-1">
                <span>{displayStreak}</span>
                <span className="text-lg">🔥</span>
              </p>
              <span className="text-[10px] text-slate-500 font-medium">Days Continuous</span>
            </div>

            {/* Box 6: Consistency Score */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm text-center space-y-1 hover:shadow-md transition-shadow">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Consistency</span>
              <p className="text-xs font-black text-emerald-900 bg-emerald-50 py-2 rounded-xl border border-emerald-100 mt-1">
                {consistencyScore.split(' ')[0]}
              </p>
              <span className="text-[10px] text-slate-500 font-medium">Studio Rating</span>
            </div>

          </div>
        </div>


        {/* 3. INTERACTIVE MONTHLY ATTENDANCE & LEAVE CALENDAR */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          
          {/* Header & Month Navigator */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <CalendarDays className="w-6 h-6 text-emerald-700" />
                <h3 className="font-serif font-extrabold text-xl sm:text-2xl text-slate-900">
                  Monthly Attendance & Leave Calendar
                </h3>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Check daily practice attendance, absences, approved leaves, and studio holidays.
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200/60">
                <button
                  onClick={handlePrevCalMonth}
                  className="p-1.5 rounded-xl hover:bg-white text-slate-700 transition-all shadow-sm"
                  title="Previous Month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-3 py-1 text-xs font-black text-slate-900 min-w-[125px] text-center">
                  {monthNames[calMonth]} {calYear}
                </span>
                <button
                  onClick={handleNextCalMonth}
                  className="p-1.5 rounded-xl hover:bg-white text-slate-700 transition-all shadow-sm"
                  title="Next Month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleCurrentCalMonth}
                className="px-3.5 py-2 rounded-2xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-extrabold transition-colors border border-emerald-200"
              >
                Current Month
              </button>
            </div>
          </div>

          {/* Month Summary Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
              <span className="text-[10px] font-extrabold text-emerald-800 uppercase block">Present</span>
              <strong className="text-lg sm:text-xl font-black text-emerald-900">{calMonthPresent} Days</strong>
            </div>
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-center">
              <span className="text-[10px] font-extrabold text-rose-800 uppercase block">Absent</span>
              <strong className="text-lg sm:text-xl font-black text-rose-900">{calMonthAbsent} Days</strong>
            </div>
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-center">
              <span className="text-[10px] font-extrabold text-amber-800 uppercase block">Client Leaves</span>
              <strong className="text-lg sm:text-xl font-black text-amber-900">{calMonthLeaves} Days</strong>
            </div>
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 border border-amber-300 text-center ring-1 ring-amber-300/50">
              <span className="text-[10px] font-black text-amber-900 uppercase block">💳 Fee Paid</span>
              <strong className="text-lg sm:text-xl font-black text-amber-950">
                {calMonthPayments.length > 0 ? `₹${calMonthPaidTotal.toLocaleString()}` : '₹0'}
              </strong>
            </div>
            <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 text-center col-span-2 sm:col-span-1">
              <span className="text-[10px] font-extrabold text-purple-800 uppercase block">Studio Leaves</span>
              <strong className="text-lg sm:text-xl font-black text-purple-900">{instructorLeavesCount} Logged</strong>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="space-y-2">
            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-1 text-center font-bold text-[11px] text-slate-400 uppercase tracking-wider py-1">
              {calDaysOfWeek.map((d, i) => (
                <span key={i} className={i === 0 ? 'text-rose-400' : ''}>{d}</span>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {/* Empty padding days for month start */}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="min-h-[56px] sm:min-h-[68px] rounded-2xl bg-slate-50/40 border border-transparent" />
              ))}

              {/* Month Days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                
                const att = clientAtt.find(a => a.date === dateStr);
                const isPresent = att?.status === 'Present';
                const isAbsent = att?.status === 'Absent';
                
                const clientLeave = leaves.find(l => {
                  if (l.clientId !== targetClient.id) return false;
                  if (l.startDate) return dateStr >= l.startDate && dateStr <= (l.endDate || l.startDate);
                  return l.date === dateStr;
                });
                
                const trainerLeave = trainerLeaves.find(tl => {
                  const s = tl.startDate || tl.date || '';
                  const e = tl.endDate || s;
                  return dateStr >= s && dateStr <= e;
                });

                // Client fee payment check for this date
                const clientPaymentsOnDate = payments.filter(p => p.clientId === targetClient.id && p.date === dateStr && p.status === 'Paid');
                const totalPaidOnDate = clientPaymentsOnDate.reduce((sum, p) => sum + (p.amount || 0), 0);
                const hasPayment = clientPaymentsOnDate.length > 0;

                const isToday = new Date().toISOString().slice(0, 10) === dateStr;

                return (
                  <div
                    key={dateStr}
                    className={`min-h-[56px] sm:min-h-[68px] p-2 rounded-2xl border transition-all flex flex-col justify-between ${
                      hasPayment
                        ? 'bg-gradient-to-br from-amber-50 via-emerald-50/60 to-amber-100/70 border-amber-400 ring-2 ring-amber-400 shadow-md'
                        : isPresent
                        ? 'bg-emerald-50/90 border-emerald-300 ring-1 ring-emerald-200'
                        : isAbsent
                        ? 'bg-rose-50/90 border-rose-300 ring-1 ring-rose-200'
                        : clientLeave
                        ? 'bg-amber-50/90 border-amber-300 ring-1 ring-amber-200'
                        : trainerLeave
                        ? 'bg-purple-50/90 border-purple-300'
                        : isToday
                        ? 'bg-slate-50 border-emerald-500 ring-2 ring-emerald-500/20'
                        : 'bg-white border-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-black ${
                        hasPayment
                          ? 'w-5 h-5 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center text-[10px] shadow-sm ring-1 ring-amber-500'
                          : isToday 
                          ? 'w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[10px]' 
                          : 'text-slate-700'
                      }`}>
                        {dayNum}
                      </span>
                      {hasPayment && <span className="text-xs shrink-0" title={`Payment Paid ₹${totalPaidOnDate.toLocaleString()}`}>💰</span>}
                      {!hasPayment && isPresent && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                      {!hasPayment && isAbsent && <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />}
                      {!hasPayment && clientLeave && <span className="text-xs">🌴</span>}
                      {!hasPayment && trainerLeave && <span className="text-xs">🧘‍♀️</span>}
                    </div>

                    <div className="pt-1 space-y-0.5">
                      {hasPayment ? (
                        <span className="text-[9px] font-black text-amber-950 bg-amber-300/90 px-1 py-0.5 rounded-md block text-center truncate shadow-sm">
                          💳 Paid ₹{totalPaidOnDate.toLocaleString()}
                        </span>
                      ) : isPresent ? (
                        <span className="text-[9px] font-black text-emerald-800 bg-emerald-200/60 px-1 py-0.5 rounded-md block text-center truncate">
                          Present
                        </span>
                      ) : isAbsent ? (
                        <span className="text-[9px] font-black text-rose-800 bg-rose-200/60 px-1 py-0.5 rounded-md block text-center truncate">
                          Absent
                        </span>
                      ) : clientLeave ? (
                        <span className="text-[9px] font-bold text-amber-800 bg-amber-200/60 px-1 py-0.5 rounded-md block text-center truncate">
                          Leave
                        </span>
                      ) : trainerLeave ? (
                        <span className="text-[9px] font-bold text-purple-800 bg-purple-200/60 px-1 py-0.5 rounded-md block text-center truncate" title={trainerLeave.reason || 'Instructor Rest Day'}>
                          Studio Off
                        </span>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Calendar Legend */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full bg-amber-400 ring-2 ring-amber-300 flex items-center justify-center text-[8px] shadow-sm">💰</span>
              <span className="text-amber-950 font-black">Fee Paid Date</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span>Attended (Present)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <span>Missed (Absent)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span>Client Leave</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-purple-500" />
              <span>Studio / Instructor Leave</span>
            </span>
          </div>

        </div>


        {/* 4. LEADERBOARD HISTORY & ACHIEVEMENTS BADGES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Leaderboard History */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  🏆
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-base">Studio Leaderboard History</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Monthly regularity rankings & feature analytics</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-black text-xs border border-amber-200">
                August 2026 Ranking
              </span>
            </div>

            <div className="space-y-3">
              {leaderboardHistory.map((h, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-white text-slate-800 font-extrabold text-xs flex items-center justify-center border border-slate-200 shadow-sm">
                      #{i + 1}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{h.month}</p>
                      <span className="text-[10px] text-emerald-700 font-semibold">{h.badge}</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-amber-400/20 text-amber-900 font-extrabold text-xs border border-amber-300/40">
                    {h.rank}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Earned Badges & Achievements */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  🎖️
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-base">Earned Yoga Badges</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Recognitions achieved for regularity & dedication</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-900 font-black text-xs border border-purple-200">
                {achievements.filter(a => a.earned).length} Badges
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {achievements.map((badge) => (
                <div 
                  key={badge.id} 
                  className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                    badge.earned 
                      ? 'bg-gradient-to-br from-amber-50/80 to-purple-50/50 border-amber-200 shadow-sm' 
                      : 'bg-slate-50/50 border-slate-200/60 opacity-50 grayscale'
                  }`}
                >
                  <span className="text-2xl shrink-0">{badge.icon}</span>
                  <div>
                    <h5 className="text-xs font-extrabold text-slate-900">{badge.title}</h5>
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5 leading-tight">{badge.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>


        {/* 4. PAYMENT STATUS & INSTRUCTOR INFO SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Payment & Continuous Billing Cycles Card (Strict Privacy Enforced!) */}
          <div id="billing-cycle-section" className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 transition-all scroll-mt-24">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">Billing Cycle & Fee Status</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Monthly fee records verified by Studio Journal</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Lock className="w-3 h-3 text-slate-400" /> Private
              </span>
            </div>

            {/* Total Balance / Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-emerald-50/40 border border-slate-200/80">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Outstanding Balance</span>
                <div className="flex items-center gap-2">
                  <strong className="text-xl font-black text-slate-900">
                    {hasOutstandingDue ? `₹${totalOutstandingDue.toLocaleString()}` : '₹0 (All Clear)'}
                  </strong>
                  {hasOutstandingDue ? (
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px] border border-amber-200">
                      {pendingCycles.length} {pendingCycles.length === 1 ? 'Cycle Pending' : 'Cycles Pending'}
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[10px] border border-emerald-200">
                      Up to Date ✓
                    </span>
                  )}
                </div>
              </div>

              {hasOutstandingDue ? (
                <button
                  onClick={() => setIsPaymentCheckoutOpen(true)}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Pay Online (₹{totalOutstandingDue.toLocaleString()})</span>
                </button>
              ) : (
                <span className="px-3.5 py-2 rounded-2xl bg-emerald-100 text-emerald-900 font-black text-xs border border-emerald-300 flex items-center gap-1.5 self-start sm:self-auto">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Verified by Studio Journal</span>
                </span>
              )}
            </div>

            {/* Continuous Monthly Cycles Breakdown */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Monthly Billing History:
              </span>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {billingCycles.map((cycle) => (
                  <div
                    key={cycle.monthStr}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                      cycle.status === 'Paid'
                        ? 'bg-emerald-50/60 border-emerald-200'
                        : cycle.status === 'Leave Waived'
                        ? 'bg-slate-50 border-slate-200 opacity-80'
                        : 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-200/50'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-900">
                          {cycle.monthName}
                        </span>
                        {cycle.isCurrentMonth && (
                          <span className="px-2 py-0.5 rounded-full bg-slate-900 text-white text-[9px] font-extrabold">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {cycle.status === 'Paid'
                          ? `₹${cycle.paidAmount.toLocaleString()} Paid on ${cycle.paidDate || 'Monthly Cycle'}`
                          : cycle.status === 'Leave Waived'
                          ? 'Full Month Approved Leave • Fee Waived'
                          : `Due Amount: ₹${cycle.dueAmount.toLocaleString()}`}
                      </p>
                    </div>

                    <div>
                      {cycle.status === 'Paid' ? (
                        <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-900 font-black text-xs border border-emerald-300 flex items-center gap-1 shadow-sm">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>PAID</span>
                        </span>
                      ) : cycle.status === 'Leave Waived' ? (
                        <span className="px-3 py-1 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs">
                          Leave Waived 🌴
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-xl bg-amber-100 text-amber-950 font-black text-xs border border-amber-300 flex items-center gap-1 shadow-sm">
                          <Clock className="w-3.5 h-3.5 text-amber-700" />
                          <span>PENDING</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-slate-400 font-medium italic text-center pt-1 flex items-center justify-center gap-1">
              <Lock className="w-3 h-3 text-slate-400" /> All fee transactions are securely recorded in Yoganjali Studio ledger.
            </p>
          </div>

          {/* Instructor Information Card */}
          <div className="bg-gradient-to-br from-emerald-900 to-slate-900 p-6 rounded-3xl text-white shadow-md border border-emerald-800/40 space-y-3">
            <div className="flex items-center justify-between border-b border-emerald-800/60 pb-3">
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-amber-400" />
                <h4 className="font-extrabold text-white text-sm">Guided Studio Instructor</h4>
              </div>
              <span className="text-[10px] font-black text-amber-300 uppercase tracking-wider bg-white/10 px-2.5 py-0.5 rounded-full">
                Lead Trainer
              </span>
            </div>

            <div className="flex items-center gap-3">
              <img
                src="/anjali_hero.jpg"
                alt="Trainer Anjali Negi"
                className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-400 shrink-0 bg-white"
              />
              <div>
                <h5 className="font-extrabold text-white text-sm">Trainer Anjali Negi</h5>
                <p className="text-[11px] text-emerald-200 font-medium">Founder & Certified Senior Yoga Instructor</p>
              </div>
            </div>

            <div className="pt-2 border-t border-emerald-800/60 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="px-3 py-1.5 rounded-xl bg-white/10 text-emerald-200 font-medium">
                🌿 Vinyasa, Hatha, Flexibility & Posture Correction
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-amber-400/20 text-amber-300 font-extrabold border border-amber-400/30">
                Certified Senior Yoga Instructor
              </span>
            </div>

            {/* Instructor Leave Schedule */}
            <div className="pt-3 border-t border-emerald-800/60 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-emerald-200 font-bold flex items-center gap-1.5">
                  <CalendarX className="w-3.5 h-3.5 text-amber-300" />
                  <span>Instructor Leave Schedule:</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-black text-xs border border-amber-400/30">
                  {instructorLeavesCount} {instructorLeavesCount === 1 ? 'Day' : 'Days'} Total
                </span>
              </div>
              
              {trainerLeaves.length > 0 ? (
                <div className="space-y-1.5 pt-1">
                  {trainerLeaves.slice(0, 3).map((tl) => (
                    <div key={tl.id} className="p-2 rounded-xl bg-white/10 border border-white/10 text-xs flex items-center justify-between">
                      <span className="text-slate-200 font-medium">
                        📅 {tl.startDate || tl.date} {tl.endDate && tl.endDate !== tl.startDate ? `to ${tl.endDate}` : ''}
                      </span>
                      <span className="text-amber-300 font-bold">
                        {tl.reason || 'Personal / Rest Day'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-emerald-300/80 italic pt-0.5">
                  ✓ No studio leaves scheduled. All guided classes running as per regular slots.
                </p>
              )}
            </div>
          </div>

        </div>

      </main>

      {/* Studio & Social Connect Footer */}
      <footer className="mt-16 border-t border-slate-200 bg-white py-12 px-4 sm:px-8 text-center space-y-6 shadow-sm">
        <div className="max-w-xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Connect with Yoganjali & Trainer Anjali Negi</span>
          </div>

          <h4 className="font-serif font-extrabold text-xl sm:text-2xl text-slate-900">
            Official Studio & Social Channels
          </h4>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            Follow our daily yoga flows, posture correction tips, student transformations and holistic wellness guides.
          </p>

          {/* Social Buttons Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <a
              href="https://www.yoganjaliyoga.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md hover:scale-105 transition-all"
            >
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>Official Website</span>
            </a>

            <a
              href="https://instagram.com/yoganjali25"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 p-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white font-extrabold text-xs shadow-md hover:scale-105 transition-all"
            >
              <Instagram className="w-4 h-4 text-white" />
              <span>@Yoganjali25</span>
            </a>

            <a
              href="https://www.youtube.com/@Yoganjali25"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 p-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md hover:scale-105 transition-all"
            >
              <Youtube className="w-4 h-4 text-white" />
              <span>YouTube Channel</span>
            </a>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 max-w-md mx-auto">
          <p className="text-[11px] text-slate-400 font-medium">
            © {new Date().getFullYear()} Yoganjali Yoga Studio • Guided by Anjali Negi • Official Member Progress Portal
          </p>
        </div>
      </footer>

      {/* Razorpay Online Payment Modal */}
      <PaymentCheckoutModal
        isOpen={isPaymentCheckoutOpen}
        onClose={() => setIsPaymentCheckoutOpen(false)}
        clientName={targetClient.name}
        clientPhone={targetClient.whatsapp || targetClient.phone || ''}
        amount={hasOutstandingDue ? totalOutstandingDue : Math.max(dueAmount - paidAmount, dueAmount || (targetClient.monthlyFee || 0))}
        purpose={`${isPerSession ? 'Per Session Fee' : 'Yoga Studio Fee'} — ${targetClient.name}`}
        onPaymentSuccess={(paymentId, paidAmt) => {
          const today = new Date().toISOString().slice(0, 10);
          addPayment({
            clientId: targetClient.id,
            clientName: targetClient.name,
            amount: paidAmt,
            date: today,
            month: today.slice(0, 7),
            paymentMode: 'UPI',
            status: 'Paid',
            notes: `Online Payment via Razorpay (Ref: ${paymentId})`,
          });
          setIsPaymentCheckoutOpen(false);
          showSuccessToast(`🎉 Payment of ₹${paidAmt.toLocaleString()} completed successfully! Verified as PAID.`);
        }}
      />
    </div>
  );
};
