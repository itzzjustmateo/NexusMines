"use client";

import { Hero } from "@/components/blocks/about/hero";
import { Features } from "@/components/blocks/about/features";
import { Philosophy } from "@/components/blocks/about/philosophy";
import { Team } from "@/components/blocks/about/team";

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-12 sm:py-24 flex flex-col items-center">
      <Hero />
      <div className="mt-16 w-full space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
        <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2">
          <div className="p-6 sm:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all">
            <Features />
          </div>
          <div className="p-6 sm:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all">
            <Philosophy />
          </div>
        </div>
        
        <div className="p-6 sm:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all">
          <Team />
        </div>

        <div className="mt-8 text-center pt-8 border-t border-zinc-100 dark:border-zinc-900">
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            Made with ❤️ by <span className="font-semibold text-brand-accent">DevFlare</span>
          </p>
          <div className="mt-2 text-[10px] uppercase font-bold tracking-widest text-zinc-400">
            Want to contribute or have feedback? Reach out on our Discord or GitHub.
          </div>
        </div>
      </div>
    </section>
  );
}
