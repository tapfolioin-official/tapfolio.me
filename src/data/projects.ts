export interface ProjectCaseStudy {
  slug: string;
  name: string;
  category: string;
  year: string;
  duration: string;
  role: string;
  image: string;
  tagline: string;
  problem: string;
  solution: string;
  impact: string;
  responsibilities: string[];
  stack: string[];
  lessonsLearned: string[];
  architectureOverview: string;
  url?: string;
  github?: string;
}

export const projectsData: ProjectCaseStudy[] = [
  {
    slug: "tapfolio",
    name: "Tapfolio",
    category: "NFC & SaaS Platform",
    year: "2026",
    duration: "Jan 2026 – Present",
    role: "Co-Founder & CTO",
    image: "/tapfolio.png",
    tagline: "Connecting physical NFC cards to dynamic live digital identity profiles.",
    problem: "Traditional paper business cards are static, easily lost, costly to reprint, and fail to capture real-time connection analytics in professional networking.",
    solution: "Architected a digital-first networking platform combining physical NTAG215/216 NFC smart cards with real-time web identity profiles built on Next.js App Router and PostgreSQL.",
    impact: "Streamlined professional contact exchange and lead capture for businesses and individual creators across digital ecosystems.",
    responsibilities: [
      "Full-Stack System Architecture",
      "Next.js App Router & Server Actions",
      "NFC NDEF Payload & URI Provisioning",
      "Database Schema Design (PostgreSQL & Prisma)",
      "Edge Infrastructure & Vercel Deployment"
    ],
    stack: ["Next.js 15", "TypeScript", "TailwindCSS", "PostgreSQL", "Prisma", "NFC / NDEF", "Vercel"],
    lessonsLearned: [
      "Hardware-software handshakes require strict URL fallback handling across varied iOS & Android browser implementations.",
      "Optimizing cold-start database queries is vital when users scan physical cards expecting sub-second profile loads.",
      "Designing modular profile themes allows rapid customization without compromising core CSS performance."
    ],
    architectureOverview: "Client (Physical NFC Card / Mobile Browser) → Vercel Edge Router → Next.js App Router (SSR & Dynamic Cache) → Prisma ORM → PostgreSQL Database.",
    url: "https://www.tapfolio.me",
    github: "https://github.com/nibrasul/Add-1"
  },
  {
    slug: "invoice-printer",
    name: "Invoice Printer Suite",
    category: "Business Tooling",
    year: "2026",
    duration: "Feb 2026 – Mar 2026",
    role: "Lead Architect & Developer",
    image: "/builder_suite.png",
    tagline: "Enterprise invoice editor and high-performance vector PDF printing engine.",
    problem: "Small businesses and freelancers struggle with clunky invoicing software that shifts layout margins during browser PDF printing.",
    solution: "Engineered a client-side invoice editing platform with live preview, tax calculation rules, and vector-perfect PDF generation.",
    impact: "Eliminated layout distortions during printing, improving billing workflow consistency for client services.",
    responsibilities: [
      "UI/UX Design & Form State Management",
      "Dynamic VAT & Currency Computation Engine",
      "Client-Side PDF Generation Pipeline",
      "Responsive Layout Optimization"
    ],
    stack: ["React", "TypeScript", "TailwindCSS", "PDF Engine", "Vercel"],
    lessonsLearned: [
      "Precise print stylesheets (@media print) require strict pixel-to-millimeter font scaling for cross-browser consistency.",
      "Client-side state persistence in localStorage prevents accidental data loss during multi-item invoice entry."
    ],
    architectureOverview: "React UI State → Dynamic Calculations Engine → Print Stylesheet / PDF Canvas → Instant Browser Export.",
    url: "https://www.tapfolio.me/invoice-printer"
  },
  {
    slug: "jarvis-ai",
    name: "JARVIS AI Assistant",
    category: "AI Systems & Automation",
    year: "2025",
    duration: "Oct 2025 – Dec 2025",
    role: "AI Systems Architect",
    image: "/jarvis.png",
    tagline: "Autonomous CLI and voice shell assistant for developer operations.",
    problem: "Software developers lose significant time executing repetitive terminal commands, environment provisioning, and cloud server diagnostics.",
    solution: "Built an event-driven terminal and voice shell assistant using Node.js and OpenAI's API that translates natural language commands into verified system shell calls.",
    impact: "Significantly reduced manual environment provisioning and routine server maintenance setup time.",
    responsibilities: [
      "Natural Language Shell Parser Design",
      "OpenAI Function Calling & Tool Integration",
      "Speech-to-Intent Voice Pipeline",
      "CLI Command Security Validation Wrappers"
    ],
    stack: ["Node.js", "Python", "OpenAI API", "Whisper AI", "Bash Tooling"],
    lessonsLearned: [
      "AI shell assistants must enforce strict permission whitelists to prevent destructive terminal execution.",
      "Streaming LLM token output directly to terminal stdout dramatically improves developer UX perception."
    ],
    architectureOverview: "User Voice / Text Input → Speech-to-Text → OpenAI Function Call Classifier → Security Validator → Executable Shell Process.",
    github: "https://github.com/nibrasul"
  },
  {
    slug: "old-school-tea",
    name: "Old School Tea",
    category: "E-Commerce",
    year: "2025",
    duration: "Aug 2025 – Sep 2025",
    role: "Full-Stack Developer (Client Work)",
    image: "/tapfolio.png",
    tagline: "Immersive storytelling digital storefront for artisanal tea brand.",
    problem: "A traditional tea brand needed a modern e-commerce presence that reflected its authentic heritage while driving digital customer acquisition.",
    solution: "Designed and developed a storytelling-driven website with rich imagery, responsive product showcases, and fast asset loading.",
    impact: "Elevated digital brand positioning and provided a scalable foundation for direct-to-consumer online sales.",
    responsibilities: [
      "Storefront UI/UX Architecture",
      "Performance Asset Optimization",
      "Responsive Product Catalog Component Suite",
      "Checkout Journey Mapping"
    ],
    stack: ["Next.js", "TailwindCSS", "Framer Motion", "Stripe API"],
    lessonsLearned: [
      "High-resolution product imagery requires Next.js image optimization and WebP conversion for fast mobile loading.",
      "Brand storytelling integrated directly into product discovery increases user engagement time."
    ],
    architectureOverview: "Next.js Frontend → Component Catalog → Stripe API Payment Gateway → Asset Delivery Network.",
    url: "https://www.tapfolio.me"
  },
  {
    slug: "crime-analytics",
    name: "Spatial Crime Analytics",
    category: "ML & Data Science",
    year: "2025",
    duration: "May 2025 – Jul 2025",
    role: "Machine Learning Engineer",
    image: "/builder_suite.png",
    tagline: "Predictive spatial intelligence platform for regional risk density mapping.",
    problem: "Municipal planners lacked interactive geospatial tools to analyze temporal high-risk density clusters.",
    solution: "Engineered statistical predictive pipelines in Python and TensorFlow, rendering interactive geospatial heatmaps via React and D3.js.",
    impact: "Transformed complex spatial data layers into accessible visual maps for resource planning.",
    responsibilities: [
      "Data Cleaning & Feature Engineering",
      "Predictive Model Training (TensorFlow)",
      "D3.js Geospatial Visualization Layer",
      "REST Data API Construction"
    ],
    stack: ["Python", "TensorFlow", "Pandas", "React", "D3.js"],
    lessonsLearned: [
      "Rendering large geospatial datasets in D3.js requires canvas aggregation to maintain 60fps interaction.",
      "Temporal feature extraction significantly improves regional hotspot prediction accuracy."
    ],
    architectureOverview: "Raw Dataset → Python Preprocessor → TensorFlow Model → REST API → React + D3.js Interactive Canvas.",
    github: "https://github.com/nibrasul"
  },
  {
    slug: "smart-transit",
    name: "Smart Transit System",
    category: "IoT & WebSockets",
    year: "2025",
    duration: "Jan 2025 – Apr 2025",
    role: "Systems Architect",
    image: "/tapfolio.png",
    tagline: "Real-time fleet tracking and GPS telemetry mapping service.",
    problem: "Fleet operators needed a low-latency mapping service to track multi-vehicle coordinates concurrently.",
    solution: "Architected a WebSocket telemetry backend with Node.js and Socket.io streaming live coordinates to custom React Google Maps dashboards.",
    impact: "Delivered real-time location updates across concurrent driver broadcasts with minimal latency.",
    responsibilities: [
      "WebSocket Connection Architecture",
      "GPS Telemetry Ingestion Pipeline",
      "React Dashboard Map Integration",
      "Low-Latency Event Dispatching"
    ],
    stack: ["Node.js", "Socket.io", "React", "Google Maps API", "Express"],
    lessonsLearned: [
      "WebSocket connection auto-reconnect logic is vital for mobile driver devices passing through weak signal zones.",
      "Throttling coordinate state updates to 1-second intervals balances UI smoothness with CPU utilization."
    ],
    architectureOverview: "GPS Transmitters → WebSocket Server (Socket.io) → Event Broker → React Google Maps Client.",
    github: "https://github.com/nibrasul"
  }
];
