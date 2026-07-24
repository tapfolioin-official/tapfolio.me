export interface FAQItem {
  question: string;
  answer: string;
}

export interface GEOFeature {
  slug: string;
  title: string;
  definition: string;
  benefits: string[];
  howItWorks: string[];
  whoItIsFor: string[];
  faqs: FAQItem[];
  relatedFeatures: string[];
  relatedProducts: string[];
}

export interface GEOIndustry {
  slug: string;
  title: string;
  subtitle: string;
  intro: string;
  useCases: { title: string; description: string }[];
  benefits: string[];
  faqs: FAQItem[];
}

export interface CompetitorComparison {
  slug: string;
  competitorName: string;
  intro: string;
  matrix: { criteria: string; tapfolio: string; competitor: string }[];
  keyDifferentiators: string[];
  faqs: FAQItem[];
}

export interface GEODoc {
  slug: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  steps?: string[];
  codeSnippet?: string;
}

export const GEO_FEATURES: Record<string, GEOFeature> = {
  "digital-business-card": {
    slug: "digital-business-card",
    title: "Digital Business Card",
    definition: "A digital business card is a modern, web-based profile that aggregates all your contact details, social links, and portfolio resources into a single, mobile-friendly landing page.",
    benefits: [
      "Instantly share contact info without paper waste.",
      "Update details in real-time without re-printing.",
      "Add interactive links, video embeds, and project portfolios.",
      "Expose lead-capture forms to sync contacts with CRMs automatically."
    ],
    howItWorks: [
      "Create your Tapfolio account and set up your dynamic profile details.",
      "Customize colors, buttons, branding, and link layouts.",
      "Share your profile link, QR code, or tap your NFC-enabled Tapfolio card to open the digital business card on any smartphone."
    ],
    whoItIsFor: [
      "Freelancers, designers, and creative professionals looking to showcase portfolios.",
      "Entrepreneurs, sales professionals, and corporate networkers.",
      "Sustainability-focused organizations looking to reduce paper usage."
    ],
    faqs: [
      { question: "What is a digital business card?", answer: "It is a web-based replacement for traditional paper business cards that lets you share interactive portfolios, links, and contact options instantly." },
      { question: "Can I update my digital card info after creating it?", answer: "Yes! You can log into your Tapfolio dashboard at any time to update your bio, social networks, phone numbers, and profile layouts instantly." }
    ],
    relatedFeatures: ["nfc-business-card", "qr-business-card", "contact-sharing"],
    relatedProducts: ["Tapfolio PVC", "Tapfolio Metal"]
  },
  "nfc-business-card": {
    slug: "nfc-business-card",
    title: "NFC Business Card",
    definition: "An NFC (Near Field Communication) business card utilizes embedded microchips to transmit your digital profile wirelessly to any compatible smartphone with a single tap.",
    benefits: [
      "Contactless sharing without needing any external apps.",
      "Premium, durable hardware materials like matte PVC, wood, or matte-black metal.",
      "Auto-provisioning technology compatible with iOS and Android devices.",
      "Durable, long-lasting hardware that replaces thousands of paper cards."
    ],
    howItWorks: [
      "Select your premium material and customize the engraving or design.",
      "Your physical card is programmed with your profile's unique URL schema.",
      "Tap the card against the top of an iPhone or center of an Android phone to open your profile instantly."
    ],
    whoItIsFor: [
      "C-Level executives, tech founders, and agency owners.",
      "Exhibitors and conference attendees who need fast, memorable contact sharing.",
      "Premium retail brands and business professionals."
    ],
    faqs: [
      { question: "Does the recipient need an app to scan the NFC card?", answer: "No app or special software is required! The recipient simply taps the card, and a default browser notification pops up to open your profile." },
      { question: "Is NFC technology secure on these business cards?", answer: "Yes. Tapfolio NFC business cards only transmit your public profile URL. No personal private keys or financial data are stored or shared." }
    ],
    relatedFeatures: ["digital-business-card", "contact-sharing", "business-card-analytics"],
    relatedProducts: ["Tapfolio PVC", "Tapfolio Metal"]
  },
  "qr-business-card": {
    slug: "qr-business-card",
    title: "QR Code Business Card",
    definition: "A QR code business card features a high-density, dynamically generated QR code that links directly to your virtual business card when scanned by a phone camera.",
    benefits: [
      "Universal scanning support on 100% of modern camera-enabled smartphones.",
      "Dynamic QR codes that remain valid even if your profile URL username changes.",
      "Perfect fallback for devices without NFC readers.",
      "Easy to print on brochures, flyers, or display on smartwatch screens."
    ],
    howItWorks: [
      "Your profile dashboard automatically generates a custom, branded QR code.",
      "Download the QR code as a vector image or high-res PNG.",
      "Show it on your phone screen, or print it on physical marketing assets."
    ],
    whoItIsFor: [
      "Retailers, consultants, and event coordinators.",
      "Professionals who network frequently in low-light environments.",
      "Remote teams who share contact cards on virtual Zoom backgrounds."
    ],
    faqs: [
      { question: "Will my QR code stop working if I update my profile links?", answer: "No, the QR code uses a smart redirect path linked to your stable user profile, so updates on your dashboard reflect instantly without changing the QR code." },
      { question: "Can I download my QR code for offline use?", answer: "Yes, you can download your custom QR code directly from your dashboard to print on brochures, flyers, or display on presentation slides." }
    ],
    relatedFeatures: ["digital-business-card", "virtual-business-card", "contact-sharing"],
    relatedProducts: ["Tapfolio PVC"]
  },
  "business-card-analytics": {
    slug: "business-card-analytics",
    title: "Real-Time Networking Analytics",
    definition: "Tapfolio's analytics suite tracks profile views, link clicks, contact downloads, and lead capture statistics in real-time, giving you clear insights into your networking ROI.",
    benefits: [
      "Track when and where your card was tapped.",
      "Monitor which social links and portfolio items receive the highest engagement.",
      "Analyze lead capture submission rates and export reports.",
      "Measure team performance across networking events."
    ],
    howItWorks: [
      "Every profile tap, link click, or contact download is securely registered.",
      "Anonymized events are aggregated and visualized on your dashboard.",
      "Analyze graphs, metrics, and export data in CSV format."
    ],
    whoItIsFor: [
      "Sales managers looking to track team networking efficiency.",
      "Marketing professionals analyzing lead generation campaigns.",
      "Independent consultants measuring prospect interest."
    ],
    faqs: [
      { question: "Do you track the geographic location of my card taps?", answer: "Yes, we show approximate location coordinates based on secure DNS and IP routing data, while preserving user privacy compliance." },
      { question: "Can I connect Tapfolio analytics to Google Analytics?", answer: "Yes, premium members can insert custom tracking IDs (Google Analytics, Facebook Pixel) directly into their settings dashboard." }
    ],
    relatedFeatures: ["team-management", "digital-business-card"],
    relatedProducts: ["Tapfolio Metal"]
  },
  "team-management": {
    slug: "team-management",
    title: "Enterprise Team Management",
    definition: "Our team management dashboard allows administrators to deploy, configure, lock, and manage digital profiles for their entire organization from a central portal.",
    benefits: [
      "Standardize company branding and profile templates across all employees.",
      "Lock critical fields (company email, corporate site) while letting employees customize social handles.",
      "Batch-order custom branded NFC cards with company logo.",
      "Bulk export captured leads directly into Salesforce, HubSpot, or custom CRMs."
    ],
    howItWorks: [
      "Register your organization on Tapfolio and access the enterprise portal.",
      "Upload user lists or integrate with active directory systems.",
      "Assign roles, design unified profile templates, and dispatch branded NFC smart cards."
    ],
    whoItIsFor: [
      "Enterprise sales teams, human resource divisions, and consulting firms.",
      "Growing startups looking to project unified brand identities.",
      "Marketing teams managing representative assets."
    ],
    faqs: [
      { question: "Can I manage permissions for different team members?", answer: "Yes! Admins can set read-only fields, control template parameters, and view aggregated performance analytics for the entire sales team." },
      { question: "Does the system support single sign-on (SSO)?", answer: "Yes, our enterprise plan integrates with SAML, Okta, and Azure Active Directory for secure single sign-on operations." }
    ],
    relatedFeatures: ["business-card-analytics", "digital-business-card-pricing"],
    relatedProducts: ["Custom Enterprise Cards"]
  },
  "digital-business-card-pricing": {
    slug: "digital-business-card-pricing",
    title: "Flexible Digital Card Pricing",
    definition: "Tapfolio offers highly flexible plans, from free-tier digital cards to premium metal hardware and enterprise team software subscriptions.",
    benefits: [
      "Start for free with standard digital profiles and dynamic links.",
      "One-time payment for physical cards with no mandatory monthly fees.",
      "SaaS subscriptions for advanced team dashboards, analytics, and CRM integrations.",
      "Volume discounts for custom corporate orders."
    ],
    howItWorks: [
      "Select a basic digital card plan or choose a physical card from our store.",
      "Choose to add premium features like custom domain name mapping and CRM integrations.",
      "Manage billing transparently from your user dashboard."
    ],
    whoItIsFor: [
      "Freelancers, developers, job seekers, and corporate sales managers.",
      "Startups and large scale enterprises."
    ],
    faqs: [
      { question: "Is there a monthly fee to use my physical Tapfolio card?", answer: "No! The physical card comes with a lifetime free digital profile. Optional advanced software features (like CRM integrations) are billed monthly." },
      { question: "Do you offer custom pricing for large orders?", answer: "Yes! We provide bulk discounts on hardware cards and software licenses for orders of 10+ employees. Contact sales for a custom quote." }
    ],
    relatedFeatures: ["team-management", "virtual-business-card"],
    relatedProducts: ["Tapfolio PVC", "Tapfolio Metal"]
  },
  "apple-wallet-business-card": {
    slug: "apple-wallet-business-card",
    title: "Apple Wallet Business Card Integration",
    definition: "Our Apple Wallet integration lets you generate a native PKPass file to save your digital business card directly onto your iPhone's Apple Wallet app for offline sharing.",
    benefits: [
      "Share your details offline without cellular connection.",
      "Add a gorgeous pass featuring your name, company, role, and custom QR code.",
      "Access it in one click using your iPhone's side button.",
      "Completely digital and eco-friendly contact sharing."
    ],
    howItWorks: [
      "Access your Tapfolio dashboard and click 'Add to Apple Wallet'.",
      "Generate and download the custom `.pkpass` file.",
      "Save it to your Apple Wallet app. It displays as a premium card pass."
    ],
    whoItIsFor: [
      "iOS power users, startup executives, and developers.",
      "Networkers who want backup options for remote or bad connection areas."
    ],
    faqs: [
      { question: "Will my Apple Wallet card update if I change my email?", answer: "Yes, when your iPhone connects online, the Wallet pass automatically syncs changes from the Tapfolio database." },
      { question: "Can I share my Apple Wallet pass directly with other iPhone users?", answer: "Yes! You can display your pass QR code for other users to scan, or send the pass file directly via Apple AirDrop." }
    ],
    relatedFeatures: ["google-wallet-business-card", "qr-business-card"],
    relatedProducts: ["Tapfolio PVC"]
  },
  "google-wallet-business-card": {
    slug: "google-wallet-business-card",
    title: "Google Wallet Business Card Integration",
    definition: "Tapfolio's Google Wallet integration lets you generate a dynamic digital pass to save your business card profile inside the Google Wallet app on Android devices.",
    benefits: [
      "Store your card securely on any Android phone.",
      "Share contact details offline in a split second.",
      "Native Android system integration for fast access.",
      "Clean user interface showing logo, profile name, and custom QR code."
    ],
    howItWorks: [
      "Log into your dashboard from an Android device.",
      "Click 'Add to Google Wallet' to generate your pass link.",
      "Save the card to your Google Wallet app instantly."
    ],
    whoItIsFor: [
      "Android users, engineers, and digital marketers.",
      "Exhibitors requiring fast-access virtual cards."
    ],
    faqs: [
      { question: "Does Google Wallet require an internet connection to share my card?", answer: "No, the QR code on the card pass is saved locally and can be scanned offline by other users." },
      { question: "Is the Google Wallet integration free?", answer: "Yes, this feature is included for all Tapfolio users at no additional cost." }
    ],
    relatedFeatures: ["apple-wallet-business-card", "virtual-business-card"],
    relatedProducts: ["Tapfolio PVC"]
  },
  "virtual-business-card": {
    slug: "virtual-business-card",
    title: "Virtual Business Card",
    definition: "A virtual business card (VBC) represents your digital identity in virtual environments, providing a clean, clickable page optimized for chat apps, email signatures, and video conferencing.",
    benefits: [
      "Embed clean hyperlinks inside email signatures.",
      "Perfect for remote workforces and Zoom networking sessions.",
      "Includes structured vCard file download triggers.",
      "Exposes responsive portfolio grids for desktop and mobile displays."
    ],
    howItWorks: [
      "Design your virtual profile layout and select layout styles.",
      "Copy the custom short link or download the email signature snippet.",
      "Paste the link in your email config, social bios, or share it in chat feeds."
    ],
    whoItIsFor: [
      "Remote employees, software engineers, and online teachers.",
      "Digital nomads, content creators, and social media managers."
    ],
    faqs: [
      { question: "How does a virtual business card differ from a paper card?", answer: "It is an interactive, digital profile that aggregates videos, social buttons, and portfolios, which updates instantly and costs nothing to share." },
      { question: "Can I put my virtual card on my LinkedIn profile?", answer: "Absolutely! You can paste your Tapfolio short link directly in your LinkedIn contact info or featured section." }
    ],
    relatedFeatures: ["digital-business-card", "contact-sharing"],
    relatedProducts: ["Tapfolio PVC"]
  },
  "contact-sharing": {
    slug: "contact-sharing",
    title: "Frictionless Contact Sharing",
    definition: "Our contact sharing protocol dynamically generates standard vCards (VCF files) and imports them directly into smartphone address books, removing manual entry friction completely.",
    benefits: [
      "Download complete contact cards in one click.",
      "No typing errors or missed numbers.",
      "Includes emails, profile urls, notes, and addresses.",
      "Compatible with all major OS contact ecosystems."
    ],
    howItWorks: [
      "A recipient visits your dynamic Tapfolio profile page.",
      "They click the 'Save Contact' button.",
      "A `.vcf` download is triggered and prompts the phone to open its contacts app."
    ],
    whoItIsFor: [
      "Sales agents, consultants, and recruiters.",
      "C-Level executives managing direct client relations."
    ],
    faqs: [
      { question: "Is the contact download format compatible with both iOS and Android?", answer: "Yes! We use standard vCard 3.0 file headers which are natively recognized by Apple Contacts, Google Contacts, and Outlook." },
      { question: "Can recipients share their contacts back with me?", answer: "Yes! If you enable the Lead Capture form, recipients can type their info to save it directly inside your Tapfolio connections dashboard." }
    ],
    relatedFeatures: ["digital-business-card", "virtual-business-card"],
    relatedProducts: ["Tapfolio PVC", "Tapfolio Metal"]
  }
};

