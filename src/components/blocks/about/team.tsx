import Link from "next/link";

export function Team() {
  return (
    <section className="mb-4 w-full">
      <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-50 mb-2">Meet the Team</h2>
      <div className="text-zinc-600 dark:text-zinc-400 text-sm">
        <p>
          <span className="font-medium text-primary">DraftierMovie66</span> – Owner, Developer
        </p>
        <p>
          <span className="font-medium text-primary">ItzzMateo</span> – Co-Owner, Lead Developer & Designer
        </p>
        <p>
          <span className="font-medium text-primary">NexusMines Community</span> – Feedback, Testing & Inspiration
        </p>
      </div>
      <div className="mt-3 flex justify-end">
        <Link
          href="/staff"
          tabIndex={0}
          className={`
            group relative flex items-center
            rounded-xl transition-all duration-300
            hover:bg-zinc-100 dark:hover:bg-zinc-800
            px-4 py-2
            outline-none
            focus-visible:ring-2 focus-visible:ring-brand-accent
            text-xs font-semibold text-zinc-900 dark:text-white
            bg-transparent
          `}
          aria-label="See more staff"
        >
          <span className="tracking-tight transition-colors">
            See more
          </span>
          <span
            className={`
              absolute -bottom-9 left-1/2 -translate-x-1/2
              text-[10px] px-2 py-px rounded
              bg-zinc-100 dark:bg-zinc-900/60
              text-zinc-500 dark:text-zinc-400
              opacity-0 group-hover:opacity-100 pointer-events-none
              transition-all duration-300
            `}
          >
            Full staff list
          </span>
        </Link>
      </div>
    </section>
  );
}
