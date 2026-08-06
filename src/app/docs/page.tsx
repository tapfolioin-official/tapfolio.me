'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  BookOpen, 
  UserCheck, 
  CreditCard, 
  BarChart3, 
  Code, 
  HelpCircle, 
  ShieldCheck, 
  Sparkles, 
  Copy, 
  Check,
  ExternalLink,
  Smartphone,
  Layers,
  Terminal,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/config/routes';

export default function DocsPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeSec, setActiveSec] = useState('getting-started');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const sections = [
    { id: 'getting-started', title: 'Getting Started', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'profile-setup', title: 'Profile Setup & Design', icon: <UserCheck className="w-4 h-4" /> },
    { id: 'nfc-hardware', title: 'NFC Hardware Setup', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'analytics-crm', title: 'Analytics & CRM Leads', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'developer-api', title: 'Developer REST API', icon: <Code className="w-4 h-4" /> },
    { id: 'troubleshooting', title: 'NFC Troubleshooting', icon: <HelpCircle className="w-4 h-4" /> }
  ];

  return (
    <div className="bg-[#0b0f19] min-h-screen text-slate-100 font-sans antialiased selection:bg-blue-600/30 selection:text-blue-300">
      
      {/* Dynamic Aurora glow background elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-10 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header bar */}
      <header className="sticky top-0 z-50 bg-[#0b0f19]/80 backdrop-blur-md border-b border-slate-800/80 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 bg-slate-800/60 hover:bg-slate-800 hover:text-white rounded-xl transition-all text-slate-400">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <span className="font-bold text-lg text-white flex items-center gap-2">
            Tapfolio 
            <span className="text-blue-400 text-xs font-semibold px-2.5 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
              Documentation Center v1.0
            </span>
          </span>
        </div>
        <Link href={ROUTES.DASHBOARD} className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-blue-500/20 transition-all">
          Go to Dashboard
        </Link>
      </header>

      <div className="max-w-[1280px] mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sticky top-24 backdrop-blur-sm">
          <h3 className="text-xs uppercase tracking-widest font-black text-slate-500 px-3 mb-4">Documentation</h3>
          <nav className="flex flex-col gap-1.5">
            {sections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveSec(sec.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-left transition-all cursor-pointer ${
                  activeSec === sec.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                {sec.icon}
                {sec.title}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content area */}
        <main className="lg:col-span-9 bg-slate-900/40 border border-slate-800/60 rounded-3xl p-6 sm:p-10 backdrop-blur-sm min-h-[600px] flex flex-col gap-8">
          
          {/* SECTION 1: Getting Started */}
          {activeSec === 'getting-started' && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-blue-400">Welcome & Quickstart</span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">Tapfolio Documentation Center</h1>
                <p className="text-slate-400 text-sm sm:text-base mt-2 leading-relaxed">
                  Welcome to the official Tapfolio Documentation Hub. Learn how smart NFC business card hardware, live dynamic profiles, team badging, and programmatic REST APIs work together seamlessly.
                </p>
              </div>

              {/* 3-Step Setup Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                <div className="p-5 border border-slate-800/60 rounded-2xl bg-slate-900/50 flex flex-col gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold">1</div>
                  <h4 className="font-bold text-white text-sm">Register & Setup</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">Create your Tapfolio account, set your unique handle, and add your contact details.</p>
                </div>
                <div className="p-5 border border-slate-800/60 rounded-2xl bg-slate-900/50 flex flex-col gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold">2</div>
                  <h4 className="font-bold text-white text-sm">Design & Customize</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">Customize your digital profile layout, colors, socials, glassmorphism themes, and links.</p>
                </div>
                <div className="p-5 border border-slate-800/60 rounded-2xl bg-slate-900/50 flex flex-col gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">3</div>
                  <h4 className="font-bold text-white text-sm">Tap & Connect</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">Order your physical NFC PVC, Wooden, or Metal smart card and tap any smartphone to share.</p>
                </div>
              </div>

              {/* Featured Articles Grid */}
              <div className="mt-4 flex flex-col gap-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Popular Guides & Reference</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link href="/docs/getting-started" className="p-4 bg-slate-950/60 border border-slate-800/80 hover:border-blue-500/40 rounded-2xl flex items-center justify-between group transition-all">
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-5 h-5 text-blue-400" />
                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">Getting Started Guide</h4>
                        <p className="text-xs text-slate-500">Platform introduction & quick setup</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors" />
                  </Link>

                  <Link href="/docs/profile-setup" className="p-4 bg-slate-950/60 border border-slate-800/80 hover:border-blue-500/40 rounded-2xl flex items-center justify-between group transition-all">
                    <div className="flex items-center gap-3">
                      <UserCheck className="w-5 h-5 text-purple-400" />
                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">Setting Up Your Profile</h4>
                        <p className="text-xs text-slate-500">Bio, socials, and design themes</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors" />
                  </Link>

                  <Link href="/docs/nfc-setup" className="p-4 bg-slate-950/60 border border-slate-800/80 hover:border-blue-500/40 rounded-2xl flex items-center justify-between group transition-all">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-emerald-400" />
                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">Configuring NFC Cards</h4>
                        <p className="text-xs text-slate-500">Pairing & programming smart cards</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors" />
                  </Link>

                  <Link href="/docs/troubleshooting" className="p-4 bg-slate-950/60 border border-slate-800/80 hover:border-blue-500/40 rounded-2xl flex items-center justify-between group transition-all">
                    <div className="flex items-center gap-3">
                      <HelpCircle className="w-5 h-5 text-amber-400" />
                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">NFC Troubleshooting</h4>
                        <p className="text-xs text-slate-500">Scanner tips for iOS & Android</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors" />
                  </Link>
                </div>
              </div>

              {/* Case-Insensitive Banner */}
              <div className="mt-4 p-5 bg-blue-950/20 border border-blue-500/20 rounded-2xl flex items-start gap-4">
                <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-blue-300 text-sm">Universal Case-Insensitive Routing</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    All username profiles and portfolio paths (e.g. <code className="text-blue-400 bg-blue-900/20 px-1.5 py-0.5 rounded font-mono">/connect/Abhinand</code> or <code className="text-blue-400 bg-blue-900/20 px-1.5 py-0.5 rounded font-mono">/portfolio/Abhinand</code>) support case-insensitive URL queries. Slugs are resolved automatically.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: Profile Setup & Design */}
          {activeSec === 'profile-setup' && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">Profile Setup & Customization</h1>
                <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                  Your Tapfolio digital business card is your modern identity base. Customize your executive narrative, social links, project portfolios, and glassmorphism styling.
                </p>
              </div>

              <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
                <div className="p-5 border border-slate-800 rounded-2xl bg-slate-950/50 flex flex-col gap-2">
                  <h3 className="font-bold text-white text-base">1. Basic Profile & Branding</h3>
                  <p className="text-xs text-slate-400">Add your full name, job title, company name, location, and avatar picture. Write a high-converting short tagline to capture attention when shared.</p>
                </div>

                <div className="p-5 border border-slate-800 rounded-2xl bg-slate-950/50 flex flex-col gap-2">
                  <h3 className="font-bold text-white text-base">2. Links & Social Accounts</h3>
                  <p className="text-xs text-slate-400">Link your LinkedIn, GitHub, X (Twitter), Instagram, email, phone number, and custom portfolio links. Rearrange link priority anytime from your dashboard.</p>
                </div>

                <div className="p-5 border border-slate-800 rounded-2xl bg-slate-950/50 flex flex-col gap-2">
                  <h3 className="font-bold text-white text-base">3. Glassmorphism Themes & Colors</h3>
                  <p className="text-xs text-slate-400">Choose between dark aesthetic modes, vibrant aurora glows, custom typography (Inter, Outfit, Roboto), and card shape parameters.</p>
                </div>

                <div className="p-5 border border-slate-800 rounded-2xl bg-slate-950/50 flex flex-col gap-2">
                  <h3 className="font-bold text-white text-base">4. Custom Domain Alias Mapping</h3>
                  <p className="text-xs text-slate-400">Enterprise plans allow you to map custom domain paths (e.g. <code className="text-blue-400 font-mono">card.yourcompany.com</code>) directly to your Tapfolio profile URL.</p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: NFC Hardware Setup */}
          {activeSec === 'nfc-hardware' && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">NFC Hardware Setup</h1>
                <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                  Every Tapfolio smart card contains embedded NTAG213/NTAG215/NTAG216 microchips programmed to launch your dynamic identity wirelessly on contact.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 border border-slate-800/80 rounded-2xl bg-slate-950/50 flex flex-col gap-3">
                  <Smartphone className="w-6 h-6 text-blue-400" />
                  <h4 className="font-bold text-white text-sm">iPhone NFC Reader Location</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    On iPhones (iPhone XS and newer), the NFC antenna is located at the top top edge near the rear camera. Simply tap the top of your iPhone against the card.
                  </p>
                </div>

                <div className="p-5 border border-slate-800/80 rounded-2xl bg-slate-950/50 flex flex-col gap-3">
                  <Smartphone className="w-6 h-6 text-purple-400" />
                  <h4 className="font-bold text-white text-sm">Android NFC Reader Location</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    On Android devices, the NFC sensor is typically located in the center of the back phone body. Ensure NFC is toggled ON in quick settings.
                  </p>
                </div>
              </div>

              <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col gap-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Automated Card Pairing Workflow</h3>
                <ol className="space-y-2 text-xs text-slate-300 leading-relaxed list-decimal list-inside">
                  <li>Hold your physical Tapfolio card against your phone scanner.</li>
                  <li>Tap the browser pop-up prompt to open the setup wizard.</li>
                  <li>Log into your Tapfolio account credentials when prompted.</li>
                  <li>Click <strong>Link Card to Profile</strong>. Your card is now locked to your live URL.</li>
                </ol>
              </div>
            </div>
          )}

          {/* SECTION 4: Analytics & CRM Leads */}
          {activeSec === 'analytics-crm' && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">Analytics & CRM Lead Capture</h1>
                <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                  Turn physical taps into actionable business connections. Track profile view counts, social click events, vCard downloads, and incoming client leads.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 border border-slate-800 rounded-2xl bg-slate-950/50 flex flex-col gap-2">
                  <BarChart3 className="w-5 h-5 text-emerald-400" />
                  <h4 className="font-bold text-white text-sm">Tap Analytics</h4>
                  <p className="text-xs text-slate-400">View live metrics graphs of unique visitors and total card taps over time.</p>
                </div>

                <div className="p-5 border border-slate-800 rounded-2xl bg-slate-950/50 flex flex-col gap-2">
                  <Layers className="w-5 h-5 text-blue-400" />
                  <h4 className="font-bold text-white text-sm">Link Click Rates</h4>
                  <p className="text-xs text-slate-400">Discover which social links, portfolios, or contact options get clicked most.</p>
                </div>

                <div className="p-5 border border-slate-800 rounded-2xl bg-slate-950/50 flex flex-col gap-2">
                  <Zap className="w-5 h-5 text-purple-400" />
                  <h4 className="font-bold text-white text-sm">CRM Auto Sync</h4>
                  <p className="text-xs text-slate-400">Push captured leads directly to HubSpot, Salesforce, or Zapier webhooks.</p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: Developer REST API */}
          {activeSec === 'developer-api' && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">Programmatic APIs</span>
                <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">Developer REST API & Webhooks</h1>
                <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                  Integrate Tapfolio profiles into custom enterprise applications, Mobile apps, or corporate directory portals using our public REST endpoints.
                </p>
              </div>

              {/* Endpoint 1: Profile Lookup */}
              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">1. Profile Metadata Lookup API</h3>
                <div className="flex items-center gap-3 bg-slate-950 rounded-xl px-4 py-3 border border-slate-800/80 text-sm font-mono text-emerald-400 select-all justify-between">
                  <span>GET https://www.tapfolio.me/api/profile/:username</span>
                  <button 
                    onClick={() => copyToClipboard('GET https://www.tapfolio.me/api/profile/:username', 'endpoint')}
                    className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer shrink-0"
                  >
                    {copiedId === 'endpoint' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="relative">
                  <pre className="bg-slate-950 border border-slate-800 rounded-xl p-5 overflow-x-auto text-[11px] font-mono text-slate-300 leading-relaxed scrollbar-none">
{`{
  "success": true,
  "profile": {
    "id": 14,
    "name": "Abhinand K.S.",
    "username": "abhinand",
    "jobTitle": "Founder & CEO",
    "company": "Tapfolio",
    "bio": "Founder & CEO of Tapfolio—a premium NFC-powered digital identity platform.",
    "socials": [
      { "platform": "LinkedIn", "url": "https://linkedin.com/in/abhinand-ks-428387332/" },
      { "platform": "GitHub", "url": "https://github.com/abhinand-me/" }
    ]
  }
}`}
                  </pre>
                  <button 
                    onClick={() => copyToClipboard(`{\n  "success": true,\n  "profile": {\n    "id": 14,\n    "name": "Abhinand K.S.",\n    "username": "abhinand",\n    "jobTitle": "Founder & CEO",\n    "company": "Tapfolio",\n    "socials": [\n      { "platform": "LinkedIn", "url": "https://linkedin.com/in/abhinand-ks-428387332/" },\n      { "platform": "GitHub", "url": "https://github.com/abhinand-me/" }\n    ]\n  }\n}`, 'json')}
                    className="absolute top-4 right-4 p-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer"
                  >
                    {copiedId === 'json' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Endpoint 2: vCard NFC Download */}
              <div className="flex flex-col gap-3 pt-4 border-t border-slate-800/80">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">2. vCard NFC Download Endpoint</h3>
                <div className="flex items-center gap-3 bg-slate-950 rounded-xl px-4 py-3 border border-slate-800/80 text-sm font-mono text-purple-400 select-all justify-between">
                  <span>GET https://www.tapfolio.me/api/profile/:username/vcard</span>
                  <button 
                    onClick={() => copyToClipboard('GET https://www.tapfolio.me/api/profile/:username/vcard', 'vcard')}
                    className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer shrink-0"
                  >
                    {copiedId === 'vcard' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-slate-400">Returns raw <code className="text-purple-400 font-mono">text/vcard</code> vCard 3.0 file formatted to prompt iOS and Android devices to add the contact directly.</p>
              </div>
            </div>
          )}

          {/* SECTION 6: Troubleshooting */}
          {activeSec === 'troubleshooting' && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">NFC & Device Troubleshooting</h1>
                <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                  If a smartphone is not reading your physical NFC card immediately, follow these simple diagnostic steps.
                </p>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-start gap-3">
                  <span className="font-bold text-amber-400">•</span>
                  <div>
                    <h4 className="font-bold text-white text-sm">1. Check NFC Setting on Android</h4>
                    <p className="text-slate-400 mt-0.5">Swipe down from top screen and ensure the <strong>NFC toggle</strong> is switched ON in Settings &gt; Connected Devices &gt; NFC.</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-start gap-3">
                  <span className="font-bold text-amber-400">•</span>
                  <div>
                    <h4 className="font-bold text-white text-sm">2. Check iPhone Model Compatibility</h4>
                    <p className="text-slate-400 mt-0.5">iPhones (XS, 11, 12, 13, 14, 15, 16) have background NFC tag reading enabled automatically. Tap at the top rim of the iPhone.</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-start gap-3">
                  <span className="font-bold text-amber-400">•</span>
                  <div>
                    <h4 className="font-bold text-white text-sm">3. Avoid Thick Metal Cases</h4>
                    <p className="text-slate-400 mt-0.5">Heavy magnetic cases or thick metal wallet cases can attenuate high-frequency NFC microchip signals. Remove thick cases if needed.</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-start gap-3">
                  <span className="font-bold text-amber-400">•</span>
                  <div>
                    <h4 className="font-bold text-white text-sm">4. Use Dynamic QR Code Fallback</h4>
                    <p className="text-slate-400 mt-0.5">If the recipient has a phone without NFC capabilities, open your Tapfolio QR code on screen to scan instantly with any camera.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Footer bar */}
      <footer className="border-t border-slate-800/80 py-8 text-center text-xs text-slate-500">
        © 2026 Tapfolio Inc. All rights reserved. Tapfolio product & developer documentation.
      </footer>
    </div>
  );
}
