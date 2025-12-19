import { Text } from "@/components/ui/text";

export default function PlayPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <Text asChild size="2xl" weight="bold">
        <h1>Play on NexusMines</h1>
      </Text>

      <Text variant="muted" className="mt-4">
        Join the server and start mining your way to the top.
      </Text>

      <div className="mt-10 rounded-2xl border border-border bg-card p-6">
        <Text weight="semibold">Server IP</Text>
        <Text size="lg" className="mt-2 font-mono text-[rgb(var(--accent))]">
          play.nexusmines.net
        </Text>

        <Text variant="subtle" className="mt-4">
          Version: 1.20+ (Java Edition)
        </Text>
      </div>
    </section>
  );
}
