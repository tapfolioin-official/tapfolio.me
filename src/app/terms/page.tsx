import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Terms of Service | Tapfolio",
  description: "Tapfolio's Terms of Service governing usage of the mobile application, website, and NFC networking products.",
};

export default function TermsOfService() {
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
          Terms of Service
        </h1>
        <p className="text-sm text-gray-400 mb-8">
          Last Updated: July 3, 2026
        </p>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Agreement to Terms</h2>
            <p>
              By accessing our website at <Link href="https://tapfolio.me" className="text-indigo-400 hover:underline">tapfolio.me</Link>, downloading or using the Tapfolio mobile application, or purchasing/using our NFC-enabled networking products, you agree to be bound by these Terms of Service. If you do not agree to these terms, you must not access or use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. User Account Registration</h2>
            <p>
              To use most features of the App, you must register for an account. You agree to provide accurate, complete, and current information. You are solely responsible for safeguarding the credentials of your account and for any activities or actions under your account. We reserve the right to suspend or terminate accounts that provide misleading or false info.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Acceptable Use and Guidelines</h2>
            <p className="mb-4">
              Tapfolio is designed for professional networking and digital business card interactions. You agree not to use the Service to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Upload, display, or share any profile content that is illegal, offensive, harassing, pornographic, or hate-oriented.</li>
              <li>Impersonate any individual, organization, or professional entity.</li>
              <li>Spam, harass, or repeatedly send unauthorized connection requests to other users.</li>
              <li>Reverse engineer, hack, or exploit vulnerability in our mobile app, API, or site endpoints.</li>
              <li>Attempt unauthorized access to other user accounts.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. NFC Card Products and Hardware</h2>
            <p>
              Tapfolio sells physical NFC-enabled networking cards. The physical cards are intended to trigger deep links (`https://tapfolio.me/connect/USERNAME` or `https://tapfolio.me/USERNAME`) on NFC-enabled smartphones. While we strive to ensure 100% compatibility across Android and iOS devices, physical parameters of target mobile devices (such as cases, coil placements, and software configurations) may affect read capabilities.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Intellectual Property</h2>
            <p>
              All content on the Service, including logo, branding design, app code, visual elements, graphics, site structure, and backend services, are the intellectual property of Tapfolio. You are granted a limited, non-exclusive, non-transferable license to use the app and site solely for your personal/professional digital business card usage.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Premium Memberships and Billing</h2>
            <p>
              We offer Tapfolio Premium upgrades which grant benefits such as advanced checklist points, global leaderboard participation, and additional profile customisations. All payments are securely processed by our third-party merchant partners. Premium purchases are non-refundable unless explicitly required by local consumer protection laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">7. Account Termination and Deletion</h2>
            <p>
              We reserve the right, without notice or liability, to suspend or terminate your account if you violate these Terms of Service. You may terminate your agreement with us at any time by deleting your account through the Settings page inside the mobile app or request deletion at <span className="text-indigo-400">support@tapfolio.me</span>. Refer to our Privacy Policy for details on data wiping.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">8. Limitation of Liability</h2>
            <p>
              In no event shall Tapfolio, its directors, employees, or partners be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, goodwill, or other intangible losses arising out of your access or inability to use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">9. Governing Law and Disputes</h2>
            <p>
              These Terms shall be governed and construed in accordance with local laws, without regard to conflict of law provisions. Any dispute arising under these Terms shall be resolved in arbitration courts of our chosen jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">10. Contact Us</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us:
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
