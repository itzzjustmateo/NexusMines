import { Server, Cable } from "lucide-react";
import { Hero } from "@/components/blocks/status/hero";
import { Indicator } from "@/components/blocks/status/indicator";
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

async function getStatus() {
  const [javaRes, bedrockRes] = await Promise.all([
    fetch("https://api.mcsrvstat.us/3/nexusmines.minekeep.gg", {
      cache: "no-store",
    }),
    fetch("https://api.mcsrvstat.us/bedrock/3/nexusmines.bedrock.minekeep.gg", {
      cache: "no-store",
    }),
  ]);

  const java: JavaStatus = await javaRes.json();
  const bedrock: BedrockStatus = await bedrockRes.json();

  return { java, bedrock };
}

export default async function StatusPage() {
  const { java, bedrock } = await getStatus();

  const resolvedVersion =
    java.plugins?.raw?.[0] ||
    (typeof java.version === "string" && java.version) ||
    (typeof java.version === "object" && java.version?.name) ||
    "Unknown";

  const resolvedSoftware = resolvedVersion.includes("Purpur")
    ? "PurpurMC"
    : (java.software ?? "Unknown");

  return (
    <section className="mx-auto max-w-4xl px-6 py-24">
      <Hero />
      <Indicator online={java.online} />

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <ServerCard
          icon={<Server className="h-5 w-5 text-[rgb(var(--accent))]" />}
          title="Java Edition"
          ip="nexusmines.minekeep.gg"
          port={java.port ?? 25565}
          version={resolvedVersion}
          software={resolvedSoftware}
          onlinePlayers={java.players?.online ?? 0}
          maxPlayers={java.players?.max ?? "?"}
        />

        <ServerCard
          icon={<Cable className="h-5 w-5 text-[rgb(var(--accent))]" />}
          title="Bedrock Edition"
          ip="nexusmines.bedrock.minekeep.gg"
          port={bedrock.port ?? 19132}
          onlinePlayers={java.players?.online ?? 0}
          maxPlayers={java.players?.max ?? "?"}
        />
      </div>
    </section>
  );
}
