import { Text } from "@/components/ui/text";

export function ServerCard() {
  return (
    <div className="mt-10 rounded-2xl border border-border bg-card p-6">
      <Text weight="semibold">Server IP</Text>
      <Text size="lg" className="mt-2 font-mono text-[rgb(var(--accent))]">
        nexusmines.minekeep.gg
      </Text>

      <Text variant="subtle" className="mt-4">
        Version: 1.21+ (Java Edition)
      </Text>
    </div>
  );
}
