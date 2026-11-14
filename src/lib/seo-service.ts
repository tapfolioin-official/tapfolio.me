export interface SeoMeta {
  path: string;
  title: string;
  description: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  robots: string;
  isIndexed: boolean;
  keywords: string[];
  updatedAt: string;
}

export interface SeoRedirect {
  id: string;
  sourcePath: string;
  targetPath: string;
  statusCode: 301 | 302;
  isActive: boolean;
  clicks: number;
  createdAt: string;
}

export interface TrackedKeyword {
  id: string;
  keyword: string;
  targetUrl: string;
  category: string;
  currentRank: number;
  previousRank: number;
  bestRank: number;
  searchVolume: number;
  difficulty: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
  updatedAt: string;
}

let inMemorySeoMeta: Record<string, SeoMeta> = {
  '/': {
    path: '/',
    title: 'Tapfolio — Smart NFC Digital Business Cards & Portfolio Platform',
    description: 'Share your professional identity with a single tap. Instant portfolio, contact exchange, and real-time networking analytics.',
    canonicalUrl: 'https://tapfolio.me/',
    ogTitle: 'Tapfolio — The Future of Professional Networking',
    ogDescription: 'Instant smart digital cards, rich portfolios, and contactless networking powered by NFC.',
    ogImage: 'https://tapfolio.me/og-image.png',
    robots: 'index, follow, max-snippet:-1, max-image-preview:large',
    isIndexed: true,
    keywords: ['digital business card', 'smart nfc card', 'portfolio website builder', 'tap to connect', 'tapfolio'],
    updatedAt: new Date().toISOString(),
  },
  '/about': {
    path: '/about',
    title: 'About Tapfolio — Our Vision for Contactless Networking',
    description: 'Learn how Tapfolio is revolutionizing the way professionals, creators, and modern teams exchange contact information.',
    canonicalUrl: 'https://tapfolio.me/about',
    ogTitle: 'About Tapfolio — Revolutionizing Modern Networking',
    ogDescription: 'Our story, team, and hardware innovation.',
    ogImage: 'https://tapfolio.me/og-about.png',
    robots: 'index, follow',
    isIndexed: true,
    keywords: ['about tapfolio', 'contactless business card company'],
    updatedAt: new Date().toISOString(),
  },
  '/careers': {
    path: '/careers',
    title: 'Careers at Tapfolio — Build the Next-Gen Networking Operating System',
    description: 'Join our high-impact engineering, product, and growth teams at Tapfolio. Explore open positions in Kochi, hybrid and remote.',
    canonicalUrl: 'https://tapfolio.me/careers',
    ogTitle: 'Work With Us at Tapfolio',
    ogDescription: 'We are hiring visionary designers and engineers.',
    ogImage: 'https://tapfolio.me/og-careers.png',
    robots: 'index, follow',
    isIndexed: true,
    keywords: ['tapfolio careers', 'tech jobs kochi', 'react developer jobs'],
    updatedAt: new Date().toISOString(),
  },
};

let inMemoryRedirects: SeoRedirect[] = [
  {
    id: 'redir-1',
    sourcePath: '/card',
    targetPath: '/#configurator',
    statusCode: 301,
    isActive: true,
    clicks: 1420,
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    id: 'redir-2',
    sourcePath: '/app-download',
    targetPath: '/#download',
    statusCode: 302,
    isActive: true,
    clicks: 890,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'redir-3',
    sourcePath: '/shop',
    targetPath: '/#configurator',
    statusCode: 301,
    isActive: true,
    clicks: 2150,
    createdAt: new Date(Date.now() - 86400000 * 60).toISOString(),
  },
];

let inMemoryKeywords: TrackedKeyword[] = [
  {
    id: 'kw-1',
    keyword: 'smart nfc business card',
    targetUrl: 'https://tapfolio.me/',
    category: 'Product',
    currentRank: 3,
    previousRank: 5,
    bestRank: 2,
    searchVolume: 18100,
    difficulty: 42,
    trend: 'UP',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'kw-2',
    keyword: 'digital portfolio builder',
    targetUrl: 'https://tapfolio.me/',
    category: 'SaaS',
    currentRank: 6,
    previousRank: 6,
    bestRank: 4,
    searchVolume: 22400,
    difficulty: 54,
    trend: 'STABLE',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'kw-3',
    keyword: 'tap to share profile',
    targetUrl: 'https://tapfolio.me/',
    category: 'Feature',
    currentRank: 2,
    previousRank: 4,
    bestRank: 1,
    searchVolume: 9200,
    difficulty: 28,
    trend: 'UP',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'kw-4',
    keyword: 'nfc vcard generator',
    targetUrl: 'https://tapfolio.me/',
    category: 'Tools',
    currentRank: 8,
    previousRank: 7,
    bestRank: 5,
    searchVolume: 6700,
    difficulty: 35,
    trend: 'DOWN',
    updatedAt: new Date().toISOString(),
  },
];

