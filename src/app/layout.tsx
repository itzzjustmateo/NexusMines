import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { JetBrains_Mono as FontMono } from "next/font/google";

import "./globals.css";

import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { CommandPalette } from "@/components/ui/command-palette";
import { Text } from "@/components/ui/text";
import Link from "next/link";
import { ThemeProvider } from "@/components/provider/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/provider/providers";

const fontSans = FontSans({
  variable: "--font-c-sans",
  subsets: ["latin"],
});

const fontMono = FontMono({
  variable: "--font-c-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NexusMines",
  description: "The BEST Mine-Server",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={[
          fontSans.variable,
          fontMono.variable,
          "min-h-screen antialiased bg-background text-foreground",
        ].join(" ")}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Skip-to-content text for accessibility */}
          <Text asChild size="xs" className="sr-only">
            <Link href="#content">Skip to content</Link>
          </Text>

          <Navbar />
          <CommandPalette />

          <main id="content" className="min-h-[calc(100vh-8rem)]">
            <Providers>
              {children}
            </Providers>
          </main>

          <Footer createdAt={2025} name="DevFlare" allRightsReserved />
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
