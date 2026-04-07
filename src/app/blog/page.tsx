"use client";

import Link from "next/link";
import { blogPosts } from "@/data/blog";

function HeroSection() {
  return (
    <section className="py-16 px-4 bg-white dark:bg-zinc-950">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">
          Blog
        </h1>
        <p className="mt-3 text-zinc-500 dark:text-zinc-400">
          Latest news and updates from NexusMines
        </p>
      </div>
    </section>
  );
}

function BlogList() {
  if (blogPosts.length === 0) {
    return (
      <section className="px-4 py-12 bg-zinc-50 dark:bg-zinc-900">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-zinc-500">No blog posts yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-12 bg-zinc-50 dark:bg-zinc-900">
      <div className="max-w-3xl mx-auto">
        <div className="grid gap-4">
          {blogPosts.map((post) => (
            <Link 
              key={post.slug} 
              href={`/blog/${post.slug}`}
              className="block p-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2 text-xs text-zinc-500">
                <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
              </div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-1">
                {post.title}
              </h2>
              <p className="text-sm text-zinc-500 line-clamp-2">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <HeroSection />
      <BlogList />
    </div>
  );
}
