"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Home,
  Vote,
  Info,
  type LucideIcon,
  Play,
  Shield,
  Users,
  ClipboardCheck,
  Server,
} from "lucide-react";

import { Text } from "@/components/ui/text";

type Command = {
  label: string;
  path: string;
  icon: LucideIcon;
};

const commands: Command[] = [
  { label: "Home", path: "/", icon: Home },
  { label: "Vote", path: "/vote", icon: Vote },
  { label: "Status", path: "/status", icon: Server },
  { label: "Staff", path: "/staff", icon: Users },
  { label: "Rules", path: "/rules", icon: Shield },
  { label: "Play", path: "/play", icon: Play },
  { label: "Apply", path: "/apply", icon: ClipboardCheck },
  { label: "About", path: "/about", icon: Info },
];

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredCommands = commands.filter((command) =>
    command.label.toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => {
    function openPalette() {
      setOpen(true);
      setQuery("");
      setSelectedIndex(0);
    }

    function onKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        openPalette();
        return;
      }

      if (!open) return;

      if (event.key === "Escape") {
        setOpen(false);
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, filteredCommands.length - 1));
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      }

      if (event.key === "Enter") {
        event.preventDefault();
        const command = filteredCommands[selectedIndex];
        if (!command) return;

        router.push(command.path);
        setOpen(false);
        setQuery("");
        setSelectedIndex(0);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("command-palette:open", openPalette);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("command-palette:open", openPalette);
    };
  }, [open, filteredCommands, selectedIndex, router]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm">
      <div className="mx-auto mt-40 max-w-lg overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-xl ring-1 ring-[color:var(--accent)]/30">
        <input
          autoFocus
          placeholder="Type a page name…"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setSelectedIndex(0);
          }}
          className="w-full border-b border-zinc-800 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-zinc-500 caret-[rgb(var(--accent))]"
        />

        <div className="max-h-64 overflow-y-auto">
          {filteredCommands.length === 0 && (
            <Text variant="muted" size="sm" className="px-4 py-6">
              No results found.
            </Text>
          )}

          {filteredCommands.map((command, index) => {
            const Icon = command.icon;
            const isSelected = index === selectedIndex;

            return (
              <button
                key={command.path}
                onMouseEnter={() => setSelectedIndex(index)}
                onClick={() => {
                  router.push(command.path);
                  setOpen(false);
                  setQuery("");
                  setSelectedIndex(0);
                }}
                className={[
                  "relative flex w-full items-center gap-3 px-4 py-3 text-left text-sm",
                  isSelected ? "bg-zinc-900" : "hover:bg-zinc-900",
                ].join(" ")}
              >
                {isSelected && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-[rgb(var(--accent))]" />
                )}

                <Icon
                  className={[
                    "h-4 w-4",
                    isSelected ? "text-[rgb(var(--accent))]" : "text-zinc-400",
                  ].join(" ")}
                  aria-hidden
                />

                <Text asChild weight="medium">
                  <span className="flex-1">{command.label}</span>
                </Text>

                <Text size="xs" variant="subtle">
                  ↵
                </Text>
              </button>
            );
          })}
        </div>

        <div className="border-t border-zinc-800 px-4 py-2">
          <Text size="xs" variant="subtle" align="center">
            ↑ ↓ navigate · ↵ open · Esc close
          </Text>
        </div>
      </div>
    </div>
  );
}
