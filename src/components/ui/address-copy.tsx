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
        "group relative flex items-center gap-3 px-5 py-3 rounded-xl border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 bg-white/50 dark:bg-white/5 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer",
        className
      )}
      onClick={copyToClipboard}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && copyToClipboard()}
      {...props}
    >
      <div className={cn(
        "absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500",
        type === "java" && "bg-emerald-500/5",
        type === "bedrock" && "bg-blue-500/5",
        type === "store" && "bg-brand-accent/5"
      )} />
      
      <div className="relative z-10 flex items-center gap-2.5">
        {icon && (
          <span className="flex items-center gap-1.5">
            <span
              className={cn(
                "h-2 w-2 rounded-full animate-pulse",
                typeStyles[type] || "bg-zinc-500"
              )}
            />
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              {label}
            </span>
          </span>
        )}
        <span className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 font-mono">
          {value}
        </span>
      </div>
      
      <div className="relative z-10 h-4 w-px bg-zinc-200 dark:bg-zinc-700 mx-1" />
      
      <div className="relative z-10 h-4 w-4 flex items-center justify-center">
        <Check
          className={cn(
            "absolute inset-0 h-full w-full text-emerald-500 transition-all duration-300",
            copied ? "scale-100 opacity-100" : "scale-50 opacity-0"
          )}
        />
        <Copy
          className={cn(
            "absolute inset-0 h-full w-full text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-all duration-300",
            copied ? "scale-50 opacity-0" : "scale-100 opacity-100"
          )}
        />
      </div>

      <span className="absolute -top-10 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-all duration-200 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 text-[10px] px-2.5 py-1.5 rounded-lg font-semibold whitespace-nowrap z-20">
        {copied ? "Copied!" : "Click to copy"}
      </span>
    </div>
  );
}
