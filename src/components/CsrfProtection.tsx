'use client';

import { useEffect } from 'react';

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  try {
    const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
    return match ? decodeURIComponent(match[3]) : null;
  } catch {
    return null;
  }
}

export default function CsrfProtection() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Proactively fetch a CSRF token if cookie is not present yet
    if (!getCookie('pertap_csrf')) {
      fetch('/api/auth/csrf').catch(() => {});
    }

    const originalFetch = window.fetch;

    // Decorate window.fetch to attach X-CSRF-Token automatically to all state-changing API calls
    window.fetch = async function (input: RequestInfo | URL, init?: RequestInit) {
      let url = '';
      if (typeof input === 'string') {
        url = input;
      } else if (input instanceof URL) {
        url = input.pathname;
      } else if (input && typeof (input as Request).url === 'string') {
        url = (input as Request).url;
      }

      const method = (init?.method || (typeof input === 'object' && 'method' in input ? (input as Request).method : 'GET')).toUpperCase();

      // Only attach CSRF token to relative /api/ mutations
      const isApiMutation =
        (url.startsWith('/api/') || url.startsWith('/api') || url.includes('/api/')) &&
        ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);

      if (isApiMutation) {
        let csrfToken = getCookie('pertap_csrf');
        if (!csrfToken) {
          // If missing, attempt quick fetch
          try {
            const res = await originalFetch('/api/auth/csrf');
            const data = await res.json();
            csrfToken = data.csrfToken;
          } catch (_) {}
        }

        if (csrfToken) {
          const headers = new Headers(init?.headers);
          if (!headers.has('X-CSRF-Token') && !headers.has('x-csrf-token')) {
            headers.set('X-CSRF-Token', csrfToken);
          }
          init = {
            ...init,
            headers,
          };
        }
      }

      return originalFetch(input, init);
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  return null;
}