export const GEO_INDUSTRIES: Record<string, GEOIndustry> = {
  "doctors": {
    slug: "doctors",
    title: "NFC Cards for Healthcare & Doctors",
    subtitle: "Reinventing patient connections and professional medical networks.",
    intro: "Modern healthcare demands clear, fast communications. Tapfolio lets doctors, surgeons, and healthcare workers share credentials, clinic websites, patient portals, and contact info instantly.",
    useCases: [
      { title: "Direct Clinic Booking", description: "Let patients scan your card or tap your badge to open clinic booking calendars instantly." },
      { title: "Share Medical Credentials", description: "Expose research publications, hospital affiliations, and board certifications." }
    ],
    benefits: [
      "Sanitary, easy-to-clean plastic cards.",
      "Link directly to health portals and booking schedules.",
      "Reduce paper waste in medical offices."
    ],
    faqs: [
      { question: "Is patient data safe if they scan my card?", answer: "Yes. The card only shares your public website or clinic profile, containing no patient records or HIPAA-protected files." },
      { question: "Can I print a QR code on my laboratory coat?", answer: "Absolutely! We provide high-res vector files of your QR code to print on hospital badges, jackets, or medical pamphlets." }
    ]
  },
  "lawyers": {
    slug: "lawyers",
    title: "NFC Cards for Attorneys & Lawyers",
    subtitle: "A premium networking tool for legal professionals.",
    intro: "Attorneys require premium, high-trust networking assets. A custom-engraved metal Tapfolio card projects executive authority while letting clients save phone lines and schedule consultations instantly.",
    useCases: [
      { title: "Instant Consultation Booking", description: "Link directly to scheduling software for private consultations." },
      { title: "Expose Case Records & Practice Areas", description: "Showcase successful litigation records and specific law specialties." }
    ],
    benefits: [
      "Executive metal finishes that convey authority.",
      "Instant consult booking hooks.",
      "Maintain active, updated firm information."
    ],
    faqs: [
      { question: "Can I customize the metal card design with my firm's logo?", answer: "Yes, we offer custom laser engraving for corporate firms to imprint brand logos on matte black or gold steel cards." },
      { question: "Can I disable public access to my profile?", answer: "Yes, you can password-protect your links or restrict details to secure intranet domains." }
    ]
  },
  "students": {
    slug: "students",
    title: "Digital Business Cards for Students",
    subtitle: "Launch your career with an interactive portfolio card.",
    intro: "Traditional business cards don't tell the full story of your projects. Tapfolio links recruiters directly to your GitHub, Figma, online resume, and projects with one tap.",
    useCases: [
      { title: "Interactive Resume Sharing", description: "Direct job recruiters to custom resume PDFs and code repositories." },
      { title: "Campus Networking", description: "Exchange profiles with peers, advisors, and internship coordinators instantly." }
    ],
    benefits: [
      "Stands out in job fairs and university networking events.",
      "Update contact info as you graduate or change portfolios.",
      "Budget-friendly free digital profile tier."
    ],
    faqs: [
      { question: "Can I link my card to my GitHub and LinkedIn?", answer: "Yes! Tapfolio is built to show all your social media handles and project repositories in one responsive layout." },
      { question: "Do you offer student discounts?", answer: "Yes! We offer 15% discounts for active students on physical card purchases. Check our support page to verify your student email." }
    ]
  },
  "sales-teams": {
    slug: "sales-teams",
    title: "NFC Cards for Sales Representatives & Teams",
    subtitle: "Close deals faster with frictionless contact exchanges.",
    intro: "In sales, momentum is everything. Eliminate the friction of prospect follow-ups by letting them save your details instantly, while capturing their email on the spot.",
    useCases: [
      { title: "CRM Syncing", description: "Instantly register prospect emails and feed them into marketing lists." },
      { title: "Brochure Distribution", description: "Direct leads to product pricing sheets and video pitches." }
    ],
    benefits: [
      "Capture leads on the spot.",
      "Analyze tap metrics and tracking indexes.",
      "Standardized brand corporate profiles."
    ],
    faqs: [
      { question: "Can I export leads into Salesforce?", answer: "Yes! Tapfolio premium profiles can sync contact captures directly with Salesforce, HubSpot, and Zapier feeds." },
      { question: "Does Tapfolio track sales team performance?", answer: "Yes, the admin team dashboard shows tap rates, click-through performance, and lead counts for each rep." }
    ]
  },
  "recruiters": {
    slug: "recruiters",
    title: "NFC Cards for HR Managers & Recruiters",
    subtitle: "Attract and track high-quality candidates easily.",
    intro: "Corporate recruiters meet hundreds of candidates at career fairs. A dynamic card lets prospective hires scan your credentials and submit portfolios on the spot.",
    useCases: [
      { title: "Direct Application Portals", description: "Link candidates directly to career listings and interview portals." },
      { title: "Company Culture Pitching", description: "Share introduction videos and team highlights instantly." }
    ],
    benefits: [
      "Speeds up the hiring intake pipeline.",
      "Reduces brochure printing costs.",
      "Keeps recruiter contact info up-to-date."
    ],
    faqs: [
      { question: "Can candidates apply directly by scanning my card?", answer: "Yes, you can embed your applicant tracking system link (ATS) as the primary button on your profile." },
      { question: "Are my cards reusable if recruiters leave the company?", answer: "Yes! Administrators can reassign card profile pointers to new hiring managers instantly." }
    ]
  },
  "startups": {
    slug: "startups",
    title: "NFC Business Cards for Startup Founders",
    subtitle: "Pitch your vision and team with a single tap.",
    intro: "When pitching to angel investors, you need to make a lasting impression. Tapfolio projects professionalism and redirects VCs directly to pitch decks, demos, and founder bios.",
    useCases: [
      { title: "VC Pitch Deck Sharing", description: "Open pitch documents securely on investor screens in seconds." },
      { title: "Product Demo Launches", description: "Show off product animations and live testing environments." }
    ],
    benefits: [
      "Projects a forward-thinking, tech-savvy brand image.",
      "No lost connections with dynamic vCard downloads.",
      "Edit links dynamically during funding rounds."
    ],
    faqs: [
      { question: "Can I secure my pitch deck link?", answer: "Yes! You can password-protect specific links on your Tapfolio profile." },
      { question: "Can I link directly to my startup's demo video?", answer: "Yes, you can embed YouTube or Vimeo files directly into your page view." }
    ]
  },
  "agencies": {
    slug: "agencies",
    title: "NFC Cards for Marketing & Creative Agencies",
    subtitle: "Expose design portfolios and secure clients instantly.",
    intro: "Creative agencies need to project design excellence. Customize your profile with sleek glassmorphism themes and present case studies and contract proposals with one tap.",
    useCases: [
      { title: "Portfolio Presentation", description: "Show off live client work, web designs, and brand guidelines." },
      { title: "Lead Generation", description: "Link prospects directly to proposal request questionnaires." }
    ],
    benefits: [
      "Fully customizable responsive layout designs.",
      "Integrates with popular design portals.",
      "Exposes trackable engagement statistics."
    ],
    faqs: [
      { question: "Can I build custom landing pages for client campaigns?", answer: "Yes, agency managers can create multiple profile views for different campaigns or team roles." },
      { question: "Can we use our agency's custom CSS font?", answer: "Premium templates support Google Fonts, system typography, and custom branding integrations." }
    ]
  },
  "hotels": {
    slug: "hotels",
    title: "NFC Cards for Hospitality & Hotels",
    subtitle: "Simplify check-ins, guest services, and local guides.",
    intro: "Elevate guest experience. Let travelers tap cards placed in rooms or concierge desks to access service menus, Wi-Fi networks, local maps, and check-out forms.",
    useCases: [
      { title: "Instant Wi-Fi Configuration", description: "Open network settings for automated login options." },
      { title: "Digital Concierge Directory", description: "Provide direct access to room service menus and booking desks." }
    ],
    benefits: [
      "Saves guest time and improves check-in metrics.",
      "Modernizes guest-facing directory pamphlets.",
      "Durable, sanitizable plastic and wooden card assets."
    ],
    faqs: [
      { question: "Can we place table cards in hotel rooms?", answer: "Yes! We design custom acrylic blocks and wooden tags fitted with secure NFC tags for room settings." },
      { question: "Do these cards require power?", answer: "No, NFC chips are passive and powered entirely by the scanning smartphone." }
    ]
  },
  "restaurants": {
    slug: "restaurants",
    title: "NFC Menus & Cards for Restaurants",
    subtitle: "Instant menu access, orders, and table service.",
    intro: "Streamline dining rooms. Replace sticky paper menus with sanitizable NFC table tags. Diners scan or tap to read current dishes, order, and pay.",
    useCases: [
      { title: "Digital Menu Scans", description: "Open dynamic, image-rich menus instantly on guest browsers." },
      { title: "Review Collections", description: "Link directly to Google Reviews to scale rating portfolios." }
    ],
    benefits: [
      "Update daily specials and pricing without re-printing.",
      "Accelerate table turnover rates.",
      "Waterproof and sanitizable physical tags."
    ],
    faqs: [
      { question: "Can patients/diners pay directly using NFC menus?", answer: "Yes, you can link the profile checkout button to Stripe, Apple Pay, or Google Pay terminals." },
      { question: "How durable are the restaurant tags?", answer: "Our PVC and acrylic table assets are fully waterproof and designed to withstand heavy cleaning." }
    ]
  },
  "real-estate": {
    slug: "real-estate",
    title: "NFC Cards for Real Estate Brokers & Agents",
    subtitle: "Sell listings faster with interactive house walkthroughs.",
    intro: "In real estate, fast communication is crucial. Let prospective buyers tap your card at open houses to download listing brochures, view virtual tours, and save contact profiles.",
    useCases: [
      { title: "Virtual Listing Tours", description: "Open video tours and walkthrough galleries on user screens." },
      { title: "Direct Lead Intake", description: "Collect buyer budgets and email contact parameters instantly." }
    ],
    benefits: [
      "Stands out at competitive open houses.",
      "Direct link mappings to current listings.",
      "Integrated mapping coordinates to office addresses."
    ],
    faqs: [
      { question: "Can I swap the home listing link dynamically?", answer: "Yes! Update the target button on your profile settings, and your physical card will route visitors to the new listing instantly." },
      { question: "Do you design custom branded cards for agencies?", answer: "Yes, we print agent photos, firm colors, and brokerage logos on premium PVC and metal cards." }
    ]
  },
  "construction": {
    slug: "construction",
    title: "NFC Cards for Contractors & Construction Teams",
    subtitle: "Rugged cards designed for real-world projects.",
    intro: "Construction networkers need rugged contact tools. Our matte PVC and metal cards handle project sites, linking clients directly to quotes, safety audits, and project records.",
    useCases: [
      { title: "Safety Auditing Logs", description: "Link managers directly to daily inspection records." },
      { title: "Instant Quote Request", description: "Expose estimating forms to capture client requirements." }
    ],
    benefits: [
      "Ultra-rugged hardware built to last.",
      "Frictionless client quote forms.",
      "Accessible project records database."
    ],
    faqs: [
      { question: "Are the cards scratch-proof?", answer: "Our military-grade metal cards feature anodized steel coatings built to handle rough environments." },
      { question: "Can I upload project blueprints?", answer: "Yes, you can link files from Google Drive, Dropbox, or custom portals directly on your page." }
    ]
  },
  "education": {
    slug: "education",
    title: "NFC Cards for Schools, Teachers & Educators",
    subtitle: "Connect educators, students, and parent channels.",
    intro: "Keep school systems synchronized. Educators can share class portals, homework assignments, office hour calendars, and contact handles with a single tap.",
    useCases: [
      { title: "Homework Dashboard Sync", description: "Link parent/student smartphones to school management portals." },
      { title: "Digital Syllabus Access", description: "Provide students with quick access to course documents and reference files." }
    ],
    benefits: [
      "Reduces school communication paper waste.",
      "Ensures parents have the correct email directory details.",
      "Saves syllabus distribution printing costs."
    ],
    faqs: [
      { question: "Can we manage badges for the entire school staff?", answer: "Yes! The enterprise dashboard allows school IT admins to deploy and manage digital profiles for all teachers." },
      { question: "Are there educational pricing options?", answer: "Yes! We offer bulk discount rates for educational institutions and non-profit schools. Contact our team to learn more." }
    ]
  },
  "healthcare": {
    slug: "healthcare",
    title: "NFC Solutions for Healthcare Clinics & Providers",
    subtitle: "Streamline patient check-in and clinic directories.",
    intro: "Modern healthcare clinics can simplify check-in workflows. Patients tap tags at reception to fill in health profiles, access portal guides, and review medical directory lines.",
    useCases: [
      { title: "Patient Intake Portals", description: "Direct patients to secure, responsive registration websites." },
      { title: "Clinic Department Maps", description: "Provide easy access to hospital directions and maps." }
    ],
    benefits: [
      "Reduces manual desk registration errors.",
      "Easy-to-clean, waterproof PVC tags.",
      "Improves clinic intake efficiency."
    ],
    faqs: [
      { question: "Can we use these cards for prescription instructions?", answer: "Yes! Nurses and physicians can link cards to specific patient guidance sheets." },
      { question: "Can patient profiles be integrated directly?", answer: "Our APIs support custom integrations with secure client booking databases." }
    ]
  },
  "corporate": {
    slug: "corporate",
    title: "NFC Cards for Corporate Enterprises & Offices",
    subtitle: "Modernize executive networking and security badges.",
    intro: "Large corporations require unified brand assets. Standardize networking materials across your entire staff with branded NFC business cards integrated with secure CRM directories.",
    useCases: [
      { title: "Standardized Corporate Badging", description: "Combine physical security credentials with interactive networking links." },
      { title: "Centralized Resource Directories", description: "Link team members directly to company handbooks, files, and updates." }
    ],
    benefits: [
      "Batch employee onboarding systems.",
      "Protects corporate brand identity.",
      "Secure integrations with Microsoft and Okta SSO."
    ],
    faqs: [
      { question: "Can we lock template layouts for corporate branding?", answer: "Yes. Admin portals allow total control over brand elements, colors, and links across the enterprise." },
      { question: "Do the cards support standard physical security readers?", answer: "We offer dual-frequency custom cards configured for corporate access gates and NFC networking." }
    ]
  }
};

