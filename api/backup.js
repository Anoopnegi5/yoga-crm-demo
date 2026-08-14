// Vercel Serverless Backup API & Daily Cron Endpoint
// Served at https://www.yoganjaliyoga.com/api/backup

const PERSISTENT_BLOB_URL = 'https://api.restful-api.dev/objects/ff8081819f7e10ae019fefa0a25822af';

function getSupabaseEnv() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
  const key = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  return { url, key };
}

async function fetchMasterData() {
  const { url, key } = getSupabaseEnv();
  if (url && key) {
    try {
      const res = await fetch(`${url}/rest/v1/yoganjali_sync?id=eq.master_db&select=*`, {
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
    } catch (e) {
      console.warn('Supabase fetch error during backup:', e);
    }
  }

  // Fallback RESTful Blob Store
  try {
    const res = await fetch(PERSISTENT_BLOB_URL, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      return data?.data?.payload || null;
    }
  } catch (e) {
    console.warn('REST blob fetch error during backup:', e);
  }

  return null;
}

export default async function handler(req, res) {
  // CORS & Cache Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const rawData = await fetchMasterData();
    const backupObject = {
      app: 'Yoganjali Studio Manager',
      backupVersion: '2.0',
      exportedAt: new Date().toISOString(),
      timestamp: Date.now(),
      recordCounts: {
        clients: rawData?.clients?.length || 0,
        payments: rawData?.payments?.length || 0,
        attendance: rawData?.attendanceRecords?.length || 0,
        leaves: rawData?.leaves?.length || 0,
        dreams: rawData?.trainerDreams?.length || 0
      },
      data: rawData || {}
    };

    // If query parameter ?download=1 is passed, serve as downloadable file attachment
    if (req.query.download === '1') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename="Yoganjali_Latest_Backup.json"');
      return res.status(200).send(JSON.stringify(backupObject, null, 2));
    }

    return res.status(200).json({
      success: true,
      message: 'Daily rolling backup generated successfully',
      backup: backupObject
    });
  } catch (err) {
    console.error('Backup API Error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to generate backup'
    });
  }
}
