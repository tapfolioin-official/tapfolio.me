'use client';

import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Terminal, Code, Cpu, ShieldCheck, Sparkles, Copy, Check } from 'lucide-react';
import Link from 'next/link';

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
    { id: 'profile-api', title: 'Profile Lookup API', icon: <Terminal className="w-4 h-4" /> },
    { id: 'vcard-api', title: 'vCard NFC Download', icon: <Code className="w-4 h-4" /> },
    { id: 'themes', title: 'Theme System JSON', icon: <Sparkles className="w-4 h-4" /> }
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
          <span className="font-bold text-lg text-white">Tapfolio <span className="text-blue-500 text-sm font-semibold ml-1.5 px-2.5 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded-full">Developer Docs v1.0</span></span>
        </div>
        <Link href="/dashboard" className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-blue-500/20 transition-all">
          Go to Dashboard
        </Link>
      </header>

      <div className="max-w-[1280px] mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sticky top-28 backdrop-blur-sm">
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
                <h1 className="text-3xl font-extrabold text-white tracking-tight">Getting Started</h1>
                <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                  Welcome to the Tapfolio Developer Center. Learn how our smart business card hardware, dynamic public profiles, and programmatic query APIs integrate seamlessly to share identity, socials, and creative portfolios.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                <div className="p-5 border border-slate-800/60 rounded-2xl bg-slate-900/50 flex flex-col gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold">1</div>
                  <h4 className="font-bold text-white text-sm">Register & Setup</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">Create your account and select a custom profile username path.</p>
                </div>
                <div className="p-5 border border-slate-800/60 rounded-2xl bg-slate-900/50 flex flex-col gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold">2</div>
                  <h4 className="font-bold text-white text-sm">Design & Style</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">Build a fully responsive card, set theme configs, custom typography, colors, and layout.</p>
                </div>
                <div className="p-5 border border-slate-800/60 rounded-2xl bg-slate-900/50 flex flex-col gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">3</div>
                  <h4 className="font-bold text-white text-sm">Connect & Tap</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">Order your physical NFC PVC or Metal smart card and instantly share your details.</p>
                </div>
              </div>

              <div className="mt-4 p-5 bg-blue-950/20 border border-blue-500/20 rounded-2xl flex items-start gap-4">
                <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-blue-300 text-sm">Case Insensitive Routing</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    All username profiles and portfolio paths (e.g. <code className="text-blue-400 bg-blue-900/20 px-1.5 py-0.5 rounded font-mono">/connect/Abhinand</code> or <code className="text-blue-400 bg-blue-900/20 px-1.5 py-0.5 rounded font-mono">/portfolio/Abhinand</code>) support fully case-insensitive queries. Slugs are normalized automatically.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: Profile Lookup API */}
          {activeSec === 'profile-api' && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">Profile Lookup API</h1>
                <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                  Programmatically query full profile metadata, social links, tags, and theme customization parameters using our public REST endpoint.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Endpoint Path</h3>
                <div className="flex items-center gap-3 bg-slate-950 rounded-xl px-4 py-3 border border-slate-800/80 text-sm font-mono text-emerald-400 select-all justify-between">
                  <span>GET http://localhost:3000/api/profile/:username</span>
                  <button 
                    onClick={() => copyToClipboard('GET http://localhost:3000/api/profile/:username', 'endpoint')}
                    className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer shrink-0"
                  >
                    {copiedId === 'endpoint' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Example Response</h3>
                <div className="relative">
                  <pre className="bg-slate-950 border border-slate-800 rounded-xl p-5 overflow-x-auto text-[11px] font-mono text-slate-300 leading-relaxed scrollbar-none">
{`{
  "success": true,
  "profile": {
    "id": 14,
    "userId": 5,
    "name": "Abhinand Sunil",
    "username": "abhinand",
    "tagline": "Visual Storyteller",
    "bio": "Creator, developer and creative photographer based in Bangalore.",
    "isPremium": true,
    "connectionCount": 42,
    "socials": [
      { "id": 1, "platform": "GitHub", "url": "https://github.com/abhinand" },
      { "id": 2, "platform": "LinkedIn", "url": "https://linkedin.com/in/abhinand" }
    ],
    "theme": {
      "colors": {
        "primary": "#014BAA",
        "background": "#f0f2f8",
        "surface": "#ffffff"
      },
      "typography": { "fontFamily": "Outfit" },
      "layout": { "alignment": "center", "style": "centered" }
    }
  }
}`}
                  </pre>
                  <button 
                    onClick={() => copyToClipboard(`{\n  "success": true,\n  "profile": {\n    "id": 14,\n    "userId": 5,\n    "name": "Abhinand Sunil",\n    "username": "abhinand",\n    "tagline": "Visual Storyteller",\n    "bio": "Creator, developer and creative photographer based in Bangalore.",\n    "isPremium": true,\n    "connectionCount": 42,\n    "socials": [\n      { "id": 1, "platform": "GitHub", "url": "https://github.com/abhinand" },\n      { "id": 2, "platform": "LinkedIn", "url": "https://linkedin.com/in/abhinand" }\n    ],\n    "theme": {\n      "colors": {\n        "primary": "#014BAA",\n        "background": "#f0f2f8",\n        "surface": "#ffffff"\n      },\n      "typography": { "fontFamily": "Outfit" },\n      "layout": { "alignment": "center", "style": "centered" }\n    }\n  }\n}`, 'json')}
                    className="absolute top-4 right-4 p-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer"
                  >
                    {copiedId === 'json' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: vCard NFC Download */}
          {activeSec === 'vcard-api' && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">vCard NFC Download</h1>
                <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                  Generate and download contact files directly using the NFC-optimized vCard exporter. This endpoint returns raw contacts metadata formatted to prompt iOS and Android devices to add a contact card instantly.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">vCard Path</h3>
                <div className="flex items-center gap-3 bg-slate-950 rounded-xl px-4 py-3 border border-slate-800/80 text-sm font-mono text-purple-400 select-all justify-between">
                  <span>GET http://localhost:3000/api/profile/:username/vcard</span>
                  <button 
                    onClick={() => copyToClipboard('GET http://localhost:3000/api/profile/:username/vcard', 'vcard')}
                    className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer shrink-0"
                  >
                    {copiedId === 'vcard' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">vCard Specifications</h3>
                <ul className="space-y-3 text-sm text-slate-400 leading-relaxed list-disc list-inside">
                  <li>Sends response header <code className="text-purple-400 bg-slate-950 px-1.5 py-0.5 rounded font-mono">Content-Type: text/vcard</code>.</li>
                  <li>Formatted to support standard **VCard version 3.0**.</li>
                  <li>Attaches name, emails, phone numbers, custom bio tagline, location parameters, and social handle URLs.</li>
                  <li>Automatically triggers contact saving wizard on smart phones when redirected from Tapfolio hardware NFC chips.</li>
                </ul>
              </div>
            </div>
          )}

          {/* SECTION 4: Theme System JSON */}
          {activeSec === 'themes' && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">Theme System JSON Schema</h1>
                <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                  Learn about how theme settings and custom UI customizations are stored in structured JSON database blocks. No migrations needed to add brand variables.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Settings Schema Structure</h3>
                <div className="relative">
                  <pre className="bg-slate-950 border border-slate-800 rounded-xl p-5 overflow-x-auto text-[11px] font-mono text-slate-300 leading-relaxed scrollbar-none">
{`interface ProfileThemeSettings {
  colors: {
    primary: string;       // Primary button or focus color
    background: string;    // Page layout background base
    surface: string;       // Card background container color
    text: string;          // Main typography color
    mutedText: string;     // Labels or subtitle color
    border: string;        // Border outlines color
  };
  background: {
    type: 'solid' | 'gradient' | 'aurora' | 'particles';
    value: string;         // Hex code or CSS background definition
  };
  typography: {
    fontFamily: 'Inter' | 'Outfit' | 'Roboto' | 'Space Grotesk';
    fontSize: 'small' | 'medium' | 'large';
  };
  layout: {
    style: 'centered' | 'compact' | 'modern';
    alignment: 'center' | 'left' | 'right';
  };
  avatar: {
    shape: 'circle' | 'rounded' | 'square';
    glow: 'none' | 'glow';
  };
}`}
                  </pre>
                  <button 
                    onClick={() => copyToClipboard(`interface ProfileThemeSettings {\n  colors: {\n    primary: string;\n    background: string;\n    surface: string;\n    text: string;\n    mutedText: string;\n    border: string;\n  };\n  background: {\n    type: 'solid' | 'gradient' | 'aurora' | 'particles';\n    value: string;\n  };\n  typography: {\n    fontFamily: 'Inter' | 'Outfit' | 'Roboto' | 'Space Grotesk';\n    fontSize: 'small' | 'medium' | 'large';\n  };\n  layout: {\n    style: 'centered' | 'compact' | 'modern';\n    alignment: 'center' | 'left' | 'right';\n  };\n  avatar: {\n    shape: 'circle' | 'rounded' | 'square';\n    glow: 'none' | 'glow';\n  };\n}`, 'schema')}
                    className="absolute top-4 right-4 p-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer"
                  >
                    {copiedId === 'schema' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Footer bar */}
      <footer className="border-t border-slate-800/80 py-8 text-center text-xs text-slate-500">
        © 2026 Tapfolio Inc. All rights reserved. Developer portal licensing terms apply.
      </footer>
    </div>
  );
}
