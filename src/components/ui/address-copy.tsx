"use client";

import * as React from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AddressCopyProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  label: string;
  showLabel?: boolean;
  type?: "java" | "bedrock" | "store";
}

export function AddressCopy({
  value,
  label,
  showLabel = true,
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

  return (
    <button
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer w-full min-w-0",
        className
      )}
      onClick={copyToClipboard}
      {...props}
    >
      {showLabel && (
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide shrink-0">
          {label}
        </span>
      )}
      <span className="text-sm font-mono font-medium text-zinc-900 dark:text-zinc-100 truncate min-w-0">
        {value}
      </span>
      <span className="shrink-0">
        {copied ? (
          <Check className="h-4 w-4 text-emerald-500" />
        ) : (
          <Copy className="h-4 w-4 text-zinc-400" />
        )}
      </span>
    </button>
  );
}