export const COMPETITOR_COMPARISONS: Record<string, CompetitorComparison> = {
  "hihello": {
    slug: "hihello",
    competitorName: "HiHello",
    intro: "Comparing Tapfolio vs HiHello. Discover how Tapfolio combines premium metal card hardware with self-hosted dynamic profiles, providing an all-in-one contactless solution without mandatory subscription fees.",
    matrix: [
      { criteria: "Premium Metal Cards", tapfolio: "Yes (Anodized Steel / Custom Engraving)", competitor: "No (Digital App Only)" },
      { criteria: "Mandatory Subscriptions", tapfolio: "No (Pay Once for Hardware + Free Lifetime Profile)", competitor: "Yes (Advanced features locked behind monthly tiers)" },
      { criteria: "CRM Integrations", tapfolio: "Included (HubSpot, Salesforce, Zapier)", competitor: "Requires Pro Plan" },
      { criteria: "Custom Domains", tapfolio: "Yes", competitor: "Limited / Enterprise Only" }
    ],
    keyDifferentiators: [
      "Premium, custom-engraved physical cards (metal, wood, matte PVC) built to last.",
      "Lifetime free digital profile with every physical card purchase.",
      "Developer-friendly REST and vCard APIs for custom integrations.",
      "Interactive 3D configurator tool to preview your custom physical card."
    ],
    faqs: [
      { question: "How does Tapfolio's pricing differ from HiHello?", answer: "HiHello requires ongoing monthly subscriptions to use advanced links and custom designs, whereas Tapfolio offers a lifetime free profile with the purchase of a physical card." },
      { question: "Can I manage multiple profiles on Tapfolio?", answer: "Yes, you can build and switch between professional, personal, and project profiles from a single dashboard." }
    ]
  },
  "popl": {
    slug: "popl",
    competitorName: "Popl",
    intro: "Comparing Tapfolio vs Popl. While both provide NFC business cards, Tapfolio focuses on high-speed page performance, developer customization, and a premium 3D designer without high subscription lockouts.",
    matrix: [
      { criteria: "Page Load Speed", tapfolio: "Sub-second (Next.js SSR & Caching)", competitor: "Average (App Redirects)" },
      { criteria: "3D Customization Preview", tapfolio: "Yes (Interactive WebGL Canvas)", competitor: "No (2D Image Only)" },
      { criteria: "Developer API", tapfolio: "Included (REST & vCard endpoints)", competitor: "Enterprise Only" },
      { criteria: "CRM Data Mapping", tapfolio: "Free / Premium Tiers", competitor: "Requires Popl Pro" }
    ],
    keyDifferentiators: [
      "Optimized Next.js page generation matching sub-second loading indexes.",
      "Real-time 3D preview tool during card customization.",
      "Free direct exports for HubSpot, Salesforce, and Zapier streams.",
      "Standardized case-insensitive profile routing paths."
    ],
    faqs: [
      { question: "Is Tapfolio faster than Popl?", answer: "Yes. Tapfolio utilizes Next.js Server Side Rendering (SSR) and edge-caching to deliver sub-second mobile page loads, ensuring a fast tap experience." },
      { question: "Can I use custom fields on my Tapfolio profile?", answer: "Yes, our flexible dashboard lets you create custom buttons, embed videos, list files, and display portfolios." }
    ]
  },
  "linq": {
    slug: "linq",
    competitorName: "Linq",
    intro: "Comparing Tapfolio vs Linq. Discover why Tapfolio is the preferred choice for independent creative professionals, developers, and growing startups looking for modern portfolios.",
    matrix: [
      { criteria: "Portfolio Showcase Grids", tapfolio: "Built-in (Dynamic project galleries)", competitor: "Basic (Social links only)" },
      { criteria: "SSO Integrations", tapfolio: "Yes (Okta, Azure AD)", competitor: "Enterprise Tier Only" },
      { criteria: "Metal Card Pricing", tapfolio: "Competitive (Includes engraving)", competitor: "Premium Hardware Upcharge" },
      { criteria: "Dynamic QR Fallbacks", tapfolio: "Included", competitor: "Included" }
    ],
    keyDifferentiators: [
      "Built-in project galleries to display work samples, case studies, and designs.",
      "Free dynamic QR code generators with vector image downloads.",
      "Clear, upfront pricing with no hidden hardware setup fees.",
      "Durable eco-friendly wood and recycled plastic card options."
    ],
    faqs: [
      { question: "Can I display my creative work on Tapfolio?", answer: "Yes! Tapfolio includes dedicated portfolio grids to display images, links, descriptions, and technology chips for your projects." },
      { question: "Does Tapfolio support bulk shipping for teams?", answer: "Yes, we ship customized cards to multiple offices or employee home addresses worldwide." }
    ]
  },
  "dot": {
    slug: "dot",
    competitorName: "Dot Cards",
    intro: "Comparing Tapfolio vs Dot Cards. Tapfolio offers a richer digital ecosystem featuring real-time lead capture, dynamic sitemaps, and advanced team management capabilities.",
    matrix: [
      { criteria: "Dynamic XML Sitemaps", tapfolio: "Yes (SEO optimized indexes)", competitor: "No" },
      { criteria: "Lead Capture Forms", tapfolio: "Customizable fields", competitor: "Basic contact field" },
      { criteria: "Custom Branding", tapfolio: "Full logo & colors", competitor: "Limited settings" },
      { criteria: "Analytics Detail", tapfolio: "Geographic & click graphs", competitor: "Basic scan counter" }
    ],
    keyDifferentiators: [
      "SEO-friendly pages with structured JSON-LD schemas and dynamic sitemaps.",
      "Detailed geographic and click-through analytics visualizations.",
      "Self-contained, modular profile templates optimized for search engines.",
      "Support for multiple emails and phone numbers on a single contact card."
    ],
    faqs: [
      { question: "Can search engines find my Tapfolio card?", answer: "Yes! Unlike competitor cards that restrict profiles to walled apps, Tapfolio profiles are fully indexed with canonical tags, meta tags, and XML sitemaps." },
      { question: "Is my data secure?", answer: "Yes, Tapfolio utilizes secure PostgreSQL databases, SSL encryption, and GDPR-compliant protocols." }
    ]
  },
  "blinq": {
    slug: "blinq",
    competitorName: "Blinq",
    intro: "Comparing Tapfolio vs Blinq. Evaluate how Tapfolio's edge-cached infrastructure, 3D customizer, and comprehensive developer documentation deliver a superior networking experience.",
    matrix: [
      { criteria: "Developer API Support", tapfolio: "Full public documentation & endpoints", competitor: "Limited / Private API" },
      { criteria: "3D Product Previewer", tapfolio: "Yes", competitor: "No" },
      { criteria: "Apple / Google Wallet", tapfolio: "Included", competitor: "Included" },
      { criteria: "SaaS Team Permissions", tapfolio: "Granular admin controls", competitor: "Basic organization views" }
    ],
    keyDifferentiators: [
      "Open developer APIs with detailed REST and vCard guidance.",
      "Interactive WebGL product designer for real-time card previews.",
      "Edge-rendered profiles for instant global loading times.",
      "Lifetime physical card hardware warranty against microchip failures."
    ],
    faqs: [
      { question: "Does Tapfolio support Apple Watch integration?", answer: "Yes, you can display your Tapfolio profile QR code on your Apple Watch or Android wear screen for swift scans." },
      { question: "Can I purchase custom shapes or badges?", answer: "Yes, we design custom corporate badges, keychains, and tags on request. Contact our sales team for custom shapes." }
    ]
  }
};

