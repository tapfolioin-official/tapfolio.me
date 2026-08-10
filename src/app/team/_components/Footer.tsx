import React from 'react';

/**
 * Self-contained Footer component.
 * Links point to /about, /founders, /team (independent routes).
 */
export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-100 pt-20 pb-10 flex justify-center">
      <div className="max-w-[1200px] w-full px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <h3 className="font-display font-black text-2xl tracking-tighter text-gray-950 mb-6">TapFolio.</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              The smartest business card on the planet. Eco-friendly, always updated, and designed for modern professionals.
            </p>
            <div className="text-gray-900 font-medium text-sm">
              tapfolio.in@gmail.com
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Products</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><a href="/#products" className="hover:text-blue-600 transition-colors">TapFolio PVC</a></li>
              <li><a href="/#products" className="hover:text-blue-600 transition-colors">TapFolio Metal</a></li>
              <li><a href="/#products" className="hover:text-blue-600 transition-colors">TapFolio Team</a></li>
              <li><a href="/#order" className="hover:text-blue-600 transition-colors">Custom Enterprise</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-4">Software</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><a href="/#technology" className="hover:text-blue-600 transition-colors">Profile Builder</a></li>
              <li><a href="/#technology" className="hover:text-blue-600 transition-colors">Analytics Dashboard</a></li>
              <li><a href="/#technology" className="hover:text-blue-600 transition-colors">Lead Capture</a></li>
              <li><a href="/blog" className="hover:text-blue-600 transition-colors font-semibold text-blue-600">Blog & Articles</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><a href="/about" className="hover:text-blue-600 transition-colors font-medium">About Us</a></li>
              <li><a href="/founders" className="hover:text-blue-600 transition-colors font-medium">Founders</a></li>
              <li><a href="/team" className="hover:text-blue-600 transition-colors font-medium">Team</a></li>
              <li><a href="/#order" className="hover:text-blue-600 transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div>
            © 2026 TapFolio Inc. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="/terms" className="hover:text-gray-900 transition-colors">Terms of Service</a>
            <a href="/privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
            <a href="/privacy" className="hover:text-gray-900 transition-colors">Cookie Policy</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
