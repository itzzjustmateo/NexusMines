import Link from "next/link";

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
        {["PlanetMinecraft", "MinecraftServers.org", "TopG"].map((site) => (
          <Link
            key={site}
            href="#"
            className="block rounded-xl border border-zinc-800 p-5 hover:bg-zinc-900"
          >
            Vote on {site}
          </Link>
        ))}
      </div>
    </section>
  );
}
