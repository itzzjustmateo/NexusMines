"use client";

import * as React from "react";
import { RefreshCcw, Users, Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/text";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback, AvatarGroup, AvatarGroupCount } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { config as defaultConfig } from "@/data/config";

interface ServerConfig {
  javaIp: string;
  bedrockIp: string;
  javaPort: number;
  bedrockPort: number;
}

interface Player {
  name: string;
  uuid: string;
}

interface ServerStatus {
  online: boolean;
  players?: {
    online: number;
    max: number;
    list?: Player[];
  };
}

export function StatusCard() {
  const [status, setStatus] = React.useState<ServerStatus | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [javaIp, setJavaIp] = React.useState(defaultConfig.javaIp);

  React.useEffect(() => {
    fetch("/api/config")
      .then(res => res.json())
      .then((data: ServerConfig) => {
        if (data.javaIp) setJavaIp(data.javaIp);
      })
      .catch(console.error);
  }, []);

  const fetchStatus = React.useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`https://api.mcsrvstat.us/3/${javaIp}`);
      const data = await res.json();
      setStatus({
        online: data.online,
        players: data.players,
      });
    } catch (err) {
      console.error("Failed to fetch server status:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [javaIp]);

  React.useEffect(() => {
    fetchStatus();
    // Refresh every 60 seconds
    const interval = setInterval(fetchStatus, 60000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  if (loading && !status) {
    return (
      <Card className="w-full max-w-[300px] border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm shadow-sm">
        <CardContent className="py-1.5 px-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-2 w-2 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-8 w-24 rounded-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || (status && !status.online)) {
    return (
      <Card className="w-full max-w-[300px] border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm shadow-sm animate-in fade-in zoom-in-95 duration-500">
        <CardContent className="py-1.5 px-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-zinc-400 dark:bg-zinc-600" />
            <Text weight="semibold" className="text-zinc-500">Server Offline</Text>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={fetchStatus}
            className="rounded-full h-8 px-3 gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <RefreshCcw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
            <span className="text-xs">Retry</span>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const topPlayers = status?.players?.list?.slice(0, 5) || [];
  const remainingPlayers = (status?.players?.online || 0) - topPlayers.length;

  return (
    <Card className="group relative w-full max-w-[300px] border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-500 overflow-hidden animate-in fade-in slide-in-from-bottom-2">
      {/* Background Accent Glow */}
      <div className="absolute -inset-px bg-linear-to-r from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardContent className="relative py-1.5 px-3 flex items-center justify-between z-10">
        {/* Live Status Indicator */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <div className="absolute h-2 w-2 rounded-full bg-emerald-500 animate-ping opacity-75" />
          </div>
          <div className="flex flex-col -space-y-0.5">
            <Text size="xxs" weight="bold" className="text-emerald-500 uppercase tracking-wider">Live</Text>
            <Text size="xxs" weight="medium" variant="muted" className="truncate max-w-[100px]">{javaIp}</Text>
          </div>
        </div>

        {/* Player Info */}
        <div className="flex items-center gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer group/players">
                  <AvatarGroup className="-space-x-2.5">
                    {topPlayers.map((player) => (
                      <Avatar key={player.uuid} size="sm" className="border-2 border-white dark:border-zinc-950">
                        <AvatarImage src={`https://crafatar.com/avatars/${player.uuid}?size=32&overlay`} />
                        <AvatarFallback className="text-[10px] bg-zinc-100 dark:bg-zinc-800">
                          {player.name[0]}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {remainingPlayers > 0 && (
                      <AvatarGroupCount className="bg-zinc-100 dark:bg-zinc-800 text-[10px] border-2 border-white dark:border-zinc-950 size-6">
                        +{remainingPlayers}
                      </AvatarGroupCount>
                    )}
                  </AvatarGroup>
                  <div className="hidden sm:flex flex-col items-end">
                    <Text size="xs" weight="bold">{status?.players?.online || 0}</Text>
                    <Text size="xxs" variant="muted" className="uppercase tracking-tighter">Online</Text>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl max-h-48 overflow-y-auto">
                <div className="flex flex-col gap-1.5 min-w-[120px]">
                  <div className="flex items-center gap-2 mb-1 border-b border-zinc-100 dark:border-zinc-800 pb-1.5">
                    <Users className="h-3 w-3 text-emerald-500" />
                    <Text size="xxs" weight="bold">Online Players</Text>
                  </div>
                  {status?.players?.list?.length ? (
                    status.players.list.map((player) => (
                      <div key={player.uuid} className="flex items-center gap-2 group/player">
                         <img 
                          src={`https://crafatar.com/avatars/${player.uuid}?size=16&overlay`} 
                          alt="" 
                          className="h-4 w-4 rounded-sm"
                        />
                        <Text size="xxs" className="group-hover/player:text-emerald-500 transition-colors">{player.name}</Text>
                      </div>
                    ))
                  ) : (
                    <Text size="xxs" variant="muted">Only numbers visible</Text>
                  )}
                  {remainingPlayers > 0 && status?.players?.list?.length === 0 && (
                    <Text size="xxs" variant="muted">And {status.players.online} more...</Text>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
}
