import { Server, Users, Cable, CheckCircle, XCircle } from "lucide-react";

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

  // ---- Version resolution (Purpur-safe) ----
  const resolvedVersion =
    java.plugins?.raw?.[0] ||
    (typeof java.version === "string" && java.version) ||
    (typeof java.version === "object" && java.version?.name) ||
    "Unknown";

  // ---- Software resolution (truthful) ----
  const resolvedSoftware = resolvedVersion.includes("Purpur")
    ? "PurpurMC"
    : (java.software ?? "Unknown");

  return (
    <section className="mx-auto max-w-4xl px-6 py-24">
      <h1 className="text-4xl font-bold">
        Server <span className="text-[rgb(var(--accent))]">Status</span>
      </h1>

      <p className="mt-3 text-zinc-400">
        Live status of the NexusMines Minecraft network.
      </p>

      {/* Online indicator */}
      <div className="mt-6 flex items-center gap-2">
        {java.online ? (
          <>
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-green-400">Online</span>
          </>
        ) : (
          <>
            <XCircle className="h-5 w-5 text-red-500" />
            <span className="text-red-400">Offline</span>
          </>
        )}
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {/* Java Edition */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
          <div className="mb-4 flex items-center gap-3">
            <Server className="h-5 w-5 text-[rgb(var(--accent))]" />
            <h2 className="text-lg font-semibold">Java Edition</h2>
          </div>

          <p className="text-sm text-zinc-400">IP</p>
          <p className="font-mono">nexusmines.minekeep.gg</p>

          <p className="mt-3 text-sm text-zinc-400">Port</p>
          <p className="font-mono">{java.port ?? 25565}</p>

          <p className="mt-3 text-sm text-zinc-400">Version</p>
          <p>{resolvedVersion}</p>

          <p className="mt-3 text-sm text-zinc-400">Software</p>
          <p>{resolvedSoftware}</p>

          <div className="mt-4 flex items-center gap-2">
            <Users className="h-4 w-4 text-zinc-400" />
            <span>
              {java.players?.online ?? 0} / {java.players?.max ?? "?"} players
            </span>
          </div>
        </div>

        {/* Bedrock Edition */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
          <div className="mb-4 flex items-center gap-3">
            <Cable className="h-5 w-5 text-[rgb(var(--accent))]" />
            <h2 className="text-lg font-semibold">Bedrock Edition</h2>
          </div>

          <p className="text-sm text-zinc-400">IP</p>
          <p className="font-mono">nexusmines.bedrock.minekeep.gg</p>

          <p className="mt-3 text-sm text-zinc-400">Port</p>
          <p className="font-mono">{bedrock.port ?? 19132}</p>

          {/* Java player count intentionally */}
          <div className="mt-4 flex items-center gap-2">
            <Users className="h-4 w-4 text-zinc-400" />
            <span>
              {java.players?.online ?? 0} / {java.players?.max ?? "?"} players
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
