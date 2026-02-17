"use client";

import { SunMedium, MoonStar, Laptop } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="
            relative rounded-xl
            transition-all duration-300
            hover:bg-zinc-100 dark:hover:bg-zinc-800
          "
        >
          {/* Sun */}
          <SunMedium
            className="
              h-[1.2rem] w-[1.2rem]
              rotate-0 scale-100
              transition-all duration-300
              dark:-rotate-90 dark:scale-0
            "
          />

          {/* Moon */}
          <MoonStar
            className="
              absolute h-[1.2rem] w-[1.2rem]
              rotate-90 scale-0
              transition-all duration-300
              dark:rotate-0 dark:scale-100
            "
          />

          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="rounded-xl">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <SunMedium className="mr-2 h-4 w-4" />
          Light
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <MoonStar className="mr-2 h-4 w-4" />
          Dark
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Laptop className="mr-2 h-4 w-4" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
