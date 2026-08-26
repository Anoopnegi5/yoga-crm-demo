// Cloudflare Worker Script with Cloudflare KV Real-Time Database Router & SPA Fallback

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Standard CORS Headers for Multi-Device Access
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept, Cache-Control, Pragma, Expires',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Real-Time Cloud Database Endpoint: /api/sync and /api/db
    if (url.pathname === '/api/sync' || url.pathname === '/api/db') {
      if (request.method === 'GET') {
        try {
          if (env.CRM_STORE) {
            const raw = await env.CRM_STORE.get('master_db');
            if (raw) {
              return new Response(raw, {
                status: 200,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
              });
            }
          }
        } catch (err) {
          console.error('KV get error:', err);
        }

        // Return empty payload if no database record yet
        return new Response(JSON.stringify({
          clients: [],
          payments: [],
          attendance: [],
          trainerDreams: [],
          trainerLeaves: [],
          leaves: [],
          lastUpdated: new Date().toISOString()
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (request.method === 'POST' || request.method === 'PUT') {
        try {
          const body = await request.json();
          const payload = body.data || body;
          payload.lastUpdated = new Date().toISOString();

          if (env.CRM_STORE) {
            await env.CRM_STORE.put('master_db', JSON.stringify(payload));
          }

          return new Response(JSON.stringify({
            success: true,
            count: Array.isArray(payload.clients) ? payload.clients.length : 0,
            lastUpdated: payload.lastUpdated
          }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        } catch (err) {
          return new Response(JSON.stringify({ error: err.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
      }

      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // SPA Routing: Serve static assets, and route /panel, /client/:id, /demo, etc. to index.html
    if (env.ASSETS) {
      try {
        const response = await env.ASSETS.fetch(request);
        if (response.status === 404 || !response.ok) {
          const indexUrl = new URL('/index.html', request.url);
          return await env.ASSETS.fetch(new Request(indexUrl, request));
        }
        return response;
      } catch (err) {
        const indexUrl = new URL('/index.html', request.url);
        return await env.ASSETS.fetch(new Request(indexUrl, request));
      }
    }

    // Direct fallback to index.html
    const indexUrl = new URL('/index.html', request.url);
    return fetch(new Request(indexUrl, request));
  }
};
