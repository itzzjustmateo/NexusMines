import { ShieldAlert, UserCheck, BugOff, MegaphoneOff, Gavel } from "lucide-react";

const rules = [
  {
    icon: <ShieldAlert className="h-6 w-6 text-red-500" />,
    title: "No cheating, hacking, or unfair modifications.",
    desc: "Play fair. Mods or clients that give unfair advantages are strictly forbidden.",
  },
  {
    icon: <UserCheck className="h-6 w-6 text-cyan-500" />,
    title: "Respect all players and staff.",
    desc: "Treat everyone with kindness and maturity. Harassment, hate speech, or toxicity won’t be tolerated.",
  },
  {
    icon: <BugOff className="h-6 w-6 text-orange-400" />,
    title: "No griefing or exploiting bugs.",
    desc: "Exploiting glitches or intentionally ruining experiences for others is not allowed. Report bugs to staff.",
  },
  {
    icon: <MegaphoneOff className="h-6 w-6 text-fuchsia-500" />,
    title: "No spamming or advertising.",
    desc: "Keep chat clean and relevant. No server ads, self-promotion, or message flooding.",
  },
  {
    icon: <Gavel className="h-6 w-6 text-zinc-600 dark:text-zinc-300" />,
    title: "Staff decisions are final.",
    desc: "Respect the judgment of our team. If you disagree, discuss politely and responsibly.",
  },
];

export default function RulesPage() {
  return (
    <section className="relative flex flex-col items-center justify-center overflow-hidden px-4 py-24 bg-zinc-50/70 dark:bg-zinc-950/70 border-b border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
      {/* Main title */}
      <div className="mb-6 text-center">
        <h1 className="font-extrabold text-5xl md:text-7xl tracking-tight text-zinc-900 dark:text-white flex items-center justify-center gap-2 relative transition-colors duration-300">
          NexusMines
          <span className="text-brand-accent">Rules</span>
        </h1>
        <p className="mt-4 max-w-xl mx-auto text-zinc-600 dark:text-zinc-400 text-lg font-medium transition-colors duration-300">
          Play fair, respect others, and help keep NexusMines fun for all.
        </p>
      </div>

      {/* Rules Cards */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        {rules.map((rule, i) => (
          <div
            key={rule.title}
            className={`
              flex items-start gap-4 rounded-xl border
              bg-white border-zinc-200 text-zinc-900 shadow-sm
              dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100
              px-6 py-6 transition-all duration-300
              hover:bg-zinc-100 dark:hover:bg-zinc-900
              group
            `}
          >
            <div className="mt-1">{rule.icon}</div>
            <div>
              <h3 className="text-base font-semibold text-brand-accent flex items-center gap-2">
                <span className="text-zinc-400 font-bold text-lg">#{i + 1}</span>
                {rule.title}
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{rule.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
