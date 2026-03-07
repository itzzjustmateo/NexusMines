import { Users } from "lucide-react";
import { ReactNode } from "react";

interface ServerCardProps {
  icon: ReactNode;
  title: string;
  ip: string;
  port: number;
  version?: string;
  software?: string;
  onlinePlayers: number;
  maxPlayers: number | string;
}

export function ServerCard({
  icon,
  title,
  ip,
  port,
  version,
  software,
  onlinePlayers,
  maxPlayers
}: ServerCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
      <div className="mb-4 flex items-center gap-3">
        {icon}
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>

      <p className="text-sm text-zinc-400">IP</p>
      <p className="font-mono">{ip}</p>

      <p className="mt-3 text-sm text-zinc-400">Port</p>
      <p className="font-mono">{port}</p>

      {version && (
        <>
          <p className="mt-3 text-sm text-zinc-400">Version</p>
          <p>{version}</p>
        </>
      )}

      {software && (
        <>
          <p className="mt-3 text-sm text-zinc-400">Software</p>
          <p>{software}</p>
        </>
      )}

      <div className="mt-4 flex items-center gap-2">
        <Users className="h-4 w-4 text-zinc-400" />
        <span>
          {onlinePlayers} / {maxPlayers} players
        </span>
      </div>
    </div>
  );
}
