"use client";

import React from "react";

/**
 * Clean Navbar component for Founder profile & directory pages.
 * Responsive, aligned layout for desktop & mobile devices.
 */
export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full h-20 bg-white/90 backdrop-blur-md border-b border-gray-150 z-50 flex items-center justify-between px-4 sm:px-6 md:px-[12%] max-w-[1440px] left-1/2 -translate-x-1/2">
      {/* Brand Logo */}
      <a 
        href="/"
        className="flex items-center gap-1 cursor-pointer flex-shrink-0"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-0.5">
          <path d="M5 14C6.10457 14 7 13.1046 7 12C7 10.8954 6.10457 10 5 10C3.89543 10 3 10.8954 3 12C3 13.1046 3.89543 14 5 14Z" fill="#60A5FA"/>
          <path d="M9 8C11.2091 8 13 9.79086 13 12C13 14.2091 11.2091 16 9 16" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M13 4C17.4183 4 21 7.58172 21 12C21 16.4183 17.4183 20 13 20" stroke="#2563EB" strokeWidth="3" strokeLinecap="round"/>
        </svg>
        <span className="font-bold text-xl sm:text-2xl tracking-tight font-sans" style={{ color: '#020b2d' }}>
          Tap<span style={{ color: '#2563EB' }}>folio</span>
        </span>
      </a>

      {/* Responsive Navigation Links */}
      <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm font-medium">
        <a 
          href="/founders" 
          className="text-gray-600 hover:text-blue-600 transition-colors hidden xs:inline-block"
        >
          Founders
        </a>
        <a 
          href="/about" 
          className="text-gray-600 hover:text-blue-600 transition-colors hidden sm:inline-block"
        >
          About
        </a>
        <a 
          href="/" 
          className="bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-blue-100 transition-all text-xs sm:text-sm whitespace-nowrap"
        >
          Home →
        </a>
      </div>
    </nav>
  );
}
