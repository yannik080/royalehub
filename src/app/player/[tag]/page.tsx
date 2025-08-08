import { headers } from "next/headers";
import DeckGrid from "@/components/DeckGrid";
import DeckAnalysis from "@/components/DeckAnalysis";

async function getPlayer(tag: string) {
  const h = await headers();
  const host = h.get("host");
  const protocol = h.get("x-forwarded-proto") ?? "http";
  const base = `${protocol}://${host}`;
  const res = await fetch(`${base}/api/player/${encodeURIComponent(tag)}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load player");
  return res.json() as Promise<{ name: string; tag: string; trophies: number; currentDeck?: { id: number; name: string; iconUrls?: { medium?: string; large?: string } }[]; cards?: { id: number; name: string; level: number; maxLevel: number; iconUrls?: { medium?: string; large?: string } }[] }>
}

function toBuilderHref(ids: number[]) {
  return `/builder?ids=${ids.join(",")}`;
}

export default async function PlayerPage({ params }: { params: { tag: string } }) {
  const tag = decodeURIComponent(params.tag);
  const player = await getPlayer(tag);
  const cards = (player.currentDeck ?? []).map((c) => ({ id: c.id, name: c.name, icon: c.iconUrls?.medium || c.iconUrls?.large }));
  const ids = cards.map((c) => c.id);

  return (
    <main className="max-w-5xl mx-auto p-4 space-y-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">{player.name} <span className="text-zinc-400 text-base">{player.tag}</span></h1>
          <p className="text-zinc-400">Trophies: {player.trophies}</p>
        </div>
        {ids.length === 8 && (
          <a href={toBuilderHref(ids)} className="px-3 py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-sm">Deck im Builder öffnen</a>
        )}
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Current Deck</h2>
        {cards.length === 8 ? <DeckGrid cards={cards} /> : <p className="text-zinc-400">No deck available.</p>}
        {cards.length > 0 && <DeckAnalysis names={cards.map((c) => c.name)} />}
      </section>

      {player.cards && player.cards.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Sammlung</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {player.cards.map((c) => (
              <div key={c.id} className="rounded border border-zinc-800 bg-zinc-900 p-2">
                <div className="text-sm">{c.name}</div>
                <div className="text-xs text-zinc-400">Level {c.level} / {c.maxLevel}</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
} 