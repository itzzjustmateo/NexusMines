import Link from "next/link";
import { Star, Rocket, Gift } from "lucide-react";

const voteSites = [
  {
    name: "PlanetMinecraft",
    href: "https://www.planetminecraft.com/server/nexusmines/",
    icon: <Star className="h-6 w-6 mb-2 text-yellow-400 dark:text-yellow-300" />,
    desc: "Cast your vote for us and climb the charts!",
  },
  {
    name: "MinecraftServers.org",
    href: "https://minecraftservers.org/server/681467",
    icon: <Rocket className="h-6 w-6 mb-2 text-blue-500 dark:text-blue-400" />,
    desc: "Help boost NexusMines and spread the word.",
  },
  {
    name: "TopG",
    href: "/404",
    icon: <Gift className="h-6 w-6 mb-2 text-pink-500 dark:text-pink-400" />,
    desc: "Coming soon – more rewards incoming.",
    comingSoon: true,
  },
];

export default function VotePage() {
  return (
    <section className="relative flex flex-col items-center justify-center overflow-hidden px-4 py-24 bg-zinc-50/70 dark:bg-zinc-950/70 border-b border-zinc-200 dark:border-zinc-800 transition-colors duration-300 min-h-[70vh]">
      <div className="mb-6 text-center">
        <h1 className="font-extrabold text-5xl md:text-7xl tracking-tight text-zinc-900 dark:text-white flex items-center justify-center gap-2 relative transition-colors duration-300">
          Vote for
          <span className="text-brand-accent">NexusMines</span>
        </h1>
        <p className="mt-4 max-w-xl mx-auto text-zinc-600 dark:text-zinc-400 text-lg font-medium transition-colors duration-300">
          Support NexusMines, boost our server rankings, and earn in-game rewards!
        </p>
      </div>

      <div className="flex justify-center items-center gap-7 mt-9 mb-12">
        <Link
          href="https://dc.gg/technova"
          tabIndex={0}
          className={`
            group relative flex flex-col items-center
            rounded-xl transition-all duration-300
            hover:bg-zinc-100 dark:hover:bg-zinc-800
            px-7 py-3
            outline-none
            focus-visible:ring-2 focus-visible:ring-brand-accent
          `}
          aria-label="Need help?"
        >
          <span className="text-base font-bold text-zinc-900 dark:text-white tracking-tight transition-colors">
            Need help?
          </span>
          <span
            className={`
              absolute -bottom-5 left-1/2 -translate-x-1/2
              text-[10px] px-2 py-px rounded
              bg-zinc-100 dark:bg-zinc-900/60
              text-zinc-500 dark:text-zinc-400
              opacity-0 group-hover:opacity-100 pointer-events-none
              transition-all duration-300
            `}
          >
            Contact staff via Discord
          </span>
        </Link>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {voteSites.map((site) => (
          <div
            key={site.name}
            className={`
              flex flex-col items-center rounded-xl border
              bg-white border-zinc-200 text-zinc-900 shadow-sm
              dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100
              px-4 py-8 transition-all duration-300
              hover:bg-zinc-100 dark:hover:bg-zinc-900
              group relative
              ${site.comingSoon ? "opacity-60 pointer-events-none" : ""}
            `}
          >
            {site.icon}
            <h3 className="text-base font-semibold text-zinc-900 dark:text-white mb-1">{site.name}</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 text-center mb-3">{site.desc}</p>
            {/* Vote button styled like hero.tsx (vote now/tooltip) */}
            <Link
              href={site.href}
              target={site.comingSoon ? undefined : "_blank"}
              rel={site.comingSoon ? undefined : "noopener noreferrer"}
              tabIndex={site.comingSoon ? -1 : 0}
              aria-disabled={site.comingSoon}
              className={`
                group relative flex flex-col items-center
                rounded-xl transition-all duration-300
                bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700
                px-7 py-3
                outline-none
                focus-visible:ring-2 focus-visible:ring-brand-accent
                ${site.comingSoon
                  ? "pointer-events-none cursor-not-allowed bg-zinc-400 dark:bg-zinc-700"
                  : "bg-transparent"}
              `}
            >
              <span className="text-base font-bold text-zinc-900 dark:text-white tracking-tight transition-colors">
                {site.comingSoon ? "Coming Soon" : "Vote now!"}
              </span>
              <span
                className={`
                  absolute -bottom-5 left-1/2 -translate-x-1/2
                  text-[10px] px-2 py-px rounded
                  bg-zinc-100 dark:bg-zinc-900/60
                  text-zinc-500 dark:text-zinc-400
                  opacity-0 group-hover:opacity-100 pointer-events-none
                  transition-all duration-300
                `}
              >
                {site.comingSoon
                  ? "Rewards coming soon!"
                  : "Boost us!"}
              </span>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
