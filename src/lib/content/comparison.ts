export interface Comparison {
  slug: string;
  title: string;
  competitorName: string;
  intro: string;
  matrix: { criteria: string; tapfolio: string; competitor: string }[];
  keyDifferentiators: string[];
  faqs: { question: string; answer: string }[];
  summary: string;
  pros: string[];
  cons: string[];
  alternatives: string[];
}

export const COMPARISONS: Record<string, Comparison> = {
  "nfc-vs-qr": {
    slug: "nfc-vs-qr",
    title: "NFC Cards vs QR Codes",
    competitorName: "QR Code Cards",
    intro: "Evaluating Near Field Communication (NFC) vs Quick Response (QR) codes. Understand how physical smart chips offer higher engagement speed while QR codes provide universal camera overrides.",
    matrix: [
      { criteria: "Tap Speed", tapfolio: "Instant wireless transmission (under 1 sec)", competitor: "Requires opening camera and centering scanner" },
      { criteria: "Visual Layout", tapfolio: "Clean surfaces (no graphics needed)", competitor: "Requires printed pixel block patterns" },
      { criteria: "Fallback Support", tapfolio: "Includes QR prints on back", competitor: "No NFC option" }
    ],
    keyDifferentiators: [
      "NFC provides a seamless, application-free contactless exchange.",
      "QR codes serve as a universal backup tool for older devices.",
      "Tapfolio cards incorporate both options for 100% connectivity."
    ],
    faqs: [
      { question: "Do I need a QR code if I have NFC?", answer: "Yes, we recommend printing a QR code on the back of your NFC card to serve as a backup for older camera-only devices." }
    ],
    summary: "NFC offers superior speed and design aesthetics, while QR codes guarantee universal camera compatibility. Tapfolio uses both.",
    pros: ["Instant contactless scans", "Sleek card styles", "High engagement speed"],
    cons: ["Older smartphones lack NFC receivers"],
    alternatives: ["Paper visiting cards", "Verbal links sharing"]
  },
  "paper-vs-nfc": {
    slug: "paper-vs-nfc",
    title: "Paper Cards vs NFC Business Cards",
    competitorName: "Traditional Paper Cards",
    intro: "An analytical breakdown comparing traditional paper cards vs reusable NFC smart business cards.",
    matrix: [
      { criteria: "Update Ability", tapfolio: "Instant cloud updates anytime", competitor: "Requires complete reprinting" },
      { criteria: "Eco Sustainability", tapfolio: "One card replaced thousands of prints", competitor: "Adds to industrial forestry waste" },
      { criteria: "Analytics Tracking", tapfolio: "Detailed link click tracking charts", competitor: "Zero tracking possible" }
    ],
    keyDifferentiators: [
      "Over 88% of printed paper cards are discarded within 7 days.",
      "NFC cards allow dynamic contact saves directly into smartphone registries.",
      "Saves thousands of dollars annually in corporate printing costs."
    ],
    faqs: [
      { question: "Is an NFC card cost-effective?", answer: "Yes, a one-time purchase of an NFC card pays for itself within months by eliminating printing costs." }
    ],
    summary: "Paper business cards are outdated and easily lost. Reusable NFC smart cards offer instant cloud updates, CRM syncing, and sustainable durability.",
    pros: ["Cuts reprinting costs entirely", "Dynamic links updates", "Eco-friendly sustainability"],
    cons: ["Initial card setup expense"],
    alternatives: ["Printed leaflets", "Direct email exchanges"]
  },
  "tapfolio-vs-mobilo": {
    slug: "tapfolio-vs-mobilo",
    title: "Tapfolio vs Mobilo",
    competitorName: "Mobilo",
    intro: "A detailed comparison between Tapfolio and Mobilo Cards, highlighting hardware aesthetics, page load speeds, and CRM analytics access.",
    matrix: [
      { criteria: "WebGL Customizer", tapfolio: "Yes, full 3D layout previews", competitor: "2D static layouts only" },
      { criteria: "Page Load Speed", tapfolio: "Sub-second Next.js edge loading", competitor: "Average app redirection speeds" },
      { criteria: "API Integrations", tapfolio: "Public JSON endpoints included", competitor: "Enterprise plans licensing required" }
    ],
    keyDifferentiators: [
      "Next.js statically pre-rendered profiles load up to 2x faster than competitor platforms.",
      "Custom WebGL preview allows layout previewing before ordering.",
      "Direct webhook syncs available without high enterprise tier lockouts."
    ],
    faqs: [
      { question: "Why is page speed important?", answer: "A faster page load ensures that when you tap your card, your profile displays instantly without awkward loading screen pauses." }
    ],
    summary: "Tapfolio delivers faster profile load speeds and customizable WebGL card previews without Mobilo's higher licensing lockouts.",
    pros: ["Sub-second page speeds", "Frictionless CRM integrations", "Beautiful 3D builder previews"],
    cons: ["Fewer plastic variants compared to Mobilo"],
    alternatives: ["HiHello", "Popl", "Dot Cards"]
  },
  "tapfolio-vs-linq": {
    slug: "tapfolio-vs-linq",
    title: "Tapfolio vs Linq",
    competitorName: "Linq",
    intro: "Comparing Tapfolio and Linq Cards. Evaluate portfolio showcase layouts, analytics features, and metal engraving quality.",
    matrix: [
      { criteria: "Portfolio Grids", tapfolio: "Built-in dynamic project grids", competitor: "Basic links list format" },
      { criteria: "Metal Materials", tapfolio: "Marine-grade steel and titanium options", competitor: "Steel option with high weight" },
      { criteria: "Team Templates", tapfolio: "Granular administrative template locks", competitor: "Standard layouts views" }
    ],
    keyDifferentiators: [
      "Tapfolio is designed for creators and visual artists, featuring portfolio grids.",
      "Advanced titanium card materials offer lightweight, high-durability hardware.",
      "Clean dark themes matching developer specifications."
    ],
    faqs: [
      { question: "Can I display code repositories directly?", answer: "Yes, Tapfolio features built-in developer stacks and GitHub shortcuts, unlike Linq's basic social links format." }
    ],
    summary: "Tapfolio is built for designers, developers, and visual creators, offering portfolio showcases and titanium options.",
    pros: ["Stunning portfolio display modules", "Aerospace titanium materials", "Bespoke styling designs"],
    cons: ["Fewer peripheral accessory items (like keychains)"],
    alternatives: ["Mobilo", "Blinq"]
  },
  "tapfolio-vs-popl": {
    slug: "tapfolio-vs-popl",
    title: "Tapfolio vs Popl",
    competitorName: "Popl",
    intro: "Comparing Tapfolio vs Popl. Explore how Tapfolio provides premium self-hosted dynamic profiles and developer endpoints without mandatory subscription paywalls.",
    matrix: [
      { criteria: "Mandatory SaaS Fees", tapfolio: "No, pay once for card, free profile forever", competitor: "Yes, advanced layouts require Pro tiers" },
      { criteria: "API Endpoints", tapfolio: "Public JSON and vCard access", competitor: "Locked under enterprise agreements" },
      { criteria: "Analytics Detail", tapfolio: "Geographic logs and click maps included", competitor: "Basic tap metrics on free tier" }
    ],
    keyDifferentiators: [
      "Pay once for physical cards—no mandatory monthly fees for advanced layout links.",
      "Public REST and vCard APIs included for developer workflows.",
      "Edge-rendered profiles ensure rapid lookup times globally."
    ],
    faqs: [
      { question: "Do I have to pay monthly to use my card?", answer: "No, a lifetime free dynamic profile is included with the purchase of a Tapfolio card, with no mandatory subscription requirements." }
    ],
    summary: "Tapfolio provides comprehensive profile design parameters and analytics data without Popl's monthly subscription requirements.",
    pros: ["No monthly profile upkeep fees", "Open developer APIs", "Detailed geographic traffic graphs"],
    cons: ["Fewer phone sticker models compared to Popl"],
    alternatives: ["Linq", "Dot Cards"]
  },
  "tapfolio-vs-dot": {
    slug: "tapfolio-vs-dot",
    title: "Tapfolio vs Dot Cards",
    competitorName: "Dot Cards",
    intro: "Evaluate Tapfolio vs Dot Cards. Tapfolio offers a richer digital ecosystem featuring lead capture, dynamic sitemaps, and advanced team management capabilities.",
    matrix: [
      { criteria: "Dynamic Sitemaps", tapfolio: "Yes, automatically indexes search pages", competitor: "No sitemaps provided" },
      { criteria: "Lead Intake Forms", tapfolio: "Bespoke data fields and integrations", competitor: "Basic email contact input" },
      { criteria: "Material Choices", tapfolio: "PVC, wood, metal, and titanium options", competitor: "PVC models only" }
    ],
    keyDifferentiators: [
      "Statically indexed profile URLs with canonical configurations help show up in Google search results.",
      "Custom lead intake fields allow for detailed query collection.",
      "Multiple premium materials (metal, wood, titanium) compared to basic PVC options."
    ],
    faqs: [
      { question: "Will my card show up on search engines?", answer: "Yes! Tapfolio generates dynamic XML sitemaps and schema graphs to index your profile in searches." }
    ],
    summary: "Tapfolio provides search-indexed dynamic profiles and a wide range of premium materials compared to Dot's basic PVC offerings.",
    pros: ["Indexed for search engine visibility", "Advanced lead intake fields", "Wood, steel, and titanium card options"],
    cons: ["Slightly larger layout size"],
    alternatives: ["Popl", "HiHello"]
  },
  "digital-vs-paper-cards": {
    slug: "digital-vs-paper-cards",
    title: "Digital Cards vs Paper Cards",
    competitorName: "Traditional Paper Cards",
    intro: "Comparing digital cards vs paper visiting cards to determine networking efficiency and sustainability.",
    matrix: [
      { criteria: "Update Speed", tapfolio: "Instant digital updates", competitor: "Requires reprint delays" },
      { criteria: "Link Sharing", tapfolio: "Clickable portfolios and social handles", competitor: "Requires manual typing of URLs" },
      { criteria: "Environmental Impact", tapfolio: "Zero paper waste", competitor: "Contributes to landfill waste" }
    ],
    keyDifferentiators: [
      "Instant cloud redirects bypass old details.",
      "Reduces corporate printing expenses by over 90%.",
      "Interactive grids show actual project wireframes and video links."
    ],
    faqs: [
      { question: "How do I share my digital card?", answer: "You can share your short profile link, display your custom QR fallback, or tap your physical NFC card." }
    ],
    summary: "Digital cards replace traditional paper by offering dynamic updates, interactive link displays, and zero paper waste.",
    pros: ["Always updated in real-time", "Zero reprint paper waste", "Supports clickable URLs and video files"],
    cons: ["Patrons require browser access"],
    alternatives: ["Paper prints", "Verbal links sharing"]
  }
};
