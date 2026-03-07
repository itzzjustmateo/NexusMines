import { Hero } from "@/components/blocks/status/hero";
import { Indicator } from "@/components/blocks/status/indicator";
import { List } from "@/components/blocks/status/list";
import { config } from "@/data/config";

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
    fetch(`https://api.mcsrvstat.us/3/${config.javaIp}`, {
      cache: "no-store",
    }),
    fetch(`https://api.mcsrvstat.us/bedrock/3/${config.bedrockIp}`, {
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

      <List 
        java={java} 
        bedrock={bedrock} 
        resolvedVersion={resolvedVersion} 
        resolvedSoftware={resolvedSoftware} 
      />
    </section>
  );
}
