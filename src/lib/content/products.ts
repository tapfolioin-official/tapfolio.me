export interface Product {
  slug: string;
  name: string;
  description: string;
  price: string;
  category: string;
  variants: { name: string; hex: string }[];
  shipping: string;
  features: string[];
  specifications: Record<string, string>;
  faqs: { question: string; answer: string }[];
  reviews: { author: string; rating: number; comment: string; date: string }[];
  rating: number;
  reviewCount: number;
}

export const PRODUCTS: Record<string, Product> = {
  "classic-nfc-card": {
    slug: "classic-nfc-card",
    name: "Tapfolio Classic NFC Card",
    description: "Premium matte-finished recycled polymer card with dynamic NFC capabilities and a custom QR code override. A durable and lightweight standard profile card built for daily networking.",
    price: "$29",
    category: "PVC Cards",
    variants: [
      { name: "Matte Black", hex: "#111" },
      { name: "Arctic White", hex: "#fff" },
      { name: "Ocean Blue", hex: "#1e40af" }
    ],
    shipping: "Ships in 2-3 business days worldwide. Lifetime hardware warranty included.",
    features: [
      "Sturdy 0.8mm recycled plastic base.",
      "Matte fingerprint-resistant coating.",
      "High-speed NTAG213 microchip with universal Android & iOS sync.",
      "Included dynamic QR code backup for older camera devices."
    ],
    specifications: {
      "Material": "Recycled PVC Polymer",
      "Finish": "Matte Anti-Scratch",
      "NFC Chip Type": "NTAG213 (NDEF pre-formatted)",
      "Dimensions": "85.6mm x 54mm (Standard CR80 Credit Card Size)",
      "Lifespan": "100,000+ card reads"
    },
    faqs: [
      { question: "Do I need a custom app to configure this card?", answer: "No custom application is required. Scanning the card for the first time opens a direct profile creation page." },
      { question: "Is the QR code printed on the card dynamic?", answer: "Yes, the QR code maps directly to your permanent Tapfolio routing alias and updates in real-time." }
    ],
    reviews: [
      { author: "Sarah Jenkins", rating: 5, comment: "Fantastic quality, lightweight, and works seamlessly. Highly recommended!", date: "2026-05-12" },
      { author: "Alex Mercer", rating: 4.5, comment: "Excellent matte feel, scan is incredibly fast.", date: "2026-06-02" }
    ],
    rating: 4.8,
    reviewCount: 34
  },
  "premium-nfc-card": {
    slug: "premium-nfc-card",
    name: "Tapfolio Premium NFC Card",
    description: "Laser-engraved card with custom branding options, optimized for agency owners and independent professionals seeking a premium touch.",
    price: "$39",
    category: "PVC Cards",
    variants: [
      { name: "Slate Matte", hex: "#334155" },
      { name: "Crimson Red", hex: "#991b1b" }
    ],
    shipping: "Ships in 3-5 business days. Design preview shared with you within 24 hours.",
    features: [
      "Individually laser-engraved logos and custom texts.",
      "Edge-to-edge full color print layouts available.",
      "Ultra-durable polymer core.",
      "Advanced link permissions and lead collection features."
    ],
    specifications: {
      "Material": "Ultra-Core PVC Polymer",
      "Finish": "Dual-textured laser etch",
      "NFC Chip Type": "NTAG216 (High capacity)",
      "Dimensions": "85.6mm x 54mm"
    },
    faqs: [
      { question: "Can I upload my own vector logo?", answer: "Yes, you can upload PNG or SVG design formats during checkout or preview them in the 3D customizer." }
    ],
    reviews: [
      { author: "Markus V.", rating: 5, comment: "The laser engraving looks professional. Extremely pleased.", date: "2026-04-18" }
    ],
    rating: 4.9,
    reviewCount: 18
  },
  "black-edition": {
    slug: "black-edition",
    name: "Tapfolio Black Edition",
    description: "Anodized matte-black steel card with direct silver laser etching. Projects ultimate authority and corporate excellence.",
    price: "$79",
    category: "Metal Cards",
    variants: [
      { name: "Matte Black Steel", hex: "#0f172a" }
    ],
    shipping: "Ships in 3-5 business days with premium tracker.",
    features: [
      "Anodized high-density steel layout.",
      "Deep precision laser-engraving with silver core contrast.",
      "Special signal window to allow NFC transmission through metal shields.",
      "Exclusive black dashboard themes unlocked on registration."
    ],
    specifications: {
      "Material": "Anodized Surgical Steel",
      "Finish": "Matte Slate-Black",
      "NFC Chip Type": "NTAG213 with signal shielding",
      "Weight": "22 grams"
    },
    faqs: [
      { question: "Does the metal block the NFC wireless transmission?", answer: "No. Our design features an engineered cutout signal window that allows the signal to transmit clearly with a simple tap." }
    ],
    reviews: [
      { author: "Jonathan Thorne", rating: 5, comment: "This card turns heads. Heavy, premium, and works instantly.", date: "2026-03-24" }
    ],
    rating: 5.0,
    reviewCount: 52
  },
  "metal-nfc-card": {
    slug: "metal-nfc-card",
    name: "Tapfolio Metal Card",
    description: "Sleek metallic steel smart card crafted from marine-grade stainless steel. Engineered for innovators who value structural longevity and visual elegance.",
    price: "$89",
    category: "Metal Cards",
    variants: [
      { name: "Brushed Chrome", hex: "#94a3b8" },
      { name: "Rose Gold", hex: "#fda4af" }
    ],
    shipping: "Ships in 5 business days worldwide. Custom gift packaging included.",
    features: [
      "CNC milled stainless steel structure.",
      "Brushed texture that avoids fingerprint marks.",
      "Integrated NTAG213 signal module.",
      "Free dynamic CRM syncing and link tracking."
    ],
    specifications: {
      "Material": "Marine Stainless Steel",
      "Finish": "Brushed Chrome",
      "NFC Chip Type": "NTAG213",
      "Weight": "24 grams"
    },
    faqs: [
      { question: "Is the metal card heavier than plastic?", answer: "Yes, it weighs about 24g, giving it a premium, high-quality heavy hand feel." }
    ],
    reviews: [
      { author: "Diana Prince", rating: 5, comment: "It stands out. People are always wowed when I tap it on their phone.", date: "2026-07-01" }
    ],
    rating: 4.9,
    reviewCount: 41
  },
  "wooden-nfc-card": {
    slug: "wooden-nfc-card",
    name: "Tapfolio Wooden Card",
    description: "Eco-friendly natural wood card carved from sustainable bamboo, sapele, or cherry forests. Laser-engraved with your custom branding.",
    price: "$49",
    category: "Eco Wood",
    variants: [
      { name: "Bamboo Wood", hex: "#d97706" },
      { name: "Dark Walnut", hex: "#451a03" }
    ],
    shipping: "Ships in 3-5 business days. 100% plastic-free carbon-neutral shipping.",
    features: [
      "Natural organic wood textures.",
      "100% biodegradable core structure.",
      "Laser etched logo with rustic carbonized contrast.",
      "NTAG213 microchip embedded safely under natural grains."
    ],
    specifications: {
      "Material": "Sustainable Bamboo / Sapele Wood",
      "Finish": "Organic wax sealer",
      "NFC Chip Type": "NTAG213",
      "Weight": "6 grams"
    },
    faqs: [
      { question: "Is this card waterproof?", answer: "The wood is sealed with water-resistant organic oils. It handles splashes fine, but shouldn't be submerged." }
    ],
    reviews: [
      { author: "Oliver Green", rating: 4.8, comment: "Beautiful texture, aligns perfectly with our company's sustainability values.", date: "2026-05-19" }
    ],
    rating: 4.8,
    reviewCount: 29
  },
  "executive-card": {
    slug: "executive-card",
    name: "Tapfolio Executive Card",
    description: "Precision-milled aerospace grade titanium card for high-level executives and corporate leaders.",
    price: "$149",
    category: "Metal Cards",
    variants: [{ name: "Titanium Grey", hex: "#64748b" }],
    shipping: "Ships in 7 business days with priority courier.",
    features: [
      "Genuine aerospace titanium alloy construction.",
      "Extremely light yet stronger than steel.",
      "Mirror-finish laser printing details.",
      "Direct personal account manager for custom layout configs."
    ],
    specifications: {
      "Material": "Grade 5 Titanium Alloy",
      "NFC Chip Type": "NTAG216",
      "Weight": "12 grams"
    },
    faqs: [
      { question: "What does the titanium setup package include?", answer: "Includes a custom executive box, one-on-one layout setup, and dynamic CRM onboarding." }
    ],
    reviews: [
      { author: "Robert Sterling", rating: 5, comment: "Incredible asset. Truly executive grade.", date: "2026-06-11" }
    ],
    rating: 5.0,
    reviewCount: 15
  },
  "gold-edition": {
    slug: "gold-edition",
    name: "Tapfolio Gold Edition",
    description: "24K Gold-plated luxury metal smart card. Hand-polished and custom-etched for peak executive aesthetics.",
    price: "$199",
    category: "Luxury Metal",
    variants: [{ name: "24K Gold Plated", hex: "#fbbf24" }],
    shipping: "Ships in 5-7 business days with security packaging.",
    features: [
      "Surgical steel core plated in genuine 24K gold.",
      "Hand-polished mirror finish.",
      "Secure custom box storage option.",
      "Unlocked lifetime premium pro portfolio configurations."
    ],
    specifications: {
      "Material": "24K Gold-Plated Stainless Steel",
      "Finish": "Mirror Gold",
      "Weight": "25 grams"
    },
    faqs: [
      { question: "Will the gold plating scratch?", answer: "We apply a special nano-protective coat to prevent minor scratches, but handle with care in metal clips." }
    ],
    reviews: [
      { author: "Vijay Kumar", rating: 5, comment: "Breathtaking card. Represents our luxury brand perfectly.", date: "2026-07-15" }
    ],
    rating: 5.0,
    reviewCount: 9
  },
  "team-card": {
    slug: "team-card",
    name: "Tapfolio Team Card",
    description: "Volume-discounted PVC or wood cards with central dashboard licensing. Perfect for teams of 5 to 50 employees.",
    price: "$19",
    category: "Corporate Team",
    variants: [
      { name: "Custom Corporate Brand colors", hex: "#3b82f6" }
    ],
    shipping: "Ships in 7-10 business days after digital layout approval.",
    features: [
      "Central template standardization across all employee cards.",
      "Company logo front-printed with employee names.",
      "Includes bulk deployment dashboard permissions.",
      "Integrated employee analytics tracker."
    ],
    specifications: {
      "Material": "Recycled PVC or Bamboo",
      "NFC Chip Type": "NTAG213",
      "Minimum Order Quantity": "5 cards"
    },
    faqs: [
      { question: "Can we reassign cards if a team member leaves?", answer: "Yes! The team administrator can map any card to a different employee username instantly." }
    ],
    reviews: [
      { author: "Rachel Ross (HR)", rating: 4.9, comment: "Deploying this to our sales reps simplified contact collection immensely.", date: "2026-06-25" }
    ],
    rating: 4.9,
    reviewCount: 22
  },
  "enterprise-card": {
    slug: "enterprise-card",
    name: "Tapfolio Enterprise Card",
    description: "Fully custom enterprise layout package with active directory syncing, SAML SSO integration, and custom API leads ingestion.",
    price: "Custom",
    category: "Corporate Team",
    variants: [{ name: "Corporate Bespoke Finish", hex: "#1e3a8a" }],
    shipping: "Shipped via priority courier based on team layout approval.",
    features: [
      "Custom shape options and custom materials (hybrid wood/metal).",
      "Dedicated corporate API setup and webhook notifications.",
      "Active Directory sync automation.",
      "Dual-frequency microchip integration support (security access + NFC)."
    ],
    specifications: {
      "Material": "Hybrid options",
      "SSO Support": "SAML, Okta, Azure AD",
      "SLA": "99.9% dynamic lookup uptime guarantee"
    },
    faqs: [
      { question: "Does it support office gate swipe access?", answer: "Yes, we can design dual-frequency cards containing both standard NFC tags and access card microchips." }
    ],
    reviews: [
      { author: "Charles K. (VP IT)", rating: 5, comment: "The integration with Okta SSO was extremely straightforward.", date: "2026-05-30" }
    ],
    rating: 5.0,
    reviewCount: 8
  },
  "student-card": {
    slug: "student-card",
    name: "Tapfolio Student Card",
    description: "Budget-friendly smart card with student verification, perfect for job fairs, student portfolios, and resume sharing.",
    price: "$15",
    category: "PVC Cards",
    variants: [
      { name: "Bright White", hex: "#fff" },
      { name: "Cyan Pop", hex: "#06b6d4" }
    ],
    shipping: "Ships in 2-3 business days. Student identification required for checkout discount.",
    features: [
      "Affordable high-impact matte PVC card.",
      "Custom printed student photo and university registry links.",
      "Built-in portfolio template layout optimization.",
      "Lifetime free student networking profile."
    ],
    specifications: {
      "Material": "Recycled PVC",
      "NFC Chip Type": "NTAG213",
      "Dimensions": "Standard CR80"
    },
    faqs: [
      { question: "How do I verify my student status?", answer: "Complete checkout using your verified .edu email address or upload student identity cards." }
    ],
    reviews: [
      { author: "Emily Watson", rating: 4.7, comment: "Budget friendly and got me tons of compliments at the job fair!", date: "2026-06-18" }
    ],
    rating: 4.7,
    reviewCount: 45
  }
};
