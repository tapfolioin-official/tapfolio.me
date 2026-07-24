import { FounderProfile } from "../_data/founders";

export const ORGANIZATION_ID = "https://www.tapfolio.me/#organization";
export const WEBSITE_ID = "https://www.tapfolio.me/#website";

/**
 * Returns the Organization JSON-LD Schema with stable @id and founder references.
 */
export function getOrganizationEntitySchema(): Record<string, any> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    "name": "Tapfolio",
    "url": "https://tapfolio.me",
    "logo": {
      "@type": "ImageObject",
      "url": "https://tapfolio.me/assets/logo.png"
    },
    "description": "Tapfolio provides smart NFC professional profiles and digital business cards.",
    "email": "hello@tapfolio.me",
    "founder": [
      {
        "@type": "Person",
        "@id": "https://www.tapfolio.me/founders/abhinand#person",
        "name": "Abhinand",
        "jobTitle": "Founder and CEO",
        "url": "https://tapfolio.me"
      }
    ],
    "founders": [
      {
        "@type": "Person",
        "@id": "https://www.tapfolio.me/founders/abhinand#person",
        "name": "Abhinand",
        "jobTitle": "Founder and CEO"
      },
      {
        "@type": "Person",
        "@id": "https://www.tapfolio.me/founders/mohammed-nibrasul-haqq#person",
        "name": "Mohammed Nibrasul Haqq",
        "jobTitle": "Co-founder and CTO"
      }
    ],
    "employee": [
      {
        "@type": "Person",
        "@id": "https://www.tapfolio.me/founders/abhinand#person",
        "name": "Abhinand",
        "jobTitle": "Founder and CEO"
      },
      {
        "@type": "Person",
        "@id": "https://www.tapfolio.me/founders/mohammed-nibrasul-haqq#person",
        "name": "Mohammed Nibrasul Haqq",
        "jobTitle": "Co-founder and CTO"
      }
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "hello@tapfolio.me",
      "contactType": "customer support"
    },
    "sameAs": [
      "https://x.com/tapfolio",
      "https://linkedin.com/company/tapfolio",
      "https://github.com/tapfolio"
    ]
  };
}

/**
 * Generates rich Google Knowledge Graph JSON-LD Person schema with stable @id.
 */
export function getPersonEntitySchema(founder: FounderProfile): Record<string, any> {
  const canonicalUrl = `https://www.tapfolio.me/founders/${founder.slug}`;
  const personId = `${canonicalUrl}#person`;

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": personId,
    "name": founder.name,
    "alternateName": founder.alternateName || founder.name,
    "jobTitle": founder.jobTitle,
    "description": founder.shortSummary,
    "url": canonicalUrl,
    "image": {
      "@type": "ImageObject",
      "url": `https://www.tapfolio.me${founder.avatar}`,
      "caption": `${founder.name} - ${founder.jobTitle} at Tapfolio`
    },
    "worksFor": {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      "name": "Tapfolio",
      "url": "https://www.tapfolio.me",
      "logo": "https://www.tapfolio.me/logo.png"
    },
    "sameAs": founder.socials.map(s => s.url),
    "knowsAbout": founder.skills.flatMap(c => c.skills),
    "nationality": {
      "@type": "Country",
      "name": founder.quickFacts.nationality
    },
    "knowsLanguage": founder.quickFacts.languages,
    "alumniOf": founder.education.map(e => ({
      "@type": "EducationalOrganization",
      "name": e.institution
    }))
  };
}

/**
 * Generates ProfilePage schema linking mainEntity -> Person.
 */
export function getProfilePageSchema(founder: FounderProfile): Record<string, any> {
  const canonicalUrl = `https://www.tapfolio.me/founders/${founder.slug}`;
  const personId = `${canonicalUrl}#person`;

  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": canonicalUrl,
    "url": canonicalUrl,
    "name": `${founder.name} | ${founder.jobTitle} | Tapfolio`,
    "description": founder.shortSummary,
    "mainEntity": {
      "@id": personId
    }
  };
}

/**
 * Generates BreadcrumbList schema.
 */
export function getFounderBreadcrumbSchema(founder: FounderProfile): Record<string, any> {
  const canonicalUrl = `https://www.tapfolio.me/founders/${founder.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.tapfolio.me"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Founders",
        "item": "https://www.tapfolio.me/founders"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": founder.name,
        "item": canonicalUrl
      }
    ]
  };
}

/**
 * Generates FAQPage schema for entity Q&A.
 */
export function getFounderFAQSchema(founder: FounderProfile): Record<string, any> | null {
  if (!founder.faqs || founder.faqs.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": founder.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

/**
 * Generates Article schema with Founder Author Attribution for Knowledge Graph signals.
 */
export function getArticleEntitySchema(article: {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  datePublished: string;
  dateModified?: string;
  founderSlug: string;
  founderName: string;
}): Record<string, any> {
  const founderPersonId = `https://www.tapfolio.me/founders/${article.founderSlug}#person`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.description,
    "mainEntityOfPage": article.url,
    "image": article.imageUrl ? [article.imageUrl] : undefined,
    "datePublished": article.datePublished,
    "dateModified": article.dateModified || article.datePublished,
    "author": {
      "@type": "Person",
      "@id": founderPersonId,
      "name": article.founderName,
      "url": `https://www.tapfolio.me/founders/${article.founderSlug}`
    },
    "publisher": {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      "name": "Tapfolio",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.tapfolio.me/logo.png"
      }
    }
  };
}

/**
 * Backward compatibility helper for simple Person schema calls.
 */
export function getPersonSchema(params: any): Record<string, any> {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": params.name,
    "jobTitle": params.jobTitle,
    "worksFor": {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      "name": "Tapfolio",
      "url": "https://www.tapfolio.me"
    },
    "image": params.image ? (params.image.startsWith('http') ? params.image : `https://www.tapfolio.me${params.image}`) : undefined,
    "url": params.url,
    "description": params.description,
    "sameAs": params.sameAs || []
  };
}
