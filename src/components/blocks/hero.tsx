export function Hero() {
  return (
    <div className="relative overflow-hidden">
      <div className="px-6 py-32 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold">
          Nexus<span className="text-[rgb(var(--accent))]">Mines</span>
        </h1>

        <p className="mt-6 text-zinc-400 max-w-xl mx-auto">
          The best Mine-Server experience. Custom gameplay. Real progression.
          Zero nonsense.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <a
            href="/vote"
            className="rounded-xl bg-[rgb(var(--accent))] px-6 py-3 font-semibold text-white"
          >
            Vote Now
          </a>

          <a
            href="/about"
            className="rounded-xl border border-zinc-700 px-6 py-3"
          >
            Learn More
          </a>
        </div>
      </div>
    </div>
  );
}
