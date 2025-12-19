import { Text } from "@/components/ui/text";

const rules = [
  "No cheating, hacking, or unfair modifications.",
  "Respect all players and staff.",
  "No griefing or exploiting bugs.",
  "No spamming or advertising.",
  "Staff decisions are final.",
];

export default function RulesPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <Text asChild size="2xl" weight="bold">
        <h1>Server Rules</h1>
      </Text>

      <Text variant="muted" className="mt-4">
        Keep NexusMines fair, fun, and competitive.
      </Text>

      <ul className="mt-10 space-y-3">
        {rules.map((rule, index) => (
          <li
            key={rule}
            className="flex gap-3 rounded-xl border border-border bg-card p-4"
          >
            <Text weight="bold" className="text-[rgb(var(--accent))]">
              {index + 1}.
            </Text>
            <Text>{rule}</Text>
          </li>
        ))}
      </ul>
    </section>
  );
}
