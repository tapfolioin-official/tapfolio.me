"use client";

import React, { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import Navbar from "@/components/navigation/Navbar";
import FooterSection from "@/components/sections/FooterSection";
import { 
  ShoppingBag, 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  Upload, 
  Check, 
  Send,
  RotateCw,
  Eye,
  Radio,
  QrCode,
  Layers,
  ArrowRight
} from "lucide-react";

// Optional WebGL Canvas
const Configurator3DCanvas = dynamic(
  () => import("@/components/sections/Configurator3DCanvas"),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-gray-950 text-gray-400">
        <span className="text-xs font-bold animate-pulse">Loading 3D Canvas...</span>
      </div>
    )
  }
);

interface CardTier {
  id: string;
  name: string;
  material: "pvc" | "metal";
  finish: "glossy" | "matte" | "brushed";
  priceNumber: number;
  priceFormatted: string;
  badge: string;
  description: string;
  features: string[];
}

const CARD_TIERS: CardTier[] = [
  {
    id: "pvc-glossy",
    name: "PVC Glossy Card",
    material: "pvc",
    finish: "glossy",
    priceNumber: 1000,
    priceFormatted: "₹1,000",
    badge: "Entry Edition",
    description: "High-gloss resilient polymer with dynamic NFC chip.",
    features: ["Recycled polymer core", "High-gloss protective laminate", "NTAG213 microchip", "Dynamic QR fallback"]
  },
  {
    id: "pvc-matte",
    name: "PVC Matte Card",
    material: "pvc",
    finish: "matte",
    priceNumber: 1500,
    priceFormatted: "₹1,500",
    badge: "Most Popular",
    description: "Matte-finished anti-scratch polymer with velvet touch.",
    features: ["Soft matte anti-glare finish", "Ultra-durable 0.8mm core", "NTAG216 high capacity chip", "Lifetime dynamic profile"]
  },
  {
    id: "metal",
    name: "Tactile Metal Card",
    material: "metal",
    finish: "brushed",
    priceNumber: 2500,
    priceFormatted: "₹2,500",
    badge: "Executive Edition",
    description: "Brushed military-grade steel with silver core laser etching.",
    features: ["Precision CNC stainless steel", "Engineered NFC signal window", "Laser engraved branding", "Heavy 24g luxury weight"]
  },
  {
    id: "custom",
    name: "Custom Enterprise",
    material: "metal",
    finish: "matte",
    priceNumber: 2500,
    priceFormatted: "Custom / ₹2,500",
    badge: "Team Deployments",
    description: "Full bespoke corporate design, API sync, and centralized admin.",
    features: ["Custom bespoke shapes & etching", "Team admin & CRM auto-sync", "Dedicated account onboarding", "Volume corporate discounts"]
  }
];

const COLOR_PRESETS = [
  { name: "Obsidian Black", value: "#111111", isDark: true },
  { name: "Pure Alabaster", value: "#f8f9fa", isDark: false },
  { name: "Royal Cobalt", value: "#1e3a8a", isDark: true },
  { name: "Forest Emerald", value: "#064e3b", isDark: true },
  { name: "Aureum Gold", value: "#b45309", isDark: true },
];

