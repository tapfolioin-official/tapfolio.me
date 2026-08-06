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
    jobTitle: "Co-founder & CTO",
    company: "Tapfolio",
    avatar: "/nibras.png",
    shortSummary: "Meet Mohammed Nibrasul Haqq, Co-Founder & CTO of Tapfolio. Explore his work in software engineering, AI integration, platform architecture, and product development.",
    email: "hello@tapfolio.me",
    portfolioUrl: "https://www.tapfolio.me/nibrasulhaqq",
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
      experienceYears: "Since 2026",
      specialization: "Full-Stack Web Systems, NFC Hardware Integration, Next.js & AI Agents",
      availability: "Open to Strategic Partnerships & Technical Collaboration"
    },
    timeline: [
      {
        year: "2019",
        title: "Started Programming & Software Development",
        description:
          "Began learning computer programming through self-directed study, exploring the fundamentals of software development, web technologies, problem-solving, and programming logic. Built early personal projects while developing a passion for creating software that solves real-world problems."
      },
      {
        year: "2020",
        title: "Built First Web Applications",
        description:
          "Expanded into front-end web development using HTML, CSS, JavaScript, and Bootstrap. Developed personal websites, static business pages, responsive user interfaces, and experimented with interactive web experiences while strengthening UI implementation and design fundamentals."
      },
      {
        year: "2021",
        title: "Explored Full-Stack Development",
        description:
          "Started developing dynamic web applications with databases, authentication systems, backend APIs, and server-side technologies. Learned modern software architecture principles, relational databases, RESTful APIs, version control with Git, and deployment workflows."
      },
      {
        year: "2022",
        title: "Built Real-World Software Projects",
        description:
          "Worked on increasingly complex software projects including management systems, automation tools, portfolio platforms, and business-focused applications. Expanded expertise in JavaScript ecosystems, backend development, database design, cloud deployment, and scalable application architecture."
      },
      {
        year: "2023",
        title: "Advanced Full-Stack Engineering",
        description:
          "While pursuing a B.Sc. in Computer Science, focused on modern full-stack development using React, Next.js, Node.js, Express, TypeScript, PostgreSQL, Prisma ORM, and Tailwind CSS. Built reusable component systems, responsive interfaces, secure authentication flows, REST APIs, and performance-optimized web applications."
      },
      {
        year: "2024",
        title: "Expanded into AI, Mobile & Cloud Technologies",
        description:
          "Integrated artificial intelligence, cloud services, and cross-platform mobile development into software projects. Worked with Flutter, OpenAI APIs, workflow automation, cloud infrastructure, real-time systems, developer tools, and modern SaaS architecture while continuously improving engineering practices."
      },
      {
        year: "2025",
        title: "Developed Multiple SaaS Products & Business Solutions",
        description:
          "Designed and built a diverse portfolio of software products including portfolio management platforms, invoice generation systems, resume builders, AI-powered tools, business management applications, custom client solutions, and scalable web platforms with a strong emphasis on user experience and maintainable architecture."
      },
      {
        year: "2026",
        title: "Co-Founded Tapfolio",
        description:
          "Co-founded Tapfolio alongside Abhinand with the vision of modernizing professional networking through NFC-powered smart business cards and digital identity technology. Assumed the role of Chief Technology Officer, leading technology strategy, software architecture, engineering operations, and product development."
      },
      {
        year: "2026",
        title: "Architected the Tapfolio Ecosystem",
        description:
          "Designed and developed the complete Tapfolio technology stack, including the public website, SaaS dashboard, digital profile platform, authentication system, analytics engine, QR code generation, NFC provisioning workflows, profile customization studio, administrative tools, APIs, and scalable backend infrastructure."
      },
      {
        year: "2026",
        title: "Developed Mobile Applications & NFC Platform",
        description:
          "Built Tapfolio's Flutter mobile application with NFC read/write capabilities, digital business card sharing, QR code integration, profile synchronization, card activation, scan history, customizable digital cards, and seamless contactless networking experiences."
      },
      {
        year: "2026",
        title: "Built AI Systems & Developer Tools",
        description:
          "Developed JARVIS AI Assistant and explored intelligent automation using OpenAI APIs, AI agents, voice interaction, workflow automation, developer tooling, and productivity-focused software solutions. Continued researching practical applications of artificial intelligence in modern software products."
      },
      {
        year: "2026",
        title: "Created Business & Productivity Platforms",
        description:
          "Designed and developed multiple production-ready applications including the Tapfolio Invoice Printer Suite, Resume Builder, portfolio management systems, business automation tools, and other software focused on improving productivity, digital workflows, and user experience."
      },
      {
        year: "2026",
        title: "Built Software Across Multiple Industries",
        description:
          "Developed products spanning digital identity, SaaS platforms, e-commerce, educational technology, AI-powered applications, developer tools, service marketplaces, and custom business software. Contributed to projects including Tapfolio, OldSchoolTea, LocalConnect, Resume Builder, Invoice Printer Suite, portfolio systems, and various client-focused solutions."
      },
      {
        year: "Present",
        title: "Leading Technology & Scaling Tapfolio",
        description:
          "Continuing to lead Tapfolio's technology vision by expanding AI-powered automation, advanced analytics, enterprise-ready cloud infrastructure, NFC innovations, developer tools, intelligent digital identity systems, and globally scalable SaaS products focused on transforming professional networking."
      }
    ],
    skills: [
      {
        category: "Frontend Engineering",
        skills: [
          "Next.js (App Router)",
          "React",
          "TypeScript",
          "JavaScript (ES6+)",
          "HTML5",
          "CSS3",
          "Tailwind CSS",
          "Framer Motion",
          "Responsive Web Design",
          "Progressive Web Applications (PWA)",
          "Component Architecture",
          "State Management",
          "SEO Optimization",
          "Performance Optimization",
          "Accessibility (WCAG)"
        ]
      },
      {
        category: "Backend Engineering",
        skills: [
          "Node.js",
          "Express.js",
          "REST API Development",
          "Authentication & Authorization",
          "JWT",
          "OAuth",
          "File Upload Systems",
          "Server Architecture",
          "Microservices",
          "Webhooks",
          "Real-Time Applications",
          "Socket.IO",
          "API Integration"
        ]
      },
      {
        category: "Database & Data Engineering",
        skills: [
          "PostgreSQL",
          "MySQL",
          "MariaDB",
          "Prisma ORM",
          "Database Design",
          "Query Optimization",
          "Data Modeling",
          "Migration Management",
          "Relational Database Systems"
        ]
      },
      {
        category: "Mobile Development",
        skills: [
          "Flutter",
          "Dart",
          "Android Development",
          "Cross-Platform Applications",
          "Firebase Integration",
          "Mobile UI Design",
          "Native Device APIs",
          "QR Code Integration"
        ]
      },
      {
        category: "Cloud & DevOps",
        skills: [
          "Vercel",
          "Cloudflare",
          "AWS",
          "Docker",
          "Git",
          "GitHub",
          "CI/CD",
          "Linux",
          "Domain & DNS Management",
          "Cloud Deployment",
          "Server Configuration",
          "CDN Optimization"
        ]
      },
      {
        category: "Artificial Intelligence",
        skills: [
          "OpenAI APIs",
          "AI Agents",
          "Prompt Engineering",
          "LLM Integration",
          "Workflow Automation",
          "Retrieval-Augmented Generation (RAG)",
          "Vector Search",
          "AI Chatbots",
          "Speech-to-Text",
          "Developer AI Tools"
        ]
      },
      {
        category: "NFC & Digital Identity",
        skills: [
          "NFC Technology",
          "NTAG213",
          "NTAG215",
          "NTAG216",
          "NDEF Formatting",
          "Smart Business Cards",
          "Digital Identity Systems",
          "QR Code Technologies",
          "Contactless Networking",
          "Profile Synchronization"
        ]
      },
      {
        category: "UI/UX & Product Design",
        skills: [
          "Figma",
          "UI Design",
          "UX Design",
          "Design Systems",
          "Wireframing",
          "Prototyping",
          "Glassmorphism",
          "Animation Design",
          "User-Centered Design",
          "Product Thinking"
        ]
      },
      {
        category: "Software Architecture",
        skills: [
          "System Design",
          "Scalable SaaS Architecture",
          "Application Security",
          "Software Engineering",
          "Clean Architecture",
          "MVC Pattern",
          "Component-Driven Development",
          "Performance Engineering",
          "Technical Documentation"
        ]
      },
      {
        category: "Founder & Product Leadership",
        skills: [
          "Technical Strategy",
          "Product Architecture",
          "Startup Technology",
          "Product Development",
          "Technology Leadership",
          "Roadmap Planning",
          "Agile Development",
          "Cross-Functional Collaboration",
          "Innovation Management"
        ]
      }
    ],
    projects: [
      {
        title: "Tapfolio",
        role: "Co-Founder & CTO",
        year: "2026 - Present",
        description: "Smart NFC business card platform and live digital networking ecosystem.",
        techStack: ["Next.js", "TypeScript", "TailwindCSS", "PostgreSQL", "NFC / NDEF"],
        url: "https://www.tapfolio.me",
        github: "https://github.com/nibrasul/Add-1"
      },
      {
        title: "Invoice Printer Suite",
        role: "Lead Architect",
        year: "2026",
        description: "Web invoice editor featuring dynamic line items, total calculations, and vector PDF printing.",
        techStack: ["React", "TypeScript", "TailwindCSS", "PDF Engine"],
        url: "https://www.tapfolio.me/invoice-printer"
      },
      {
        title: "JARVIS AI Assistant",
        role: "AI Systems Architect",
        year: "2026",
        description: "Autonomous CLI & voice shell assistant for developer operations.",
        techStack: ["Node.js", "OpenAI API", "Python", "CLI Tooling"],
        github: "https://github.com/nibrasul"
      },
      {
        title: "Resume Builder",
        role: "Creator & Developer",
        year: "2026",
        description: "Interactive resume creation engine with real-time preview and export.",
        techStack: ["Next.js", "TypeScript", "Framer Motion"],
        github: "https://github.com/nibrasul"
      },
      {
        title: "OldSchoolTea",
        role: "Full Stack Engineer",
        year: "2026",
        description: "Storytelling e-commerce storefront for artisanal tea brand.",
        techStack: ["Next.js", "Stripe", "TailwindCSS"],
        url: "https://www.tapfolio.me"
      },
      {
        title: "LocalConnect",
        role: "Founder & Mobile Developer",
        year: "2026",
        description: "Location-aware service marketplace connecting customers with local labor.",
        techStack: ["React Native", "Flutter", "Firebase", "Node.js"]
      }
    ],
    companies: [
      {
        name: "Tapfolio",
        role: "Co-Founder & CTO",
        period: "2026 - Present",
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
    shortSummary: "Meet Abhinand K.S., Founder & CEO of Tapfolio. Discover his leadership, product vision, entrepreneurship, and the journey behind building Tapfolio.",
    email: "abhinandkspersonal@gmail.com",
    portfolioUrl: "https://www.tapfolio.me/portfolio/abhinand",
    socials: [
      { platform: "LinkedIn", url: "https://www.linkedin.com/in/abhinand-ks-428387332/" },
      { platform: "GitHub", url: "https://github.com/abhinand-me/" },
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

const slugAliasMap: Record<string, string> = {
  "abhinand": "abhinand",
  "abhinand-ks": "abhinand",
  "abhinand-k-s": "abhinand",
  "abhinand_ks": "abhinand",
  "mohammed-nibrasul-haqq": "mohammed-nibrasul-haqq",
  "nibras": "mohammed-nibrasul-haqq",
  "nibrasulhaqq": "mohammed-nibrasul-haqq",
  "nibrasul-haqq": "mohammed-nibrasul-haqq",
  "mohammed-nibras": "mohammed-nibrasul-haqq"
};

export function getFounderBySlug(slug: string): FounderProfile | undefined {
  if (!slug) return undefined;
  const normalized = slug.toLowerCase().trim();
  const targetKey = slugAliasMap[normalized] || normalized;
  return foundersData[targetKey];
}

