import React, { createContext, useContext, useState, useEffect } from 'react';
import { Client, PaymentRecord, LeaveRecord, AttendanceRecord, TrainerProfile, TrainerLeave, AttendanceStatus, WebsiteCMS, TrainerDreamGoal } from '../types';
import { INITIAL_CLIENTS, INITIAL_PAYMENTS, INITIAL_LEAVES, INITIAL_ATTENDANCE, DEFAULT_TRAINER_PROFILE, INITIAL_TRAINER_LEAVES, INITIAL_TRAINER_DREAMS } from '../data/mockData';
import { DEFAULT_WEBSITE_CMS } from '../config/siteConfig';
import { getTodayDateString } from '../utils/dateUtils';

interface AppContextType {
  trainerProfile: TrainerProfile;
  updateTrainerProfile: (profile: TrainerProfile) => void;

  websiteCMS: WebsiteCMS;
  updateWebsiteCMS: (cms: WebsiteCMS) => void;
  
  trainerLeaves: TrainerLeave[];
  addTrainerLeave: (leave: Omit<TrainerLeave, 'id'>) => void;
  deleteTrainerLeave: (id: string) => void;

  trainerDreams: TrainerDreamGoal[];
  addTrainerDream: (dream: Omit<TrainerDreamGoal, 'id'>) => void;
  updateTrainerDream: (dream: TrainerDreamGoal) => void;
  deleteTrainerDream: (id: string) => void;

  clients: Client[];
  addClient: (client: Omit<Client, 'id' | 'completedClasses' | 'paymentStatus'>) => void;
  updateClient: (client: Client) => void;
  deleteClient: (id: string) => void;
  toggleClientStatus: (id: string, status: 'Active' | 'Discontinued', reason?: string) => void;

  payments: PaymentRecord[];
  addPayment: (payment: Omit<PaymentRecord, 'id'>) => void;
  updatePayment: (payment: PaymentRecord) => void;
  deletePayment: (id: string) => void;
  quickMarkPaid: (clientId: string) => void;

  leaves: LeaveRecord[];
  addLeave: (leave: Omit<LeaveRecord, 'id' | 'clientName' | 'photoUrl'>) => void;
  deleteLeave: (id: string) => void;

  attendance: AttendanceRecord[];
  markAttendance: (clientId: string, status: AttendanceStatus, targetDateStr?: string) => void;
  deleteAttendanceRecord: (id: string) => void;

  activeTab: string;
  setActiveTab: (tab: string) => void;

  selectedClientId: string | null;
  setSelectedClientId: (id: string | null) => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;

  isAddClientOpen: boolean;
  setIsAddClientOpen: (open: boolean) => void;

  isAddPaymentOpen: boolean;
  setIsAddPaymentOpen: (open: boolean) => void;

  isAddLeaveOpen: boolean;
  setIsAddLeaveOpen: (open: boolean) => void;

  isAddTrainerLeaveOpen: boolean;
  setIsAddTrainerLeaveOpen: (open: boolean) => void;

  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  paymentModalDefaultClientId: string | null;
  setPaymentModalDefaultClientId: (clientId: string | null) => void;

  toastMessage: string | null;
  showSuccessToast: (msg: string) => void;

  isClientWebsiteMode: boolean;
  setIsClientWebsiteMode: (mode: boolean) => void;

  customGroupBatches: string[];
  addCustomGroupBatch: (name: string) => void;
  deleteCustomGroupBatch: (name: string) => void;

