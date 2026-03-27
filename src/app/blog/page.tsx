"use client";

import Link from "next/link";
import { blogPosts } from "@/data/blog";
import { Text } from "@/components/ui/text";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

export const dynamic = "force-dynamic";

export default function BlogPage() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch("/api/auth/status").then(r => r.json()).then(data => {
      setIsAdmin(!!data.isLoggedIn);
    }).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50/70 dark:bg-zinc-950/70 pt-24 pb-20 overflow-hidden relative transition-colors duration-300">
      <div className="absolute top-20 right-1/4 w-80 h-80 bg-brand-accent/10 rounded-full blur-[100px] opacity-40 animate-in fade-in duration-1000 pointer-events-none" />
      
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Text variant="muted" weight="bold" className="text-sm uppercase tracking-[0.2em]">
              Latest News
            </Text>
            {isAdmin && (
              <Link href="/admin?tab=blog">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Plus className="h-3.5 w-3.5" />
                  Create
                </Button>
              </Link>
            )}
          </div>
          <Text asChild size="2xl" weight="extrabold" className="tracking-tight text-3xl sm:text-4xl md:text-6xl lg:text-7xl">
            <h1>
              <span className="text-brand-accent">Blog</span>
            </h1>
          </Text>
          <Text variant="muted" className="mt-4 text-lg max-w-xl mx-auto">
            Stay updated with the latest news, announcements, and articles from our community.
          </Text>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          {blogPosts.map((post, index) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <Card className="group h-full hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50 transition-all duration-500 overflow-hidden border-zinc-200/50 dark:border-zinc-800/50 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-sm hover:shadow-lg hover:border-brand-accent/30">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-3">
                    <Text size="xs" weight="medium" className="text-zinc-500">
                      {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </Text>
                    <span className="text-zinc-300 dark:text-zinc-700">•</span>
                    <div className="flex gap-1">
                      {post.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-brand-accent/10 text-brand-accent">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Text size="lg" weight="bold" className="text-zinc-900 dark:text-white mb-2 group-hover:text-brand-accent transition-colors">
                    {post.title}
                  </Text>
                  <Text size="sm" variant="muted" className="flex-1 line-clamp-3">
                    {post.excerpt}
                  </Text>
                  <Text size="xs" variant="muted" className="mt-4">
                    By {post.author}
                  </Text>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}