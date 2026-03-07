import { Server, Cable } from "lucide-react";
import { config } from "@/data/config";
import { ServerCard } from "@/components/blocks/status/server-card";

type JavaStatus = {
  online: boolean;
  players?: {
    online: number;
    max: number;
  };
  version?: string | { name?: string };
  software?: string;
  port?: number;
  plugins?: {
    raw?: string[];
  };
};

type BedrockStatus = {
  online: boolean;
  players?: {
    online: number;
    max: number;
  };
  port?: number;
};

interface ListProps {
  java: JavaStatus;
  bedrock: BedrockStatus;
  resolvedVersion: string;
  resolvedSoftware: string;
}

export function List({ java, bedrock, resolvedVersion, resolvedSoftware }: ListProps) {
  return (
    <div className="mt-10 grid gap-6 grid-cols-1 md:grid-cols-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
      <ServerCard
        icon={<Server className="h-5 w-5 text-brand-accent" />}
        title="Java Edition"
        ip={config.javaIp}
        port={java.port ?? 25565}
        version={resolvedVersion}
        software={resolvedSoftware}
        onlinePlayers={java.players?.online ?? 0}
        maxPlayers={java.players?.max ?? "?"}
      />

      <ServerCard
        icon={<Cable className="h-5 w-5 text-brand-accent" />}
        title="Bedrock Edition"
        ip={config.bedrockIp}
        port={bedrock.port ?? 19132}
        onlinePlayers={java.players?.online ?? 0}
        maxPlayers={java.players?.max ?? "?"}
      />
    </div>
  );
}
