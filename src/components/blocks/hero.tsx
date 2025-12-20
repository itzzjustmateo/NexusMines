import Link from "next/link";
import { Button } from "../ui/button";

export function Hero() {
  return (
    <div className="relative overflow-hidden">
      {/* Top section */}
      <div className="px-6 py-32 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold text-zinc-900 dark:text-white">
          Nexus<span className="text-[#7255e9]">Mines</span>
        </h1>

        <p className="mt-6 max-w-xl mx-auto text-zinc-600 dark:text-zinc-400">
          The best Mine-Server experience. Custom gameplay. Real progression.
          Zero nonsense.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          {/* Primary action */}
          <Button variant="link" asChild>
            <Link
              href="/vote"
              className="
                inline-flex h-auto min-h-0 items-center rounded-xl
                px-6 py-3 font-semibold
                text-zinc-900 hover:text-zinc-700
                dark:text-white dark:hover:text-zinc-200
                transition-all duration-300
              "
            >
              Vote Now
            </Link>
          </Button>

          {/* Secondary action */}
          <Button variant="ghost" asChild>
            <Link
              href="/about"
              className="
                inline-flex h-auto min-h-0 items-center rounded-xl
                border border-zinc-300
                px-6 py-3
                text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900
                dark:border-zinc-700 dark:text-zinc-400
                dark:hover:bg-zinc-800 dark:hover:text-zinc-200
                transition-all duration-300
              "
            >
              Learn More
            </Link>
          </Button>
        </div>
      </div>

      {/* Feature cards */}
      <div className="grid md:grid-cols-3 gap-6 px-6 py-16">
        {["Custom Mines", "Active Economy", "Lag-Free Experience"].map(
          (feature) => (
            <div
              key={feature}
              className="
                rounded-2xl border p-6
                bg-white border-zinc-200 text-zinc-900
                dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-100
                transition-colors
              "
            >
              <h3 className="text-lg font-semibold text-[rgb(var(--accent))]">
                {feature}
              </h3>

              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Built for grinders, optimized for legends.
              </p>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
