'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface ArticleSummary {
  slug: string;
  title: string;
  summary: string;
  date: string;
  readTime: string;
  author: string;
}

export default function FeaturedBlogsSection() {
  const [featured, setFeatured] = useState<ArticleSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/blog/posts?limit=3&status=PUBLISHED')
      .then((res) => res.json())
      .then((data) => {
        if (data.posts && data.posts.length > 0) {
          setFeatured(
            data.posts.map((p: any) => ({
              slug: p.slug,
              title: p.title,
              summary: p.summary,
              date: p.publishedAt
                ? new Date(p.publishedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Recently Published',
              readTime: p.readingTime || '5 min read',
              author: p.authorName || 'Tapfolio Team',
            }))
          );
        }
      })
      .catch((err) => console.error('Failed to load featured articles:', err))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && featured.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-24 bg-white flex justify-center border-t border-b border-gray-100">
      <div className="max-w-[1200px] w-full px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-bold tracking-widest text-blue-600 uppercase mb-2 block">
            Resource Library
          </span>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-gray-950">
            Popular Blogs & Guides
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featured.map((post) => (
            <article 
              key={post.slug}
              className="border border-gray-100 bg-gray-50/50 rounded-3xl p-8 flex flex-col justify-between hover:shadow-xl hover:border-blue-100 transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-4">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="font-display font-bold text-gray-900 text-xl leading-snug mb-3 hover:text-blue-600 transition-colors">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-6">{post.summary}</p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-400 font-medium">By {post.author}</span>
                <Link 
                  href={`/blog/${post.slug}`}
                  className="text-xs font-bold text-blue-600 hover:text-blue-500"
                >
                  Read Article →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
