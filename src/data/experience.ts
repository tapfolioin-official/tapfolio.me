export interface ExperienceItem {
  id: string;
  year: string;
  type: "STARTUP" | "CLIENT WORK" | "FREELANCE" | "ACADEMIC";
  company: string;
  role: string;
  location: string;
  icon: string;
  description: string;
  outcome: string;
  responsibilities: string[];
  technologies: string[];
  bullets: string[];
  link?: string;
}

export const experiences: ExperienceItem[] = [
  {
    id: "exp-tapfolio",
    year: "2024 – Present",
    type: "STARTUP",
    company: "Tapfolio",
    role: "Co-Founder & CTO",
    location: "Kochi & Bangalore, India",
    icon: "🚀",
    description: "Co-founded and engineered Tapfolio, a smart digital identity ecosystem combining physical NFC hardware with real-time web profiles.",
    outcome: "Successfully scaled platform to power digital identities, contact sharing, and lead capture workflows across multiple markets.",
    responsibilities: ["Technical Vision & CTO Leadership", "Full-Stack Next.js Architecture", "NFC Hardware Provisioning", "Database & Edge Deployment"],
    technologies: ["Next.js", "TypeScript", "TailwindCSS", "PostgreSQL", "Supabase", "Flutter", "NFC / NDEF", "Vercel"],
    bullets: [
      "Architected Next.js App Router platform, PostgreSQL database schemas, and API routes handling instant lead sync.",
      "Engineered multi-device NFC card provisioning algorithms and custom vanity URL routing.",
      "Established CI/CD pipeline on Vercel delivering sub-second page loads and 99.9% uptime."
    ],
    link: "https://www.tapfolio.me"
  },
  {
    id: "exp-old-school-tea",
    year: "2025",
    type: "CLIENT WORK",
    company: "Old School Tea",
    role: "Lead Full-Stack Developer",
    location: "Kochi, India",
    icon: "☕",
    description: "Engineered a storytelling-driven e-commerce digital presence tailored for a traditional artisanal tea brand.",
    outcome: "Elevated direct-to-consumer brand positioning and optimized product discoverability with zero layout shifts.",
    responsibilities: ["E-Commerce UX Design", "Frontend Performance Tuning", "Stripe Checkout Integration"],
    technologies: ["Next.js", "TypeScript", "TailwindCSS", "Stripe API", "Framer Motion"],
    bullets: [
      "Crafted a custom storytelling web application with immersive visual asset loading and responsive checkout flows.",
      "Optimized Core Web Vitals and image delivery pipelines to maximize digital customer conversions."
    ],
    link: "https://www.tapfolio.me"
  },
  {
    id: "exp-localconnect",
    year: "2024",
    type: "STARTUP",
    company: "LocalConnect",
    role: "Founder & Mobile Developer",
    location: "Kerala, India",
    icon: "📱",
    description: "Conceived and launched a location-aware service marketplace connecting customers with local labor and technicians.",
    outcome: "Streamlined local service discovery and double-sided transaction routing with sub-second request matching.",
    responsibilities: ["Mobile App Architecture", "Real-Time Request Routing", "Backend Database Design"],
    technologies: ["React Native", "Flutter", "Firebase Firestore", "Node.js", "Google Maps API"],
    bullets: [
      "Designed double-sided transaction routing and automated job assignment algorithms using React Native and Firebase.",
      "Integrated in-app messaging and simplified billing workflows for local service workers."
    ]
  },
  {
    id: "exp-consulting",
    year: "2023 – 2024",
    type: "FREELANCE",
    company: "Bespoke Software Consulting",
    role: "Contract Software Engineer",
    location: "Remote",
    icon: "💻",
    description: "Consulted for startups and enterprise clients to build custom SaaS applications, analytics dashboards, and web systems.",
    outcome: "Accelerated client product launches and refactored legacy codebases into modern component-driven architectures.",
    responsibilities: ["Full-Stack Engineering", "Codebase Refactoring", "Performance Optimization"],
    technologies: ["React", "Next.js", "Node.js", "PostgreSQL", "TailwindCSS", "AWS"],
    bullets: [
      "Refactored monolithic legacy codebases into modular, component-driven Next.js architectures.",
      "Optimized page load speeds and API response times, achieving 95+ Lighthouse performance scores."
    ]
  },
  {
    id: "exp-education",
    year: "2023",
    type: "ACADEMIC",
    company: "Computer Science & Foundation",
    role: "Software Engineering & Academic Milestone",
    location: "India",
    icon: "🎓",
    description: "Formal computer science foundation focusing on algorithms, database management systems, data structures, and computer networks.",
    outcome: "Built core algorithmic problem-solving discipline and published early web utility applications.",
    responsibilities: ["Algorithmic Study", "Database Systems Design", "Object-Oriented Programming"],
    technologies: ["C++", "Python", "Java", "SQL", "HTML/CSS", "JavaScript"],
    bullets: [
      "Studied foundational data structures, relational database management (RDBMS), and distributed network protocols.",
      "Engineered early web prototypes and open-source utility tools, launching a lifetime passion for software product development."
    ]
  }
];
