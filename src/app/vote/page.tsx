import Link from "next/link";

const voteSites = [
  {
    name: "PlanetMinecraft",
    href: "https://www.planetminecraft.com/server/nexusmines/",
  },
  {
    name: "MinecraftServers.org",
    href: "https://minecraftservers.org/server/681467",
  },
  {
    name: "TopG",
    href: "/404",
  },
];

export default function VotePage() {
  return (
    <section className="px-6 py-24 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold">
        Vote for <span className="text-[rgb(var(--accent))]">NexusMines</span>
      </h1>

      <p className="mt-4 text-zinc-400">
        Support the server and receive in-game rewards.
      </p>

      <div className="mt-10 space-y-4">
        {voteSites.map((site) => (
          <Link
            key={site.name}
            href={site.href}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-xl border border-zinc-800 p-5 transition hover:bg-zinc-900"
          >
            Vote on {site.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
