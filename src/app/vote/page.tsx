import { Hero } from "@/components/blocks/vote/hero";
import { List } from "@/components/blocks/vote/list";

export default function VotePage() {
  return (
    <section className="relative flex flex-col items-center justify-center overflow-hidden px-4 py-24 bg-zinc-50/70 dark:bg-zinc-950/70 border-b border-zinc-200 dark:border-zinc-800 transition-colors duration-300 min-h-[70vh]">
      <Hero />
      <List />
    </section>
  );
}