export async function getSeoDashboardData() {
  return {
    healthScore: 92,
    organicTraffic: 48200,
    trafficGrowth: '+32.6%',
    indexedPages: 421,
    totalImpressions: 185400,
    totalClicks: 24600,
    avgPosition: 4.8,
    avgCtr: '13.3%',
    trackedKeywordsCount: inMemoryKeywords.length,
    totalBacklinks: 3420,
    activeRedirects: inMemoryRedirects.filter((r) => r.isActive).length,
    checklist: [
      { name: 'Meta Titles & Descriptions', status: 'PASS', score: '100%' },
      { name: 'XML Sitemap Generated & Validated', status: 'PASS', score: '100%' },
      { name: 'Robots.txt Crawl Directives', status: 'PASS', score: '100%' },
      { name: 'Mobile Usability & Responsive Viewport', status: 'PASS', score: '98%' },
      { name: 'Core Web Vitals (LCP < 2.5s, CLS < 0.1)', status: 'PASS', score: '95%' },
      { name: 'SSL/HTTPS HSTS Enforced', status: 'PASS', score: '100%' },
      { name: 'OpenGraph & Twitter Social Cards', status: 'PASS', score: '100%' },
      { name: 'Broken Links (0 broken detected)', status: 'PASS', score: '100%' },
    ],
  };
}

export async function getSeoMeta(path: string) {
  return inMemorySeoMeta[path] || {
    path,
    title: `Tapfolio — ${path.replace('/', '')}`,
    description: 'Tapfolio digital business card and profile portfolio.',
    canonicalUrl: `https://tapfolio.me${path}`,
    ogTitle: `Tapfolio — ${path.replace('/', '')}`,
    ogDescription: 'Contactless NFC networking and portfolio showcase.',
    ogImage: 'https://tapfolio.me/og-image.png',
    robots: 'index, follow',
    isIndexed: true,
    keywords: ['tapfolio'],
    updatedAt: new Date().toISOString(),
  };
}

export async function updateSeoMeta(data: SeoMeta) {
  inMemorySeoMeta[data.path] = {
    ...data,
    updatedAt: new Date().toISOString(),
  };
  return inMemorySeoMeta[data.path];
}

export async function getAllRedirects() {
  return inMemoryRedirects;
}

export async function createRedirect(rule: Omit<SeoRedirect, 'id' | 'clicks' | 'createdAt'>) {
  const newRule: SeoRedirect = {
    id: `redir-${Date.now()}`,
    ...rule,
    clicks: 0,
    createdAt: new Date().toISOString(),
  };
  inMemoryRedirects.unshift(newRule);
  return newRule;
}

export async function deleteRedirect(id: string) {
  inMemoryRedirects = inMemoryRedirects.filter((r) => r.id !== id);
  return true;
}

export async function getAllKeywords() {
  return inMemoryKeywords;
}

export async function addKeyword(kw: Omit<TrackedKeyword, 'id' | 'trend' | 'updatedAt'>) {
  const newKw: TrackedKeyword = {
    id: `kw-${Date.now()}`,
    ...kw,
    trend: 'UP',
    updatedAt: new Date().toISOString(),
  };
  inMemoryKeywords.unshift(newKw);
  return newKw;
}

