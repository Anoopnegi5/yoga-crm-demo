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

const AppShell: React.FC = () => {
  const { activeTab, isClientWebsiteMode, setIsClientWebsiteMode } = useApp();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('yoganjali_auth_token') === 'authenticated_true';
  });

  // Check URL query parameters on initial load
  const isShareLink = React.useMemo(() => {
    if (typeof window === 'undefined') return false;
    const search = window.location.search;
    return search.includes('join=true') || search.includes('mode=client') || search.includes('register=true');
  }, []);

  const isExplicitPanel = React.useMemo(() => {
    if (typeof window === 'undefined') return false;
    const search = window.location.search;
    return search.includes('view=panel') || search.includes('admin=true') || search.includes('login=true');
  }, []);

  useEffect(() => {
    if (isShareLink && !isClientWebsiteMode) {
      setIsClientWebsiteMode(true);
    }
  }, [isShareLink, isClientWebsiteMode, setIsClientWebsiteMode]);

  const handleLogout = () => {
    sessionStorage.removeItem('yoganjali_auth_token');
    setIsAuthenticated(false);
  };

  // 1. PUBLIC CLIENT SELF-REGISTRATION WIZARD MODE (?join=true)
  if (isShareLink) {
    return (
      <>
        <ClientRegistrationWizard />
        <Toast />
      </>
    );
  }

  // 2. PUBLIC WEBSITE MODE (Default for website visitors & when clicking Visit Our Website)
  if (isClientWebsiteMode || !isExplicitPanel) {
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

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("App boundary caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center space-y-4 font-sans">
          <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-2xl font-black">⚠️</div>
          <h2 className="text-xl font-bold">App Session Recovered</h2>
          <p className="text-xs text-slate-400 max-w-sm">Click below to refresh Yoganjali Studio cleanly.</p>
          <button onClick={() => window.location.reload()} className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-md">Reload App</button>
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
