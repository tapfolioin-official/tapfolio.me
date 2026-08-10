/**
 * Generates the JSON-LD Organization schema for Tapfolio.
 */
export function getOrganizationSchema(): Record<string, any> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://tapfolio.me/#organization",
    "name": "Tapfolio",
    "alternateName": "Tapfolio Inc.",
    "url": "https://tapfolio.me",
    "logo": {
      "@type": "ImageObject",
      "url": "https://tapfolio.me/logo.png",
      "width": "512",
      "height": "512",
      "caption": "Tapfolio Logo"
    },
    "description": "Tapfolio provides smart NFC professional profiles and digital business cards.",
    "email": "tapfolio.in@gmail.com",
    "foundingLocation": {
      "@type": "Place",
      "name": "Kochi, India"
    },
    "foundingDate": "2026",
    "founder": [
      {
        "@type": "Person",
        "@id": "https://tapfolio.me/founders/abhinand#person",
        "name": "Abhinand K.S.",
        "jobTitle": "Founder and CEO",
        "url": "https://tapfolio.me/founders/abhinand"
      }
    ],
    "founders": [
      {
        "@type": "Person",
        "@id": "https://tapfolio.me/founders/abhinand#person",
        "name": "Abhinand K.S.",
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
        "name": "Abhinand K.S.",
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
      "email": "tapfolio.in@gmail.com",
      "contactType": "customer support"
    }
  };
}
