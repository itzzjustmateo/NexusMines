"use client";

import { Hero } from "@/components/blocks/about/hero";
import { Features } from "@/components/blocks/about/features";
import { Philosophy } from "@/components/blocks/about/philosophy";
import { Team } from "@/components/blocks/about/team";

export default function AboutPage() {
  return (
    <section className="px-6 py-24 max-w-4xl mx-auto flex flex-col items-center">
      <div className="rounded-xl border border-border bg-card shadow-md w-full max-w-2xl p-8 flex flex-col items-center">
        <Hero />
        <Features />
        <Philosophy />
        <Team />
        
        <div className="mt-8 text-center">
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">
            Made with ❤️ by <span className="font-medium text-primary">TechNova</span>
          </p>
          <div className="mt-2 text-xs text-zinc-400">
            Want to contribute or have feedback? Reach out on our Discord or open an issue on GitHub.
          </div>
        </div>
      </div>
    </section>
  );
}
