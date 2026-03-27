import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/text";
import { Heart, Github, MessageCircle } from "lucide-react";

const FOOTER_LINKS = {
  play: [
    { label: "Join Server", href: "/play" },
    { label: "Rules", href: "/rules" },
  ],
  community: [
    { label: "Staff", href: "/staff" },
    { label: "Vote", href: "/vote" },
    { label: "Apply", href: "/apply" },
  ],
  resources: [
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
    { label: "Status", href: "/status" },
  ],
};

function Footer({
  createdAt,
  name,
  allRightsReserved = false,
  rightsText = "All rights reserved.",
  className,
  ...props
}: React.HTMLAttributes<HTMLElement> & {
  createdAt: number;
  name: string;
  allRightsReserved?: boolean;
  rightsText?: string;
}) {
  const currentYear = new Date().getFullYear();

  if (
    typeof createdAt !== "number" ||
    isNaN(createdAt) ||
    !Number.isInteger(createdAt) ||
    createdAt <= 1900 ||
    currentYear < createdAt
  ) {
    throw new Error(
      `[Footer] createdAt (${createdAt}) must be a valid year and not in the future.`
    );
  }

  const yearLabel =
    currentYear === createdAt
      ? `${createdAt}`
      : `${createdAt}–${currentYear}`;

  return (
    <footer
      className={cn(
        "w-full py-12 px-4 border-t border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-950/50 transition-colors duration-200",
        className
      )}
      {...props}
    >
      <div className="max-w-6xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <span className="font-black text-xl tracking-tight">
                Nexus<span className="text-brand-accent">Mines</span>
              </span>
            </Link>
            <Text size="sm" variant="muted" className="mt-3">
              The ultimate Minecraft experience with custom gameplay and real progression.
            </Text>
            {/* Social Links */}
            <div className="flex items-center gap-3 mt-4">
              <a
                href="/discord"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-[#5865F2] hover:bg-[#5865F2]/10 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href="https://github.com/itzzjustmateo/NexusMines"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
              >
                <Github className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Play Links */}
          <div>
            <Text weight="semibold" className="text-sm text-zinc-900 dark:text-white mb-4">
              Play
            </Text>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.play.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-brand-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community Links */}
          <div>
            <Text weight="semibold" className="text-sm text-zinc-900 dark:text-white mb-4">
              Community
            </Text>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.community.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-brand-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <Text weight="semibold" className="text-sm text-zinc-900 dark:text-white mb-4">
              Resources
            </Text>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-brand-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-200/50 dark:border-zinc-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Text size="xs" variant="muted" className="text-center sm:text-left">
            © {yearLabel} {name}. {allRightsReserved || rightsText}
          </Text>
          <Text size="xs" variant="muted" className="flex items-center gap-1">
            Made with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> for Minecraft players
          </Text>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
