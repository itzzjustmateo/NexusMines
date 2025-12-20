"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";
import { ArrowRight } from "lucide-react";

export default function ApplyPage() {
  useEffect(() => {
    window.location.href = "https://forms.gle/f1osvk1anNmK9vsQ8";
  }, []);

  return (
    <section className="flex min-h-screen items-center justify-center px-6 text-center">
      <div className="max-w-md">
        <h1 className="text-3xl font-bold">Redirecting…</h1>
        <p className="mt-3 text-zinc-400">
          You’re being sent to the NexusMines application form.
        </p>

        <Button asChild variant={"link"}>
          <Link href="https://forms.gle/f1osvk1anNmK9vsQ8">
            <span className="relative z-10 flex items-center gap-2">
              Open application form
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </span>

            <span
              className="
                absolute
                inset-0
                -z-0
                bg-gradient-to-r
                from-white/10
                via-white/20
                to-white/10
                opacity-0
                transition-opacity
                group-hover:opacity-100
              "
            />
          </Link>
        </Button>
      </div>
    </section>
  );
}
