"use client";

import { staff, StaffMember } from "@/data/staff";

const RANK_ORDER = ["Owner", "Co-Owner", "Developer", "Admin", "Moderator", "Helper"];

function HeroSection() {
  return (
    <section className="py-16 px-4 bg-white dark:bg-zinc-950">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">
          Meet the Staff
        </h1>
        <p className="mt-3 text-zinc-500 dark:text-zinc-400">
          The team behind NexusMines keeping the community safe and running.
        </p>
      </div>
    </section>
  );
}

function StaffList() {
  const sortedStaff = [...staff].sort((a, b) => {
    const aIndex = RANK_ORDER.indexOf(a.rank);
    const bIndex = RANK_ORDER.indexOf(b.rank);
    return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
  });

  return (
    <section className="px-4 py-12 bg-zinc-50 dark:bg-zinc-900">
      <div className="max-w-2xl mx-auto">
        <div className="grid gap-4 sm:grid-cols-2">
          {sortedStaff.map((member) => (
            <div 
              key={member.id}
              className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
            >
              <img
                src={`https://mc-heads.net/avatar/${member.name}.png`}
                alt={member.name}
                className="h-12 w-12 rounded-full bg-zinc-200 dark:bg-zinc-700 shrink-0"
              />
              <div className="min-w-0">
                <h3 className="font-semibold text-zinc-900 dark:text-white truncate">
                  {member.name}
                </h3>
                <p className="text-xs text-zinc-500">{member.rank}</p>
                <p className="text-xs text-zinc-400 truncate">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function StaffPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <HeroSection />
      <StaffList />
    </div>
  );
}
