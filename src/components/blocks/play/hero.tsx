import { Text } from "@/components/ui/text";

export function Hero() {
  return (
    <>
      <Text asChild size="2xl" weight="bold">
        <h1>Play on NexusMines</h1>
      </Text>

      <Text variant="muted" className="mt-4">
        Join the server and start mining your way to the top.
      </Text>
    </>
  );
}