function OrderContent() {
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialCardParam = searchParams.get("card") || searchParams.get("product") || "pvc-matte";
  const initialTier = CARD_TIERS.find(t => t.id === initialCardParam) || CARD_TIERS[1];

  const [selectedTier, setSelectedTier] = useState<CardTier>(initialTier);
  const [quantity, setQuantity] = useState(1);
  const [cardSide, setCardSide] = useState<"front" | "back">("front");
  const [viewMode, setViewMode] = useState<"realistic" | "3d">("realistic");

  // Card customization state
  const [config, setConfig] = useState({
    name: "Alex Sterling",
    role: "Creative Director",
    company: "TAPFOLIO INC.",
    color: "#111111",
    material: initialTier.material,
    finish: initialTier.finish,
    logoUrl: null as string | null,
    email: "alex@tapfolio.me",
    phone: "+91 98765 43210",
    website: "tapfolio.me/alex",
    linkedin: "in/alexsterling",
    x: "alex_design",
    instagram: "alex.creates",
    youtube: "@alexsterling",
    whatsapp: "+919876543210",
    meetingLink: "calendly.com/alex",
    profileTheme: "dark" as "light" | "dark",
    qrPosition: "back" as "front" | "back" | "hidden",
  });

  // Shipping & Contact form
  const [shipping, setShipping] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    notes: ""
  });

  const [activeStep, setActiveStep] = useState<"customize" | "shipping" | "confirm">("customize");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState("");

  const selectTier = (tier: CardTier) => {
    setSelectedTier(tier);
    setConfig(prev => ({
      ...prev,
      material: tier.material,
      finish: tier.finish
    }));
  };

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShipping(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setConfig(prev => ({ ...prev, logoUrl: event.target!.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const totalPrice = selectedTier.priceNumber * quantity;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const generatedId = `TF-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(generatedId);

    setTimeout(() => {
      setIsSubmitting(false);
      setOrderComplete(true);
      setActiveStep("confirm");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 800);
  };

  const handleWhatsAppOrder = () => {
    const message = `*New TapFolio Card Order Request*%0A%0A` +
      `*Product:* ${selectedTier.name} (${selectedTier.priceFormatted})%0A` +
      `*Quantity:* ${quantity}%0A` +
      `*Total:* ₹${totalPrice.toLocaleString()}%0A%0A` +
      `*Card Details:*%0A` +
      `- Name on Card: ${config.name}%0A` +
      `- Role/Designation: ${config.role}%0A` +
      `- Company: ${config.company}%0A` +
      `- Material: ${config.material.toUpperCase()}%0A` +
      `- Surface Finish: ${config.finish}%0A` +
      `- Shell Color: ${config.color}%0A` +
      `- QR Position: ${config.qrPosition}%0A%0A` +
      `*Customer Information:*%0A` +
      `- Contact Name: ${shipping.customerName || config.name}%0A` +
      `- Phone: ${shipping.phone || config.phone}%0A` +
      `- Email: ${shipping.email || config.email}%0A` +
      `- Delivery Address: ${shipping.address || "Pending"}, ${shipping.city || ""}, ${shipping.state || ""} ${shipping.pincode || ""}%0A` +
      `- Notes: ${shipping.notes || "None"}`;

    window.open(`https://wa.me/919876543210?text=${message}`, "_blank");
  };

  const isLightShell = config.color === "#ffffff" || config.color === "#f8f9fa";
  const textColorClass = isLightShell ? "text-gray-950" : "text-white";
  const subtextColorClass = isLightShell ? "text-gray-600" : "text-gray-300";

  return (
    <div className="bg-white min-h-screen font-sans text-gray-900 selection:bg-blue-200 flex flex-col">
      <Navbar />

      <main className="flex-1 w-full pt-28 pb-20">
        {/* Header Breadcrumb & Title */}
        <section className="w-full bg-gradient-to-b from-gray-50/80 via-gray-50/40 to-white py-12 border-b border-gray-100">
          <div className="max-w-[1300px] mx-auto px-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 mb-4 uppercase tracking-wider">
              <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
              <span>/</span>
              <Link href="/#products" className="hover:text-blue-600 transition-colors">Products</Link>
              <span>/</span>
              <span className="text-gray-900 font-bold">Order Custom Card</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-100 mb-4">
                  <Sparkles size={14} /> Official TapFolio Hardware
                </span>
                <h1 className="font-display font-bold text-4xl md:text-5xl text-gray-950 tracking-tight">
                  Order Your Custom Card
                </h1>
                <p className="text-gray-500 text-base md:text-lg mt-2 max-w-xl">
                  Choose your card edition, personalize details with real-time live preview, and get lifetime profile hosting.
                </p>
              </div>

              {/* Step Navigation Pills */}
              <div className="inline-flex items-center gap-1.5 bg-gray-100/90 p-1.5 rounded-2xl text-xs font-bold shrink-0 self-start md:self-auto border border-gray-200/60">
                <button
                  type="button"
                  onClick={() => setActiveStep("customize")}
                  className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                    activeStep === "customize" 
                      ? "bg-white text-gray-950 shadow-sm ring-1 ring-gray-200" 
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  1. Customize Card
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep("shipping")}
                  className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                    activeStep === "shipping" 
                      ? "bg-white text-gray-950 shadow-sm ring-1 ring-gray-200" 
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  2. Shipping & Order
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Main Order Workspace */}
        <div className="max-w-[1300px] mx-auto px-6 py-12">
          {orderComplete ? (
            /* Order Success State */
            <div className="max-w-2xl mx-auto bg-white border border-gray-100 rounded-3xl p-8 md:p-12 shadow-xl text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-green-50 text-green-600 flex items-center justify-center mb-6">
                <CheckCircle2 size={36} />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-green-600 mb-2">Order Confirmed</span>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-gray-950 mb-3">
                Thank You for Your Order!
              </h2>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6 max-w-md">
                Your custom <strong>{selectedTier.name}</strong> has been received. Order reference: <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">{orderId}</span>
              </p>

              <div className="w-full bg-gray-50 rounded-2xl p-6 text-left space-y-3 mb-8 border border-gray-100 text-sm">
                <div className="flex justify-between border-b border-gray-200/60 pb-2">
                  <span className="text-gray-500">Card Edition</span>
                  <span className="font-bold text-gray-900">{selectedTier.name} ({quantity}x)</span>
                </div>
                <div className="flex justify-between border-b border-gray-200/60 pb-2">
                  <span className="text-gray-500">Name on Card</span>
                  <span className="font-bold text-gray-900">{config.name}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200/60 pb-2">
                  <span className="text-gray-500">Role & Company</span>
                  <span className="font-bold text-gray-900">{config.role} @ {config.company}</span>
                </div>
                <div className="flex justify-between pt-1 text-base">
                  <span className="font-bold text-gray-900">Total Paid / Due</span>
                  <span className="font-extrabold text-blue-600">₹{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                <button
                  type="button"
                  onClick={handleWhatsAppOrder}
                  className="bg-green-600 hover:bg-green-500 text-white font-bold py-3.5 px-6 rounded-full flex items-center justify-center gap-2 text-sm shadow-md transition-all cursor-pointer"
                >
                  <Send size={16} /> Confirm on WhatsApp
                </button>
                <Link
                  href="/"
                  className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-3.5 px-6 rounded-full text-sm text-center transition-all"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                 {/* Left Column: Live 3D Card Visualizer (Sticky on Desktop) */}
              <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-28">
                <div className="bg-gray-50/80 border border-gray-200/90 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between relative overflow-hidden">
                  
                  {/* Top Bar Label & Price */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="bg-white border border-gray-200 px-3.5 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm">
                      Live 3D Customizer
                    </span>
                    <span className="font-extrabold text-blue-600 text-sm tracking-wide">
                      {selectedTier.priceFormatted}
                    </span>
                  </div>

                  {/* 3D Canvas Visualizer */}
                  <div className="w-full h-[360px] sm:h-[420px] rounded-2xl bg-white/60 border border-gray-200/60 flex items-center justify-center relative overflow-hidden shadow-inner">
                    <div className="absolute inset-0">
                      <Configurator3DCanvas config={config} />
                    </div>
                  </div>

                  {/* Live Details Summary Bar */}
                  <div className="mt-4 pt-4 border-t border-gray-200/80 flex items-center justify-between text-xs text-gray-600">
                    <div>
                      <p className="font-bold text-gray-950 text-sm">{config.name || "Alex Sterling"}</p>
                      <p className="text-gray-500 text-xs">{config.role || "CEO & Founder"} • {config.company || "TAPFOLIO"}</p>
                    </div>
                    <div className="text-right">
                      <span className="uppercase text-[10px] font-mono font-bold tracking-wider bg-gray-200/70 px-2.5 py-1 rounded-md text-gray-800">
                        {config.material} • {config.finish}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 space-y-3 text-xs text-gray-600">
                  <div className="flex items-center gap-3">
                    <Truck size={18} className="text-blue-600 shrink-0" />
                    <span><strong>Free Express Shipping</strong> anywhere in India. Delivered in 3-5 business days.</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={18} className="text-blue-600 shrink-0" />
                    <span><strong>Lifetime Profile Hosting</strong> included with every physical card order.</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Card Selector, Customizer, and Shipping Form */}
              <div className="lg:col-span-7 flex flex-col gap-8">
                
                {/* Step 1: Select Card Edition */}
                <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm">
                  <span className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2 block">
                    Step 1 of 2
                  </span>
                  <h2 className="font-display font-bold text-2xl md:text-3xl text-gray-950 mb-6">
                    Choose Your Hardware Tier
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {CARD_TIERS.map(tier => {
                      const isSelected = selectedTier.id === tier.id;
                      return (
                        <div
                          key={tier.id}
                          onClick={() => selectTier(tier)}
                          className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? "border-blue-600 bg-blue-50/40 shadow-md ring-2 ring-blue-600/20"
                              : "border-gray-100 bg-gray-50/50 hover:border-gray-200 hover:bg-white"
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                isSelected ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
                              }`}>
                                {tier.badge}
                              </span>
                              <span className="font-extrabold text-base text-gray-950">
                                {tier.priceFormatted}
                              </span>
                            </div>
                            <h3 className="font-bold text-lg text-gray-900 mb-1">{tier.name}</h3>
                            <p className="text-xs text-gray-500 leading-relaxed mb-4">
                              {tier.description}
                            </p>
                          </div>

                          <ul className="space-y-1.5 text-xs text-gray-600 border-t border-gray-200/60 pt-3">
                            {tier.features.slice(0, 2).map((feat, idx) => (
                              <li key={idx} className="flex items-center gap-1.5">
                                <CheckCircle2 size={12} className="text-blue-600 shrink-0" />
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Step 2: Personalize Card Details */}
                <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2 block">
                      Card Customization
                    </span>
                    <h2 className="font-display font-bold text-2xl text-gray-950">
                      Personalize Your Card Details
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                      These details will be laser-engraved/printed directly onto your physical smart card.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase text-gray-700 block mb-1.5">Card Holder Name</label>
                      <input
                        type="text"
                        name="name"
                        value={config.name}
                        onChange={handleConfigChange}
                        placeholder="Alex Sterling"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase text-gray-700 block mb-1.5">Designation / Role</label>
                      <input
                        type="text"
                        name="role"
                        value={config.role}
                        onChange={handleConfigChange}
                        placeholder="Creative Director"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase text-gray-700 block mb-1.5">Company Name</label>
                      <input
                        type="text"
                        name="company"
                        value={config.company}
                        onChange={handleConfigChange}
                        placeholder="TAPFOLIO INC."
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase text-gray-700 block mb-1.5">QR Position</label>
                      <select
                        value={config.qrPosition}
                        onChange={(e) => setConfig(prev => ({ ...prev, qrPosition: e.target.value as any }))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm bg-white"
                      >
                        <option value="back">Back of Card (Recommended)</option>
                        <option value="front">Front of Card</option>
                        <option value="hidden">NFC Only (Hidden QR)</option>
                      </select>
                    </div>
                  </div>

                  {/* Color Swatches */}
                  <div>
                    <label className="text-xs font-bold uppercase text-gray-700 block mb-2">Base Shell Color</label>
                    <div className="flex items-center gap-3">
                      {COLOR_PRESETS.map((preset) => {
                        const isSelected = config.color === preset.value;
                        return (
                          <button
                            key={preset.value}
                            type="button"
                            onClick={() => setConfig(prev => ({ ...prev, color: preset.value }))}
                            className={`w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer ${
                              isSelected ? "ring-2 ring-blue-600 scale-110 border-white shadow-md" : "border-gray-200"
                            }`}
                            style={{ backgroundColor: preset.value }}
                            title={preset.name}
                          >
                            {isSelected && (
                              <Check size={14} color={preset.value === "#ffffff" || preset.value === "#f8f9fa" ? "#000" : "#fff"} />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Logo Upload */}
                  <div>
                    <label className="text-xs font-bold uppercase text-gray-700 block mb-1.5">Custom Logo (Optional)</label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleLogoUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-200 hover:border-blue-500 rounded-2xl p-4 flex items-center justify-center gap-3 cursor-pointer transition-colors bg-gray-50/50"
                    >
                      {config.logoUrl ? (
                        <div className="flex items-center gap-3">
                          <img src={config.logoUrl} alt="Logo preview" className="w-10 h-10 object-contain rounded-lg border bg-white p-1" />
                          <span className="text-xs font-bold text-blue-600">Logo loaded • Click to replace</span>
                        </div>
                      ) : (
                        <>
                          <Upload size={18} className="text-gray-400" />
                          <span className="text-xs font-semibold text-gray-600">Click to upload SVG or PNG logo</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Step 3: Shipping & Checkout Form */}
                <form onSubmit={handlePlaceOrder} className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2 block">
                      Delivery & Shipping
                    </span>
                    <h2 className="font-display font-bold text-2xl text-gray-950">
                      Shipping Address & Quantity
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase text-gray-700 block mb-1.5">Full Name *</label>
                      <input
                        type="text"
                        name="customerName"
                        required
                        value={shipping.customerName}
                        onChange={handleShippingChange}
                        placeholder="Your full delivery name"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase text-gray-700 block mb-1.5">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={shipping.phone}
                        onChange={handleShippingChange}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold uppercase text-gray-700 block mb-1.5">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={shipping.email}
                        onChange={handleShippingChange}
                        placeholder="yourname@gmail.com"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold uppercase text-gray-700 block mb-1.5">Street Delivery Address *</label>
                      <textarea
                        name="address"
                        required
                        rows={2}
                        value={shipping.address}
                        onChange={handleShippingChange}
                        placeholder="Flat / Building, Street, Area / Landmark"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm resize-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase text-gray-700 block mb-1.5">City *</label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={shipping.city}
                        onChange={handleShippingChange}
                        placeholder="e.g. Mumbai, Bengaluru, Delhi"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-bold uppercase text-gray-700 block mb-1.5">State *</label>
                        <input
                          type="text"
                          name="state"
                          required
                          value={shipping.state}
                          onChange={handleShippingChange}
                          placeholder="State"
                          className="w-full px-3 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase text-gray-700 block mb-1.5">PIN Code *</label>
                        <input
                          type="text"
                          name="pincode"
                          required
                          value={shipping.pincode}
                          onChange={handleShippingChange}
                          placeholder="PIN"
                          className="w-full px-3 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Summary Box */}
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase text-gray-500 block mb-1">Quantity</span>
                      <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-1">
                        <button
                          type="button"
                          onClick={() => setQuantity(q => Math.max(1, q - 1))}
                          className="w-7 h-7 rounded bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 flex items-center justify-center cursor-pointer"
                        >
                          -
                        </button>
                        <span className="font-bold text-sm px-2">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => setQuantity(q => q + 1)}
                          className="w-7 h-7 rounded bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 flex items-center justify-center cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-gray-500 block">Total Due</span>
                      <span className="font-display font-black text-2xl text-blue-600">
                        ₹{totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-full flex items-center justify-center gap-3 transition-all text-base shadow-lg shadow-blue-600/20 cursor-pointer disabled:opacity-50"
                    >
                      <ShoppingBag size={20} />
                      {isSubmitting ? "Processing Order..." : `Place Order — ₹${totalPrice.toLocaleString()}`}
                    </button>

                    <button
                      type="button"
                      onClick={handleWhatsAppOrder}
                      className="bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-6 rounded-full flex items-center justify-center gap-2 text-sm transition-all shadow-md cursor-pointer"
                    >
                      <Send size={16} /> Order on WhatsApp
                    </button>
                  </div>

                  <p className="text-center text-xs text-gray-400">
                    Includes Free All-India Shipping, NDEF Chip pre-formatting, and Lifetime Dynamic Profile hosting.
                  </p>
                </form>

              </div>

            </div>
          )}
        </div>
      </main>

      <FooterSection />
    </div>
  );
}

export default function OrderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    }>
      <OrderContent />
    </Suspense>
  );
}
