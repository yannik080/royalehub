import { headers } from "next/headers";
import DeckGrid from "@/components/DeckGrid";

async function getMeta() {
  const h = await headers();
  const host = h.get("host");
  const protocol = h.get("x-forwarded-proto") ?? "http";
  const base = `${protocol}://${host}`;
  const res = await fetch(`${base}/api/meta?mode=slow&limit=10`, { cache: "no-store" });
  if (!res.ok) {
    let detail = "";
    try { const j = await res.json(); detail = j?.error || ""; } catch {}
    throw new Error(`Failed to load meta${detail ? `: ${detail}` : ""}`);
  }
  return res.json() as Promise<{ items: { key: string; count: number; cards: { id: number; name: string; icon?: string }[] }[] }>;
}

export default async function MetaPage() {
  try {
    const { items } = await getMeta();
    const isEmpty = !items || items.length === 0;
    return (
      <main className="max-w-6xl mx-auto p-4 space-y-6">
        <h1 className="text-2xl font-bold">Meta Decks</h1>
        <p className="text-zinc-400">Aggregated from top players' current decks.</p>
        {isEmpty ? (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 text-zinc-300">
            Keine Meta-Decks gefunden. Prüfe deinen API-Key (Allowed IP) und lade die Seite neu.
          </div>
        ) : (
          <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
            {items.map((deck) => (
              <div key={deck.key} className="rounded-lg border border-zinc-800 bg-zinc-900 p-3 sm:p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-300">Usage</span>
                  <span className="text-zinc-100 font-semibold">{deck.count}</span>
                </div>
                <DeckGrid cards={deck.cards} />
              </div>
            ))}
          </div>
        )}
      </main>
    );
  } catch (e: any) {
    return (
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold">Meta Decks</h1>
        <p className="mt-3 text-red-300">{e?.message || "Failed to load meta decks."}</p>
        <p className="mt-1 text-zinc-400">Set <code className="px-1 py-0.5 rounded bg-zinc-800 border border-zinc-700">CLASH_ROYALE_API_TOKEN</code> in <code className="px-1 py-0.5 rounded bg-zinc-800 border border-zinc-700">.env.local</code> and restart the dev server.</p>
      </main>
    );
  }
} 