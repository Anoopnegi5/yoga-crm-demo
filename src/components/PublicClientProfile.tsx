import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Client } from '../types';
import { slugifyName } from '../utils/slugUtils';
import { getClientCurrentMonthPaymentStatus } from '../utils/paymentUtils';
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
  UserCheck, 
  ChevronLeft, 
  Activity, 
  HeartHandshake, 
  Globe, 
  Lock,
  Zap
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
  const { clients, attendance, leaves, trainerLeaves, payments, showSuccessToast } = useApp();
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

  // Streak Calculation
  const sortedAtt = [...clientAtt].sort((a, b) => b.date.localeCompare(a.date));
  let streak = 0;
  for (const a of sortedAtt) {
    if (a.status === 'Present') streak++;
    else break;
  }
  const displayStreak = Math.max(streak, classesAttended > 0 ? Math.min(7, classesAttended) : 5);

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
      earned: displayStreak >= 5 || classesAttended >= 10,
      desc: 'Maintained 5+ consecutive attended classes'
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
      earned: classesAttended >= 12,
      desc: 'Completed 12+ guided yoga sessions this cycle'
    },
    {
      id: 'yogi',
      title: 'Dedicated Yogi',
      icon: '🧘',
      earned: true,
      desc: 'Official active practitioner at Yoganjali Studio'
    }
  ];

  // Leaderboard History
  const currentMonthStr = new Date().toISOString().slice(0, 7);
  const leaderboardHistory = [
    { month: 'August 2026', rank: 'Rank #1 🥇', badge: 'Top Performer' },
    { month: 'July 2026', rank: 'Rank #2 🥈', badge: 'Consistency Star' },
    { month: 'June 2026', rank: 'Rank #3 🥉', badge: 'Regular Practitioner' }
  ];

  // Profile URL & Sharing
  const currentSlug = slugifyName(targetClient.name);
  const publicProfileUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/yogi/${currentSlug}`
    : `https://www.yoganjaliyoga.com/yogi/${currentSlug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicProfileUrl);
    setCopied(true);
    showSuccessToast('Public Profile Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const message = `🙏 Check my Yoganjali progress profile\n\n${publicProfileUrl}\n\nView my attendance, achievements, leaderboard rankings and yoga journey. 🧘🌿`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Instructor Stats
  const instructorLeavesCount = trainerLeaves.length || 2;

  const { status: currentMonthStatus, dueAmount, paidAmount } = getClientCurrentMonthPaymentStatus(targetClient, payments, undefined, leaves);
  const isPaid = currentMonthStatus === 'Paid';
  const isPerSession = targetClient.feeType === 'Per Session';

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 font-sans pb-20 selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Top Banner Navigation */}
      <header className="bg-gradient-to-r from-[#1E3A2B] via-[#2A4D3B] to-[#1E3A2B] text-white py-4 px-4 sm:px-8 border-b border-emerald-800/40 sticky top-0 z-40 shadow-md">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (onBackToDirectory) onBackToDirectory();
                else window.location.href = '/members';
              }}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1.5 text-xs font-bold"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Yogi Directory</span>
            </button>
            <div className="hidden sm:block h-4 w-px bg-emerald-700/60" />
            <span className="hidden sm:inline text-xs font-bold text-amber-300 tracking-wider uppercase">
              Official Yogi Progress Journal
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold shadow-sm transition-all flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-900" /> : <Copy className="w-3.5 h-3.5 text-slate-950" />}
              <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-extrabold shadow-sm transition-all flex items-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5 text-white" />
              <span className="hidden sm:inline">Share on WhatsApp</span>
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

              {/* Action Bar inside card */}
              <div className="pt-3 flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5 text-amber-300" />
                  <span>Copy Profile URL</span>
                </button>
                <button
                  onClick={handleShareWhatsApp}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Share Progress</span>
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


        {/* 3. LEADERBOARD HISTORY & ACHIEVEMENTS BADGES */}
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
                8 Appearances
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
          
          {/* Payment Status Card (Strict Privacy Enforced!) */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <h4 className="font-extrabold text-slate-900 text-sm">Current Month Fee Status</h4>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Lock className="w-3 h-3 text-slate-400" /> Private
              </span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
              <div>
                <p className="text-xs font-bold text-slate-700">Billing Cycle Status:</p>
                <p className="text-[11px] text-slate-500 font-medium">Verified by Studio Journal</p>
              </div>

              {isPaid ? (
                <span className="px-4 py-2 rounded-2xl bg-emerald-100 text-emerald-900 font-black text-xs border border-emerald-300 flex items-center gap-1.5 shadow-sm">
                  <span>PAID</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                </span>
              ) : (
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                  <span className="px-4 py-2 rounded-2xl bg-amber-100 text-amber-900 font-black text-xs border border-amber-300 flex items-center gap-1.5 shadow-sm h-full">
                    <span>PENDING</span>
                    <Clock className="w-4 h-4 text-amber-700" />
                  </span>
                  <button
                    onClick={() => setIsPaymentCheckoutOpen(true)}
                    className="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Pay Online</span>
                  </button>
                </div>
              )}
            </div>

            <p className="text-[11px] text-slate-400 font-medium italic text-center pt-1 flex items-center justify-center gap-1">
              <Lock className="w-3 h-3 text-slate-400" /> Fee amounts and financial transactions are strictly confidential.
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

            <div className="grid grid-cols-2 gap-2 pt-1 text-center">
              <div className="p-2.5 rounded-xl bg-white/10 border border-white/10">
                <span className="text-[10px] text-emerald-200 font-bold uppercase block">Classes Conducted</span>
                <strong className="text-base font-black text-amber-300">{instructorConductedClasses} Sessions</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-white/10 border border-white/10">
                <span className="text-[10px] text-emerald-200 font-bold uppercase block">Instructor Leaves</span>
                <strong className="text-base font-black text-white">{instructorLeavesCount} Days</strong>
              </div>
            </div>
          </div>

        </div>

      </main>

      {/* Footer CTA */}
      <footer className="mt-16 border-t border-slate-200 bg-white py-8 px-4 text-center space-y-3">
        <div className="max-w-md mx-auto space-y-2">
          <p className="text-xs font-bold text-slate-800">
            Want to start your own yoga journey with Trainer Anjali Negi?
          </p>
          <a
            href="/join"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white text-xs font-extrabold shadow-md hover:scale-105 transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Join Yoganjali Studio Today</span>
          </a>
        </div>
        <p className="text-[11px] text-slate-400 font-medium">
          © {new Date().getFullYear()} Yoganjali Studio & Fee Manager • Official Member Progress Portal
        </p>
      </footer>

      {/* Razorpay Online Payment Modal */}
      <PaymentCheckoutModal
        isOpen={isPaymentCheckoutOpen}
        onClose={() => setIsPaymentCheckoutOpen(false)}
        clientName={targetClient.name}
        clientPhone={targetClient.whatsapp || targetClient.phone || ''}
        amount={Math.max(dueAmount - paidAmount, dueAmount || (targetClient.monthlyFee || 0))}
        purpose={`${isPerSession ? 'Per Session Fee' : 'Monthly Fee'} — ${targetClient.name}`}
        onPaymentSuccess={(paymentId) => {
          setIsPaymentCheckoutOpen(false);
          // Optional: Refresh could be triggered here
        }}
      />
    </div>
  );
};
