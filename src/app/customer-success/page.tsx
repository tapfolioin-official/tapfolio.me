/**
 * CUSTOMER SUCCESS PAGE — SELF-CONTAINED
 * Showcases customer testimonials, case studies, and success metrics.
 * Same UI and colour design as the homepage.
 */

import React from "react";

export const metadata = {
  title: "Customer Success | Tapfolio",
  description: "Discover how businesses use Tapfolio NFC cards to capture leads, reduce printing costs, and scale professional networking across their teams.",
};

export default function CustomerSuccessPage() {
  const stats = [
    { value: "120+", label: "Qualified Leads Captured", desc: "Average increase per enterprise deployment" },
    { value: "$0", label: "Annual Printing Costs", desc: "Eliminated with digital-first approach" },
    { value: "3x", label: "Faster Follow-ups", desc: "Through instant contact exchange" },
    { value: "98%", label: "Customer Satisfaction", desc: "Based on post-deployment surveys" },
  ];

  const testimonials = [
    {
      quote: "We deployed TapFolio Metal to our entire enterprise sales floor. Within 3 months, our CRM captured 120+ highly qualified leads directly from the NFC tap integration.",
      name: "David Chen",
      title: "VP of Sales, CloudSys",
      metric: "120+ Qualified Leads",
    },
    {
      quote: "Our agency used to spend thousands annually reprinting paper cards every time someone's title changed. Now, we update it globally in the TapFolio dashboard in 2 seconds.",
      name: "Elena Rodriguez",
      title: "Principal, ArchStudio",
      metric: "$0 Printing Costs",
    },
    {
      quote: "TapFolio's analytics dashboard gives us real-time visibility into which team members are making the most connections at events. It's a game-changer for our sales ops.",
      name: "Marcus Wei",
      title: "Director of Operations, NovaTech",
      metric: "3x Faster Follow-ups",
    },
    {
      quote: "The transition from paper to NFC was seamless. Our entire team of 200+ was onboarded in a single afternoon with custom-engraved metal cards.",
      name: "Sarah Mitchell",
      title: "Chief of Staff, Finbridge",
      metric: "200+ Cards Deployed",
    },
  ];

  const useCases = [
    {
      title: "Enterprise Sales Teams",
      desc: "Equip your sales floor with NFC cards that capture leads directly into your CRM pipeline.",
      icon: "📈",
    },
    {
      title: "Real Estate Agencies",
      desc: "Share property listings, virtual tours, and contact info in a single tap at open houses.",
      icon: "🏠",
    },
    {
      title: "Creative Agencies",
      desc: "Showcase your portfolio, team bios, and case studies with dynamic digital profiles.",
      icon: "🎨",
    },
    {
      title: "Conference & Events",
      desc: "Replace badge scanners with instant NFC networking — no apps or downloads required.",
      icon: "🎪",
    },
  ];

  return (
    <div className="bg-white min-h-screen text-gray-900 font-sans selection:bg-blue-100 flex flex-col pt-20">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full h-20 bg-white/80 backdrop-blur-md border-b border-gray-150 z-50 flex items-center justify-between px-6 md:px-[12%] max-w-[1440px] left-1/2 -translate-x-1/2">
        <a href="/" className="flex items-center gap-1 cursor-pointer">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
            <path d="M5 14C6.10457 14 7 13.1046 7 12C7 10.8954 6.10457 10 5 10C3.89543 10 3 10.8954 3 12C3 13.1046 3.89543 14 5 14Z" fill="#60A5FA" />
            <path d="M9 8C11.2091 8 13 9.79086 13 12C13 14.2091 11.2091 16 9 16" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M13 4C17.4183 4 21 7.58172 21 12C21 16.4183 17.4183 20 13 20" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <span className="font-bold text-2xl tracking-tight font-sans" style={{ color: '#020b2d' }}>
            Tap<span style={{ color: '#2563EB' }}>folio</span>
          </span>
        </a>
        <a href="/" className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
          Back to Home
        </a>
      </header>

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-6 py-16 flex flex-col gap-24">
        {/* Hero */}
        <section className="text-center max-w-3xl mx-auto flex flex-col gap-6 mt-8">
          <div className="inline-flex items-center gap-2 mx-auto bg-blue-50 text-blue-700 text-xs font-semibold px-4 py-2 rounded-full border border-blue-100/50">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Trusted by teams worldwide
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-tight text-gray-950 leading-[1.1]">
            Customer{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Success
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto">
            See how businesses around the world are transforming their networking with Tapfolio&apos;s NFC-powered digital cards.
          </p>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div key={i} className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-2xl p-6 text-center hover:shadow-md transition-all">
              <div className="text-3xl font-black text-gray-900">{s.value}</div>
              <div className="text-sm font-bold text-blue-600 mt-1">{s.label}</div>
              <div className="text-xs text-gray-400 mt-1">{s.desc}</div>
            </div>
          ))}
        </section>

        {/* Testimonials */}
        <section className="flex flex-col gap-12">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Testimonials</span>
            <h2 className="text-4xl font-bold text-gray-950 mt-2">What our customers say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group hover:border-blue-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-2 h-full bg-blue-600 transform translate-x-full group-hover:translate-x-0 transition-transform" />
                <div className="mb-4">
                  <span className="inline-block bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                    {t.metric}
                  </span>
                </div>
                <p className="text-gray-600 text-base leading-relaxed italic mb-6">
                  &quot;{t.quote}&quot;
                </p>
                <div>
                  <span className="font-bold text-gray-900">{t.name}</span>
                  <span className="block text-xs text-gray-400 mt-0.5">{t.title}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Use Cases */}
        <section className="flex flex-col gap-12">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Use Cases</span>
            <h2 className="text-4xl font-bold text-gray-950 mt-2">Built for every industry</h2>
            <p className="text-gray-500 max-w-xl mx-auto mt-2">
              From enterprise sales teams to creative agencies, Tapfolio adapts to your workflow.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {useCases.map((u, i) => (
              <div
                key={i}
                className="group border border-gray-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 bg-white hover:-translate-y-1 hover:border-blue-200"
              >
                <div className="text-4xl mb-4">{u.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{u.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{u.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gray-950 text-white rounded-3xl p-12 md:p-16 text-center flex flex-col items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-bold">Ready to transform your networking?</h2>
            <p className="text-gray-400 max-w-md mx-auto mt-2">
              Join thousands of professionals who have already made the switch to Tapfolio.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <a
                href="/#order"
                className="inline-flex items-center justify-center px-8 h-[50px] bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-all shadow-md"
              >
                Order Now
              </a>
              <a
                href="/about"
                className="inline-flex items-center justify-center px-8 h-[50px] border border-white/20 text-white font-semibold rounded-full hover:bg-white/10 transition-all"
              >
                Learn More
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-gray-100 pt-20 pb-10 flex justify-center">
        <div className="max-w-[1200px] w-full px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1">
              <h3 className="font-display font-black text-2xl tracking-tighter text-gray-950 mb-6">TapFolio.</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                The smartest business card on the planet. Eco-friendly, always updated, and designed for modern professionals.
              </p>
              <div className="text-gray-900 font-medium text-sm">hello@tapfolio.me</div>
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
                <li><a href="/docs" className="hover:text-blue-600 transition-colors font-semibold text-blue-600">Developer API Docs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li><a href="/about" className="hover:text-blue-600 transition-colors">About Us</a></li>
                <li><a href="/customer-success" className="hover:text-blue-600 transition-colors">Customer Success</a></li>
                <li><a href="/privacy" className="hover:text-blue-600 transition-colors">Privacy & Security</a></li>
                <li><a href="/contact" className="hover:text-blue-600 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
            <div>© 2026 TapFolio Inc. All rights reserved.</div>
            <div className="flex gap-6">
              <a href="/terms" className="hover:text-gray-900 transition-colors">Terms of Service</a>
              <a href="/privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
              <a href="/privacy" className="hover:text-gray-900 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
