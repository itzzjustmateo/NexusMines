"use client";

import { AddressCopy } from "@/components/ui/address-copy";
import { ShoppingCart } from "lucide-react";

export function StoreCTA() {
  const storeUrl = "store.nexusmines.com";

  return (
    <section className="py-24 px-4 bg-zinc-50 dark:bg-zinc-950/50 border-t border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 bg-white dark:bg-zinc-900 p-8 md:p-12 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden relative group">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-brand-accent/5 rounded-full blur-3xl group-hover:bg-brand-accent/10 transition-colors duration-500" />
        
        <div className="flex-1 text-center md:text-left z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent/10 text-brand-accent text-xs font-bold mb-4">
            <ShoppingCart className="h-3.5 w-3.5" />
            OFFICIAL STORE
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white tracking-tight leading-tight">
            Support the server & <br />
            <span className="text-brand-accent text-glow">Unlock Perks</span>
          </h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400 font-medium">
            Get exclusive ranks, crates, and items while helping us keep the lights on.
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 z-10 w-full md:w-auto">
          <AddressCopy value={storeUrl} label="Store" type="store" className="scale-110" />
          <p className="text-[10px] text-zinc-500 dark:text-zinc-500 font-bold tracking-widest uppercase">
            Click to copy address
          </p>
        </div>
      </div>
    </section>
  );
}
