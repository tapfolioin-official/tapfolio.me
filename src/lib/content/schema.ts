import { ORGANIZATION_ID, WEBSITE_ID } from '@/lib/geo-schemas';

export function getEnhancedProductSchema(product: {
  name: string;
  description: string;
  price: string;
  rating: number;
  reviewCount: number;
  slug: string;
  reviews: { author: string; comment: string; rating: number; date: string }[];
}): Record<string, any> {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": `https://www.tapfolio.me/assets/products/${product.slug}.webp`,
    "description": product.description,
    "brand": {
      "@type": "Brand",
      "name": "Tapfolio"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://www.tapfolio.me/products/${product.slug}`,
      "priceCurrency": "USD",
      "price": product.price.replace('$', '').replace('one-time payment', '').trim(),
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.reviewCount
    },
    "review": product.reviews.map(r => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": r.author
      },
      "datePublished": r.date,
      "reviewBody": r.comment,
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": r.rating
      }
    }))
  };
}

export function getArticleSchema(post: {
  slug: string;
  title: string;
  summary: string;
  date: string;
  author: string;
}): Record<string, any> {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": `https://www.tapfolio.me/blog/${post.slug}`,
    "headline": post.title,
    "description": post.summary,
    "datePublished": post.date,
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "publisher": {
      "@id": ORGANIZATION_ID
    }
  };
}
