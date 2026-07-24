export const ORGANIZATION_ID = "https://tapfolio.me/#organization";
export const WEBSITE_ID = "https://tapfolio.me/#website";

export function getOrganizationSchema(): Record<string, any> {
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
        "@id": "https://tapfolio.me/founders/abhinand#person",
        "name": "Abhinand",
        "jobTitle": "Founder and CEO",
        "url": "https://tapfolio.me"
      }
    ],
    "founders": [
      {
        "@type": "Person",
        "@id": "https://tapfolio.me/founders/abhinand#person",
        "name": "Abhinand",
        "jobTitle": "Founder and CEO"
      },
      {
        "@type": "Person",
        "@id": "https://tapfolio.me/founders/mohammed-nibrasul-haqq#person",
        "name": "Mohammed Nibrasul Haqq",
        "jobTitle": "Co-founder and CTO"
      }
    ],
    "employee": [
      {
        "@type": "Person",
        "@id": "https://tapfolio.me/founders/abhinand#person",
        "name": "Abhinand",
        "jobTitle": "Founder and CEO"
      },
      {
        "@type": "Person",
        "@id": "https://tapfolio.me/founders/mohammed-nibrasul-haqq#person",
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

export function getWebsiteSchema(): Record<string, any> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    "name": "Tapfolio",
    "url": "https://tapfolio.me",
    "publisher": {
      "@id": ORGANIZATION_ID
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://tapfolio.me/portfolio/{search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };
}

export function getWebPageSchema(url: string, name: string, description: string): Record<string, any> {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    "url": url,
    "name": name,
    "description": description,
    "isPartOf": {
      "@id": WEBSITE_ID
    },
    "about": {
      "@id": ORGANIZATION_ID
    }
  };
}

export function getProductSchema(name: string, description: string, price?: string): Record<string, any> {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": name,
    "description": description,
    "brand": {
      "@type": "Brand",
      "name": "Tapfolio"
    },
    "offers": price ? {
      "@type": "Offer",
      "price": price,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "url": "https://tapfolio.me"
    } : undefined
  };
}

export function getSoftwareApplicationSchema(name: string, description: string): Record<string, any> {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": name,
    "operatingSystem": "All",
    "applicationCategory": "BusinessApplication",
    "description": description,
    "publisher": {
      "@id": ORGANIZATION_ID
    }
  };
}

export function getFAQPageSchema(faqs: { question: string; answer: string }[]): Record<string, any> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer
      }
    }))
  };
}

export function getLocalBusinessSchema(name: string, description: string, url: string): Record<string, any> {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": name,
    "description": description,
    "url": url,
    "image": "https://tapfolio.me/assets/logo.png",
    "parentOrganization": {
      "@id": ORGANIZATION_ID
    }
  };
}

export function getBreadcrumbSchema(items: { name: string; url: string }[]): Record<string, any> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((it, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": it.name,
      "item": it.url
    }))
  };
}
