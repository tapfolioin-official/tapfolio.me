import type { NextConfig } from "next";

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://accounts.google.com/gsi/client https://apis.google.com https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com data:;
  img-src 'self' data: blob: https://res.cloudinary.com https://i.pravatar.cc https://lh3.googleusercontent.com https://*.googleusercontent.com;
  connect-src 'self' https://accounts.google.com/gsi/ https://*.firebaseio.com https://*.googleapis.com https://*.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://api.cloudinary.com https://api.web3forms.com;
  frame-src 'self' https://accounts.google.com/gsi/ https://accounts.google.com/;
  frame-ancestors 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
`.replace(/\s{2,}/g, ' ').trim();

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: cspHeader,
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(self)',
  },
  {
    key: 'Cross-Origin-Opener-Policy',
    value: 'same-origin-allow-popups',
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/abhinand",
        destination: "/portfolio/abhinand",
        permanent: true,
      },
      {
        source: "/nibras",
        destination: "/nibrasulhaqq",
        permanent: true,
      },
      {
        source: "/portfolio/nibras",
        destination: "/nibrasulhaqq",
        permanent: true,
      },
      {
        source: "/portfolio/nibrasulhaqq",
        destination: "/nibrasulhaqq",
        permanent: true,
      },
      {
        source: "/founders/nibras",
        destination: "/founders/mohammed-nibrasul-haqq",
        permanent: true,
      },
      {
        source: "/founders/nibrasulhaqq",
        destination: "/founders/mohammed-nibrasul-haqq",
        permanent: true,
      },
      {
        source: "/founders/abhinand-ks",
        destination: "/founders/abhinand",
        permanent: true,
      },
      {
        source: "/founders/abhinand-k-s",
        destination: "/founders/abhinand",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

