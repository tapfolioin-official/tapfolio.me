import article1 from './blog/what-is-nfc-business-card';
import article2 from './blog/best-nfc-business-card';
import article3 from './blog/nfc-security';

export interface BlogPost {
  slug: string;
  title: string;
  summary: string;
  date: string;
  author: string;
  readTime: string;
  content: string;
}

export const BLOG_POSTS: BlogPost[] = [
  article1,
  article2,
  article3
];
