import Link from "next/link";
import { Text } from "@/components/ui/text";

export function Hero() {
  return (
    <div className="mb-6 text-center animate-in fade-in slide-in-from-top-4 duration-700">
      <h1 className="font-extrabold text-4xl sm:text-5xl md:text-7xl tracking-tight text-zinc-900 dark:text-white flex flex-wrap items-center justify-center gap-x-3 relative transition-colors duration-300">
        Vote for
        <span className="text-brand-accent">NexusMines</span>
      </h1>
      <Text size="lg" weight="medium" variant="muted" className="mt-4 max-w-xl mx-auto">
        Support NexusMines, boost our server rankings, and earn in-game rewards!
      </Text>

      <div className="flex justify-center items-center gap-7 mt-9 mb-12">
        <Link
          href="https://dc.gg/technova"
          className="group relative flex flex-col items-center rounded-xl transition-all duration-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 px-7 py-3 outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
        >
          <span className="text-base font-bold text-zinc-900 dark:text-white tracking-tight">
            Need help?
          </span>
          <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] px-2 py-px rounded bg-zinc-100 dark:bg-zinc-900/60 text-zinc-500 dark:text-zinc-400 opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap">
            Contact staff via Discord
          </span>
        </Link>
      </div>
    </div>
  );
}
