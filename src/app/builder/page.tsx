"use client";
import { useEffect, useMemo, useState } from "react";
import DeckAnalysis from "@/components/DeckAnalysis";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { suggestRolesToImprove } from "@/lib/analysis";

interface Card { id: number; name: string; iconUrls?: { medium?: string; large?: string } }

export default function BuilderPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [selected, setSelected] = useState<Card[]>([]);
  const [query, setQuery] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    fetch("/api/cards").then((r) => r.json()).then((d) => setCards(d.items || [])).catch(() => {});
  }, []);

  // Prefill from ids param once cards are loaded
  useEffect(() => {
    const idsParam = searchParams.get("ids");
    if (!idsParam || cards.length === 0 || selected.length > 0) return;
    const ids = idsParam.split(",").map((s) => parseInt(s, 10)).filter((n) => Number.isFinite(n));
    const chosen = ids.map((id) => cards.find((c) => c.id === id)).filter(Boolean) as Card[];
    if (chosen.length > 0) setSelected(chosen.slice(0, 8));
  }, [cards, searchParams, selected.length]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return cards.filter((c) => c.name.toLowerCase().includes(q));
  }, [cards, query]);

  function toggle(card: Card) {
    const exists = selected.find((c) => c.id === card.id);
    if (exists) setSelected((s) => s.filter((c) => c.id !== card.id));
    else if (selected.length < 8) setSelected((s) => [...s, card]);
  }

  const suggestionTexts = useMemo(() => suggestRolesToImprove(selected.map((c) => c.name)), [selected]);

  return (
    <main className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
      <section className="md:col-span-2 space-y-4">
        <h1 className="text-2xl font-bold">Deck Builder</h1>
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 8 }).map((_, idx) => {
            const c = selected[idx];
            return (
              <button key={idx} onClick={() => c && toggle(c)} className="h-24 sm:h-28 rounded border border-zinc-800 bg-zinc-900 flex items-center justify-center">
                {c ? (
                  <Image src={c.iconUrls?.medium || c.iconUrls?.large || "/favicon.ico"} alt={c.name} width={72} height={72} className="rounded" />
                ) : (
                  <span className="text-zinc-500">Empty</span>
                )}
              </button>
            );
          })}
        </div>
        <DeckAnalysis names={selected.map((c) => c.name)} />
        {suggestionTexts.length > 0 && (
          <div className="rounded border border-zinc-800 bg-zinc-900 p-3 text-sm text-zinc-300">
            <div className="font-semibold mb-1">Verbesserungsvorschläge</div>
            <ul className="list-disc ml-5">
              {suggestionTexts.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        )}
      </section>

      <aside className="space-y-3">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search cards..." className="w-full rounded bg-zinc-900 border border-zinc-800 px-3 py-2 outline-none" />
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 max-h-[70vh] overflow-auto pr-1">
          {filtered.map((c) => (
            <button key={c.id} onClick={() => toggle(c)} className="flex items-center gap-2 p-3 rounded border border-zinc-800 bg-zinc-900 hover:bg-zinc-800">
              <Image src={c.iconUrls?.medium || c.iconUrls?.large || "/favicon.ico"} alt={c.name} width={44} height={44} className="rounded" />
              <span className="text-sm">{c.name}</span>
            </button>
          ))}
        </div>
      </aside>
    </main>
  );
} 