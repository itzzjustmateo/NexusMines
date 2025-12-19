import Image from "next/image";
import { staff } from "@/data/staff";
import { Text } from "@/components/ui/text";

export default function StaffPage() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <Text size="2xl" weight="bold" className="mb-8">
        Staff Team
      </Text>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {staff.map((member) => (
          <div
            key={member.id}
            className="rounded-xl border border-border bg-card p-4"
          >
            <Image
              src={member.image}
              alt={member.name}
              width={96}
              height={96}
              className="mb-4 rounded-full"
            />

            <Text weight="semibold">{member.name}</Text>
            <Text variant="muted">{member.rank}</Text>

            <Text size="xs" className="mt-2">
              {member.bio}
            </Text>
          </div>
        ))}
      </div>
    </section>
  );
}
