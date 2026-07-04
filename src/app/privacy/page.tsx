import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Tapfolio",
  description: "Tapfolio's privacy policy, detailing data collection, processing, user rights, and account deletion rules.",
};

export default function PrivacyPolicy() {
  return (
    <div className="bg-[#0F0F16] text-white min-h-screen font-sans selection:bg-indigo-500/30">
      {/* Simplified Header */}
      <header className="fixed top-0 left-0 w-full h-20 bg-[#141420]/80 backdrop-blur-md border-b border-white/5 z-50 flex items-center justify-between px-6 md:px-24">
        <Link href="/" className="flex items-center gap-1 cursor-pointer">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
            <path d="M5 14C6.10457 14 7 13.1046 7 12C7 10.8954 6.10457 10 5 10C3.89543 10 3 10.8954 3 12C3 13.1046 3.89543 14 5 14Z" fill="#818CF8"/>
            <path d="M9 8C11.2091 8 13 9.79086 13 12C13 14.2091 11.2091 16 9 16" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M13 4C17.4183 4 21 7.58172 21 12C21 16.4183 17.4183 20 13 20" stroke="#4F46E5" strokeWidth="3" strokeLinecap="round"/>
          </svg>
          <span className="font-bold text-2xl tracking-tight text-white">
            Tap<span className="text-indigo-400">folio</span>
          </span>
        </Link>
        <Link href="/" className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
          Back to Home
        </Link>
      </header>

      {/* Content Area */}
      <main className="max-w-4xl mx-auto px-6 pt-32 pb-24">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-white">
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-400 mb-8">
          Last Updated: July 3, 2026
        </p>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Introduction</h2>
            <p>
              Welcome to Tapfolio ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy describes how your information is collected, used, and safeguarded when you use our mobile application (the "App"), visit our website at <Link href="https://tapfolio.me" className="text-indigo-400 hover:underline">tapfolio.me</Link> (the "Site"), or use any of our NFC-enabled networking products.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Information We Collect</h2>
            <p className="mb-4">
              We collect information that you voluntarily provide to us when you register for an account, set up or modify your profile, or use the interactive features of the App. This includes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account Credentials:</strong> Full name, email address, password, and custom username.</li>
              <li><strong>Google Sign-In:</strong> If you choose to log in using Google OAuth, we receive your email address, name, profile picture, and Google authentication token.</li>
              <li><strong>Profile Information:</strong> Professional tagline, bio, phone number, WhatsApp contact link, location, social media links (GitHub, LinkedIn, Twitter, Instagram, etc.), and avatar image.</li>
              <li><strong>NFC Interaction Data:</strong> We record tap events (who tapped whom, timestamps, and geolocation if enabled) to build your digital connection history.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. How We Use Your Information</h2>
            <p className="mb-4">We use the collected information for various business and user-facing purposes, including to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Create and manage your professional digital profile.</li>
              <li>Facilitate networking connections through physical NFC taps or digital deep links.</li>
              <li>Maintain your connections list, connection logs, and global leaderboard rankings.</li>
              <li>Communicate with you regarding updates, support queries, or system notifications.</li>
              <li>Protect against unauthorized access, fraudulent actions, or terms violations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Cookies and Session Storage</h2>
            <p>
              We use secure cookies and local storage to manage your logged-in session state. The mobile app stores a JWT authentication token securely in your device's preferences. On the Web, we use a secure HttpOnly cookie to keep you signed in. No tracking or marketing cookies are used.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Data Sharing and Third-Party Services</h2>
            <p className="mb-4">
              Your profile details (name, tagline, bio, social links, etc.) are public and accessible to anyone who visits your profile link or scans your physical Tapfolio card. However, you can control the visibility of specific items (like email and phone number) in your profile settings. We do not sell or lease your personal data. We utilize:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Database Services:</strong> To securely host and save your connection records and user profile data.</li>
              <li><strong>Google Cloud:</strong> For managing secure user authentication credentials and SSO.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. User Rights and Choices</h2>
            <p>
              You have the right to access, update, correct, or download your personal data. You can perform all of these actions directly by logging into your profile dashboard inside the App or Web interface.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">7. Account and Data Deletion</h2>
            <p className="mb-4">
              We respect your right to be forgotten. You can delete your account and all associated data permanently at any time.
            </p>
            <div className="bg-[#141420] border border-red-500/20 p-5 rounded-xl space-y-3">
              <p className="font-semibold text-red-400">How to Delete Your Account:</p>
              <ul className="list-decimal pl-6 space-y-1">
                <li>Open the <strong>Tapfolio App</strong> on your device.</li>
                <li>Tap the <strong>More (3 dots)</strong> menu in the upper right corner of the dashboard/navigation shell.</li>
                <li>Select <strong>Delete Account</strong> from the drop-down options.</li>
                <li>Read the warning checklist and type <strong>DELETE</strong> in the text box.</li>
                <li>Tap <strong>Permanently Delete My Account</strong> to complete the process.</li>
              </ul>
              <p className="text-sm text-gray-400">
                Alternatively, you can request account deletion by emailing us at <span className="text-indigo-400">support@tapfolio.me</span>. Once deleted, all profile details, avatars, connection history, and auth records are wiped from our production database immediately and cannot be recovered.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">8. Security of Your Data</h2>
            <p>
              We implement comprehensive security measures including SSL/TLS encryption for all api traffic, secure storage of authentication tokens, API request rate limiting, and password hashing to keep your professional networking data safe.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">9. Contact Information</h2>
            <p>
              If you have any questions or concerns regarding this Privacy Policy or your data, please contact us at:
              <br />
              <strong>Email:</strong> <span className="text-indigo-400">support@tapfolio.me</span>
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#141420] py-12 px-6 text-center text-sm text-gray-500">
        <p className="mb-2">© {new Date().getFullYear()} Tapfolio. All rights reserved.</p>
        <div className="flex justify-center gap-4 text-indigo-400">
          <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
          <span>•</span>
          <Link href="/terms" className="hover:underline">Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
}
