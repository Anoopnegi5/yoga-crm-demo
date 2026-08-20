// api/yogi-image.js
// Dynamic image server for client DP previews on WhatsApp, Telegram, Facebook, etc.

import { Buffer } from 'buffer';

function slugifyName(name) {
  if (!name) return 'member';
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getSupabaseEnv() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
  const key = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  return { url, key };
}

async function fetchClients() {
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
        if (Array.isArray(rows) && rows.length > 0 && rows[0].payload && Array.isArray(rows[0].payload.clients)) {
          return rows[0].payload.clients;
        }
      }
    } catch (e) {}
  }

  // Fallback to RESTful blob store
  try {
    const blobRes = await fetch('https://api.restful-api.dev/objects/ff8081819f7e10ae019fefa0a25822af');
    if (blobRes.ok) {
      const blobJson = await blobRes.json();
      if (blobJson?.data?.clients && Array.isArray(blobJson.data.clients)) {
        return blobJson.data.clients;
      }
    }
  } catch (e) {}

  return [];
}

export default async function handler(req, res) {
  let slug = req.query?.slug || '';
  if (!slug && req.url) {
    const urlParts = req.url.split('?')[0].split('/');
    slug = urlParts[urlParts.length - 1] || '';
  }
  slug = (slug || '').toLowerCase().trim();

  try {
    const clients = await fetchClients();
    const matched = clients.find(c => slugifyName(c.name) === slug);
    
    if (matched && matched.photoUrl) {
      let rawPhoto = matched.photoUrl;

      // 1. If base64 data URI (e.g. data:image/jpeg;base64,... or data:image/png;base64,...)
      if (rawPhoto.startsWith('data:image/')) {
        const match = rawPhoto.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
        if (match) {
          const mimeType = match[1] === 'jpg' ? 'image/jpeg' : `image/${match[1]}`;
          const base64Data = match[2];
          const imgBuffer = Buffer.from(base64Data, 'base64');

          res.setHeader('Content-Type', mimeType);
          res.setHeader('Content-Length', imgBuffer.length);
          res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400');
          return res.status(200).send(imgBuffer);
        }
      }

      // 2. If DiceBear SVG, convert to PNG
      if (rawPhoto.includes('dicebear.com') && rawPhoto.includes('/svg?')) {
        rawPhoto = rawPhoto.replace('/svg?', '/png?');
      }

      // 3. If external HTTP/HTTPS URL, redirect directly
      if (rawPhoto.startsWith('http://') || rawPhoto.startsWith('https://')) {
        res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
        return res.redirect(302, rawPhoto);
      }
    }
  } catch (err) {
    console.error('Error serving yogi-image:', err);
  }

  // Fallback to DiceBear PNG for this slug
  const fallbackUrl = `https://api.dicebear.com/7.x/notionists/png?seed=${encodeURIComponent(slug || 'yogi')}&size=600`;
  return res.redirect(302, fallbackUrl);
}
