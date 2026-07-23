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
      { platform: "X (Twitter)", url: "https://x.com/Nibrasulhaqq" }
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
    name: "Abhinand K.S.",
    alternateName: "Abhinand",
    jobTitle: "Founder & CEO",
    company: "Tapfolio",
    avatar: "/abhinand.png",
    shortSummary: "Founder & Chief Executive Officer (CEO) of Tapfolio. Visionary behind Tapfolio building the future of NFC-powered digital identity, smart networking, brand strategy, and product innovation. Tap. Connect. Grow.",
    email: "hello@tapfolio.me",
    portfolioUrl: "https://www.tapfolio.me/portfolio/abhinand",
    socials: [
      { platform: "LinkedIn", url: "https://www.linkedin.com/in/abhinand-ks-428387332/" },
      { platform: "GitHub", url: "https://github.com/abhinand" },
      { platform: "Instagram", url: "https://www.instagram.com/ft_abhinand_" }
    ],
    biography: [
      "Hi, I'm Abhinand, the Founder and CEO of Tapfolio—a premium NFC-powered digital identity platform transforming how people connect, share, and grow through smart NFC technology.",
      "Beyond building startups, I am a multidisciplinary creative professional with 8+ years of experience in the creative and digital industry. My expertise spans graphic design, video editing, videography, photography, branding, digital marketing, and product design, helping businesses build impactful brands and compelling digital experiences.",
      "My entrepreneurial journey led me to establish Kreovate Marketing Agency, a creative agency focused on branding, marketing, content production, and digital growth. Through Kreovate, I have successfully worked with clients across India and the UAE, delivering creative solutions that drive measurable business results.",
      "I have also worked with FLY Creative, one of Kerala's leading travel agencies, where I contributed to branding, social media strategy, advertising campaigns, visual storytelling, and digital marketing initiatives.",
      "Today, I combine technology, creativity, business strategy, and innovation to build products that solve real-world problems. Every feature of Tapfolio reflects my vision of creating a future where networking is seamless, professional, and powered by technology."
    ],
    quickFacts: {
      location: "Kochi, India",
      nationality: "Indian",
      languages: ["English", "Malayalam"],
      company: "Tapfolio",
      industry: "Smart Networking & Brand Strategy",
      experienceYears: "8+ Years Exp",
      specialization: "Product Strategy, Brand Development & UI/UX Design",
      availability: "Open to Enterprise Partnerships & Brand Collaborations"
    },
    timeline: [
      {
        year: "2024 – Present",
        title: "Founder & CEO — Tapfolio",
        description: "Leading product strategy, business development, NFC digital identity solutions, product design, branding, and global growth strategy."
      },
      {
        year: "2023 – Present",
        title: "Founder — Kreovate Marketing Agency",
        description: "Founded full-service creative agency delivering branding, social media, and advertising campaigns for clients across India & UAE."
      },
      {
        year: "2022 – 2023",
        title: "Creative Professional — FLY Creative",
        description: "Managed branding, social media strategy, promotional video production, and digital marketing for one of Kerala's top travel agencies."
      },
      {
        year: "2016 – Present",
        title: "Freelance Creative Professional (8+ Years)",
        description: "Delivering graphic design, brand identity, videography, photography, digital marketing, and creative direction."
      }
    ],
    skills: [
      {
        category: "Brand & Executive Strategy",
        skills: ["Brand Strategy", "Creative Direction", "Brand Identity", "Startup Strategy", "Business Development", "Product Strategy", "Growth Strategy"]
      },
      {
        category: "Design & Multimedia",
        skills: ["UI/UX Design", "Graphic Design", "Photography", "Videography", "Video Editing", "Content Creation", "Product Design"]
      },
      {
        category: "Digital Marketing & Growth",
        skills: ["Digital Marketing", "Social Media Marketing", "Performance Marketing", "Content Strategy", "Advertising Campaigns"]
      },
      {
        category: "Product & Technology",
        skills: ["NFC Product Development", "Product Innovation", "AI Content Creation", "Physical-Digital Sync"]
      }
    ],
    projects: [
      {
        title: "Tapfolio Smart NFC Platform",
        role: "Founder & CEO",
        year: "2024 - Present",
        description: "Smart NFC digital business card ecosystem connecting physical cards with dynamic web profiles.",
        techStack: ["NFC / NDEF", "Product Design", "Brand Strategy", "UI/UX", "System Sync"],
        url: "https://www.tapfolio.me"
      },
      {
        title: "Kreovate Marketing Agency",
        role: "Founder & Creative Director",
        year: "2023 - Present",
        description: "Full-service marketing & branding agency serving enterprise clients across India & UAE.",
        techStack: ["Branding", "Content Production", "Digital Marketing", "Campaigns"],
        url: "https://www.tapfolio.me"
      },
      {
        title: "FLY Creative Campaigns",
        role: "Creative Professional",
        year: "2022 - 2023",
        description: "Visual storytelling, video production, and brand campaigns for travel agency.",
        techStack: ["Videography", "Video Editing", "Social Strategy", "Advertising"]
      }
    ],
    companies: [
      {
        name: "Tapfolio",
        role: "Founder & CEO",
        period: "2024 - Present",
        description: "Reinventing business networking with smart NFC cards and real-time digital identity platforms.",
        url: "https://www.tapfolio.me"
      },
      {
        name: "Kreovate Marketing Agency",
        role: "Founder",
        period: "2023 - Present",
        description: "Branding, digital marketing, content production, and business growth across India & UAE."
      }
    ],
    media: [],
    faqs: [
      {
        question: "Who is Abhinand K.S.?",
        answer: "Abhinand K.S. is the Founder and CEO of Tapfolio, a multidisciplinary creative professional with 8+ years of experience in product design, branding, and marketing strategy."
      },
      {
        question: "What is Abhinand K.S.'s role at Tapfolio?",
        answer: "As Founder & CEO, Abhinand leads product strategy, business growth, brand development, industrial card design, and user experience at Tapfolio."
      },
      {
        question: "What other companies has Abhinand founded?",
        answer: "Abhinand founded Kreovate Marketing Agency, a creative agency delivering branding, marketing, and digital growth across India and the UAE."
      }
    ],
    education: [
      {
        institution: "St. Albert's College (Autonomous), Ernakulam",
        degree: "B.Sc. Computer Science & Industrial Design",
        years: "2023 - 2026",
        achievements: "Focused on Software Systems, Multimedia Technologies, Branding, and Industrial Product Design."
      }
    ]
  }
};