  startNewMonthCycle: () => void;
  resetToSampleData: () => void;
  exportBackupData: () => void;
  importBackupData: (data: any) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'yoganjali_app_state_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trainerProfile, setTrainerProfile] = useState<TrainerProfile>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_trainer_profile`);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (!parsed.photoUrl || parsed.photoUrl.includes('dicebear')) {
        parsed.photoUrl = '/anjali-hero.jpg';
      }
      if (!parsed.studioLogoUrl || parsed.studioLogoUrl.includes('dicebear')) {
        parsed.studioLogoUrl = '/yoganjali-logo.png';
      }
      return parsed;
    }
    return DEFAULT_TRAINER_PROFILE;
  });

  const [websiteCMS, setWebsiteCMS] = useState<WebsiteCMS>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_website_cms`);
    return saved ? JSON.parse(saved) : DEFAULT_WEBSITE_CMS;
  });

  const updateWebsiteCMS = (newCMS: WebsiteCMS) => {
    setWebsiteCMS(newCMS);
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_website_cms`, JSON.stringify(newCMS));
    } catch (e) {
      console.warn('LocalStorage quota limit reached, saving in memory session:', e);
    }
    showSuccessToast('🎉 Live Website Content & Images Updated!');
  };

  const [trainerLeaves, setTrainerLeaves] = useState<TrainerLeave[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_trainer_leaves`);
    return saved ? JSON.parse(saved) : INITIAL_TRAINER_LEAVES;
  });

  const [trainerDreams, setTrainerDreams] = useState<TrainerDreamGoal[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_trainer_dreams`);
    return saved ? JSON.parse(saved) : INITIAL_TRAINER_DREAMS;
  });

  const addTrainerDream = (dream: Omit<TrainerDreamGoal, 'id'>) => {
    const newDream: TrainerDreamGoal = {
      ...dream,
      id: `dream-${Date.now()}`
    };
    setTrainerDreams(prev => [newDream, ...prev]);
    showSuccessToast('🎯 New Financial Vision Goal Added!');
  };

  const updateTrainerDream = (updated: TrainerDreamGoal) => {
    setTrainerDreams(prev => prev.map(d => d.id === updated.id ? updated : d));
    showSuccessToast('✨ Dream Goal Updated!');
  };

  const deleteTrainerDream = (id: string) => {
    setTrainerDreams(prev => prev.filter(d => d.id !== id));
    showSuccessToast('🗑️ Goal Removed');
  };

  const [customGroupBatches, setCustomGroupBatches] = useState<string[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_custom_group_batches`);
    return saved ? JSON.parse(saved) : ['Morning Vinyasa Batch (07:00 AM)', 'Evening Flow Batch (05:30 PM)'];
  });

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_custom_group_batches`, JSON.stringify(customGroupBatches));
  }, [customGroupBatches]);

  const addCustomGroupBatch = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setCustomGroupBatches(prev => Array.from(new Set([...prev, trimmed])));
    showSuccessToast(`✨ New group batch '${trimmed}' created`);
  };

  const deleteCustomGroupBatch = (name: string) => {
    setCustomGroupBatches(prev => prev.filter(b => b !== name));
    showSuccessToast(`🗑️ Group batch '${name}' deleted`);
  };

  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_clients`);
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });

  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_payments`);
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  const [leaves, setLeaves] = useState<LeaveRecord[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_leaves`);
    return saved ? JSON.parse(saved) : INITIAL_LEAVES;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_attendance`);
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [isAddLeaveOpen, setIsAddLeaveOpen] = useState(false);
  const [isAddTrainerLeaveOpen, setIsAddTrainerLeaveOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [paymentModalDefaultClientId, setPaymentModalDefaultClientId] = useState<string | null>(null);
  const [isClientWebsiteMode, setIsClientWebsiteMode] = useState<boolean>(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showSuccessToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Automatic Month Cycle Detection & Background Rollover
  useEffect(() => {
    const currentMonthStr = getTodayDateString().slice(0, 7); // e.g. "2026-08"
    const lastActiveMonth = localStorage.getItem(`${LOCAL_STORAGE_KEY}_last_active_month`);

    if (lastActiveMonth && lastActiveMonth !== currentMonthStr) {
      // Automatic background rollover for new calendar month
      setClients(prev => prev.map(c => ({
        ...c,
        completedClasses: 0,
        monthlyFee: c.feeType === 'Per Session' ? 0 : c.monthlyFee
      })));
    }

    localStorage.setItem(`${LOCAL_STORAGE_KEY}_last_active_month`, currentMonthStr);
  }, []);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_trainer_profile`, JSON.stringify(trainerProfile));
  }, [trainerProfile]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_trainer_leaves`, JSON.stringify(trainerLeaves));
  }, [trainerLeaves]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_trainer_dreams`, JSON.stringify(trainerDreams));
  }, [trainerDreams]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_clients`, JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_payments`, JSON.stringify(payments));
  }, [payments]);



  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_leaves`, JSON.stringify(leaves));
  }, [leaves]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_attendance`, JSON.stringify(attendance));
  }, [attendance]);

  const updateTrainerProfile = (profile: TrainerProfile) => {
    setTrainerProfile(profile);
    showSuccessToast('Trainer profile updated successfully!');
  };

  const addTrainerLeave = (leaveData: Omit<TrainerLeave, 'id'>) => {
    const newLeave: TrainerLeave = {
      ...leaveData,
      id: `t-leave-${Date.now()}`
    };
    setTrainerLeaves(prev => [newLeave, ...prev]);
    showSuccessToast(`Logged Trainer Leave for ${newLeave.date}!`);
  };

  const deleteTrainerLeave = (id: string) => {
    setTrainerLeaves(prev => prev.filter(l => l.id !== id));
    showSuccessToast('Instructor leave record removed.');
  };

  const addClient = (newClientData: Omit<Client, 'id' | 'completedClasses' | 'paymentStatus'>) => {
    const newId = `c${Date.now()}`;
    const newClient: Client = {
      ...newClientData,
      id: newId,
      completedClasses: 0,
      paymentStatus: 'Pending',
      status: 'Active'
    };
    setClients(prev => [newClient, ...prev]);
    showSuccessToast(`Added new client: ${newClient.name}`);
  };

  const updateClient = (updatedClient: Client) => {
    setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
    showSuccessToast(`Updated profile for ${updatedClient.name}`);
  };

  const deleteClient = (id: string) => {
    const target = clients.find(c => c.id === id);
    setClients(prev => prev.filter(c => c.id !== id));
    setPayments(prev => prev.filter(p => p.clientId !== id));
    setLeaves(prev => prev.filter(l => l.clientId !== id));
    setAttendance(prev => prev.filter(a => a.clientId !== id));
    
    if (selectedClientId === id) {
      setSelectedClientId(null);
    }
    showSuccessToast(`Deleted client profile: ${target?.name || ''}`);
  };

  const toggleClientStatus = (id: string, status: 'Active' | 'Discontinued', reason?: string) => {
    const todayStr = getTodayDateString();
    setClients(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status,
          leftDate: status === 'Discontinued' ? todayStr : undefined,
          leftReason: status === 'Discontinued' ? (reason || 'Left Class') : undefined
        };
      }
      return c;
    }));

    if (status === 'Discontinued') {
      showSuccessToast('Marked client as Left Class / Discontinued.');
    } else {
      showSuccessToast('Re-activated client membership.');
    }
  };

  const addPayment = (paymentData: Omit<PaymentRecord, 'id'>) => {
    const paymentMonth = paymentData.date.slice(0, 7);

    if (paymentData.status === 'Pending' || paymentData.status === 'Overdue') {
      // If marked Pending / Overdue, clear any paid records for this month and set client paymentStatus to Pending
      setPayments(prev => prev.filter(p => !(p.clientId === paymentData.clientId && p.date.startsWith(paymentMonth))));

      setClients(prev => prev.map(c => {
        if (c.id === paymentData.clientId) {
          return { ...c, paymentStatus: 'Pending' };
        }
        return c;
      }));

      showSuccessToast(`⚠️ Updated ${paymentData.clientName}'s status to Pending in Dashboard checklist!`);
      return;
    }

    const newPayment: PaymentRecord = {
      ...paymentData,
      id: `p${Date.now()}`
    };

    setPayments(prev => [newPayment, ...prev]);

    setClients(prev => prev.map(c => {
      if (c.id === paymentData.clientId) {
        return { ...c, paymentStatus: paymentData.status };
      }
      return c;
    }));

    showSuccessToast(`Recorded fee payment for ${paymentData.clientName}`);
  };

  const updatePayment = (updatedPayment: PaymentRecord) => {
    setPayments(prev => prev.map(p => p.id === updatedPayment.id ? updatedPayment : p));
    showSuccessToast(`Updated payment record for ${updatedPayment.clientName}`);
  };

  const deletePayment = (id: string) => {
    setPayments(prev => prev.filter(p => p.id !== id));
    showSuccessToast('Payment log deleted.');
  };

  const quickMarkPaid = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;

    const todayStr = getTodayDateString();
    
    let dueAmount = client.monthlyFee;
    if (client.feeType === 'Per Session') {
      dueAmount = client.completedClasses * (client.perSessionFee || 1000);
    }

    addPayment({
      clientId: client.id,
      clientName: client.name,
      amount: dueAmount || client.monthlyFee || 1000,
      date: todayStr,
      status: 'Paid',
      paymentMode: 'UPI',
      notes: `Quick mark full fee payment`
    });
  };

  const addLeave = (leaveData: Omit<LeaveRecord, 'id' | 'clientName' | 'photoUrl'>) => {
    const client = clients.find(c => c.id === leaveData.clientId);
    if (!client) return;

    const newLeave: LeaveRecord = {
      ...leaveData,
      id: `l${Date.now()}`,
      clientName: client.name,
      photoUrl: client.photoUrl
    };

    setLeaves(prev => [newLeave, ...prev]);
    
    markAttendance(client.id, 'Leave');

    showSuccessToast(`Logged leave for ${client.name}`);
  };

  const deleteLeave = (id: string) => {
    setLeaves(prev => prev.filter(l => l.id !== id));
    showSuccessToast('Leave entry removed.');
  };

  const markAttendance = (clientId: string, status: AttendanceStatus, targetDateStr?: string) => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;

    const dateToUse = targetDateStr || getTodayDateString();

    const existingIndex = attendance.findIndex(
      a => a.clientId === clientId && a.date === dateToUse
    );

    let updatedAttendance = [...attendance];

    if (existingIndex >= 0) {
      updatedAttendance[existingIndex] = {
        ...updatedAttendance[existingIndex],
        status
      };
    } else {
      updatedAttendance.push({
        id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        clientId,
        clientName: client.name,
        date: dateToUse,
        status
      });
    }

    setAttendance(updatedAttendance);

    if (status === 'Present') {
      setClients(prev => prev.map(c => {
        if (c.id === clientId) {
          const nextCompleted = c.completedClasses + 1;
          return {
            ...c,
            completedClasses: nextCompleted,
          };
        }
        return c;
      }));
    }

    showSuccessToast(`Recorded ${status} for ${client.name}!`);
  };

  const deleteAttendanceRecord = (id: string) => {
    setAttendance(prev => prev.filter(a => a.id !== id));
    showSuccessToast('Removed attendance record.');
  };

  const startNewMonthCycle = () => {
    setClients(prev => prev.map(c => ({
      ...c,
      completedClasses: 0,
      monthlyFee: c.feeType === 'Per Session' ? 0 : c.monthlyFee
    })));
    showSuccessToast('New Month Cycle Started! Completed classes reset to 0.');
  };

  const resetToSampleData = () => {
    setTrainerProfile(DEFAULT_TRAINER_PROFILE);
    setTrainerLeaves([]);
    setClients(INITIAL_CLIENTS);
    setPayments(INITIAL_PAYMENTS);
    setLeaves(INITIAL_LEAVES);
    setAttendance(INITIAL_ATTENDANCE);
    showSuccessToast('Reset all data to fresh sample dataset.');
  };

  const exportBackupData = () => {
    const backupData = {
      trainerProfile,
      trainerLeaves,
      clients,
      payments,
      leaves,
      attendance,
      exportDate: new Date().toISOString()
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `yoganjali_backup_${getTodayDateString()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showSuccessToast('Exported complete data backup JSON!');
  };

  const importBackupData = (data: any): boolean => {
    try {
      if (data.trainerProfile) setTrainerProfile(data.trainerProfile);
      if (data.trainerLeaves) setTrainerLeaves(data.trainerLeaves);
      if (data.clients) setClients(data.clients);
      if (data.payments) setPayments(data.payments);
      if (data.leaves) setLeaves(data.leaves);
      if (data.attendance) setAttendance(data.attendance);

      showSuccessToast('Successfully imported backup dataset!');
      return true;
    } catch (e) {
      alert('Invalid backup file format!');
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        trainerProfile,
        updateTrainerProfile,
        websiteCMS,
        updateWebsiteCMS,
        trainerLeaves,
        addTrainerLeave,
        deleteTrainerLeave,
        trainerDreams,
        addTrainerDream,
        updateTrainerDream,
        deleteTrainerDream,
        clients,
        addClient,
        updateClient,
        deleteClient,
        toggleClientStatus,
        payments,
        addPayment,
        updatePayment,
        deletePayment,
        quickMarkPaid,
        leaves,
        addLeave,
        deleteLeave,
        attendance,
        markAttendance,
        deleteAttendanceRecord,
        activeTab,
        setActiveTab,
        selectedClientId,
        setSelectedClientId,
        searchQuery,
        setSearchQuery,
        isAddClientOpen,
        setIsAddClientOpen,
        isAddPaymentOpen,
        setIsAddPaymentOpen,
        isAddLeaveOpen,
        setIsAddLeaveOpen,
        isAddTrainerLeaveOpen,
        setIsAddTrainerLeaveOpen,
        isSearchOpen,
        setIsSearchOpen,
        paymentModalDefaultClientId,
        setPaymentModalDefaultClientId,
        toastMessage,
        showSuccessToast,
        isClientWebsiteMode,
        setIsClientWebsiteMode,
        customGroupBatches,
        addCustomGroupBatch,
        deleteCustomGroupBatch,
        startNewMonthCycle,
        resetToSampleData,
        exportBackupData,
        importBackupData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
