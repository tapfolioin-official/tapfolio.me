import React from 'react';

export default function FooterSection() {
  return (
    <footer className="w-full bg-[#0A0A0A] border-t border-white/10 py-10 flex justify-center text-xs text-gray-500">
      <div className="max-w-[1200px] w-full px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          © 2026 Mohammed Nibrasul Haqq. All rights reserved. • Co-Founder & CTO @ Tapfolio
        </div>
        <div className="flex gap-6">
          <a href="/founders/mohammed-nibrasul-haqq" className="hover:text-blue-400 transition-colors">
            Knowledge Entity Profile
          </a>
          <a href="/founders" className="hover:text-blue-400 transition-colors">
            Tapfolio Founders
          </a>
          <a href="/" className="hover:text-blue-400 transition-colors">
            Tapfolio Home
          </a>
        </div>
      </div>
    </footer>
  );
}
