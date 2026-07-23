export interface FounderSocial {
  platform: string;
  url: string;
  icon?: string;
}

export interface FounderTimelineItem {
  year: string;
  title: string;
  description: string;
}

export interface FounderSkillCategory {
  category: string;
  skills: string[];
}

export interface FounderProject {
  title: string;
  role: string;
  year: string;
  description: string;
  techStack: string[];
  image?: string;
  url?: string;
  github?: string;
}

export interface FounderCompany {
  name: string;
  role: string;
  period: string;
  description: string;
  logo?: string;
  url?: string;
}

export interface FounderMediaItem {
  type: 'video' | 'interview' | 'podcast' | 'press' | 'speaking' | 'award';
  title: string;
  publisher: string;
  date: string;
  summary: string;
  url?: string;
}

export interface FounderFAQ {
  question: string;
  answer: string;
}

export interface FounderProfile {
  slug: string;
  name: string;
  alternateName?: string;
  jobTitle: string;
  company: string;
  avatar: string;
  shortSummary: string;
  email?: string;
  resumeUrl?: string;
  portfolioUrl?: string;
  socials: FounderSocial[];
  biography: string[];
  quickFacts: {
    location: string;
    nationality: string;
    languages: string[];
    company: string;
    industry: string;
    experienceYears: string;
    specialization: string;
    availability: string;
  };
  timeline: FounderTimelineItem[];
  skills: FounderSkillCategory[];
  projects: FounderProject[];
  companies: FounderCompany[];
  media: FounderMediaItem[];
  faqs: FounderFAQ[];
  education: {
    institution: string;
    degree: string;
    years: string;
    achievements?: string;
  }[];
}

