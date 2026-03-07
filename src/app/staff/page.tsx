import { Hero } from "@/components/blocks/staff/hero";
import { List } from "@/components/blocks/staff/list";

export default function StaffPage() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-6 py-24 bg-zinc-50/70 dark:bg-zinc-950/70 transition-colors duration-300">
      <div className="w-full max-w-5xl flex flex-col items-center">
        <Hero />
        <List />
      </div>

      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-full max-h-3xl bg-brand-accent opacity-[0.03] dark:opacity-[0.05] blur-[120px] pointer-events-none -z-10" />
    </section>
  );
}
