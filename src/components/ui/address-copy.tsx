"use client";

import * as React from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AddressCopyProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  label: string;
  icon?: boolean;
  type?: "java" | "bedrock" | "store";
}

export function AddressCopy({
  value,
  label,
  icon = true,
  type = "java",
  className,
  ...props
}: AddressCopyProps) {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(`${label} copied!`, {
        description: value,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  }, [value, label]);

  const typeStyles = {
    java: "bg-emerald-500",
    bedrock: "bg-blue-500",
    store: "bg-brand-accent",
  };

  return (
    <div
      className={cn(
        "group relative flex items-center gap-3 px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all duration-300 shadow-sm cursor-pointer",
        className
      )}
      onClick={copyToClipboard}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && copyToClipboard()}
      {...props}
    >
      <div className="flex items-center gap-2">
        {icon && (
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full animate-pulse",
              typeStyles[type] || "bg-zinc-500"
            )}
          />
        )}
        <span className="text-xs font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          {value}
        </span>
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          ({label})
        </span>
      </div>
      <div className="h-3 w-px bg-zinc-200 dark:bg-zinc-800 mx-1" />
      <div className="relative h-3.5 w-3.5 flex items-center justify-center">
        <Check
          className={cn(
            "absolute inset-0 h-full w-full text-emerald-500 transition-all duration-300 transform",
            copied ? "scale-100 opacity-100" : "scale-50 opacity-0"
          )}
        />
        <Copy
          className={cn(
            "absolute inset-0 h-full w-full text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-all duration-300 transform",
            copied ? "scale-50 opacity-0" : "scale-100 opacity-100"
          )}
        />
      </div>

      <span className="absolute -top-8 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-all duration-200 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 text-[10px] px-2 py-1 rounded font-medium whitespace-nowrap z-10">
        {copied ? "Copied!" : "Click to copy"}
      </span>
    </div>
  );
}