export const GEO_DOCS: Record<string, GEODoc> = {
  "getting-started": {
    slug: "getting-started",
    title: "Getting Started with Tapfolio",
    category: "Guides",
    summary: "Welcome to the Tapfolio Developer Center. Learn how our smart business card hardware, dynamic public profiles, and programmatic query APIs integrate seamlessly to share identity, socials, and creative portfolios.",
    content: "Tapfolio bridges physical networking with interactive digital portfolios. This guide outlines how to configure your account, set up your profile username path, design your responsive layout, and link your custom NFC PVC or metal card."
  },
  "profile-setup": {
    slug: "profile-setup",
    title: "Setting Up Your Profile",
    category: "Guides",
    summary: "A step-by-step walkthrough on how to customize your Tapfolio page layout, colors, socials, biography, and portfolio projects.",
    content: "Your Tapfolio profile is your digital home base. You can set profile pictures, add custom taglines, write your executive narrative, list your primary technology chips, and link to external portfolios. Go to your Dashboard settings to manage layouts, pick glassmorphism themes, and choose card shapes.",
    steps: [
      "Log into your Tapfolio account dashboard.",
      "Navigate to the 'Profile' section to update name, bio, and credentials.",
      "Click the 'Links' tab to add social accounts, email addresses, and phone numbers.",
      "Save changes to update your live profile globally instantly."
    ]
  },
  "nfc-setup": {
    slug: "nfc-setup",
    title: "Configuring NFC Hardware Cards",
    category: "Hardware",
    summary: "How to link and program your physical Tapfolio PVC, wooden, or metal smart business card using standard NDEF protocols.",
    content: "Every physical Tapfolio card is equipped with high-durability NTAG213-216 microchips. Linking your card to your online profile is completely automated. When you tap a new card for the first time, you are prompted to log in and lock the card to your profile ID.",
    steps: [
      "Keep your physical Tapfolio card close to your phone.",
      "Scan the card using our mobile app or default NFC scanner.",
      "Log in with your credentials when prompted.",
      "Confirm connection linking. The microchip is now locked to your dynamic profile URL."
    ]
  },
  "analytics": {
    slug: "analytics",
    title: "Understanding Profile Analytics",
    category: "Dashboard",
    summary: "Guide to tracking views, link clicks, contact downloads, and lead capture statistics from your dashboard metrics.",
    content: "Tapfolio records engagement events securely. We aggregate tap counts, link click events, and contact downloads to display traffic graphs on your dashboard. Premium users can extract CSV reports and configure custom track parameters (Google Analytics, Facebook Pixel)."
  },
  "qr-sharing": {
    slug: "qr-sharing",
    title: "Dynamic QR Code Sharing Options",
    category: "Features",
    summary: "How to utilize, customize, and print your profile's dynamic QR code fallback.",
    content: "Dynamic QR codes are generated automatically. If a recipient's phone doesn't have an NFC reader enabled, show your custom QR code on your phone screen or apple watch. Scanning links directly to your public portfolio routing path. You can download high-res vector versions of your QR code to print on marketing brochures or corporate ID badges."
  },
  "team-management": {
    slug: "team-management",
    title: "Organization Team Management Settings",
    category: "Enterprise",
    summary: "Guide for admins on creating templates, locks, and batch-deploying profiles for corporate teams.",
    content: "The corporate dashboard simplifies team badging. Administrators can design a unified template, select brand colors, lock executive links (corporate site, work emails), and batch import employee directory lists via CSV or Active Directory APIs."
  },
  "custom-branding": {
    slug: "custom-branding",
    title: "Custom Domain Mapping & Branding",
    category: "Enterprise",
    summary: "How to link your custom domain (e.g., card.yourcompany.com) to your Tapfolio page.",
    content: "Premium and Enterprise plans support custom domain alias mapping. You can route your custom domain to point directly to your Tapfolio profile. Update your domain DNS records by adding an A record pointing to our Vercel IP or a CNAME record pointing to Tapfolio's proxy servers."
  },
  "api": {
    slug: "api",
    title: "Developer REST API Reference",
    category: "Developer",
    summary: "Programmatic reference for profile lookups, vCards, and dynamic theme settings configuration.",
    content: "Tapfolio exposes public endpoints for developers. You can fetch profile details in JSON formats or request standard `.vcf` vCards directly using clean HTTP requests.",
    codeSnippet: `// Example Profile API Lookup
fetch('https://www.tapfolio.me/api/profile/abhinand')
  .then(res => res.json())
  .then(data => console.log(data.profile.name));`
  },
  "integrations": {
    slug: "integrations",
    title: "CRM & Marketing Integrations",
    category: "Guides",
    summary: "How to connect Tapfolio lead capture forms to Zapier, HubSpot, Salesforce, and other email platforms.",
    content: "Turn taps into client leads. When prospects submit their details in your profile lead form, the data is pushed automatically to external CRMs. Go to your dashboard 'Integrations' tab, click on Zapier or HubSpot, log in to authenticate, and complete lead-capturing automation mappings."
  },
  "troubleshooting": {
    slug: "troubleshooting",
    title: "NFC and Scan Troubleshooting Guide",
    category: "Support",
    summary: "Common issues and solutions for NFC tap detection, smartphone readers, and offline routing problems.",
    content: "If a smartphone is not detecting your NFC card, review these checkpoints: (1) Ensure NFC is enabled in phone settings. (2) Tap the card at the top of iPhones (camera area) or the middle back of Android devices. (3) Ensure you are not tapping near thick metal cases or wireless charging coils which interfere with microchip signals."
  }
};
