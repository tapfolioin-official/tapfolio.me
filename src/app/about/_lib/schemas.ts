/**
 * Generates the JSON-LD Organization schema for Tapfolio.
 */
export function getOrganizationSchema(): Record<string, any> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Tapfolio",
    "url": "https://tapfolio.me",
    "logo": "https://tapfolio.me/assets/logo.png",
    "description": "Tapfolio provides smart NFC professional profiles and digital business cards.",
    "email": "hello@tapfolio.me",
    "founder": [
      {
        "@type": "Person",
        "name": "Abhinand",
        "jobTitle": "Founder and CEO",
        "url": "https://tapfolio.me"
      }
    ],
    "founders": [
      {
        "@type": "Person",
        "name": "Abhinand",
        "jobTitle": "Founder and CEO"
      },
      {
        "@type": "Person",
        "name": "Mohammed Nibrasul Haqq",
        "jobTitle": "Co-founder and CTO"
      }
    ],
    "employee": [
      {
        "@type": "Person",
        "name": "Abhinand",
        "jobTitle": "Founder and CEO"
      },
      {
        "@type": "Person",
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
