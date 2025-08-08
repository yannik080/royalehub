import Link from "next/link";
import PlayerSearch from "@/components/PlayerSearch";

export default function HomePage() {
  return (
    <main className="max-w-6xl mx-auto p-4 space-y-10 sm:space-y-12">
      <section className="rounded-2xl bg-gradient-to-br from-indigo-900 via-zinc-900 to-black p-6 sm:p-10 border border-zinc-800">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Clash Royale Hub</h1>
        <p className="mt-3 text-zinc-300 max-w-2xl text-sm sm:text-base">Build, analyze, and compare decks. Powered by the official Clash Royale API. Explore trending meta decks, check your player deck, or craft your own with AI-guided insights.</p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link href="/meta" className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-center">Meta Decks</Link>
          <Link href="/builder" className="px-4 py-2 rounded border border-zinc-700 hover:bg-zinc-800 text-center">Deck Builder</Link>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-4 sm:gap-6">
        <div className="rounded-xl border border-zinc-800 p-4 sm:p-6 bg-zinc-900">
          <h2 className="text-lg sm:text-xl font-semibold">Lookup Player</h2>
          <PlayerSearch />
        </div>
        <div className="rounded-xl border border-zinc-800 p-4 sm:p-6 bg-zinc-900">
          <h2 className="text-lg sm:text-xl font-semibold">What makes a strong deck?</h2>
          <ul className="list-disc ml-5 mt-2 text-zinc-300 space-y-1 text-sm">
            <li>Clear win condition</li>
            <li>Reliable air defense</li>
            <li>Balanced spell package</li>
            <li>Splash + single-target coverage</li>
            <li>Reasonable elixir curve and cycle</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
