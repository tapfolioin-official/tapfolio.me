import { MetadataRoute } from 'next';
import prisma from '@/lib/db';
import { GEO_FEATURES, GEO_INDUSTRIES, COMPETITOR_COMPARISONS, GEO_DOCS } from '@/lib/geo-data';
import { BLOG_POSTS } from './blog/page';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const timestamp = new Date();
  const host = 'https://www.tapfolio.me';

  // 1. Core pages (incorporates original items to ensure nothing is removed)
  const corePages: MetadataRoute.Sitemap = [
    { url: `${host}`, lastModified: timestamp, changeFrequency: 'yearly', priority: 1.0 },
    { url: `${host}/founders`, lastModified: timestamp, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${host}/founders/mohammed-nibrasul-haqq`, lastModified: timestamp, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${host}/founders/abhinand`, lastModified: timestamp, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${host}/portfolio/nibras`, lastModified: timestamp, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${host}/portfolio/Abhinand`, lastModified: timestamp, changeFrequency: 'monthly', priority: 0.8 },
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
  ];

  // 2. Dynamic GEO features pages
  const featurePages: MetadataRoute.Sitemap = Object.keys(GEO_FEATURES).map(slug => ({
    url: `${host}/${slug}`,
    lastModified: timestamp,
    changeFrequency: 'weekly',
    priority: 0.8
  }));

  // 3. Dynamic GEO industries pages
  const industryPages: MetadataRoute.Sitemap = Object.keys(GEO_INDUSTRIES).map(slug => ({
    url: `${host}/${slug}`,
    lastModified: timestamp,
    changeFrequency: 'weekly',
    priority: 0.8
  }));

  // 4. Dynamic Competitor Comparison pages
  const comparisonPages: MetadataRoute.Sitemap = Object.keys(COMPETITOR_COMPARISONS).map(slug => ({
    url: `${host}/tapfolio-vs-${slug}`,
    lastModified: timestamp,
    changeFrequency: 'weekly',
    priority: 0.8
  }));

  // 5. Dynamic Documentation pages
  const docPages: MetadataRoute.Sitemap = Object.keys(GEO_DOCS).map(slug => ({
    url: `${host}/docs/${slug}`,
    lastModified: timestamp,
    changeFrequency: 'weekly',
    priority: 0.8
  }));

  // 6. Dynamic Blog articles pages
  const blogPages: MetadataRoute.Sitemap = BLOG_POSTS.map(post => ({
    url: `${host}/blog/${post.slug}`,
    lastModified: timestamp,
    changeFrequency: 'weekly',
    priority: 0.8
  }));

  // 7. Dynamic active user profiles from database
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
    ...featurePages,
    ...industryPages,
    ...comparisonPages,
    ...docPages,
    ...blogPages,
    ...profilePages
  ];
}
