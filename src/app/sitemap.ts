import { MetadataRoute } from 'next';
import prisma from '@/lib/db';
import { LANDING_PAGES } from '@/lib/content/landing-pages';
import { INDUSTRIES } from '@/lib/content/industries';
import { PRODUCTS } from '@/lib/content/products';
import { COMPARISONS } from '@/lib/content/comparison';
import { BLOG_POSTS } from '@/lib/content/blog-posts';
import { GEO_DOCS } from '@/lib/geo-data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const timestamp = new Date();
  const host = 'https://www.tapfolio.me';

  // 1. Core Pages
  const corePages: MetadataRoute.Sitemap = [
    { url: `${host}`, lastModified: timestamp, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${host}/founders`, lastModified: timestamp, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${host}/founders/mohammed-nibrasul-haqq`, lastModified: timestamp, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${host}/founders/abhinand`, lastModified: timestamp, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${host}/nibrasulhaqq`, lastModified: timestamp, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${host}/portfolio/abhinand`, lastModified: timestamp, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${host}/about`, lastModified: timestamp, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${host}/team`, lastModified: timestamp, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${host}/contact`, lastModified: timestamp, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${host}/privacy`, lastModified: timestamp, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${host}/terms`, lastModified: timestamp, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${host}/docs`, lastModified: timestamp, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${host}/pricing`, lastModified: timestamp, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${host}/careers`, lastModified: timestamp, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${host}/refund`, lastModified: timestamp, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${host}/support`, lastModified: timestamp, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${host}/blog`, lastModified: timestamp, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${host}/leaderboard`, lastModified: timestamp, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${host}/history`, lastModified: timestamp, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${host}/customer-success`, lastModified: timestamp, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${host}/resources`, lastModified: timestamp, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${host}/company`, lastModified: timestamp, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${host}/technology`, lastModified: timestamp, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${host}/press`, lastModified: timestamp, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${host}/media-kit`, lastModified: timestamp, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${host}/mission`, lastModified: timestamp, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${host}/developers`, lastModified: timestamp, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${host}/business`, lastModified: timestamp, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${host}/enterprise`, lastModified: timestamp, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${host}/students`, lastModified: timestamp, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${host}/teams`, lastModified: timestamp, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${host}/solutions`, lastModified: timestamp, changeFrequency: 'weekly', priority: 0.8 }
  ];

  // 2. Landing Pages
  const landingPages: MetadataRoute.Sitemap = Object.keys(LANDING_PAGES).map(slug => ({
    url: `${host}/${slug}`,
    lastModified: timestamp,
    changeFrequency: 'weekly',
    priority: 0.8
  }));

  // 3. Comparison Pages
  const comparisonPages: MetadataRoute.Sitemap = Object.keys(COMPARISONS).map(slug => ({
    url: `${host}/${slug}`,
    lastModified: timestamp,
    changeFrequency: 'weekly',
    priority: 0.8
  }));

  // 4. Product Catalog Pages
  const productPages: MetadataRoute.Sitemap = Object.keys(PRODUCTS).map(slug => ({
    url: `${host}/products/${slug}`,
    lastModified: timestamp,
    changeFrequency: 'weekly',
    priority: 0.9
  }));

  // 5. Solution (Industry) Pages
  const solutionPages: MetadataRoute.Sitemap = Object.keys(INDUSTRIES).map(slug => ({
    url: `${host}/solutions/${slug}`,
    lastModified: timestamp,
    changeFrequency: 'weekly',
    priority: 0.8
  }));

  // 6. Dynamic Documentation Pages
  const docPages: MetadataRoute.Sitemap = Object.keys(GEO_DOCS).map(slug => ({
    url: `${host}/docs/${slug}`,
    lastModified: timestamp,
    changeFrequency: 'weekly',
    priority: 0.8
  }));

  // 7. Blog Articles
  const blogPages: MetadataRoute.Sitemap = BLOG_POSTS.map(post => ({
    url: `${host}/blog/${post.slug}`,
    lastModified: timestamp,
    changeFrequency: 'weekly',
    priority: 0.8
  }));

  // 8. Dynamic User Profiles
  let profilePages: MetadataRoute.Sitemap = [];
  try {
    const profiles = await prisma.profile.findMany({
      where: {
        isOnline: true,
        user: {
          profileReady: true
        }
      },
      select: {
        username: true
      }
    });

    profilePages = profiles.map(p => ({
      url: `${host}/portfolio/${p.username}`,
      lastModified: timestamp,
      changeFrequency: 'monthly',
      priority: 0.8
    }));
  } catch (err) {
    console.error('Failed to query profiles for dynamic sitemap:', err);
  }

  return [
    ...corePages,
    ...landingPages,
    ...comparisonPages,
    ...productPages,
    ...solutionPages,
    ...docPages,
    ...blogPages,
    ...profilePages
  ];
}
