import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SITE_CONFIG } from '../config/siteConfig';
import { safeStorage } from '../utils/safeStorage';
import { 
  Trophy, 
  Flame, 
  Calendar, 
  CheckCircle2, 
  Sparkles, 
  ArrowLeft, 
  Target, 
  Droplets, 
  MessageCircle,
  AlertTriangle,
  Clock,
  Award
} from 'lucide-react';

interface DailyLog {
  date: string;
  classAttended: boolean;
  energyLevel: 'Calm 🧘' | 'Strong 💪' | 'Supercharged ⚡';
  waterLitres: number;
  reflection: string;
}

export const ClientGoalTracker: React.FC = () => {
  const { clients, websiteCMS, showSuccessToast } = useApp();
  const cms = websiteCMS || {};

  // Check URL query params for pre-selected client
  const [selectedClientId, setSelectedClientId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const cId = params.get('clientId');
      if (cId) return cId;
    }
    return clients[0]?.id || '';
  });

  const selectedClient = clients.find(c => c.id === selectedClientId) || clients[0];

  // Client Goal State (stored in localStorage per client)
  const goalStorageKey = `yogademo_goal_data_${selectedClient?.id || 'default'}`;

  const [goalTitle, setGoalTitle] = useState<string>('Weight Loss & Core Strength (5kg Goal)');
  const [targetDays, setTargetDays] = useState<number>(20);
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [isEditingGoal, setIsEditingGoal] = useState<boolean>(false);

  // Form inputs for today's check-in
  const todayStr = new Date().toISOString().split('T')[0];
  const [todayClassDone, setTodayClassDone] = useState<boolean>(true);
  const [energyLevel, setEnergyLevel] = useState<'Calm 🧘' | 'Strong 💪' | 'Supercharged ⚡'>('Supercharged ⚡');
  const [waterLitres, setWaterLitres] = useState<number>(3);
  const [reflectionNote, setReflectionNote] = useState<string>('');

  // Load saved goal data
  useEffect(() => {
    const saved = safeStorage.getItem(goalStorageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.goalTitle) setGoalTitle(parsed.goalTitle);
        if (parsed.targetDays) setTargetDays(parsed.targetDays);
        if (parsed.logs) setLogs(parsed.logs);
      } catch (e) {
        console.error('Error loading goal tracker data:', e);
      }
    }
  }, [goalStorageKey]);

  // Save goal data helper
  const saveGoalData = (newTitle: string, newTarget: number, newLogs: DailyLog[]) => {
    const data = {
      goalTitle: newTitle,
      targetDays: newTarget,
      logs: newLogs
    };
    safeStorage.setItem(goalStorageKey, JSON.stringify(data));
  };

  // Check if today already logged
  const hasLoggedToday = logs.some(l => l.date === todayStr);

  // Stats calculation
  const completedClassesCount = logs.filter(l => l.classAttended).length;
  const progressPercent = Math.min(100, Math.round((completedClassesCount / targetDays) * 100));
  
  // Calculate current streak
  const calculateStreak = () => {
    let streak = 0;
    const sorted = [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    for (let i = 0; i < sorted.length; i++) {
      if (sorted[i].classAttended) streak++;
      else break;
    }
    return streak;
  };

  const streakCount = calculateStreak();

  // Fee & Session status calculation
  const isMonthlyClient = selectedClient?.feeType !== 'Per Session';
  const monthlyFeePaid = selectedClient?.paymentStatus === 'Paid';
  const perSessionRemaining = selectedClient?.totalClasses ? (selectedClient.totalClasses - (selectedClient.completedClasses || 0)) : 1;
  const isSessionPassActive = perSessionRemaining > 0;

  // Handle today's daily log submit
  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (hasLoggedToday) {
      alert('You have already logged today\'s yoga progress! Great job on staying consistent! 🔥');
      return;
    }

    const newLog: DailyLog = {
      date: todayStr,
      classAttended: todayClassDone,
      energyLevel,
      waterLitres,
      reflection: reflectionNote.trim() || 'Completed today\'s yoga session with mindfulness!'
    };

    const updatedLogs = [newLog, ...logs];
    setLogs(updatedLogs);
    saveGoalData(goalTitle, targetDays, updatedLogs);
    showSuccessToast(`🎉 Today's Yoga Progress Logged! ${progressPercent}% Goal Milestone Achieved! 🔥`);
  };

  // Handle WhatsApp Fee Renewal / Support Chat
  const handleFeeRenewalWhatsApp = () => {
    const waNumber = (cms.displayPhone || SITE_CONFIG.whatsappNumber).replace(/[^0-9]/g, '');
    const msg = `Hi! 👋 I am tracking my Health Goal (${goalTitle}) on ${cms.brandName || 'our Studio'}.\n\nMy current streak is 🔥 ${streakCount} Days! I would like to renew my Yoga Class Subscription Fee to keep my goal progress unlocked. 💳🧘🌿`;
    window.open(`https://api.whatsapp.com/send?phone=${waNumber}&text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleReturnToWebsite = () => {
    window.location.href = window.location.pathname;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#121B0D] via-[#1E2E17] to-[#0D1409] text-[#FAF7F2] font-sans selection:bg-emerald-500 selection:text-white pb-20">
      
      {/* Top Banner Header */}
      <header className="sticky top-0 z-40 bg-[#121B0D]/90 backdrop-blur-xl border-b border-emerald-800/40 px-4 sm:px-8 py-4 shadow-2xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
          <button
            onClick={handleReturnToWebsite}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs transition-all border border-white/15"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" />
            <span>Back to Website</span>
          </button>

          <div className="flex items-center gap-3">
            <img 
              src={cms.logoImage || SITE_CONFIG.logoImage} 
              alt="Studio Logo" 
              className="w-9 h-9 rounded-xl object-cover ring-2 ring-emerald-400/40 bg-white p-0.5" 
            />
            <div className="hidden sm:block">
              <h1 className="font-serif font-extrabold text-lg text-white leading-none">{cms.brandName?.toUpperCase() || 'STUDIO'} HEALTH GOAL TRACKER</h1>
              <p className="text-[10px] text-emerald-300 font-bold tracking-wider mt-0.5">Daily Post-Class Progress & Fee Synergy</p>
            </div>
          </div>

          {/* Client Selector Dropdown */}
          <div className="flex items-center gap-2">
            <span className="hidden md:inline text-xs font-bold text-slate-300">Client Profile:</span>
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-emerald-950 border border-emerald-500/40 text-xs font-bold text-emerald-300 outline-none cursor-pointer"
            >
              {clients.map(c => (
                <option key={c.id} value={c.id}>
                  🧘 {c.name} ({c.sessionType})
                </option>
              ))}
            </select>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-8 pt-8 space-y-8">
        
        {/* HERO GOAL HEADLINE BANNER */}
        <div className="bg-gradient-to-r from-emerald-900/80 via-teal-900/80 to-emerald-950/90 rounded-[2.5rem] p-6 sm:p-10 border-2 border-emerald-400/30 shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Trophy className="w-64 h-64 text-amber-300" />
          </div>

          <div className="relative z-10 space-y-6">
            
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-300 text-xs font-black tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                DAILY HEALTH GOAL DISCIPLINE
              </div>

              {/* Flame Streak Badge */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-black text-xs shadow-lg animate-pulse">
                <Flame className="w-4 h-4 text-slate-950 fill-slate-950" />
                <span>🔥 {streakCount}-DAY STREAK!</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-white">
                  Target: {goalTitle}
                </h2>
                <button
                  onClick={() => setIsEditingGoal(!isEditingGoal)}
                  className="text-xs text-emerald-300 underline font-bold hover:text-white"
                >
                  {isEditingGoal ? 'Close' : '✏️ Change Goal'}
                </button>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                Practitioner: <strong className="text-white font-extrabold">{selectedClient?.name}</strong> • Joining Date: {selectedClient?.joiningDate}
              </p>
            </div>

            {/* EDIT GOAL MODAL CARD */}
            {isEditingGoal && (
              <div className="p-4 rounded-2xl bg-black/40 border border-white/20 space-y-3 animate-fadeIn">
                <label className="block text-xs font-bold text-amber-300">Set Your Target Health Goal:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    'Weight Loss & Core Strength (5kg Goal)',
                    'Spine & Back Pain Relief (Pain-Free 30 Days)',
                    '100% Full Body Flexibility & Posture',
                    '20 Active Days Yoga Challenge',
                    'Daily Energy & Stress Reduction'
                  ].map((g, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setGoalTitle(g);
                        saveGoalData(g, targetDays, logs);
                        setIsEditingGoal(false);
                      }}
                      className={`p-2.5 rounded-xl border text-left font-bold transition-all ${
                        goalTitle === g ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-white/10 border-white/15 text-slate-200 hover:bg-white/20'
                      }`}
                    >
                      🎯 {g}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* VISUAL PROGRESS BAR & MILESTONE RING */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs font-extrabold">
                <span className="text-emerald-300 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-emerald-400" />
                  Progress Milestone: {completedClassesCount} / {targetDays} Classes Completed
                </span>
                <span className="text-amber-300 text-sm font-black">{progressPercent}% COMPLETED</span>
              </div>

              {/* Progress Bar Container */}
              <div className="w-full h-4 rounded-full bg-black/50 border border-white/20 p-0.5 overflow-hidden shadow-inner">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 transition-all duration-700 shadow-md"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

          </div>
        </div>

        {/* PSYCHOLOGICAL FEE & SUBSCRIPTION UNLOCKER CARD */}
        <div className={`p-6 sm:p-8 rounded-[2.5rem] border-2 shadow-2xl space-y-4 transition-all ${
          (isMonthlyClient ? monthlyFeePaid : isSessionPassActive)
            ? 'bg-gradient-to-br from-emerald-950/80 via-slate-900 to-emerald-900/40 border-emerald-500/40'
            : 'bg-gradient-to-br from-rose-950/90 via-slate-900 to-amber-950/80 border-rose-500/60'
        }`}>
          
          <div className="flex items-center justify-between border-b border-white/15 pb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg ${
                (isMonthlyClient ? monthlyFeePaid : isSessionPassActive)
                  ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-white'
                  : 'bg-gradient-to-tr from-rose-600 to-amber-500 text-white animate-bounce'
              }`}>
                {(isMonthlyClient ? monthlyFeePaid : isSessionPassActive) ? '🔓' : '🔒'}
              </div>

              <div>
                <h3 className="font-serif font-extrabold text-lg sm:text-xl text-white flex items-center gap-2">
                  <span>Yoga Investment & Goal Lock Status</span>
                  {(isMonthlyClient ? monthlyFeePaid : isSessionPassActive) ? (
                    <span className="text-[10px] bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-black">
                      UNLOCKED & ACTIVE
                    </span>
                  ) : (
                    <span className="text-[10px] bg-rose-500/30 text-rose-300 border border-rose-400/50 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-black animate-pulse">
                      RENEWAL DUE
                    </span>
                  )}
                </h3>

                <p className="text-xs text-slate-300 font-medium mt-0.5">
                  {isMonthlyClient 
                    ? `Plan: Monthly Session (${selectedClient?.monthlyFee ? `₹${selectedClient.monthlyFee}` : '₹10,000'} / month)`
                    : `Plan: Per Session (${selectedClient?.perSessionFee ? `₹${selectedClient.perSessionFee}` : '₹1,000'} / session)`}
                </p>
              </div>
            </div>

            {/* Quick Action WhatsApp Button */}
            <button
              onClick={handleFeeRenewalWhatsApp}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs shadow-xl flex items-center gap-2 shrink-0 hover:scale-105 active:scale-95 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Renew Fee on WhatsApp</span>
              <span className="sm:hidden">Renew</span>
            </button>
          </div>

          {/* Psychological Motivation Message */}
          {(isMonthlyClient ? monthlyFeePaid : isSessionPassActive) ? (
            <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-200 font-semibold">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>✨ Your yoga fee investment is active! Keep logging daily after every class to complete your {goalTitle} milestone!</span>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-500/50 space-y-2 text-xs text-rose-100 font-semibold">
              <div className="flex items-center gap-2 text-amber-300 font-extrabold text-sm">
                <AlertTriangle className="w-5 h-5 text-amber-400 animate-bounce shrink-0" />
                <span>⚠️ GOAL STREAK LOCK WARNING!</span>
              </div>
              <p className="leading-relaxed">
                Your current monthly fee / session pass cycle is ending. To keep your <strong>{streakCount}-Day Goal Streak</strong> unlocked and continue tracking your progress towards <strong>{goalTitle}</strong>, please complete your fee renewal! 🌿
              </p>
            </div>
          )}

        </div>

        {/* DAILY POST-CLASS QUICK CHECK-IN FORM */}
        <div className="bg-gradient-to-br from-[#1C2B17] to-[#142010] p-6 sm:p-8 rounded-[2.5rem] border border-emerald-500/30 shadow-2xl space-y-6">
          
          <div className="flex items-center justify-between border-b border-emerald-800/50 pb-4">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-6 h-6 text-emerald-400" />
              <div>
                <h3 className="font-serif font-extrabold text-xl text-white">Daily Post-Class Progress Check-In</h3>
                <p className="text-xs text-slate-300 font-medium">Log your daily practice in 10 seconds right after your yoga class!</p>
              </div>
            </div>

            <span className="text-xs font-bold text-emerald-300 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-500/40">
              📅 Today: {todayStr}
            </span>
          </div>

          {hasLoggedToday ? (
            <div className="p-6 rounded-3xl bg-emerald-900/40 border border-emerald-400/40 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
              <h4 className="font-serif text-xl font-extrabold text-white">Today's Practice Already Logged! 🎉</h4>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                Awesome dedication, {selectedClient?.name}! Your streak is updated to <strong className="text-amber-300">🔥 {streakCount} Days</strong>. Come back tomorrow after your next class!
              </p>
            </div>
          ) : (
            <form onSubmit={handleLogSubmit} className="space-y-6">
              
              {/* Checkbox: Attended Class */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="classDone"
                    checked={todayClassDone}
                    onChange={(e) => setTodayClassDone(e.target.checked)}
                    className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
                  />
                  <label htmlFor="classDone" className="text-sm font-extrabold text-white cursor-pointer">
                    ✅ I Attended & Completed Yoga Class Today!
                  </label>
                </div>
                <span className="text-xs text-amber-300 font-bold">+1 Goal Day</span>
              </div>

              {/* Energy & Feeling Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-emerald-300">How do you feel after today's class?</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['Calm 🧘', 'Strong 💪', 'Supercharged ⚡'] as const).map((lvl) => (
                    <button
                      type="button"
                      key={lvl}
                      onClick={() => setEnergyLevel(lvl)}
                      className={`p-3 rounded-2xl border font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 ${
                        energyLevel === lvl
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 border-emerald-400 text-white shadow-lg scale-105'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hydration Tracker */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-300">
                  <span className="flex items-center gap-1.5"><Droplets className="w-4 h-4 text-cyan-400" /> Daily Water Intake:</span>
                  <span className="text-cyan-300 font-extrabold">{waterLitres} Litres Drank Today</span>
                </div>
                <div className="flex items-center gap-3">
                  {[1, 2, 3, 4].map(l => (
                    <button
                      type="button"
                      key={l}
                      onClick={() => setWaterLitres(l)}
                      className={`flex-1 py-2.5 rounded-xl border text-xs font-extrabold transition-all ${
                        waterLitres === l ? 'bg-cyan-600 border-cyan-400 text-white' : 'bg-white/5 border-white/10 text-slate-300'
                      }`}
                    >
                      💧 {l}L
                    </button>
                  ))}
                </div>
              </div>

              {/* Today's Reflection Note */}
              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-emerald-300">Today's Yoga Reflection / Posture Note:</label>
                <input
                  type="text"
                  value={reflectionNote}
                  onChange={(e) => setReflectionNote(e.target.value)}
                  placeholder="e.g. Felt great flexibility in Cobra pose! Spinal back pain is decreasing."
                  className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/15 text-xs text-white placeholder-slate-500 font-medium outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-amber-950 font-black text-xs uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Flame className="w-4 h-4 text-amber-950 fill-amber-950" />
                <span>LOG TODAY'S PRACTICE & BOOST STREAK</span>
              </button>

            </form>
          )}

        </div>

        {/* LOG HISTORY & BADGES */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* History Calendar Logs */}
          <div className="md:col-span-7 bg-white/5 p-6 rounded-[2.5rem] border border-white/10 space-y-4">
            <h4 className="font-serif font-extrabold text-lg text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-400" />
              <span>Recent Class Log History</span>
            </h4>

            {logs.length === 0 ? (
              <p className="text-xs text-slate-400 font-medium italic">No logs yet. Complete today's check-in above to start your streak!</p>
            ) : (
              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {logs.map((log, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-white">📅 {log.date}</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                          {log.energyLevel}
                        </span>
                      </div>
                      <p className="text-slate-300 text-[11px] font-medium">{log.reflection}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-cyan-300 font-bold block text-[11px]">💧 {log.waterLitres}L Water</span>
                      <span className="text-emerald-400 font-extrabold text-[10px]">✓ Class Done</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Gamified Achievements & Badges */}
          <div className="md:col-span-5 bg-white/5 p-6 rounded-[2.5rem] border border-white/10 space-y-4">
            <h4 className="font-serif font-extrabold text-lg text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Unlocked Milestones & Badges</span>
            </h4>

            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-amber-400/30 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-bold text-xl flex items-center justify-center shadow-md">
                  🔥
                </div>
                <div>
                  <h5 className="font-bold text-xs text-white">Streak Practitioner</h5>
                  <p className="text-[10px] text-amber-200">Maintained {streakCount} consecutive yoga sessions</p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-400/30 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white font-bold text-xl flex items-center justify-center shadow-md">
                  🧘
                </div>
                <div>
                  <h5 className="font-bold text-xs text-white">Mindfulness Champion</h5>
                  <p className="text-[10px] text-emerald-200">Completed {completedClassesCount} total classes logged</p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500 text-white font-bold text-xl flex items-center justify-center shadow-md">
                  💧
                </div>
                <div>
                  <h5 className="font-bold text-xs text-white">Hydration Hero</h5>
                  <p className="text-[10px] text-cyan-200">Daily water discipline active</p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </main>

    </div>
  );
};
