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
    href: "/soon",
    icon: <Gift className="h-6 w-6 mb-2 text-pink-500 dark:text-pink-400" />,
    desc: "Coming soon – more rewards incoming.",
    comingSoon: true,
  },
];

export function List() {
  return (
    <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
      {voteSites.map((site) => (
        <div
          key={site.name}
          className={`
            flex flex-col items-center rounded-xl border
            bg-white/50 backdrop-blur-sm border-zinc-200 text-zinc-900 shadow-sm
            dark:bg-zinc-950/50 dark:border-zinc-800 dark:text-zinc-100
            px-4 py-8 transition-all duration-300
            hover:bg-zinc-100 dark:hover:bg-zinc-900
            hover:shadow-lg hover:scale-[1.02]
            group relative
            ${site.comingSoon ? "opacity-60 pointer-events-none" : ""}
          `}
        >
          {site.icon}
          <h3 className="text-base font-semibold text-zinc-900 dark:text-white mb-1">{site.name}</h3>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 text-center mb-3">{site.desc}</p>
          <Link
            href={site.href}
            target={site.comingSoon ? undefined : "_blank"}
            rel={site.comingSoon ? undefined : "noopener noreferrer"}
            className={`
              group relative flex flex-col items-center
              rounded-xl transition-all duration-300
              px-7 py-3 outline-none focus-visible:ring-2 focus-visible:ring-brand-accent
              ${site.comingSoon
                ? "pointer-events-none cursor-not-allowed bg-zinc-400 dark:bg-zinc-700"
                : "bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"}
            `}
          >
            <span className="text-base font-bold text-zinc-900 dark:text-white tracking-tight">
              {site.comingSoon ? "Coming Soon" : "Vote now!"}
            </span>
            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] px-2 py-px rounded bg-zinc-100 dark:bg-zinc-900/60 text-zinc-500 dark:text-zinc-400 opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap">
              {site.comingSoon ? "Rewards coming soon!" : "Boost us!"}
            </span>
          </Link>
        </div>
      ))}
    </div>
  );
}
