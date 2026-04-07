"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Home, Vote, Info, Play, Shield, Users, ClipboardCheck, Server, Search } from "lucide-react";

type Command = {
  label: string;
  path: string;
  icon: React.ElementType;
};

const commands: Command[] = [
  { label: "Home", path: "/", icon: Home },
  { label: "Play", path: "/play", icon: Play },
  { label: "Rules", path: "/rules", icon: Shield },
  { label: "Staff", path: "/staff", icon: Users },
  { label: "Vote", path: "/vote", icon: Vote },
  { label: "Apply", path: "/apply", icon: ClipboardCheck },
  { label: "Status", path: "/status", icon: Server },
  { label: "About", path: "/about", icon: Info },
];

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const filteredCommands = commands.filter((command) =>
    command.label.toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  useEffect(() => {
    if (listRef.current && filteredCommands.length > 0) {
      const selectedElement = listRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex, filteredCommands.length]);

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
        if (command) {
          router.push(command.path);
          setOpen(false);
        }
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
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div 
        className="mx-auto mt-32 max-w-md rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-zinc-200 dark:border-zinc-700 px-4 py-3">
          <Search className="h-4 w-4 text-zinc-400" />
          <input
            autoFocus
            placeholder="Search pages..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-400 text-zinc-900 dark:text-white"
          />
          <kbd className="text-xs text-zinc-400">ESC</kbd>
        </div>

        <div ref={listRef} className="max-h-64 overflow-y-auto py-2">
          {filteredCommands.length === 0 ? (
            <p className="px-4 py-6 text-sm text-zinc-500 text-center">No results found.</p>
          ) : (
            filteredCommands.map((command, index) => {
              const Icon = command.icon;
              const isSelected = index === selectedIndex;

              return (
                <button
                  key={command.path}
                  onMouseEnter={() => setSelectedIndex(index)}
                  onClick={() => {
                    router.push(command.path);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm ${
                    isSelected 
                      ? "bg-zinc-100 dark:bg-zinc-800" 
                      : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isSelected ? "text-zinc-900 dark:text-white" : "text-zinc-400"}`} />
                  <span className={isSelected ? "text-zinc-900 dark:text-white font-medium" : "text-zinc-600 dark:text-zinc-300"}>
                    {command.label}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
