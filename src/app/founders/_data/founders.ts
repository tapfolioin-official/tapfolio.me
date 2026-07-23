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
    shortSummary: "Co-Founder & Chief Technology Officer of Tapfolio. Software engineer and AI systems developer specializing in Next.js, Flutter, cloud infrastructure, NFC technology, and modern SaaS platforms.",
    email: "hello@tapfolio.me",
    portfolioUrl: "https://www.tapfolio.me/portfolio/nibras",
    socials: [
      { platform: "LinkedIn", url: "https://www.linkedin.com/in/mohammed-nibrasul-haqq-8267162ba/" },
      { platform: "GitHub", url: "https://github.com/nibrasul" },
      { platform: "X (Twitter)", url: "https://x.com/tapfolio" }
    ],
    biography: [
      "Mohammed Nibrasul Haqq is the Co-Founder and Chief Technology Officer (CTO) of Tapfolio, where he leads software engineering, platform architecture, and product development. He specializes in Next.js, Flutter, AI integrations, cloud infrastructure, NFC technology, and modern SaaS applications.",
      "While working on web applications and digital identity systems, he observed that traditional paper business cards often become outdated or are discarded shortly after being exchanged. This led him to co-found Tapfolio, a platform that combines NFC-enabled smart cards with dynamic digital identity profiles.",
      "As CTO, Nibras leads core software development, web and mobile platform architectures, and card provisioning pipelines at Tapfolio. His technical approach focuses on reliable engineering, clean component design, sub-second page performance, and low-latency data synchronization.",
      "Today, Nibras continues to expand Tapfolio while exploring AI-powered automation, developer tools, and scalable cloud systems. His long-term focus is building products that simplify professional networking and improve how people share and manage their digital identity."
    ],
    quickFacts: {
      location: "Kochi, India",
      nationality: "Indian",
      languages: ["English", "Malayalam", "Hindi"],
      company: "Tapfolio",
      industry: "Software & Digital Identity",
      experienceYears: "Since 2023",
      specialization: "Full-Stack Web Systems, NFC Hardware Integration, Next.js & AI Agents",
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
        description: "Formed Tapfolio alongside Abhinand and built the core web platform & analytics engine."
      },
      {
        year: "2025",
        title: "Expanded NFC Feature Suite & Analytics",
        description: "Expanded the Tapfolio platform with advanced NFC features, analytics, and customization."
      },
      {
        year: "2026",
        title: "Scaling Web Infrastructure & AI Workflows",
        description: "Expanding real-time analytics, AI agent integrations, and platform capabilities."
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
        role: "Co-Founder & CTO",
        year: "2024 - Present",
        description: "Smart NFC business card platform and live digital networking ecosystem.",
        techStack: ["Next.js", "TypeScript", "TailwindCSS", "PostgreSQL", "NFC / NDEF"],
        url: "https://www.tapfolio.me",
        github: "https://github.com/nibrasul/Add-1"
      },
      {
        title: "Invoice Printer Suite",
        role: "Lead Architect",
        year: "2025",
        description: "Web invoice editor featuring dynamic line items, total calculations, and vector PDF printing.",
        techStack: ["React", "TypeScript", "TailwindCSS", "PDF Engine"],
        url: "https://www.tapfolio.me/invoice-printer"
      },
      {
        title: "JARVIS AI Assistant",
        role: "AI Systems Architect",
        year: "2025",
        description: "Autonomous CLI & voice shell assistant for developer operations.",
        techStack: ["Node.js", "OpenAI API", "Python", "CLI Tooling"],
        github: "https://github.com/nibrasul"
      },
      {
        title: "Resume Builder",
        role: "Creator & Developer",
        year: "2025",
        description: "Interactive resume creation engine with real-time preview and export.",
        techStack: ["Next.js", "TypeScript", "Framer Motion"],
        github: "https://github.com/nibrasul"
      },
      {
        title: "OldSchoolTea",
        role: "Full Stack Engineer",
        year: "2024",
        description: "Storytelling e-commerce storefront for artisanal tea brand.",
        techStack: ["Next.js", "Stripe", "TailwindCSS"],
        url: "https://www.tapfolio.me"
      },
      {
        title: "LocalConnect",
        role: "Founder & Mobile Developer",
        year: "2024",
        description: "Location-aware service marketplace connecting customers with local labor.",
        techStack: ["React Native", "Flutter", "Firebase", "Node.js"]
      }
    ],
    companies: [
      {
        name: "Tapfolio",
        role: "Co-Founder & CTO",
        period: "2024 - Present",
        description: "Reinventing business networking with smart NFC cards and real-time digital profiles.",
        url: "https://www.tapfolio.me"
      }
    ],
    media: [],
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
        institution: "St. Albert's College (Autonomous), Ernakulam",
        degree: "B.Sc. Computer Science",
        years: "2023 - 2026",
        achievements: "Core focus on Data Structures, Relational Database Management Systems, Operating Systems, and Distributed Software Engineering."
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
    shortSummary: "Co-Founder & Chief Executive Officer of Tapfolio. Product engineer and brand strategist driving Tapfolio's global growth, physical card design, and business vision.",
    email: "hello@tapfolio.me",
    portfolioUrl: "https://www.tapfolio.me/portfolio/abhinand",
    socials: [
      { platform: "LinkedIn", url: "https://www.linkedin.com/in/abhinand-ks-428387332/" },
      { platform: "GitHub", url: "https://github.com/abhinand" },
      { platform: "Instagram", url: "https://www.instagram.com/ft_abhinand_" }
    ],
    biography: [
      "Abhinand is the Co-Founder and Chief Executive Officer (CEO) of Tapfolio. Combining expertise in product design, systems engineering, and brand building, Abhinand leads Tapfolio's executive vision, strategic partnerships, and hardware product line.",
      "Driven by a belief that tactile objects should seamlessly bridge into the digital domain, Abhinand spearheaded the engineering and custom laser-engraving of Tapfolio's premium matte, metal, and bamboo NFC cards.",
      "As CEO, Abhinand oversees market expansion, operations, customer success, and long-term brand strategy at Tapfolio."
    ],
    quickFacts: {
      location: "Kochi, India",
      nationality: "Indian",
      languages: ["English", "Malayalam"],
      company: "Tapfolio",
      industry: "Hardware Design & Smart Networking",
      experienceYears: "Since 2023",
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
        title: "Enterprise Card Series Launch",
        description: "Directed launch of laser-engraved metal NFC cards and platform management features."
      },
      {
        year: "2026",
        title: "Global Operations & Leadership",
        description: "Scaling corporate distribution and brand footprint."
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
        description: "Custom-engraved smart NFC cards engineered for modern networking.",
        techStack: ["NTAG216", "Laser Engraving", "Matte Polymer", "Anodized Stainless Steel"],
        url: "https://www.tapfolio.me"
      }
    ],
    companies: [
      {
        name: "Tapfolio",
        role: "Co-Founder & CEO",
        period: "2024 - Present",
        description: "Reinventing business networking with smart NFC cards and real-time digital identity platforms.",
        url: "https://www.tapfolio.me"
      }
    ],
    media: [],
    faqs: [
      {
        question: "Who is Abhinand?",
        answer: "Abhinand is a product engineer, designer, and the Co-Founder & CEO of Tapfolio, leading executive strategy and hardware innovation."
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
        institution: "St. Albert's College (Autonomous), Ernakulam",
        degree: "B.Sc. Computer Science",
        years: "2023 - 2026",
        achievements: "Focused on Software Systems, Hardware Prototyping, and Industrial Product Design."
      }
    ]
  }
};
