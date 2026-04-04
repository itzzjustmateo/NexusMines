import { Text } from "@/components/ui/text";

export function Hero() {
  return (
    <div className="text-center">
      <div className="animate-in fade-in slide-in-from-top-4 duration-700">
        <Text variant="muted" weight="bold" className="text-sm uppercase tracking-[0.2em] mb-4">
          The Team
        </Text>
        <Text asChild size="2xl" weight="extrabold" className="tracking-tight text-3xl sm:text-4xl md:text-6xl lg:text-7xl">
          <h1>
            Nexus<span className="text-brand-accent">Mines</span> Staff
          </h1>
        </Text>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
        <Text variant="muted" className="mt-4 text-lg max-w-xl mx-auto">
          Meet the dedicated individuals behind the scenes who keep the mines running smoothly and the community safe.
        </Text>
      </div>
    </div>
  );
}
