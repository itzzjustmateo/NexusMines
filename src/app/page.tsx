import { Hero } from "@/components/blocks/hero";

export default function HomePage() {
  return (
    <section>
      <Hero />

      <div className="grid md:grid-cols-3 gap-6 px-6 py-16">
        {["Custom Mines", "Active Economy", "Lag-Free Experience"].map(
          (feature) => (
            <div
              key={feature}
              className="rounded-2xl border border-zinc-800 p-6 bg-zinc-900"
            >
              <h3 className="text-lg font-semibold text-[rgb(var(--accent))]">
                {feature}
              </h3>
              <p className="text-sm text-zinc-400 mt-2">
                Built for grinders, optimized for legends.
              </p>
            </div>
          ),
        )}
      </div>
    </section>
  );
}
