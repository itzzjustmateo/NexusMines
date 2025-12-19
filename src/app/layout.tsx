import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { JetBrains_Mono as FontMono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";

const fontSans = FontSans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fontMono = FontMono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NexusMines",
  description: "The *BEST* Mine-Server",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className={fontSans + "min-h-screen antialiased"}>
          {children}
        </main>
        <Footer createdAt={2025} name="TechNova" allRightsReserved />
      </body>
    </html>
  );
}
