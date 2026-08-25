import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SITE_CONFIG, DEFAULT_WEBSITE_CMS } from '../config/siteConfig';
import { FreeDemoModal } from './Modals/FreeDemoModal';
import { BlogArticleModal } from './BlogArticleModal';
import { 
  Sparkles, 
  CheckCircle2, 
  MessageCircle, 
  ShieldCheck, 
  Award, 
  Users, 
  Clock, 
  Heart, 
  Flame, 
  Check, 
  Star, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  Instagram, 
  Youtube, 
  Phone, 
  Menu, 
  X, 
  Target, 
  Compass, 
  Zap, 
  Sun, 
  Activity,
  Globe,
  Sparkle,
  Shield,
  Layers,
  BookOpen,
  Calendar,
  ExternalLink,
  TrendingUp,
  Dumbbell,
  Music,
  CheckCircle
} from 'lucide-react';
import { Gender, SessionType, FeeType, BlogPost } from '../types';

export const ClientWebsite: React.FC = () => {
  const { addClient, showSuccessToast, websiteCMS, blogs } = useApp();
  const cms = websiteCMS || DEFAULT_WEBSITE_CMS;

  // URL check for Share Demo / Join Link (/join, /demo, ?demo=true, ?join=true)
  const isJoinLink = React.useMemo(() => {
    if (typeof window === 'undefined') return false;
    const search = window.location.search;
    const path = window.location.pathname.toLowerCase();
    return search.includes('join=true') || search.includes('demo=true') || search.includes('register=true') || search.includes('mode=client') || path === '/join' || path === '/demo';
  }, []);

  // State
  const [activeTab, setActiveTab] = useState<'home' | 'register' | 'leaderboard' | 'myProfile'>('home');
  const [selectedStudioCategory, setSelectedStudioCategory] = useState<'yoga' | 'gym' | 'dance' | 'martial' | 'fitness'>('yoga');
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(isJoinLink);
  const [selectedGoalForModal, setSelectedGoalForModal] = useState('');
  const [selectedProgramForModal, setSelectedProgramForModal] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);

  // Blog State
  const [selectedBlogForModal, setSelectedBlogForModal] = useState<BlogPost | null>(null);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [blogFilterCategory, setBlogFilterCategory] = useState<string>('All');

  // Auto-open modal if opened via Share Join link
  useEffect(() => {
    if (isJoinLink) {
      setIsDemoModalOpen(true);
    }
  }, [isJoinLink]);

  // Deep linking to individual blog post via clean URL (/blog/:slug or ?blog=slug or #blog-slug)
  useEffect(() => {
    if (typeof window === 'undefined' || !blogs || blogs.length === 0) return;
    const path = window.location.pathname.toLowerCase();
    const search = window.location.search;
    const hash = window.location.hash.toLowerCase();

    if (path.startsWith('/blog/')) {
      const slug = path.replace('/blog/', '').replace(/\/$/, '');
      const match = blogs.find(b => b.slug.toLowerCase() === slug || b.id.toLowerCase() === slug);
      if (match) {
        setSelectedBlogForModal(match);
        setIsBlogModalOpen(true);
      }
    } else {
      const params = new URLSearchParams(search);
      const querySlug = params.get('blog') || params.get('article');
      if (querySlug) {
        const match = blogs.find(b => b.slug.toLowerCase() === querySlug.toLowerCase() || b.id.toLowerCase() === querySlug.toLowerCase());
        if (match) {
          setSelectedBlogForModal(match);
          setIsBlogModalOpen(true);
        }
      } else if (hash.startsWith('#blog-')) {
        const hashSlug = hash.replace('#blog-', '');
        const match = blogs.find(b => b.slug.toLowerCase() === hashSlug || b.id.toLowerCase() === hashSlug);
        if (match) {
          setSelectedBlogForModal(match);
          setIsBlogModalOpen(true);
        }
      }
    }
  }, [blogs]);

  const openDemoModal = (goal: string = '', program: string = '') => {
    setSelectedGoalForModal(goal);
    setSelectedProgramForModal(program);
    setIsDemoModalOpen(true);
    setMobileMenuOpen(false);
  };

  const handleDirectWhatsAppChat = (customText?: string) => {
    const defaultMsg = customText || `Hi! 👋 I would like to know more about classes and trial sessions at ${cms.brandName || 'Studio'}. 🌿`;
    const waNumber = (cms.displayPhone || SITE_CONFIG.whatsappNumber).replace(/[^0-9]/g, '');
    window.open(`https://api.whatsapp.com/send?phone=${waNumber}&text=${encodeURIComponent(defaultMsg)}`, '_blank');
  };

  const studioCategories = [
    { id: 'yoga', label: 'Yoga & Meditation', icon: '🧘', desc: 'Live flows, pranayama & restorative sessions' },
    { id: 'gym', label: 'Gym & Fitness', icon: '🏋️', desc: 'Strength training, HIIT & body conditioning' },
    { id: 'dance', label: 'Dance Academy', icon: '💃', desc: 'Kathak, contemporary, salsa & freestyle' },
    { id: 'martial', label: 'Martial Arts & MMA', icon: '🥋', desc: 'Karate, boxing, self-defense & discipline' },
    { id: 'fitness', label: 'Pilates & Wellness', icon: '✨', desc: 'Core posture, flexibility & holistic health' },
  ];

  const goalsData = [
    {
      id: 'weight',
      title: 'Weight & Fat Loss',
      icon: '🔥',
      themeColor: 'from-amber-500 to-rose-600',
      badgeBg: 'bg-amber-50 text-amber-900 border-amber-200',
      desc: 'Active functional flows, metabolic interval conditioning, and consistent habit tracking for sustainable fat loss.'
    },
    {
      id: 'flexibility',
      title: 'Flexibility & Alignment',
      icon: '🧘‍♀️',
      themeColor: 'from-emerald-500 to-teal-700',
      badgeBg: 'bg-emerald-50 text-emerald-900 border-emerald-200',
      desc: 'Gradual, guided mobility routines designed to release tight hamstrings, hips, and shoulders at your natural pace.'
    },
    {
      id: 'strength',
      title: 'Functional Body Strength',
      icon: '💪',
      themeColor: 'from-indigo-600 to-purple-700',
      badgeBg: 'bg-indigo-50 text-indigo-900 border-indigo-200',
      desc: 'Core strength holds and bodyweight stability postures that build toned muscle without unnatural joint strain.'
    },
    {
      id: 'stress',
      title: 'Stress Relief & Mindfulness',
      icon: '🌿',
      themeColor: 'from-teal-600 to-emerald-800',
      badgeBg: 'bg-teal-50 text-teal-900 border-teal-200',
      desc: 'Deep breathing techniques, mindfulness routines, and restorative relaxation to ease nervous tension and mental fatigue.'
    },
    {
      id: 'pcos',
      title: 'PCOS & Hormonal Balance',
      icon: '🌸',
      themeColor: 'from-pink-500 to-rose-600',
      badgeBg: 'bg-pink-50 text-pink-900 border-pink-200',
      desc: 'Targeted pelvic circulation movement and stress-regulation protocols designed to complement endocrine health.'
    },
    {
      id: 'backpain',
      title: 'Back & Neck Pain Care',
      icon: '🦴',
      themeColor: 'from-orange-500 to-emerald-800',
      badgeBg: 'bg-orange-50 text-orange-900 border-orange-200',
      desc: 'Gentle spinal decompression, core bracing, and posture realignment to relieve discomfort from long desk hours.'
    }
  ];

  const faqs = [
    {
      q: "Can this system be used for Gyms, Dance Academies, and Yoga Studios?",
      a: "Yes, absolutely! The platform is 100% versatile and customizable. You can adjust batch names, pricing, instructor details, attendance styles, and branding in 1 click from the Settings panel."
    },
    {
      q: "How does the Free 1-Day Demo / Trial work?",
      a: "Students click the Free Demo button, submit their preferred time slot and goal, and receive instant confirmation with direct WhatsApp connectivity to the instructor."
    },
    {
      q: "Can members view their attendance and fee status on mobile?",
      a: "Yes! Every student gets a branded Yogi & Member Profile Link where they can view their monthly attendance calendar, payment status, fee receipts, and submit leave requests."
    },
    {
      q: "Is there support for both 1-on-1 personal training and group batches?",
      a: "Yes. Trainers can manage multiple morning and evening group batches alongside dedicated 1-on-1 personal coaching clients with individualized logs."
    },
    {
      q: "Do I need technical skills to edit website content or pricing?",
      a: "No technical knowledge required! The built-in CMS & Settings panel allows instructors and studio owners to update photos, headlines, pricing packages, and announcements in real time."
    }
  ];

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#0A0F1D] text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-300 pb-20 relative">
      
      {/* Background Subtle Mesh Gradients */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-600/10 blur-[120px]" />
        <div className="absolute top-[30%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/10 blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-amber-500/5 blur-[120px]" />
      </div>

      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border-b border-emerald-800/30 py-2.5 px-4 text-center text-xs font-bold text-emerald-200 flex items-center justify-center gap-2 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span>{cms.announcementBar || "🌸 1-Day Free Trial Available • Book Your Live Demo Session Today"}</span>
        <button 
          onClick={() => openDemoModal()}
          className="ml-2 px-3 py-0.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 font-extrabold text-[11px] transition-all"
        >
          Book Now →
        </button>
      </div>

      {/* ================================================== */}
      {/* 1. TOP HEADER / MODERN GLASS NAVBAR */}
      {/* ================================================== */}
      <header className="sticky top-0 z-50 bg-[#0A0F1D]/85 backdrop-blur-2xl border-b border-white/10 px-4 sm:px-8 py-3.5 shadow-2xl transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand Logo & Title */}
          <a href="#home" className="flex items-center gap-3.5 group">
            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 opacity-40 blur-sm group-hover:opacity-75 transition-all" />
              <img 
                src={SITE_CONFIG.logoImage} 
                alt="Studio Logo" 
                className="relative w-11 h-11 rounded-2xl object-cover ring-1 ring-white/20 shadow-md bg-slate-900 p-0.5" 
              />
            </div>
            <div>
              <span className="font-serif font-black text-xl sm:text-2xl tracking-wide bg-gradient-to-r from-white via-slate-100 to-emerald-300 bg-clip-text text-transparent block leading-none">
                {cms.brandName || SITE_CONFIG.brandName}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 block mt-1">
                Studio & Member Hub
              </span>
            </div>
          </a>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-bold text-slate-300">
            <a href="#home" className="hover:text-emerald-400 transition-colors">Home</a>
            <a href="#categories" className="hover:text-emerald-400 transition-colors">Disciplines</a>
            <a href="#programs" className="hover:text-emerald-400 transition-colors">Programs</a>
            <a href="#benefits" className="hover:text-emerald-400 transition-colors">Why Us</a>
            <a href="#goals" className="hover:text-emerald-400 transition-colors">Goals</a>
            <a href="#about" className="hover:text-emerald-400 transition-colors">Instructor</a>
            <a href="#testimonials" className="hover:text-emerald-400 transition-colors">Reviews</a>
            <a href="#faq" className="hover:text-emerald-400 transition-colors">FAQ</a>
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="/panel"
              className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 font-extrabold text-xs transition-all flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Trainer CRM</span>
            </a>

            <button
              onClick={() => handleDirectWhatsAppChat()}
              className="p-2.5 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all shadow-sm"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </button>

            <button
              onClick={() => openDemoModal()}
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 hover:scale-105 active:scale-95 transition-all"
            >
              FREE DEMO CLASS
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-2xl bg-white/10 border border-white/15 text-slate-200 shadow-sm"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 p-5 bg-[#0F172A]/95 backdrop-blur-2xl rounded-3xl border border-white/15 shadow-2xl space-y-3 text-xs font-bold text-slate-200 animate-fadeIn">
            <a href="#home" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-emerald-400">Home</a>
            <a href="#categories" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-emerald-400">Disciplines & Studio Types</a>
            <a href="#programs" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-emerald-400">Classes & Programs</a>
            <a href="#benefits" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-emerald-400">Why Choose Us</a>
            <a href="#goals" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-emerald-400">Targeted Goals</a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-emerald-400">About Instructor</a>
            <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-emerald-400">Reviews & Results</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-emerald-400">FAQ</a>
            
            <div className="pt-3 border-t border-white/10 space-y-2">
              <a
                href="/panel"
                className="w-full py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 border border-white/15"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Open Trainer CRM Panel
              </a>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openDemoModal();
                }}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs shadow-md text-center"
              >
                FREE DEMO CLASS
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ================================================== */}
      {/* 2. HERO SECTION */}
      {/* ================================================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-24">
        
        <section id="home" className="pt-6 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-extrabold shadow-sm backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                <span>ALL-IN-ONE STUDIO CRM & MEMBER PORTAL</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08]">
                Transform Your Body. <br />
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
                  Master Daily Mindful Practice.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
                {cms.heroSubtitle || "Personalized live online and studio classes with automated member tracking, attendance journals, and progress goals."}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => openDemoModal()}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-emerald-500/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5"
                >
                  <Sparkle className="w-4 h-4 text-slate-950 fill-slate-950" />
                  <span>BOOK 1-DAY FREE TRIAL</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href="/panel"
                  className="px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-extrabold text-xs sm:text-sm shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>OPEN TRAINER CRM</span>
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-bold text-slate-300">
                <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Certified Coaches</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Live 1-on-1 & Group</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Student Journal</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Free Trial Class</span>
                </div>
              </div>

            </div>

            {/* Hero Right Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Glow Backdrop */}
                <div className="absolute -inset-4 rounded-[3rem] bg-gradient-to-tr from-emerald-500/20 via-teal-500/20 to-indigo-500/20 blur-2xl -z-10" />

                <div className="relative rounded-[2.5rem] overflow-hidden border-2 border-white/20 shadow-2xl bg-slate-900">
                  <img
                    src={cms.heroImage || SITE_CONFIG.heroImage}
                    alt="Certified Yoga & Studio Coach"
                    className="w-full h-[460px] sm:h-[520px] object-cover hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                </div>

                {/* Floating Badge 1 (Top Left) */}
                <div className="absolute top-6 -left-4 sm:-left-6 bg-slate-900/90 backdrop-blur-xl p-3.5 rounded-2xl shadow-2xl border border-white/15 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black text-base shadow-md">
                    ⭐
                  </div>
                  <div>
                    <h4 className="font-serif font-extrabold text-xs text-white">5.0 Star Rated</h4>
                    <p className="text-[10px] text-emerald-400 font-bold">120+ Active Members</p>
                  </div>
                </div>

                {/* Floating Badge 2 (Bottom Right) */}
                <div className="absolute bottom-6 -right-2 sm:-right-4 bg-slate-900/90 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-white/15 flex items-center gap-3 max-w-[260px]">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center font-bold text-lg shadow-md shrink-0">
                    ⚡
                  </div>
                  <div>
                    <h4 className="font-serif font-extrabold text-xs text-white">Live Member Portal</h4>
                    <p className="text-[10px] text-slate-300 font-medium leading-tight">Instant Attendance & Fee Slips</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* ================================================== */}
        {/* 3. MULTI-DISCIPLINE STUDIO SWITCHER */}
        {/* ================================================== */}
        <section id="categories" className="space-y-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20 inline-block">
              BUILT FOR ALL DISCIPLINES
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-black text-white">
              One Platform. Every Studio Type.
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm font-medium">
              Seamlessly adaptable for personal trainers, boutique studios, gyms, and academies.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {studioCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedStudioCategory(cat.id as any)}
                className={`p-5 rounded-3xl text-left border transition-all space-y-2 ${
                  selectedStudioCategory === cat.id
                    ? 'bg-gradient-to-b from-emerald-950/60 to-slate-900 border-emerald-500/50 shadow-lg shadow-emerald-500/10 scale-105'
                    : 'bg-white/5 hover:bg-white/10 border-white/10'
                }`}
              >
                <div className="text-3xl">{cat.icon}</div>
                <h4 className="font-bold text-sm text-white">{cat.label}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{cat.desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* ================================================== */}
        {/* 4. PROGRAMS & PRICING BENTO GRID */}
        {/* ================================================== */}
        <section id="programs" className="space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20 inline-block">
              STRUCTURED PACKAGES
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-black text-white">
              {cms.classesTitle || "Tailored Studio Programs"}
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm font-medium">
              Choose the learning pace and coaching intensity that fits your lifestyle.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            
            {/* Card 1: Personal 1-on-1 (Highlighted) */}
            <div className="bg-gradient-to-b from-emerald-950/80 via-slate-900 to-slate-950 rounded-[2.5rem] p-8 sm:p-10 border-2 border-emerald-500/40 shadow-2xl flex flex-col justify-between relative overflow-hidden group hover:scale-[1.02] transition-all">
              <div className="absolute top-0 right-0 px-4 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-[11px] uppercase tracking-wider rounded-bl-2xl">
                ⭐ MOST POPULAR
              </div>

              <div className="space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-3xl shadow-inner">
                  🧘‍♀️
                </div>
                <div>
                  <h3 className="font-serif font-black text-2xl sm:text-3xl text-white">Personal 1-on-1 Coaching</h3>
                  <p className="text-xs font-bold text-emerald-400 mt-1">Live Online or In-Studio</p>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  Complete undivided attention with personalized posture corrections, diet habit guidance, and custom daily workouts.
                </p>

                <div className="pt-4 border-t border-white/10 space-y-2.5">
                  <span className="text-[11px] font-black text-amber-400 uppercase tracking-wider">Features Included:</span>
                  <div className="space-y-2 text-xs text-slate-200">
                    <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> 1-on-1 live dedicated session</div>
                    <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Custom body & goal assessment</div>
                    <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Flexible morning / evening slots</div>
                    <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Personalized member portal</div>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => openDemoModal('', 'Personal 1-on-1 Coaching')}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs tracking-wider uppercase shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>BOOK 1-ON-1 TRIAL</span>
                </button>
              </div>
            </div>

            {/* Card 2: Interactive Group Batches */}
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-[2.5rem] p-8 sm:p-10 border border-white/10 shadow-xl flex flex-col justify-between relative hover:border-emerald-500/30 transition-all">
              <div className="space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center text-3xl shadow-inner">
                  👥
                </div>
                <div>
                  <h3 className="font-serif font-black text-2xl sm:text-3xl text-white">Group Practice Batches</h3>
                  <p className="text-xs font-bold text-indigo-400 mt-1">High-Energy Community Flows</p>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  Daily dynamic interactive batches with fellow yogis and fitness enthusiasts. Build consistency with group motivation.
                </p>

                <div className="pt-4 border-t border-white/10 space-y-2.5">
                  <span className="text-[11px] font-black text-indigo-400 uppercase tracking-wider">Features Included:</span>
                  <div className="space-y-2 text-xs text-slate-200">
                    <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Morning & Evening Batches</div>
                    <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Live interactive video feedback</div>
                    <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Monthly attendance tracking</div>
                    <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Weekend workshops & Q&A</div>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => openDemoModal('', 'Group Practice Batches')}
                  className="w-full py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-black text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>JOIN GROUP BATCH TRIAL</span>
                </button>
              </div>
            </div>

            {/* Card 3: Therapeutic & Specialized Care */}
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-[2.5rem] p-8 sm:p-10 border border-white/10 shadow-xl flex flex-col justify-between relative hover:border-emerald-500/30 transition-all">
              <div className="space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center text-3xl shadow-inner">
                  🌿
                </div>
                <div>
                  <h3 className="font-serif font-black text-2xl sm:text-3xl text-white">Therapeutic & Care</h3>
                  <p className="text-xs font-bold text-rose-400 mt-1">Back Pain, PCOS & Mobility</p>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  Gentle, therapeutic movement sequences tailored for recovery, posture alignment, joint ease, and hormonal well-being.
                </p>

                <div className="pt-4 border-t border-white/10 space-y-2.5">
                  <span className="text-[11px] font-black text-rose-400 uppercase tracking-wider">Features Included:</span>
                  <div className="space-y-2 text-xs text-slate-200">
                    <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Zero strain, patient pacing</div>
                    <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Spine decompression routines</div>
                    <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Restorative breathwork techniques</div>
                    <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Progress health journals</div>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => openDemoModal('', 'Therapeutic & Specialized Care')}
                  className="w-full py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-black text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>EXPLORE THERAPY TRIAL</span>
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* ================================================== */}
        {/* 5. WHY CHOOSE US & STUDIO ADVANTAGE */}
        {/* ================================================== */}
        <section id="benefits" className="py-16 px-8 sm:px-12 rounded-[3rem] bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-950 border border-white/15 shadow-2xl relative overflow-hidden">
          <div className="space-y-12">
            
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="text-xs font-black uppercase tracking-widest text-amber-400 bg-amber-400/10 px-4 py-1.5 rounded-full border border-amber-400/20 inline-block">
                THE STUDIO ADVANTAGE
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-black text-white">
                {cms.whyTitle || "Why Train With Us?"}
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm font-medium">
                {cms.whySubtitle || "A blend of traditional wisdom, personalized attention, and modern digital journal tracking."}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl">
                  🎯
                </div>
                <h4 className="font-serif font-black text-xl text-white">Personalized Pace</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">Every pose adapted to your body mobility and current strength.</p>
              </div>

              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-2xl">
                  📱
                </div>
                <h4 className="font-serif font-black text-xl text-white">Digital Member App</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">Track your attendance streak, leave requests, and fee slips 24/7.</p>
              </div>

              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-2xl">
                  🌱
                </div>
                <h4 className="font-serif font-black text-xl text-white">Beginner Friendly</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">Zero intimidation. Gentle step-by-step guidance from day one.</p>
              </div>

              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center text-2xl">
                  ⚡
                </div>
                <h4 className="font-serif font-black text-xl text-white">Online & Studio</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">Practice from the convenience of your home or in-studio.</p>
              </div>

            </div>

            {/* Metrics Counter Bar */}
            <div className="pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <h4 className="font-serif text-3xl font-black text-emerald-400">500+</h4>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Transformed Members</p>
              </div>
              <div>
                <h4 className="font-serif text-3xl font-black text-amber-400">4.9 ★</h4>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Average Review</p>
              </div>
              <div>
                <h4 className="font-serif text-3xl font-black text-teal-400">99.4%</h4>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Attendance Consistency</p>
              </div>
              <div>
                <h4 className="font-serif text-3xl font-black text-rose-400">100%</h4>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Personalized Attention</p>
              </div>
            </div>

          </div>
        </section>

        {/* ================================================== */}
        {/* 6. GOALS & SPECIALIZATION GRID */}
        {/* ================================================== */}
        <section id="goals" className="space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20 inline-block">
              TARGETED GOALS
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-black text-white">
              What Is Your Health Priority?
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm font-medium">
              Select your primary goal to start your customized training routine.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {goalsData.map((goal) => (
              <div 
                key={goal.id}
                className="p-7 rounded-3xl bg-slate-900/60 border border-white/10 hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-5 group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{goal.icon}</span>
                    <span className="px-3 py-1 rounded-full bg-white/10 text-white font-black text-[10px] uppercase">Custom Routine</span>
                  </div>
                  <h3 className="font-serif font-black text-2xl text-white group-hover:text-emerald-300 transition-colors">
                    {goal.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    {goal.desc}
                  </p>
                </div>

                <button
                  onClick={() => openDemoModal(goal.title)}
                  className="w-full py-3 rounded-2xl bg-white/10 hover:bg-emerald-500 hover:text-slate-950 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Select {goal.title}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ================================================== */}
        {/* 7. ABOUT INSTRUCTOR SPOTLIGHT */}
        {/* ================================================== */}
        <section id="about" className="py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-[2.5rem] overflow-hidden border-2 border-white/20 shadow-2xl">
                <img
                  src={cms.aboutImage || SITE_CONFIG.aboutImage}
                  alt="Certified Instructor & Coach"
                  className="w-full h-[460px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/15">
                  <h4 className="font-serif font-black text-base text-white">{cms.instructorName || "Aarav Sharma"}</h4>
                  <p className="text-xs text-emerald-400 font-bold">Certified Studio Coach & Yoga Master</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20 inline-block">
                MEET YOUR COACH
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-black text-white">
                {cms.aboutTitle || "Guiding You Toward Strength, Ease & Alignment."}
              </h2>
              
              <div className="space-y-4 text-slate-300 text-xs sm:text-sm leading-relaxed font-medium">
                <p className="font-serif text-lg text-emerald-300 italic font-semibold">
                  "{cms.aboutQuote || "True practice begins when you listen to your body and honor its natural rhythm."}"
                </p>
                <p>{cms.aboutBio1 || "With dedicated years of certified instruction, our studio specializes in functional body conditioning, posture realignment, and stress management."}</p>
                <p>{cms.aboutBio2 || "Every session is designed to make you feel energized, light, and mentally resilient."}</p>
              </div>

              <div className="pt-2 flex flex-wrap gap-2.5">
                {['Personalized Attention', 'Alignment First', 'Progress Tracking', 'Holistic Breathwork'].map((tag) => (
                  <span key={tag} className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-white font-extrabold text-xs flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> {tag}
                  </span>
                ))}
              </div>

              <div className="pt-4">
                <button
                  onClick={() => openDemoModal()}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                >
                  <span>SCHEDULE 1-ON-1 CONSULTATION</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* ================================================== */}
        {/* 8. TESTIMONIALS & REVIEWS */}
        {/* ================================================== */}
        <section id="testimonials" className="space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-black uppercase tracking-widest text-amber-400 bg-amber-400/10 px-4 py-1.5 rounded-full border border-amber-400/20 inline-block">
              STUDENT EXPERIENCES
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-black text-white">
              Real Transformations & Results
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm font-medium">
              Read how our members improved posture, lost weight, and found mental clarity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-7 rounded-3xl bg-slate-900/60 border border-white/10 space-y-4 shadow-xl">
              <div className="flex text-amber-400 text-sm">★★★★★</div>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                "The 1-on-1 sessions completely cured my lower back pain after 2 months of regular practice. The coach explains alignment so patiently!"
              </p>
              <div className="pt-3 border-t border-white/10 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs">
                  MP
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white">Meera Patel</h4>
                  <p className="text-[10px] text-slate-400">Personal Online Member</p>
                </div>
              </div>
            </div>

            <div className="p-7 rounded-3xl bg-slate-900/60 border border-white/10 space-y-4 shadow-xl">
              <div className="flex text-amber-400 text-sm">★★★★★</div>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                "I lost 6 kgs in 3 months with the morning dynamic batch. The student attendance portal keeps me motivated to never miss a class!"
              </p>
              <div className="pt-3 border-t border-white/10 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-xs">
                  RK
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white">Rohit Khanna</h4>
                  <p className="text-[10px] text-slate-400">Morning Vinyasa Batch</p>
                </div>
              </div>
            </div>

            <div className="p-7 rounded-3xl bg-slate-900/60 border border-white/10 space-y-4 shadow-xl">
              <div className="flex text-amber-400 text-sm">★★★★★</div>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                "Best studio software and coaching! I can check my fee receipts and request leaves directly from my mobile link."
              </p>
              <div className="pt-3 border-t border-white/10 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-rose-500/20 text-rose-400 font-bold flex items-center justify-center text-xs">
                  AS
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white">Ananya Sen</h4>
                  <p className="text-[10px] text-slate-400">Evening Flow Member</p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ================================================== */}
        {/* 9. FAQ ACCORDION */}
        {/* ================================================== */}
        <section id="faq" className="space-y-8 max-w-3xl mx-auto">
          <div className="text-center space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20 inline-block">
              COMMON QUESTIONS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-black text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-slate-900/60 border border-white/10 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setExpandedFaqIndex(expandedFaqIndex === idx ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between font-bold text-xs sm:text-sm text-white hover:text-emerald-300 transition-colors"
                >
                  <span>{faq.q}</span>
                  {expandedFaqIndex === idx ? (
                    <ChevronUp className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {expandedFaqIndex === idx && (
                  <div className="px-5 pb-5 text-xs text-slate-300 font-medium leading-relaxed border-t border-white/5 pt-3 animate-fadeIn">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ================================================== */}
        {/* 10. FINAL BOTTOM CTA BANNER */}
        {/* ================================================== */}
        <section className="p-10 sm:p-14 rounded-[3rem] bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border-2 border-emerald-500/30 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-black uppercase tracking-widest text-amber-300 bg-amber-400/20 px-4 py-1 rounded-full border border-amber-300/30 inline-block">
              GET STARTED TODAY
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-black text-white">
              {cms.contactTitle || "Ready to Experience Your Free Demo Session?"}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm font-medium">
              {cms.contactSubtitle || "Join our community today for guided movement, peace of mind, and automated member management."}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => openDemoModal()}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 text-slate-950 font-black text-xs sm:text-sm shadow-xl hover:scale-105 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>CLAIM FREE DEMO CLASS</span>
            </button>

            <button
              onClick={() => handleDirectWhatsAppChat()}
              className="px-7 py-4 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-400/40 text-emerald-300 font-extrabold text-xs sm:text-sm transition-all flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>CHAT ON WHATSAPP</span>
            </button>
          </div>
        </section>

      </main>

      {/* ================================================== */}
      {/* 11. FOOTER */}
      {/* ================================================== */}
      <footer className="mt-24 border-t border-white/10 bg-slate-950/80 py-12 px-4 sm:px-8 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-3">
              <img src={SITE_CONFIG.logoImage} alt="Logo" className="w-8 h-8 rounded-xl object-cover" />
              <span className="font-serif font-black text-lg text-white">{cms.brandName || SITE_CONFIG.brandName}</span>
            </div>
            <p className="text-slate-400 text-xs max-w-sm font-medium leading-relaxed">
              All-in-one studio management platform, member attendance journal, and online class software.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">Quick Links</h4>
            <div className="space-y-1.5">
              <a href="#home" className="block hover:text-emerald-400">Home</a>
              <a href="#programs" className="block hover:text-emerald-400">Programs</a>
              <a href="/panel" className="block text-amber-400 font-bold hover:underline">Trainer Portal Login</a>
              <a href="#faq" className="block hover:text-emerald-400">FAQ</a>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">Contact & Support</h4>
            <p className="text-slate-300 font-bold">{cms.displayPhone || SITE_CONFIG.displayPhone}</p>
            <p className="text-slate-400">{cms.email || SITE_CONFIG.email}</p>
          </div>

        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <span>© {new Date().getFullYear()} {cms.brandName || SITE_CONFIG.brandName}. All rights reserved.</span>
          <span>Studio & Fitness CRM Platform</span>
        </div>
      </footer>

      {/* Free Demo Registration Modal */}
      {isDemoModalOpen && (
        <FreeDemoModal
          isOpen={isDemoModalOpen}
          onClose={() => setIsDemoModalOpen(false)}
          defaultGoal={selectedGoalForModal}
          defaultProgram={selectedProgramForModal}
        />
      )}

      {/* Blog Article Detail Modal */}
      {isBlogModalOpen && selectedBlogForModal && (
        <BlogArticleModal
          post={selectedBlogForModal}
          isOpen={isBlogModalOpen}
          onClose={() => {
            setIsBlogModalOpen(false);
            setSelectedBlogForModal(null);
          }}
          onOpenDemoModal={openDemoModal}
          allPosts={blogs}
          onSelectPost={(post) => setSelectedBlogForModal(post)}
        />
      )}

    </div>
  );
};
