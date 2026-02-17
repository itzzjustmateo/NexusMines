import Link from "next/link";
import { SunMedium, MoonStar, DollarSign } from "lucide-react";
import { Button } from "../ui/button";

export function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center overflow-hidden px-4 py-24 bg-zinc-50/70 dark:bg-zinc-950/70 border-b border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
      {/* Main title */}
      <div className="mb-6 text-center">
        <h1 className="font-extrabold text-5xl md:text-7xl tracking-tight text-zinc-900 dark:text-white flex items-center justify-center gap-2 relative transition-colors duration-300">
          Nexus
          <span className="text-brand-accent">Mines</span>
        </h1>
        <p className="mt-4 max-w-xl mx-auto text-zinc-600 dark:text-zinc-400 text-lg font-medium transition-colors duration-300">
          The best Mine-Server experience. Custom gameplay. Real progression. Zero nonsense.
        </p>
      </div>

      {/* Actions: styled inner "toggle-style" container */}
      <div className="flex justify-center items-center gap-7 mt-9 mb-12">
        {/* Vote now! */}
        <Link
          href="/vote"
          tabIndex={0}
          className={`
            group relative flex flex-col items-center
            rounded-xl transition-all duration-300
            hover:bg-zinc-100 dark:hover:bg-zinc-800
            px-7 py-3
            outline-none
            focus-visible:ring-2 focus-visible:ring-brand-accent
          `}
          aria-label="Vote now!"
        >
          <span className="text-base font-bold text-zinc-900 dark:text-white tracking-tight transition-colors">
            Vote now!
          </span>
          {/* Tooltip-like help */}
          <span
            className={`
              absolute -bottom-5 left-1/2 -translate-x-1/2
              text-[10px] px-2 py-px rounded
              bg-zinc-100 dark:bg-zinc-900/60
              text-zinc-500 dark:text-zinc-400
              opacity-0 group-hover:opacity-100 pointer-events-none
              transition-all duration-300
            `}
          >
            Boost us!
          </span>
        </Link>

        {/* Learn More */}
        <Link
          href="/about"
          tabIndex={0}
          className={`
            group relative flex flex-col items-center
            rounded-xl transition-all duration-300
            hover:bg-zinc-100 dark:hover:bg-zinc-800
            px-7 py-3
            outline-none
            focus-visible:ring-2 focus-visible:ring-brand-accent
          `}
          aria-label="Learn More"
        >
          <span className="text-base font-bold text-zinc-900 dark:text-white tracking-tight transition-colors">
            Learn More
          </span>
          {/* Tooltip-like help */}
          <span
            className={`
              absolute -bottom-5 left-1/2 -translate-x-1/2
              text-[10px] px-2 py-px rounded
              bg-zinc-100 dark:bg-zinc-900/60
              text-zinc-500 dark:text-zinc-400
              opacity-0 group-hover:opacity-100 pointer-events-none
              transition-all duration-300
            `}
          >
            Why NexusMines?
          </span>
        </Link>
      </div>

      {/* Feature cards with ModeToggle UI flavor */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {/* Custom Mines */}
        <div
          className={`
            flex flex-col items-center rounded-xl border
            bg-white border-zinc-200 text-zinc-900 shadow-sm
            dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100
            px-4 py-8 transition-all duration-300
            hover:bg-zinc-100 dark:hover:bg-zinc-900
            group
          `}
        >
          <SunMedium className="h-6 w-6 mb-1 text-white dark:text-white transition-all duration-300" />
          <h3 className="text-base font-semibold text-white dark:text-white">Custom Mines</h3>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 text-center">
            Crafted worlds, custom-built for legends.
          </p>
        </div>
        {/* Active Economy */}
        <div
          className={`
            flex flex-col items-center rounded-xl border
            bg-white border-zinc-200 text-zinc-900 shadow-sm
            dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100
            px-4 py-8 transition-all duration-300
            hover:bg-zinc-100 dark:hover:bg-zinc-900
            group
          `}
        >
          <DollarSign className="h-6 w-6 mb-1 text-emerald-500" />
          <h3 className="text-base font-semibold text-white">Active Economy</h3>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 text-center">
            Player-driven market, pure progression.
          </p>
        </div>
        {/* Lag-Free Experience */}
        <div
          className={`
            flex flex-col items-center rounded-xl border
            bg-white border-zinc-200 text-zinc-900 shadow-sm
            dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100
            px-4 py-8 transition-all duration-300
            hover:bg-zinc-100 dark:hover:bg-zinc-900
            group
          `}
        >
          <MoonStar className="h-6 w-6 mb-1 text-yellow-400 dark:text-yellow-300 rotate-90 scale-0 dark:rotate-0 dark:scale-100 transition-all duration-300" />
          <h3 className="text-base font-semibold text-white">Lag-Free Experience</h3>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 text-center">
            Optimized for performance—no lag, just play.
          </p>
        </div>
      </div>
    </section>
  );
}
