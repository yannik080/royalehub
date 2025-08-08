import "./globals.css";
import Link from "next/link";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Clash Royale Hub",
  description: "Build, analyze, and compare decks with real Clash Royale data.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-black text-zinc-100">
        <header className="sticky top-0 z-20 border-b border-zinc-800 bg-black/80 backdrop-blur">
          <nav className="max-w-6xl mx-auto p-3 sm:p-4 flex items-center gap-4 sm:gap-6 flex-wrap">
            <Link href="/" className="font-semibold">CR Hub</Link>
            <div className="flex items-center gap-4 overflow-x-auto">
              <Link href="/meta" className="text-zinc-300 hover:text-white whitespace-nowrap">Meta</Link>
              <Link href="/builder" className="text-zinc-300 hover:text-white whitespace-nowrap">Builder</Link>
            </div>
          </nav>
        </header>
        {children}
        <footer className="border-t border-zinc-800 mt-16">
          <div className="max-w-6xl mx-auto p-4 text-sm text-zinc-500">Not affiliated with Supercell. Uses official Clash Royale API.</div>
        </footer>
      </body>
    </html>
  );
}
