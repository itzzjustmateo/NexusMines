import { Hero } from "@/components/blocks/rules/hero";
import { List } from "@/components/blocks/rules/list";

export default function RulesPage() {
  return (
    <div className="min-h-screen bg-zinc-50/70 dark:bg-zinc-950/70 pt-24 pb-20 overflow-hidden relative transition-colors duration-300">
      {/* Background Ornaments */}
      <div className="absolute top-20 right-1/4 w-80 h-80 bg-brand-accent/10 rounded-full blur-[100px] opacity-40 animate-in fade-in duration-1000 pointer-events-none" />
      
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <Hero />
        <List />
      </div>
    </div>
  );
}
