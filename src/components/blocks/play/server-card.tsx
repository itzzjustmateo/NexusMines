import { Text } from "@/components/ui/text";
import { AddressCopy } from "@/components/ui/address-copy";
import { Card, CardContent } from "@/components/ui/card";
import { MousePointer2, Rocket, PlayCircle } from "lucide-react";
import { config } from "@/data/config";

export function ServerCard() {
  const javaIp = config.javaIp;
  const bedrockIp = config.bedrockIp;

  return (
    <div className="mt-16 w-full max-w-4xl flex flex-col items-center gap-12">
      {/* Step 1: IPs */}
      <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              <MousePointer2 className="h-4 w-4" />
            </div>
            <Text weight="bold" className="text-sm uppercase tracking-wider text-emerald-500">Step 1</Text>
          </div>
          <Text size="xl" weight="bold">Copy the Server IP</Text>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-4">
          <AddressCopy value={javaIp} label="Java" type="java" />
          <AddressCopy value={bedrockIp} label="Bedrock" type="bedrock" />
        </div>
      </div>

      {/* Grid for Steps 2 & 3 */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
        {/* Step 2: Version */}
        <Card className="border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="p-8 flex flex-col items-center text-center">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                <Rocket className="h-4 w-4" />
              </div>
              <Text weight="bold" className="text-sm uppercase tracking-wider text-blue-500">Step 2</Text>
            </div>
            <Text size="lg" weight="bold" className="mb-2">Launch Minecraft</Text>
            <Text variant="muted" className="text-sm">
              Open your Minecraft launcher and start the game using version <span className="text-zinc-900 dark:text-zinc-100 font-semibold">1.21 or higher</span>.
            </Text>
          </CardContent>
        </Card>

        {/* Step 3: Connect */}
        <Card className="border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="p-8 flex flex-col items-center text-center">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-brand-accent/10 text-brand-accent">
                <PlayCircle className="h-4 w-4" />
              </div>
              <Text weight="bold" className="text-sm uppercase tracking-wider text-brand-accent">Step 3</Text>
            </div>
            <Text size="lg" weight="bold" className="mb-2">Add Server & Play</Text>
            <Text variant="muted" className="text-sm">
              Go to <span className="text-zinc-900 dark:text-zinc-100 font-semibold">Multiplayer</span>, click <span className="text-zinc-900 dark:text-zinc-100 font-semibold">Add Server</span>, paste the IP, and join the fun!
            </Text>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
