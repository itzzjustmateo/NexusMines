import { Hero } from "@/components/blocks/play/hero";
import { ServerCard } from "@/components/blocks/play/server-card";

export default function PlayPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <Hero />
      <ServerCard />
    </section>
  );
}