export async function getGoogleIntegrationsStatus() {
  return [
    {
      name: 'Google Search Console',
      id: 'gsc',
      status: 'CONNECTED',
      property: 'sc-domain:tapfolio.me',
      verified: true,
      lastSync: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    },
    {
      name: 'Google Analytics 4',
      id: 'ga4',
      status: 'CONNECTED',
      measurementId: 'G-XXXXXXXXXX',
      verified: true,
      lastSync: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    },
    {
      name: 'Google PageSpeed Insights',
      id: 'psi',
      status: 'ACTIVE',
      scoreMobile: 94,
      scoreDesktop: 99,
      verified: true,
      lastSync: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    },
    {
      name: 'Google Tag Manager',
      id: 'gtm',
      status: 'CONFIGURED',
      containerId: 'GTM-T8F99X',
      verified: true,
      lastSync: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
  ];
}

export interface AppStoreSeo {
  platform: 'ios' | 'android';
  appName: string;
  subtitle: string;
  bundleId: string;
  primaryCategory: string;
  secondaryCategory: string;
  keywords: string;
  shortDescription: string;
  fullDescription: string;
  promotionalText: string;
  privacyPolicyUrl: string;
  supportUrl: string;
  marketingUrl: string;
  ratingScore: number;
  totalRatings: number;
  universalLinksDomain: string;
  customScheme: string;
  smartBannerEnabled: boolean;
  appStoreId: string;
  updatedAt: string;
}

let inMemoryAppStoreSeo: Record<'ios' | 'android', AppStoreSeo> = {
  ios: {
    platform: 'ios',
    appName: 'Tapfolio: Smart NFC Business',
    subtitle: 'Digital Cards & Portfolios',
    bundleId: 'com.tapfolio.app',
    primaryCategory: 'Business',
    secondaryCategory: 'Productivity',
    keywords: 'nfc business card,digital portfolio,smart contact,networking,vcard,contactless card,tapfolio',
    shortDescription: 'Instant contactless networking and personal portfolio operating system powered by NFC.',
    fullDescription: `Tapfolio is the revolutionary smart digital networking operating system.\n\nShare your professional identity, contact details, social links, portfolio projects, and custom links with a single tap of an NFC card or dynamic QR code.\n\nKEY FEATURES:\n• Contactless NFC Card Pairing & Instant Sync\n• Real-Time Tap Analytics & Geographic Engagement\n• Custom Digital Portfolio with 4K Themes\n• Instant Contact Exchange & Inbound CRM\n• Offline QR Code Generation with vCard Export\n• Apple Wallet Pass Support & Contactless Sharing\n\nUpgrade your networking today with Tapfolio.`,
    promotionalText: 'Upgrade your networking with instant NFC tap-to-share and real-time portfolio analytics.',
    privacyPolicyUrl: 'https://tapfolio.me/privacy',
    supportUrl: 'https://tapfolio.me/support',
    marketingUrl: 'https://tapfolio.me',
    ratingScore: 4.9,
    totalRatings: 1240,
    universalLinksDomain: 'tapfolio.me',
    customScheme: 'tapfolio://',
    smartBannerEnabled: true,
    appStoreId: '6478901234',
    updatedAt: new Date().toISOString(),
  },
  android: {
    platform: 'android',
    appName: 'Tapfolio — Smart NFC Cards',
    subtitle: 'Portfolio & Contact Sharing',
    bundleId: 'com.tapfolio.app',
    primaryCategory: 'Business',
    secondaryCategory: 'Tools',
    keywords: 'nfc card,digital business card,portfolio builder,contact exchange,smart card,tap to share',
    shortDescription: 'Share your portfolio and exchange contacts instantly with NFC and dynamic QR.',
    fullDescription: `Tapfolio gives you the superpower to exchange your complete professional identity in 1 second.\n\nNo app required for the receiver! When you tap your Tapfolio NFC card or show your QR code, your interactive portfolio opens directly in their browser.\n\nFEATURES:\n• Tap-to-Share NFC Technology (NTAG215/216 support)\n• Live Inbound Lead Capture & CRM Pipeline\n• Advanced Link-in-Bio with Custom Domains\n• Real-Time Profile Visits & Tap Telemetry\n• Direct vCard Download to Phone Contacts\n• Dark Mode & Custom Accent Themes\n\nJoin thousands of top entrepreneurs, executives, creators, and freelancers on Tapfolio.`,
    promotionalText: 'Instant NFC cards & portfolio website builder for modern professionals.',
    privacyPolicyUrl: 'https://tapfolio.me/privacy',
    supportUrl: 'https://tapfolio.me/support',
    marketingUrl: 'https://tapfolio.me',
    ratingScore: 4.8,
    totalRatings: 2890,
    universalLinksDomain: 'tapfolio.me',
    customScheme: 'tapfolio://',
    smartBannerEnabled: true,
    appStoreId: 'com.tapfolio.app',
    updatedAt: new Date().toISOString(),
  },
};

export async function getAppStoreSeo(platform: 'ios' | 'android' = 'ios') {
  return inMemoryAppStoreSeo[platform];
}

export async function updateAppStoreSeo(data: AppStoreSeo) {
  inMemoryAppStoreSeo[data.platform] = {
    ...data,
    updatedAt: new Date().toISOString(),
  };
  return inMemoryAppStoreSeo[data.platform];
}
