// api/blog-meta.js
// Dynamic Server-Side HTML & Google SEO Structured Data generator for /blog/:slug

import fs from 'fs';
import path from 'path';

const FALLBACK_BLOGS = [
  {
    id: 'blog-1',
    slug: '5-morning-yoga-asanas-back-pain-relief',
    title: '5 Daily Morning Yoga Asanas for Instant Lower Back Pain Relief',
    excerpt: 'Sitting long hours at a desk compresses your spine. Discover 5 gentle yet highly effective yoga poses recommended by Trainer Anjali Negi to realign your vertebrae and eliminate lower back stiffness.',
    coverImage: 'https://www.yoganjaliyoga.com/about-anjali.jpg',
    category: 'Posture & Back Pain',
    author: 'Anjali Negi',
    date: '2026-08-20',
    readTime: '4 min read'
  },
  {
    id: 'blog-2',
    slug: 'the-science-of-vinyasa-flow-energy-breath',
    title: 'The Science of Vinyasa Flow: How Linking Breath to Movement Energizes the Body',
    excerpt: 'Vinyasa is more than a physical workout — it is moving meditation. Understand the physiological benefits of synchronized breath, heart rate variability, and cellular oxygenation.',
    coverImage: 'https://www.yoganjaliyoga.com/hero-group-yoga.jpg',
    category: 'Yoga Asanas',
    author: 'Anjali Negi',
    date: '2026-08-18',
    readTime: '5 min read'
  },
  {
    id: 'blog-3',
    slug: 'yoga-for-weight-loss-metabolism-boost',
    title: 'Yoga for Sustainable Weight Loss: Why Mindfulness Beats Crash Diets',
    excerpt: 'Struggling with stubborn weight? Discover how dynamic yoga flows, hormonal regulation, and mindful eating habits help you shed excess fat and build sustainable, lifelong vitality.',
    coverImage: 'https://www.yoganjaliyoga.com/yoga-pose-sunset.jpg',
    category: 'Weight Management',
    author: 'Anjali Negi',
    date: '2026-08-15',
    readTime: '6 min read'
  },
  {
    id: 'blog-4',
    slug: 'pranayama-101-breathing-techniques-stress-relief',
    title: 'Pranayama 101: 3 Powerful Breathing Techniques to Melt Away Stress in 5 Minutes',
    excerpt: 'Your breath is the remote control to your brain. Master Box Breathing, Nadi Shodhana, and Bhramari to calm racing thoughts, lower blood pressure, and sleep deeply.',
    coverImage: 'https://www.yoganjaliyoga.com/meditation-sanctuary.jpg',
    category: 'Pranayama & Meditation',
    author: 'Anjali Negi',
    date: '2026-08-12',
    readTime: '4 min read'
  }
];

function getSupabaseEnv() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
  const key = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  return { url, key };
}

async function fetchBlogs() {
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
        if (Array.isArray(rows) && rows.length > 0 && rows[0].payload && Array.isArray(rows[0].payload.blogs)) {
          return rows[0].payload.blogs;
        }
      }
    } catch (e) {
      console.warn('Supabase fetch error in blog-meta:', e);
    }
  }
  return FALLBACK_BLOGS;
}

export default async function handler(req, res) {
  let rawSlug = req.query?.slug || '';
  if (!rawSlug && req.url) {
    const urlParts = req.url.split('?')[0].split('/');
    rawSlug = urlParts[urlParts.length - 1] || '';
  }
  const slug = (rawSlug || '').toLowerCase().trim();

  let blog = FALLBACK_BLOGS.find(b => b.slug === slug || b.id === slug);

  try {
    const cloudBlogs = await fetchBlogs();
    const matched = cloudBlogs.find(b => (b.slug && b.slug.toLowerCase() === slug) || b.id === slug);
    if (matched) {
      blog = matched;
    }
  } catch (err) {
    console.error('Error fetching blog in blog-meta:', err);
  }

  const title = blog ? `${blog.title} | Yoganjali Yoga Studio` : 'Yoga Insights & Wellness Guides | Yoganjali Studio';
  const description = blog ? (blog.excerpt || blog.title) : 'Explore guided yoga asana routines, posture tips, and breathwork guides with Trainer Anjali Negi.';
  let coverImage = blog?.coverImage || 'https://www.yoganjaliyoga.com/yoganjali-logo.png';
  if (coverImage.startsWith('/')) {
    coverImage = `https://www.yoganjaliyoga.com${coverImage}`;
  }
  const canonicalUrl = `https://www.yoganjaliyoga.com/blog/${slug || ''}`;
  const authorName = blog?.author || 'Anjali Negi';
  const categoryName = blog?.category || 'Yoga & Holistic Wellness';

  const jsonLd = blog ? JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "description": blog.excerpt,
    "image": [coverImage],
    "datePublished": blog.date || "2026-08-20",
    "dateModified": blog.date || "2026-08-20",
    "author": {
      "@type": "Person",
      "name": authorName,
      "url": "https://www.yoganjaliyoga.com/#about"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Yoganjali Yoga Studio",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.yoganjaliyoga.com/yoganjali-logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    },
    "articleSection": categoryName
  }) : '';

  const metaTags = `
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${canonicalUrl}" />
    
    <!-- Open Graph -->
    <meta property="og:site_name" content="Yoganjali Yoga Studio" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${escapeHtml(blog?.title || title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:image" content="${coverImage}" />
    <meta property="og:image:secure_url" content="${coverImage}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="article:section" content="${escapeHtml(categoryName)}" />
    <meta property="article:author" content="${escapeHtml(authorName)}" />

    <!-- Twitter Cards -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(blog?.title || title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${coverImage}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    
    ${jsonLd ? `<script type="application/ld+json">${jsonLd}</script>` : ''}`;

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
    html = html.replace(/<title>.*?<\/title>/gis, '');
    html = html.replace(/<link rel="canonical".*?\/>/gis, '');
    html = html.replace(/<meta property="og:.*?" \/>/gis, '');
    html = html.replace(/<meta name="twitter:.*?" \/>/gis, '');
    html = html.replace(/<meta name="description" content=".*?" \/>/gis, '');
    html = html.replace(/<head>/i, `<head>${metaTags}`);
  } else {
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
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
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
