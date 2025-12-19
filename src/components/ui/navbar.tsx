import Link from "next/link";

export function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
      <Link href="/" className="font-bold text-lg">
        Nexus<span className="text-[rgb(var(--accent))]">Mines</span>
      </Link>

      <div className="flex gap-6 text-sm">
        <Link href="/vote">Vote</Link>
        <Link href="/about">About</Link>
      </div>
    </nav>
  );
}
