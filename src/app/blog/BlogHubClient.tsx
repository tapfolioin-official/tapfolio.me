"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Calendar, Clock, ArrowRight } from "lucide-react";
import { BlogPost } from "@/lib/content/blog-posts";

interface Props {
  posts: BlogPost[];
}

export default function BlogHubClient({ posts }: Props) {
  // Client-side state for search & filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(12);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(posts.map(post => post.category));
    return ["All", ...Array.from(cats)];
  }, [posts]);

  // Filter blog posts based on search query and category
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, selectedCategory]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setVisibleCount(12); // Reset page count
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setVisibleCount(12); // Reset page count
  };

  const loadMore = () => {
    setVisibleCount(prev => prev + 9);
  };

  const postsToShow = filteredPosts.slice(0, visibleCount);

  return (
    <main className="flex-1 w-full max-w-[1200px] mx-auto px-6 py-12 flex flex-col gap-12">
      
      {/* Header Block */}
      <section className="text-center max-w-3xl mx-auto flex flex-col gap-4 mt-4 animate-fade-in">
        <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full w-fit mx-auto shadow-sm">
          Tapfolio Insights
        </span>
        <h1 className="text-4xl md:text-6xl font-display font-extrabold text-slate-950 tracking-tight leading-tight">
          Knowledge for Modern <span className="text-blue-600">Networking</span>
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
          Discover guidelines on NFC card technology, CRM database integration, lead-generation tips, and contactless profile setups.
        </p>
      </section>

      {/* Controls: Search & Category Tabs */}
      <section className="flex flex-col gap-6 bg-white border border-slate-200/65 rounded-3xl p-6 shadow-sm">
        {/* Search Input */}
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search topics, tags, or articles..." 
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-normal text-sm"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 items-center overflow-x-auto pb-1">
          {categories.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => handleCategorySelect(category)}
                className={`text-xs font-bold px-4.5 py-2.5 rounded-full transition-all border whitespace-nowrap ${
                  isActive 
                    ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/10" 
                    : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200 hover:border-slate-300"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </section>

      {/* Blog Post List (Grid Layout) */}
      <section className="flex flex-col gap-10">
        {postsToShow.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {postsToShow.map((post) => (
              <article
                key={post.slug}
                className="bg-white border border-slate-200/65 rounded-3xl overflow-hidden flex flex-col justify-between hover:border-slate-300/80 hover:shadow-md hover:scale-[1.01] transition-all duration-300 shadow-sm"
              >
                <div className="flex flex-col">
                  {/* Card Cover Image */}
                  {post.image && (
                    <div className="w-full aspect-[16/9] relative overflow-hidden bg-slate-100 border-b border-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  )}

                  {/* Content Section */}
                  <div className="p-6 flex flex-col gap-4">
                    <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
                      <span className="text-blue-600">{post.category}</span>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{post.date}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                      </div>
                    </div>

                    <h3 className="font-display font-extrabold text-slate-900 text-xl leading-snug hover:text-blue-600 transition-colors">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>

                    <p className="text-sm text-slate-500 leading-relaxed font-normal line-clamp-3">
                      {post.summary}
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-6 py-4.5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-[10px] font-extrabold flex items-center justify-center">
                      {post.author.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-xs text-slate-500 font-medium">By {post.author.split(' ')[0]}</span>
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Read Post <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-slate-200/65 rounded-3xl shadow-sm flex flex-col items-center gap-3">
            <span className="text-slate-300 font-extrabold text-4xl">🔍</span>
            <h3 className="font-bold text-slate-800 text-xl">No articles found</h3>
            <p className="text-sm text-slate-500 font-normal">Try matching different keywords or selecting another category filter.</p>
          </div>
        )}

        {/* Load More Button */}
        {filteredPosts.length > visibleCount && (
          <div className="flex justify-center mt-4">
            <button
              onClick={loadMore}
              className="bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm px-8 py-3.5 rounded-full border border-slate-200 hover:border-slate-300 shadow-sm active:scale-95 transition-all duration-200"
            >
              Load More Articles ({filteredPosts.length - visibleCount} remaining)
            </button>
          </div>
        )}
      </section>

    </main>
  );
}
