import React from 'react';

/**
 * Entity-focused Footer component for Founder profile pages.
 * Optimizes Knowledge Graph entity signals and internal linking for founders.
 */
export default function Footer() {
  return (
    <footer className="w-full bg-gray-50 border-t border-gray-100 pt-16 pb-12 flex justify-center mt-20">
      <div className="max-w-[1200px] w-full px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand & Entity Statement */}
          <div className="md:col-span-1 flex flex-col gap-3">
            <h3 className="font-display font-black text-2xl tracking-tight text-gray-950">
              Tap<span className="text-blue-600">folio</span> Leadership
            </h3>
            <p className="text-gray-500 text-xs leading-relaxed">
              Official leadership & founder profile directory for Tapfolio. Structured entity graph for Google Knowledge Graph and search engine indexation.
            </p>
            <div className="text-blue-600 font-semibold text-xs mt-1">
              hello@tapfolio.me
            </div>
          </div>
          
          {/* Founder Profiles */}
          <div>
            <h4 className="font-bold text-gray-900 text-sm mb-3">Founder Entities</h4>
            <ul className="space-y-2.5 text-xs text-gray-600">
              <li>
                <a href="/founders/mohammed-nibrasul-haqq" className="hover:text-blue-600 font-semibold transition-colors">
                  Mohammed Nibrasul Haqq
                </a>
                <span className="block text-[11px] text-gray-400">Co-Founder & CTO</span>
              </li>
              <li className="pt-1">
                <a href="/founders/abhinand" className="hover:text-blue-600 font-semibold transition-colors">
                  Abhinand
                </a>
                <span className="block text-[11px] text-gray-400">Co-Founder & CEO</span>
              </li>
            </ul>
          </div>

          {/* Platform & Organization */}
          <div>
            <h4 className="font-bold text-gray-900 text-sm mb-3">Organization</h4>
            <ul className="space-y-2.5 text-xs text-gray-600">
              <li>
                <a href="/founders" className="hover:text-blue-600 font-medium transition-colors">
                  Founders Directory
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-blue-600 font-medium transition-colors">
                  About Tapfolio
                </a>
              </li>
              <li>
                <a href="/team" className="hover:text-blue-600 font-medium transition-colors">
                  Meet the Team
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-blue-600 font-medium transition-colors">
                  Home Platform
                </a>
              </li>
            </ul>
          </div>

          {/* Official Profiles / Social Graph */}
          <div>
            <h4 className="font-bold text-gray-900 text-sm mb-3">External Profiles</h4>
            <ul className="space-y-2.5 text-xs text-gray-600">
              <li>
                <a 
                  href="https://github.com/nibrasul/Add-1" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-blue-600 transition-colors"
                >
                  GitHub Repository
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal & Copyright */}
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div>
            © 2026 Tapfolio Inc. All rights reserved. • Founder Entity SEO Directory
          </div>
          <div className="flex gap-6">
            <a href="/terms" className="hover:text-gray-900 transition-colors">Terms of Service</a>
            <a href="/privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
