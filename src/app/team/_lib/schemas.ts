interface PersonParams {
  name: string;
  jobTitle: string;
  description: string;
  image: string;
  url: string;
  sameAs?: string[];
}

/**
 * Generates the JSON-LD Person schema.
 */
export function getPersonSchema(params: PersonParams): Record<string, any> {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": params.name,
    "jobTitle": params.jobTitle,
    "worksFor": {
      "@type": "Organization",
      "name": "Tapfolio",
      "url": "https://www.tapfolio.me"
    },
    "image": params.image.startsWith('http') ? params.image : `https://www.tapfolio.me${params.image}`,
    "url": params.url,
    "description": params.description,
    "sameAs": params.sameAs || []
  };
}