export const foundersData: Record<string, FounderProfile> = {
  "mohammed-nibrasul-haqq": {
    slug: "mohammed-nibrasul-haqq",
    name: "Mohammed Nibrasul Haqq",
    alternateName: "Nibras",
    jobTitle: "Co-Founder & CTO",
    company: "Tapfolio",
    avatar: "/nibras.png",
    shortSummary: "Co-Founder & Chief Technology Officer of Tapfolio. Visionary software architect and AI systems engineer focused on reinventing professional networking through state-of-the-art NFC technology and high-performance digital profile platforms.",
    email: "hello@tapfolio.me",
    portfolioUrl: "https://www.tapfolio.me/portfolio/nibras",
    socials: [
      { platform: "LinkedIn", url: "https://www.linkedin.com/in/mohammed-nibrasul-haqq-8267162ba/" },
      { platform: "GitHub", url: "https://github.com/nibrasul" },
      { platform: "X (Twitter)", url: "https://x.com/tapfolio" }
    ],
    biography: [
      "Mohammed Nibrasul Haqq is the Co-Founder and Chief Technology Officer (CTO) of Tapfolio. Driven by a deep passion for modern web engineering, real-time sync architectures, and physical-to-digital interactions, Nibras leads the technology roadmap, cloud infrastructure, and core software engineering at Tapfolio.",
      "Early in his journey as a software developer, Nibras recognized the inherent friction and environmental waste of traditional paper business cards. Most paper cards are discarded within days of an exchange, and contact details quickly become stale. This insight sparked the creation of Tapfolio—a platform designed to link high-grade NFC hardware with dynamic, live digital identity profiles.",
      "As CTO, Nibras architected Tapfolio's Next.js platform, real-time analytics engines, and cross-platform mobile connectivity suite. His technical philosophy centers on extreme performance, sleek UI aesthetics, and reliable offline-to-online data synchronization. Under his leadership, Tapfolio has expanded to serve thousands of active professionals and enterprise teams worldwide.",
      "Beyond core application development, Nibras actively explores AI agent workflows, automated web pipelines, and next-generation mobile applications. His vision is to establish Tapfolio as the universal global standard for friction-free professional identity exchange."
    ],
    quickFacts: {
      location: "Bangalore, India",
      nationality: "Indian",
      languages: ["English", "Malayalam", "Hindi"],
      company: "Tapfolio",
      industry: "Information Technology & Digital Identity",
      experienceYears: "5+ Years",
      specialization: "Full Stack Web Systems, NFC Integration, Next.js & Cloud Infrastructure",
      availability: "Open to Strategic Partnerships & Technical Collaboration"
    },
    timeline: [
      {
        year: "2023",
        title: "Conceptualized Tapfolio MVP",
        description: "Envisioned bridging tactile NFC cards with live cloud-hosted identity profiles."
      },
      {
        year: "2024",
        title: "Co-Founded Tapfolio",
        description: "Formed Tapfolio alongside Abhinand and built the core matching & analytics engine."
      },
      {
        year: "2025",
        title: "Launched Enterprise NFC Ecosystem",
        description: "Engineered multi-device NFC provisioning, custom domain routing, and instant lead capture."
      },
      {
        year: "2026",
        title: "Scaling Global SaaS & Knowledge Graph Infrastructure",
        description: "Expanding real-time analytics, AI networking agents, and Knowledge Graph entity architecture."
      }
    ],
    skills: [
      {
        category: "Frontend Engineering",
        skills: ["Next.js (App Router)", "React", "TypeScript", "TailwindCSS", "Framer Motion", "Flutter"]
      },
      {
        category: "Backend & Cloud",
        skills: ["Node.js", "Express", "PostgreSQL", "Prisma ORM", "Vercel", "AWS / Cloudflare"]
      },
      {
        category: "AI & Automation",
        skills: ["OpenAI APIs", "AI Agents", "Automated Workflows", "Vector Search"]
      },
      {
        category: "Hardware & NFC",
        skills: ["NTAG215 / NTAG216 Chips", "NDEF Data Formatting", "Contactless Direct Matching"]
      }
    ],
    projects: [
      {
        title: "Tapfolio",
        role: "Co-Founder & Technical Lead",
        year: "2024 - Present",
        description: "Smart NFC business card ecosystem and live digital networking platform.",
        techStack: ["Next.js", "TypeScript", "TailwindCSS", "PostgreSQL", "NFC / NDEF"],
        url: "https://www.tapfolio.me",
        github: "https://github.com/nibrasul/Add-1"
      },
      {
        title: "Invoice Printer",
        role: "Lead Architect",
        year: "2025",
        description: "Bespoke invoice generator and automated PDF printer for enterprise billing.",
        techStack: ["React", "TypeScript", "TailwindCSS", "PDFKit"],
        url: "https://www.tapfolio.me/invoice-printer"
      },
      {
        title: "Resume Builder",
        role: "Creator & Developer",
        year: "2025",
        description: "Interactive resume creation engine with real-time preview and export.",
        techStack: ["Next.js", "TypeScript", "Framer Motion"]
      },
      {
        title: "Zervgo",
        role: "Co-Developer",
        year: "2024",
        description: "Service management and instant booking platform for digital agencies.",
        techStack: ["React", "Node.js", "PostgreSQL"]
      },
      {
        title: "OldSchoolTea",
        role: "Full Stack Engineer",
        year: "2024",
        description: "E-commerce platform for artisanal tea blends and cultural merchandise.",
        techStack: ["Next.js", "Stripe", "TailwindCSS"]
      }
    ],
    companies: [
      {
        name: "Tapfolio",
        role: "Co-Founder & CTO",
        period: "2024 - Present",
        description: "Reinventing business networking with premium NFC cards and real-time digital profiles.",
        url: "https://www.tapfolio.me"
      }
    ],
    media: [
      {
        type: "press",
        publisher: "Tapfolio Media",
        title: "Tapfolio Launches Next-Gen NFC Digital Cards for Enterprise",
        date: "2026-01-15",
        summary: "Co-founder & CTO Mohammed Nibrasul Haqq announces the release of automated CRM lead sync and metal NFC card offerings.",
        url: "https://www.tapfolio.me/about"
      }
    ],
    faqs: [
      {
        question: "Who is Mohammed Nibrasul Haqq?",
        answer: "Mohammed Nibrasul Haqq is a software engineer, AI systems developer, and the Co-Founder & CTO of Tapfolio, where he leads software engineering and technology strategy."
      },
      {
        question: "What is Mohammed Nibrasul Haqq's role at Tapfolio?",
        answer: "As Co-Founder & Chief Technology Officer (CTO), Mohammed Nibrasul Haqq oversees platform architecture, web and mobile development, cloud infrastructure, and NFC chip integration."
      },
      {
        question: "What technologies does Mohammed Nibrasul Haqq specialize in?",
        answer: "Mohammed Nibrasul Haqq specializes in Next.js, React, TypeScript, Node.js, PostgreSQL, NFC/NDEF data protocols, Flutter mobile applications, and AI agent automation."
      },
      {
        question: "What companies has Mohammed Nibrasul Haqq co-founded?",
        answer: "Mohammed Nibrasul Haqq is the co-founder of Tapfolio, a modern digital identity and smart NFC networking platform."
      }
    ],
    education: [
      {
        institution: "Technological University",
        degree: "Bachelor of Technology in Computer Science & Engineering",
        years: "2020 - 2024",
        achievements: "Specialized in Distributed Web Systems and Mobile Computing."
      }
    ]
  },
  "abhinand": {
    slug: "abhinand",
    name: "Abhinand",
    alternateName: "Abhinand Sunil",
    jobTitle: "Co-Founder & CEO",
    company: "Tapfolio",
    avatar: "/abhinand.png",
    shortSummary: "Co-Founder & Chief Executive Officer of Tapfolio. Visionary systems engineer, product designer, and hardware strategist driving Tapfolio's global growth, physical card design, and business vision.",
    email: "hello@tapfolio.me",
    portfolioUrl: "https://www.tapfolio.me/portfolio/abhinand",
    socials: [
      { platform: "LinkedIn", url: "https://www.linkedin.com/in/abhinand-ks-428387332/" },
      { platform: "GitHub", url: "https://github.com/abhinand" },
      { platform: "Instagram", url: "https://www.instagram.com/ft_abhinand_" }
    ],
    biography: [
      "Abhinand is the Co-Founder and Chief Executive Officer (CEO) of Tapfolio. Combining expertise in physical product design, systems engineering, and brand building, Abhinand leads Tapfolio's executive vision, strategic partnerships, and hardware product line.",
      "Driven by a belief that tactile objects should seamlessly bridge into the digital domain, Abhinand spearheaded the engineering and custom laser-engraving of Tapfolio's premium matte, metal, and bamboo NFC cards. His focus on industrial design ensures every Tapfolio product delivers an impressive tactile feel alongside instant digital functionality.",
      "As CEO, Abhinand oversees market expansion, operations, customer success, and long-term brand strategy. Under his leadership, Tapfolio has grown into a trusted identity solution across corporate teams, creative freelancers, and executive sales departments."
    ],
    quickFacts: {
      location: "Bangalore, India",
      nationality: "Indian",
      languages: ["English", "Malayalam"],
      company: "Tapfolio",
      industry: "Hardware Design & Smart Networking",
      experienceYears: "5+ Years",
      specialization: "Executive Leadership, Industrial Card Design & Product Strategy",
      availability: "Open to Enterprise Partnerships & Investor Relations"
    },
    timeline: [
      {
        year: "2023",
        title: "Hardware Exploration & NFC Prototyping",
        description: "Researched metal, bamboo, and matte polymer materials for durable NFC cards."
      },
      {
        year: "2024",
        title: "Co-Founded Tapfolio",
        description: "Formed Tapfolio alongside Mohammed Nibrasul Haqq to build a unified physical-digital networking platform."
      },
      {
        year: "2025",
        title: "Enterprise Metal Line Launch",
        description: "Directed launch of laser-engraved metal NFC cards and enterprise management software."
      },
      {
        year: "2026",
        title: "Global Operations & Leadership",
        description: "Scaling corporate distribution and brand footprint internationally."
      }
    ],
    skills: [
      {
        category: "Leadership & Strategy",
        skills: ["Executive Strategy", "Operations", "Product Management", "Brand Development"]
      },
      {
        category: "Hardware & Design",
        skills: ["Industrial Product Design", "Laser Engraving Pipelines", "UI/UX Design", "Figma"]
      },
      {
        category: "Software & Mobile",
        skills: ["Web Platforms", "System Architecture", "NFC Ecosystems"]
      }
    ],
    projects: [
      {
        title: "Tapfolio Metal & Bamboo Card Series",
        role: "Co-Founder & Lead Designer",
        year: "2024 - Present",
        description: "Custom-engraved smart NFC cards engineered for luxury networking.",
        techStack: ["NTAG216", "Laser Engraving", "Matte Polymer", "Anodized Stainless Steel"],
        url: "https://www.tapfolio.me"
      }
    ],
    companies: [
      {
        name: "Tapfolio",
        role: "Co-Founder & CEO",
        period: "2024 - Present",
        description: "Reinventing business networking with premium NFC cards and real-time digital identity platforms.",
        url: "https://www.tapfolio.me"
      }
    ],
    media: [
      {
        type: "press",
        publisher: "Tapfolio News",
        title: "Abhinand Unveils Next Generation Metal Smart Cards",
        date: "2026-02-01",
        summary: "Tapfolio CEO Abhinand introduces luxury laser-engraved NFC cards built for sales leaders and executives.",
        url: "https://www.tapfolio.me/about"
      }
    ],
    faqs: [
      {
        question: "Who is Abhinand?",
        answer: "Abhinand is a systems engineer, product designer, and the Co-Founder & CEO of Tapfolio, leading executive strategy and hardware innovation."
      },
      {
        question: "What is Abhinand's role at Tapfolio?",
        answer: "As Co-Founder & CEO, Abhinand leads company strategy, industrial card design, operations, brand vision, and enterprise partnerships."
      },
      {
        question: "What is Tapfolio?",
        answer: "Tapfolio is a smart business card platform combining custom NFC hardware with real-time digital profile pages and lead capture analytics."
      }
    ],
    education: [
      {
        institution: "Technological University",
        degree: "Bachelor of Technology in Electronics & Communication Engineering",
        years: "2020 - 2024",
        achievements: "Focused on Embedded Systems, Hardware Prototyping, and Industrial Design."
      }
    ]
  }
};
