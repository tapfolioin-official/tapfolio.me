/**
 * CORS Proxy for Flutter Web (development only)
 * -------------------------------------------------
 * Forwards all requests to https://www.tapfolio.me, injects
 * CORS headers so the browser allows them from localhost.
 *
 * Key behaviour:
 *  - Strips Secure / SameSite / Domain flags from Set-Cookie so the browser
 *    can accept the cookie from localhost.
 *  - Also echoes the pertap_jwt value back in a custom X-Pertap-Token header
 *    so the Flutter app can always extract it regardless of browser cookie rules.
 *  - Forwards the Cookie header from the client to the server verbatim.
 *
 * Usage:
 *   node proxy.js          (listens on :3001 by default)
 *   PORT=4000 node proxy.js
 */

const http  = require('http');
const https = require('https');

const TARGET_HOST = 'www.tapfolio.me';
const PORT = process.env.PORT || 3001;

// Dynamically reflect the caller's origin so any localhost port works.
// Also falls back to a wildcard for non-credentialed requests.
function getCorsHeaders(requestOrigin) {
  const origin = (requestOrigin && requestOrigin.startsWith('http://localhost'))
    ? requestOrigin
    : 'http://localhost:8080';
  return {
    'Access-Control-Allow-Origin':      origin,
    'Access-Control-Allow-Methods':     'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers':     'Content-Type, Accept, Authorization, Cookie, X-Requested-With, X-Pertap-Token',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Expose-Headers':    'Set-Cookie, X-Pertap-Token',
  };
}

/**
 * Strip Secure / SameSite=None|Lax|Strict / Domain= from a Set-Cookie string
 * so the browser will store it as a plain localhost cookie.
 */
function sanitiseCookie(raw) {
  return raw
    .replace(/;\s*Secure/gi,              '')
    .replace(/;\s*SameSite=\w+/gi,        '')
    .replace(/;\s*Domain=[^;]+/gi,        '')
    .replace(/;\s*Path=\/[^;]*/gi,        '; Path=/');  // keep path as root
}

/**
 * Extract the pertap_jwt value from a Set-Cookie header (if present).
 */
function extractJwt(setCookieValue) {
  if (!setCookieValue) return null;
  const m = setCookieValue.match(/pertap_jwt=([^;]+)/i);
  return m ? m[1] : null;
}

const server = http.createServer((clientReq, clientRes) => {

  // ── Preflight ────────────────────────────────────────────────────────────
  if (clientReq.method === 'OPTIONS') {
    const corsHeaders = getCorsHeaders(clientReq.headers['origin']);
    clientRes.writeHead(204, corsHeaders);
    clientRes.end();
    return;
  }

  // ── Build upstream request ───────────────────────────────────────────────
  const upstreamHeaders = {
    ...clientReq.headers,
    host: TARGET_HOST,
  };
  // Remove headers that would confuse the upstream server
  delete upstreamHeaders['origin'];
  delete upstreamHeaders['referer'];

  const options = {
    hostname: TARGET_HOST,
    port:     443,
    path:     clientReq.url,
    method:   clientReq.method,
    headers:  upstreamHeaders,
  };

  const requestOrigin = clientReq.headers['origin'];
  const proxyReq = https.request(options, (proxyRes) => {

    // ── Assemble response headers ──────────────────────────────────────────
    const corsHeaders = getCorsHeaders(requestOrigin);
    const responseHeaders = { ...corsHeaders };

    // Copy all upstream headers, but sanitise Set-Cookie
    for (const [key, value] of Object.entries(proxyRes.headers)) {
      const lk = key.toLowerCase();

      if (lk === 'set-cookie') {
        // value can be string or string[]
        const cookies = Array.isArray(value) ? value : [value];
        const sanitised = cookies.map(sanitiseCookie);

        // Try to extract the JWT and echo it as a plain response header
        for (const c of cookies) {
          const jwt = extractJwt(c);
          if (jwt) {
            responseHeaders['X-Pertap-Token'] = jwt;
            console.log(`[proxy] captured pertap_jwt (len=${jwt.length})`);
            break;
          }
        }

        // Keep the sanitised Set-Cookie so the browser can also store it
        responseHeaders['Set-Cookie'] = sanitised;

      } else if (!corsHeaders[key]) {
        // Don't overwrite our explicit CORS headers
        responseHeaders[key] = value;
      }
    }

    clientRes.writeHead(proxyRes.statusCode, responseHeaders);
    proxyRes.pipe(clientRes, { end: true });
  });

  proxyReq.on('error', (err) => {
    console.error('[proxy] upstream error:', err.message);
    const corsHeaders = getCorsHeaders(requestOrigin);
    clientRes.writeHead(502, corsHeaders);
    clientRes.end(JSON.stringify({ error: 'Proxy upstream error: ' + err.message }));
  });

  clientReq.pipe(proxyReq, { end: true });
});

server.listen(PORT, () => {
  console.log(`✅  CORS proxy running → http://localhost:${PORT}`);
  console.log(`    Forwarding to       → https://${TARGET_HOST}`);
  console.log(`    JWT is echoed as    → X-Pertap-Token response header`);
  console.log(`    Run Flutter:          flutter run -d chrome --web-port 8080`);
});
