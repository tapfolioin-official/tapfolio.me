/**
 * Generates the JSON-LD Organization schema for Tapfolio.
 */
export function getOrganizationSchema(): Record<string, any> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Tapfolio",
    "url": "https://www.tapfolio.me",
    "logo": "https://www.tapfolio.me/logo.png",
    "description": "Showcase your professional links, track your networking connections, and join the exclusive premium leaderboard in one tap.",
    "email": "hello@tapfolio.me",
    "founders": [
      {
        "@type": "Person",
        "name": "Mohammed Nibrasul Haqq",
        "jobTitle": "Co-founder & CEO"
      },
      {
        "@type": "Person",
        "name": "Abhinand",
        "jobTitle": "Co-founder & CTO"
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
