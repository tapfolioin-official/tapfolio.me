"use client";

import React from "react";

/**
 * Clean Navbar component for Founder profile & directory pages.
 * Streamlined navigation focused on Tapfolio brand & founder navigation.
 */
export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full h-20 bg-white/80 backdrop-blur-md border-b border-gray-150 z-50 flex items-center justify-between px-6 md:px-[12%] max-w-[1440px] left-1/2 -translate-x-1/2">
      {/* Brand Logo */}
      <a 
        href="/"
        className="flex items-center gap-1 cursor-pointer"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
          <path d="M5 14C6.10457 14 7 13.1046 7 12C7 10.8954 6.10457 10 5 10C3.89543 10 3 10.8954 3 12C3 13.1046 3.89543 14 5 14Z" fill="#60A5FA"/>
          <path d="M9 8C11.2091 8 13 9.79086 13 12C13 14.2091 11.2091 16 9 16" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M13 4C17.4183 4 21 7.58172 21 12C21 16.4183 17.4183 20 13 20" stroke="#2563EB" strokeWidth="3" strokeLinecap="round"/>
        </svg>
        <span className="font-bold text-2xl tracking-tight font-sans" style={{ color: '#020b2d' }}>
          Tap<span style={{ color: '#2563EB' }}>folio</span>
        </span>
      </a>

      {/* Streamlined Founders Navigation */}
      <div className="flex items-center gap-6 text-sm font-medium">
        <a 
          href="/founders" 
          className="text-gray-600 hover:text-blue-600 transition-colors"
        >
          Founders
        </a>
        <a 
          href="/about" 
          className="text-gray-600 hover:text-blue-600 transition-colors"
        >
          About
        </a>
        <a 
          href="/" 
          className="text-blue-600 font-semibold hover:text-blue-800 transition-colors"
        >
          Back to Home →
        </a>
      </div>
    </nav>
  );
}
