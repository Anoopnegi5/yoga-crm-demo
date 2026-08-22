// api/yogi-meta.js
// Dynamic Server-Side HTML & OpenGraph Metadata generator for WhatsApp & Social Bot link previews
// Handles /yogi/:slug and /member/:slug

import fs from 'fs';
import path from 'path';

function slugifyName(name) {
  if (!name) return 'member';
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function formatNameFromSlug(slug) {
  if (!slug) return 'Studio Yogi';
  return slug
    .split('-')
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
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
    } catch (e) {
      console.warn('Supabase fetch error in yogi-meta:', e);
    }
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
  let rawSlug = req.query?.slug || '';
  if (!rawSlug && req.url) {
    const urlParts = req.url.split('?')[0].split('/');
    rawSlug = urlParts[urlParts.length - 1] || '';
  }
  const slug = (rawSlug || '').toLowerCase().trim();
  const formattedSlugName = formatNameFromSlug(slug);

  let clientName = formattedSlugName;
  let photoVersion = '1';
  try {
    const clients = await fetchClients();
    const matched = clients.find(c => slugifyName(c.name) === slug);
    if (matched) {
      clientName = matched.name || formattedSlugName;
      if (matched.photoUrl) {
        photoVersion = String(matched.photoUrl.length) + (matched.photoUrl.slice(-8).replace(/[^a-zA-Z0-9]/g, '') || 'v1');
      }
    }
  } catch (err) {
    console.error('Error matching client in yogi-meta:', err);
  }

  const photoUrl = `https://www.yoganjaliyoga.com/api/yogi-image?slug=${encodeURIComponent(slug)}&v=${photoVersion}`;
  const pageTitle = `🧘 ${clientName} • Official Yogi Profile | Yoganjali Studio`;
  const ogTitle = `🧘 ${clientName} — Official Yogi Profile`;
  const ogDescription = `View ${clientName}'s personalized yoga practice progress, attendance journal & consistency streak at Yoganjali Studio with Trainer Anjali Negi.`;
  const profileUrl = `https://www.yoganjaliyoga.com/yogi/${slug}`;

  const metaTags = `
    <title>${escapeHtml(pageTitle)}</title>
    <meta name="title" content="${escapeHtml(ogTitle)}" />
    <meta name="description" content="${escapeHtml(ogDescription)}" />
    <meta property="og:site_name" content="Yoganjali Yoga Studio" />
    <meta property="og:type" content="profile" />
    <meta property="og:title" content="${escapeHtml(ogTitle)}" />
    <meta property="og:description" content="${escapeHtml(ogDescription)}" />
    <meta property="og:url" content="${profileUrl}" />
    <meta property="og:image" content="${photoUrl}" />
    <meta property="og:image:secure_url" content="${photoUrl}" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="256" />
    <meta property="og:image:height" content="256" />
    <meta property="og:image:alt" content="${escapeHtml(clientName)} Yogi Profile" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${escapeHtml(ogTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(ogDescription)}" />
    <meta name="twitter:image" content="${photoUrl}" />
    <meta name="robots" content="noindex, nofollow" />
    <meta name="googlebot" content="noindex, nofollow" />`;

  // Read base index.html from dist
  let html = '';
  try {
    const htmlPath = path.join(process.cwd(), 'dist', 'index.html');
    if (fs.existsSync(htmlPath)) {
      html = fs.readFileSync(htmlPath, 'utf8');
    }
  } catch (e) {
    console.warn('Could not read dist/index.html:', e);
  }

  if (html) {
    // Clean out existing default title/meta tags so there are no conflicts
    html = html.replace(/<title>.*?<\/title>/gis, '');
    html = html.replace(/<meta property="og:.*?" \/>/gis, '');
    html = html.replace(/<meta name="twitter:.*?" \/>/gis, '');
    html = html.replace(/<meta name="description" content=".*?" \/>/gis, '');
    html = html.replace(/<meta name="robots" content=".*?" \/>/gis, '');
    html = html.replace(/<meta name="googlebot" content=".*?" \/>/gis, '');
    html = html.replace(/<head>/i, `<head>${metaTags}`);
  } else {
    // Fallback standalone HTML
    html = `<!doctype html>
<html lang="en" class="h-full bg-[#F7F3E8] text-slate-900 antialiased">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="/yoganjali-logo.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    ${metaTags}
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800');
  return res.status(200).send(html);
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
