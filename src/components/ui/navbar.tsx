"use client";

import Link from "next/link";
import { Search, Home, Users, Shield, Play, Info, TrendingUp, Settings } from "lucide-react";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/ui/theme-toggle";
import { openCommandPalette } from "@/lib/command-palette";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X as CloseIcon } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", path: "/", icon: Home },
  { label: "Staff", path: "/staff", icon: Users },
  { label: "Rules", path: "/rules", icon: Shield },
  { label: "Play", path: "/play", icon: Play },
  { label: "Vote", path: "/vote", icon: TrendingUp },
  { label: "About", path: "/about", icon: Info },
];

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check auth status
  useEffect(() => {
    fetch("/api/auth/status").then(r => r.json()).then(data => {
      setIsAdmin(!!data.isLoggedIn);
    }).catch(() => {});
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMobileMenuOpen(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav className="flex items-center justify-between px-6 py-3 sticky top-0 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md supports-backdrop-filter:bg-white/70 dark:supports-backdrop-filter:bg-zinc-950/70 z-50 transition-colors duration-300">
        {/* Logo */}
        <Link
          href="/"
          className="font-black text-xl tracking-tight select-none flex items-center gap-1 group z-60"
          tabIndex={0}
        >
          <span className="text-zinc-900 dark:text-white transition-colors">Nexus</span>
          <span className="text-brand-accent transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(var(--brand-accent-rgb),0.5)]">Mines</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={openCommandPalette}
            aria-label="Open command palette"
            className="rounded-xl relative transition-all duration-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 group h-10 w-10 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 hidden sm:flex"
          >
            <Search className="h-[1.1rem] w-[1.1rem] transition-colors" />
            <span className="sr-only">Search</span>
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] px-2 py-px rounded bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 whitespace-nowrap z-50">
              Search - Ctrl K
            </span>
          </Button>

          <ModeToggle />

          <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-2 hidden md:block" />

          <div className="hidden md:flex items-center gap-1 sm:gap-1.5 ml-2">
            {NAV_LINKS.map(({ label, path, icon: Icon }, index) => {
              const isActive = pathname === path;
              
              return (
                <Link
                  key={label}
                  href={path}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className={cn(
                    "group relative rounded-xl px-4 py-2 flex items-center gap-2 transition-all duration-300 font-semibold text-xs tracking-tight border animate-in fade-in slide-in-from-right-2 select-none",
                    isActive 
                      ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white border-zinc-200 dark:border-zinc-800 shadow-sm" 
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white border-transparent hover:border-zinc-200 dark:hover:border-zinc-800"
                  )}
                  tabIndex={0}
                >
                  <Icon className={cn(
                    "h-3.5 w-3.5 transition-all duration-300",
                    isActive ? "text-brand-accent scale-110" : "group-hover:scale-110"
                  )} />
                  <span className="hidden sm:inline">{label}</span>
                  
                  {isActive && (
                    <span 
                      className="absolute -bottom-[13px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-accent shadow-[0_0_8px_rgba(var(--brand-accent-rgb),1)] animate-in zoom-in-0 duration-500"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Admin Dashboard Link */}
          {isAdmin && (
            <Link
              href="/admin"
              className={cn(
                "group relative rounded-xl px-3 py-2 hidden md:flex items-center gap-2 transition-all duration-300 font-semibold text-xs tracking-tight border animate-in fade-in select-none",
                pathname === "/admin"
                  ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white border-zinc-200 dark:border-zinc-800 shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white border-transparent hover:border-zinc-200 dark:hover:border-zinc-800"
              )}
            >
              <Settings className={cn("h-3.5 w-3.5 transition-all duration-300", pathname === "/admin" ? "text-brand-accent scale-110" : "group-hover:scale-110")} />
              <span className="hidden sm:inline">Admin</span>
              {pathname === "/admin" && (
                <span className="absolute -bottom-[13px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-accent shadow-[0_0_8px_rgba(var(--brand-accent-rgb),1)] animate-in zoom-in-0 duration-500" />
              )}
            </Link>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-10 w-10 rounded-xl relative z-[60]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? (
              <CloseIcon className="h-5 w-5 animate-in spin-in-90 duration-300" />
            ) : (
              <Menu className="h-5 w-5 animate-in spin-in-hidden duration-300" />
            )}
          </Button>
        </div>
      </nav>

      <div 
        className={cn(
          "fixed inset-0 z-40 md:hidden bg-white dark:bg-zinc-950 transition-all duration-500 ease-in-out",
          isMobileMenuOpen ? "opacity-100 pointer-events-auto translate-y-0" : "opacity-0 pointer-events-none -translate-y-4"
        )}
      >
        <div className="flex flex-col h-full pt-20 px-6 pb-10">
          <div className="grid gap-2 mb-8">
            <Button
              variant="outline"
              className="w-full justify-start h-14 rounded-2xl border-zinc-200 dark:border-zinc-800 px-6"
              onClick={() => {
                setIsMobileMenuOpen(false);
                openCommandPalette();
              }}
            >
              <Search className="h-5 w-5 mr-3 text-zinc-400" />
              <span className="font-bold text-lg">Search Anywhere</span>
              <span className="ml-auto text-[10px] uppercase tracking-widest text-zinc-400">Ctrl K</span>
            </Button>
          </div>

          <div className="flex flex-col gap-2 grow">
            {NAV_LINKS.map(({ label, path, icon: Icon }, index) => {
              const isActive = pathname === path;
              return (
                <Link
                  key={label}
                  href={path}
                  className={cn(
                    "flex items-center gap-4 px-6 py-5 rounded-2xl transition-all duration-300",
                    isActive 
                      ? "bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
                      : "border border-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                  )}
                  style={{ 
                    transitionDelay: `${index * 50}ms`,
                    animationDelay: `${index * 50}ms`
                  }}
                >
                  <Icon className={cn(
                    "h-6 w-6 transition-all duration-300",
                    isActive ? "text-brand-accent scale-110" : "text-zinc-400"
                  )} />
                  <span className={cn(
                    "font-bold text-xl tracking-tight",
                    isActive ? "text-zinc-900 dark:text-white" : "text-zinc-500"
                  )}>{label}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-brand-accent shadow-[0_0_12px_rgba(var(--brand-accent-rgb),0.8)]" />
                  )}
                </Link>
              );
            })}
          </div>

            {/* Admin Link in mobile menu */}
            {isAdmin && (
              <Link
                href="/admin"
                className={cn(
                  "flex items-center gap-4 px-6 py-5 rounded-2xl transition-all duration-300 mt-2",
                  pathname === "/admin"
                    ? "bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
                    : "border border-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                )}
              >
                <Settings className={cn("h-6 w-6 transition-all duration-300", pathname === "/admin" ? "text-brand-accent scale-110" : "text-zinc-400")} />
                <span className={cn("font-bold text-xl tracking-tight", pathname === "/admin" ? "text-zinc-900 dark:text-white" : "text-zinc-500")}>Admin</span>
                {pathname === "/admin" && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-brand-accent shadow-[0_0_12px_rgba(var(--brand-accent-rgb),0.8)]" />
                )}
              </Link>
            )}

          <div className="mt-auto pt-10 border-t border-zinc-100 dark:border-zinc-900 text-center">
             <p className="text-zinc-400 text-sm font-medium">NexusMines Community</p>
             <p className="text-[10px] uppercase tracking-widest text-zinc-500 mt-1">Refined Gaming Experience</p>
          </div>
        </div>
      </div>
    </>
  );
}
