import { notFound } from "next/navigation";
import Link from "next/link";
import { blogPosts } from "@/data/blog";
import { Text } from "@/components/ui/text";
import { ArrowLeft } from "lucide-react";
import "./blog-post.css";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  
  if (!post) return { title: "Post Not Found | NexusMines" };
  
  return {
    title: `${post.title} | NexusMines Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  
  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50/70 dark:bg-zinc-950/70 pt-24 pb-20 overflow-hidden relative transition-colors duration-300">
      <div className="absolute top-20 right-1/4 w-80 h-80 bg-brand-accent/10 rounded-full blur-[100px] opacity-40 animate-in fade-in duration-1000 pointer-events-none" />
      
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-brand-accent transition-colors mb-8 animate-in fade-in slide-in-from-left-4 duration-500">
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>

        <article className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Text size="sm" weight="medium" className="text-zinc-500">
                {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </Text>
              <span className="text-zinc-300 dark:text-zinc-700">•</span>
              <Text size="sm" variant="muted">
                By {post.author}
              </Text>
            </div>
            <Text asChild size="2xl" weight="extrabold" className="text-zinc-900 dark:text-white mb-4 tracking-tight text-3xl sm:text-4xl md:text-5xl">
              <h1>{post.title}</h1>
            </Text>
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <span key={tag} className="text-xs px-3 py-1 rounded-full bg-brand-accent/10 text-brand-accent font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </header>

          <div 
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </div>
    </div>
  );
}
