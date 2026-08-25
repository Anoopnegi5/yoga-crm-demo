import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  BarChart3, 
  Settings as SettingsIcon, 
  Search, 
  Plus,
  Calendar as CalendarIcon,
  Globe,
  Trophy,
  Cloud
} from 'lucide-react';

interface NavbarProps {
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const { 
    activeTab, 
    setActiveTab, 
    setIsAddClientOpen, 
    setIsSearchOpen,
    setIsClientWebsiteMode,
    trainerProfile,
    isSyncingCloud,
    syncCloudNow
  } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  const appTitle = trainerProfile.appTitle || trainerProfile.studioName || 'Yoga Studio CRM';
  const appSubtitle = trainerProfile.appSubtitle || 'Yoga Journal & Fee Manager';

  return (
    <div className="sticky top-0 sm:top-2 z-50 px-2 sm:px-8 max-w-7xl mx-auto mb-6 pt-2 sm:pt-0">
      <nav className="glass-nav rounded-full px-4 py-2.5 flex items-center justify-between shadow-soft">
        
        {/* Brand Logo - Custom Logo Image or Default Emblem */}
        <div 
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-3 cursor-pointer group pl-2"
        >
          {trainerProfile.studioLogoUrl ? (
            <img
              src={trainerProfile.studioLogoUrl}
              alt="Studio Logo"
              className="w-10 h-10 rounded-2xl object-cover ring-2 ring-purple-400 shadow-sm group-hover:scale-105 transition-transform duration-300 bg-white"
            />
          ) : (
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-emerald-400 flex items-center justify-center text-white shadow-glow-purple group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
          )}

          <div>
            <h1 className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-purple-700 via-indigo-600 to-slate-900 bg-clip-text text-transparent">
              {appTitle}
            </h1>
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 -mt-1">
              {appSubtitle}
            </p>
          </div>
        </div>

        {/* Center Floating Nav Tabs */}
        <div className="hidden md:flex items-center gap-1 bg-slate-100/70 p-1.5 rounded-full border border-slate-200/50">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-purple-700 shadow-sm font-bold scale-[1.02]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-purple-600' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 sm:gap-3 pr-1">
          
          {/* Cloud Cross-Device Sync Button (Compact Sleek Styling) */}
          <button
            onClick={() => syncCloudNow()}
            disabled={isSyncingCloud}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-extrabold transition-all shadow-xs shrink-0 ${
              isSyncingCloud 
                ? 'bg-purple-100 text-purple-700 animate-pulse' 
                : 'bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 text-emerald-800'
            }`}
            title="Sync data across all devices (Phone, Laptop, Tablet)"
          >
            <Cloud className={`w-3.5 h-3.5 ${isSyncingCloud ? 'animate-spin text-purple-600' : 'text-emerald-600'}`} />
            <span className="hidden sm:inline">{isSyncingCloud ? 'Syncing...' : 'Sync'}</span>
          </button>

          {/* Quick Search */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 text-xs transition-colors"
            title="Search Clients or Time"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline font-medium text-slate-600">Search</span>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white rounded border border-slate-200">
              ⌘K
            </kbd>
          </button>

          {/* Round Trainer Profile Avatar DP */}
          <div className="pl-2 border-l border-slate-200/80">
            <div 
              onClick={() => setActiveTab('settings')}
              className="relative cursor-pointer group"
              title="Open Settings & Trainer Profile"
            >
              <img
                src={trainerProfile.photoUrl}
                alt={trainerProfile.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-600 shadow-md group-hover:scale-105 transition-all duration-300 bg-purple-50"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white" />
            </div>
          </div>

        </div>

      </nav>

      {/* Mobile Nav Tabs Bar */}
      <div className="md:hidden flex items-center justify-around bg-white/90 backdrop-blur-md mt-3 py-2 px-3 rounded-full border border-slate-200 shadow-sm">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`p-2 rounded-full transition-all ${
                isActive ? 'bg-purple-100 text-purple-700' : 'text-slate-500'
              }`}
            >
              <Icon className="w-5 h-5" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
