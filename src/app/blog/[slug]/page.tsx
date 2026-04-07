import { notFound } from "next/navigation";
import Link from "next/link";
import { blogPosts } from "@/data/blog";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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

function convertHtmlToMarkdown(html: string): string {
  return html
    .replace(/<h2>/g, "## ")
    .replace(/<\/h2>/g, "\n\n")
    .replace(/<h3>/g, "### ")
    .replace(/<\/h3>/g, "\n\n")
    .replace(/<strong>/g, "**")
    .replace(/<\/strong>/g, "**")
    .replace(/<em>/g, "*")
    .replace(/<\/em>/g, "*")
    .replace(/<ul>/g, "\n")
    .replace(/<\/ul>/g, "\n")
    .replace(/<li>/g, "- ")
    .replace(/<\/li>/g, "\n")
    .replace(/<p>/g, "")
    .replace(/<\/p>/g, "\n\n")
    .replace(/<br\s*\/?>/g, "\n")
    .replace(/&nbsp;/g, " ");
}

function MarkdownContent({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mt-8 mb-4">{children}</h1>,
        h2: ({ children }) => <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-8 mb-3">{children}</h2>,
        h3: ({ children }) => <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mt-6 mb-2">{children}</h3>,
        p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
        ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>,
        li: ({ children }) => <li className="text-zinc-600 dark:text-zinc-300">{children}</li>,
        strong: ({ children }) => <strong className="font-semibold text-zinc-900 dark:text-white">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
        a: ({ href, children }) => <a href={href} className="text-blue-600 dark:text-blue-400 hover:underline">{children}</a>,
        blockquote: ({ children }) => <blockquote className="border-l-4 border-zinc-300 dark:border-zinc-600 pl-4 italic text-zinc-600 dark:text-zinc-400 my-4">{children}</blockquote>,
        code: ({ children }) => <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>,
        pre: ({ children }) => <pre className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg overflow-x-auto mb-4">{children}</pre>,
      }}
    >
      {children}
    </ReactMarkdown>
  );
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  
  if (!post) {
    notFound();
  }

  const markdown = convertHtmlToMarkdown(post.content);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <article>
          <header className="mb-6">
            <div className="flex items-center gap-2 mb-3 text-sm text-zinc-500">
              <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
              <span>•</span>
              <span>{post.author}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mb-4">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="text-zinc-500 dark:text-zinc-400">{post.excerpt}</p>
            )}
          </header>

          <div className="text-zinc-600 dark:text-zinc-300">
            <MarkdownContent>{markdown}</MarkdownContent>
          </div>
        </article>
      </div>
    </div>
  );
}
