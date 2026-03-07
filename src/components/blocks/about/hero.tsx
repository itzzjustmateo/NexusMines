import { SunMedium } from "lucide-react";

export function Hero() {
  return (
    <div className="flex flex-col items-center">
      <header className="flex items-center gap-3 mb-4">
        <SunMedium className="h-8 w-8 text-yellow-400 dark:text-yellow-300 transition-all" />
        <h1 className="text-3xl font-bold tracking-tight">About NexusMines</h1>
      </header>
      <p className="text-md text-zinc-500 dark:text-zinc-400 leading-relaxed text-center mb-4">
        <span className="font-semibold text-zinc-800 dark:text-zinc-50">NexusMines</span> is built around long-term progression, fair gameplay, and systems that respect your time.<br />
        <span className="block mt-2">No pay-to-win tricks. No bloated mechanics. Just mining, perfected.</span>
      </p>
    </div>
  );
}
