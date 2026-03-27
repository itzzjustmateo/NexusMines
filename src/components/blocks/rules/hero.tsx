import { Text } from "@/components/ui/text";

export function Hero() {
  return (
    <div className="text-center mb-12">
      <div className="animate-in fade-in slide-in-from-top-4 duration-700">
        <Text variant="muted" weight="bold" className="text-sm uppercase tracking-[0.2em] mb-4">
          Server Guidelines
        </Text>
        <Text asChild size="2xl" weight="extrabold" className="tracking-tight text-3xl sm:text-4xl md:text-6xl lg:text-7xl">
          <h1>
            Official <span className="text-brand-accent">Rules</span>
          </h1>
        </Text>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
        <Text variant="muted" className="mt-4 text-lg max-w-xl mx-auto">
          Follow these guidelines to ensure a fair and enjoyable experience for everyone in our community.
        </Text>
      </div>
    </div>
  );
}
