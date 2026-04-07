export function AboutSection() {
  return (
    <section className="py-24 px-4 bg-white dark:bg-zinc-950">
      <div className="max-w-3xl mx-auto text-center">
        <span className="text-sm font-medium text-zinc-500 uppercase tracking-widest">About</span>
        <h2 className="mt-4 font-bold text-3xl sm:text-4xl text-zinc-900 dark:text-white">
          Built by players, for players
        </h2>
        <p className="mt-4 text-base text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xl mx-auto">
          NexusMines is a Minecraft survival server focused on community, progression, and fair gameplay. 
          No pay-to-win, no gimmicks—just pure Minecraft adventure with custom features and a welcoming community.
        </p>
      </div>
    </section>
  );
}
