import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { CalendarView } from './components/CalendarView';
import { Clients } from './components/Clients';
import { Payments } from './components/Payments';
import { Reports } from './components/Reports';
import { Settings } from './components/Settings';
import { TrainerDreamsView } from './components/TrainerDreamsView';
import { ClientWebsite } from './components/ClientWebsite';
import { ClientRegistrationWizard } from './components/ClientRegistrationWizard';
import { ClientProfileModal } from './components/ClientProfileModal';
import { AddClientWizard } from './components/Modals/AddClientWizard';
import { AddPaymentModal } from './components/Modals/AddPaymentModal';
import { AddLeaveModal } from './components/Modals/AddLeaveModal';
import { AddTrainerLeaveModal } from './components/Modals/AddTrainerLeaveModal';
import { SearchModal } from './components/SearchModal';
import { Toast } from './components/Toast';
import { LoginScreen } from './components/LoginScreen';

import { PublicClientProfile } from './components/PublicClientProfile';
import { MemberDirectory } from './components/MemberDirectory';
import { getSlugFromUrl } from './utils/slugUtils';

const AppShell: React.FC = () => {
  const { activeTab, isClientWebsiteMode, setIsClientWebsiteMode } = useApp();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return (
      sessionStorage.getItem('yoganjali_auth_token') === 'authenticated_true' ||
      localStorage.getItem('yoganjali_auth_token') === 'authenticated_true'
    );
  });

  // Centralized URL routing — handles clean paths (/panel, /join, /demo, /members, /yogi/slug, /register)
  const { isYogiProfile, isMembersDirectory, isPanel, isJoinLink, isRegisterLink, slug } = React.useMemo(() => getSlugFromUrl(), []);

  useEffect(() => {
    if ((isJoinLink || isRegisterLink) && !isClientWebsiteMode) {
      setIsClientWebsiteMode(true);
    }
  }, [isJoinLink, isRegisterLink, isClientWebsiteMode, setIsClientWebsiteMode]);

  const handleLogout = () => {
    sessionStorage.removeItem('yoganjali_auth_token');
    localStorage.removeItem('yoganjali_auth_token');
    setIsAuthenticated(false);
  };

  // 1. PUBLIC YOGI PROFILE (/yogi/anoop-negi)
  if (isYogiProfile && slug) {
    return (
      <>
        <PublicClientProfile clientSlug={slug} />
        <Toast />
      </>
    );
  }

  // 2. MEMBER DIRECTORY (/members) — PRIVATE TO TRAINER ONLY
  if (isMembersDirectory) {
    if (!isAuthenticated) {
      return <LoginScreen onLoginSuccess={() => setIsAuthenticated(true)} />;
    }
    return (
      <>
        <MemberDirectory onLogout={handleLogout} />
        <Toast />
      </>
    );
  }

  // 3. EXPLICIT CLIENT REGISTRATION WIZARD (/register)
  if (isRegisterLink) {
    return (
      <>
        <ClientRegistrationWizard />
        <Toast />
      </>
    );
  }

  // 4. PUBLIC WEBSITE & FREE DEMO BOOKING (/join, /demo, homepage)
  if (isClientWebsiteMode || !isPanel || isJoinLink) {
    return (
      <>
        <ClientWebsite />
        <Toast />
      </>
    );
  }

  // 3. TRAINER ADMIN LOGIN CHECK (Only when explicitly opening ?view=panel)
  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  // 3. TRAINER ADMIN BACKEND PORTAL
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-purple-100 selection:text-purple-700">
      
      {/* Top Navigation */}
      <Navbar />

      {/* Dynamic Page Component */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pb-16">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'calendar' && <CalendarView />}
        {activeTab === 'clients' && <Clients />}
        {activeTab === 'payments' && <Payments />}
        {activeTab === 'reports' && <Reports />}
        {activeTab === 'dreams' && <TrainerDreamsView />}
        {activeTab === 'settings' && <Settings onLogout={handleLogout} />}
      </main>

      {/* Global Overlays & Modals */}
      <ClientProfileModal />
      <AddClientWizard />
      <AddPaymentModal />
      <AddLeaveModal />
      <AddTrainerLeaveModal />
      <SearchModal />
      <Toast />

      {/* Minimal Modern Footer */}
      <footer className="border-t border-slate-200/60 py-8 text-center text-xs font-semibold text-slate-400">
        <p>Yoganjali — Modern Personal Yoga Client Journal & Fee Manager</p>
      </footer>
    </div>
  );
};

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("App boundary caught error:", error, errorInfo);
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {}
  }

  handleCleanReload = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {}
    window.location.href = window.location.origin + '/panel';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center space-y-4 font-sans">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl font-black">✨</div>
          <h2 className="text-xl font-bold">App Session Recovered</h2>
          
          <div className="max-w-md w-full p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-left space-y-2">
            <div className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">Error Details</div>
            <pre className="text-xs text-rose-300 font-mono whitespace-pre-wrap break-all bg-rose-950/30 p-3 rounded-xl border border-rose-900/50">
              {this.state.error ? (this.state.error.stack || this.state.error.toString()) : 'Session reset required.'}
            </pre>
          </div>

          <button
            onClick={this.handleCleanReload}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <span>🔄 Reload App Cleanly</span>
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppShell />
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
