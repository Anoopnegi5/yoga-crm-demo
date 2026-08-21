// Supabase Integration & Multi-Device Realtime Engine for Yoganjali Studio
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { safeStorage } from './safeStorage';

export interface SupabaseConfig {
  url: string;
  key: string;
  tableName: string;
}

const STORAGE_URL_KEY = 'yoganjali_supabase_url';
const STORAGE_ANON_KEY = 'yoganjali_supabase_key';
const STORAGE_TABLE_KEY = 'yoganjali_supabase_table';

export const getSupabaseConfig = (): SupabaseConfig => {
  if (typeof window === 'undefined') {
    return { url: '', key: '', tableName: 'yoganjali_sync' };
  }
  const metaEnv = (import.meta as any).env || {};
  return {
    url: safeStorage.getItem(STORAGE_URL_KEY) || metaEnv.VITE_SUPABASE_URL || '',
    key: safeStorage.getItem(STORAGE_ANON_KEY) || metaEnv.VITE_SUPABASE_ANON_KEY || '',
    tableName: safeStorage.getItem(STORAGE_TABLE_KEY) || 'yoganjali_sync'
  };
};

export const saveSupabaseConfig = (url: string, key: string, tableName = 'yoganjali_sync') => {
  if (typeof window === 'undefined') return;
  safeStorage.setItem(STORAGE_URL_KEY, url.trim());
  safeStorage.setItem(STORAGE_ANON_KEY, key.trim());
  safeStorage.setItem(STORAGE_TABLE_KEY, tableName.trim());
};

export const clearSupabaseConfig = () => {
  if (typeof window === 'undefined') return;
  safeStorage.removeItem(STORAGE_URL_KEY);
  safeStorage.removeItem(STORAGE_ANON_KEY);
  safeStorage.removeItem(STORAGE_TABLE_KEY);
};

let clientInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  const { url, key } = getSupabaseConfig();
  if (!url || !key) return null;
  if (!clientInstance) {
    try {
      clientInstance = createClient(url, key);
    } catch (e) {
      console.warn('Failed initializing Supabase client:', e);
      return null;
    }
  }
  return clientInstance;
};

// Fetch Studio State from Supabase REST Endpoint
export const fetchFromSupabase = async (): Promise<any | null> => {
  const { url, key, tableName } = getSupabaseConfig();
  if (!url || !key) return null;

  try {
    const endpoint = `${url}/rest/v1/${tableName}?id=eq.master_db&select=*`;
    const res = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Accept': 'application/json'
      }
    });

    if (res.ok) {
      const rows = await res.json();
      if (Array.isArray(rows) && rows.length > 0 && rows[0].payload) {
        return rows[0].payload;
      }
    }
  } catch (err) {
    console.warn('Supabase fetch failed:', err);
  }
  return null;
};

// Upsert / Push Studio State to Supabase REST Endpoint
export const pushToSupabase = async (payload: any): Promise<boolean> => {
  const { url, key, tableName } = getSupabaseConfig();
  if (!url || !key) return false;

  try {
    const endpoint = `${url}/rest/v1/${tableName}`;
    const row = {
      id: 'master_db',
      payload,
      updated_at: new Date().toISOString()
    };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(row)
    });

    return res.ok;
  } catch (err) {
    console.warn('Supabase push failed:', err);
  }
  return false;
};
