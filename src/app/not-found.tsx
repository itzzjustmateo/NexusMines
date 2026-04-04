import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <span className="text-sm font-mono text-zinc-500">Error 404</span>

      <h1 className="mt-4 text-5xl md:text-6xl font-extrabold">
        This Mine is <span className="text-[rgb(var(--accent))]">Empty</span>
      </h1>

      <p className="mt-6 max-w-md text-zinc-400">
        You dug a little too deep and found… nothing. This page doesn’t exist,
        or it was mined out of reality.
      </p>

      <div className="mt-10 flex gap-4">
        <Link
          href="/"
          className="rounded-xl bg-[rgb(var(--accent))] px-6 py-3 font-semibold text-white"
        >
          Back to Spawn
        </Link>

        <Link
          href="/about"
          className="rounded-xl border border-zinc-800 px-6 py-3 hover:bg-zinc-900"
        >
          Get to know something
        </Link>
      </div>
    </div>
  );
}
