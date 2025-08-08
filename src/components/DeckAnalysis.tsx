"use client";
import { analyzeDeckByNames, DeckAnalysisItemization } from "@/lib/analysis";

export default function DeckAnalysis({ names }: { names: string[] }) {
  const analysis: DeckAnalysisItemization = analyzeDeckByNames(names);
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 space-y-3">
      <div className="flex flex-wrap gap-2 text-sm text-zinc-300">
        {names.map((n) => (
          <span key={n} className="px-2 py-1 rounded bg-zinc-800">{n}</span>
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
        <Stat label="Score" value={analysis.score != null ? String(analysis.score) : "-"} />
        <Stat label="Avg Elixir" value={analysis.averageElixir ? analysis.averageElixir.toFixed(2) : "?"} />
        <Stat label="Win Cond" value={analysis.hasWinCondition ? "Yes" : "No"} />
        <Stat label="Air Defense" value={analysis.airDefense} />
        <Stat label="Spells" value={String(analysis.spellCount)} />
        <Stat label="Buildings" value={String(analysis.buildingCount)} />
        <Stat label="Splash" value={String(analysis.splashCount)} />
        <Stat label="Reset" value={String(analysis.resetCount)} />
      </div>
      {analysis.warnings.length > 0 && (
        <div className="text-yellow-300 text-sm">
          <ul className="list-disc ml-5">
            {analysis.warnings.map((w, idx) => <li key={idx}>{w}</li>)}
          </ul>
        </div>
      )}
      {analysis.suggestions.length > 0 && (
        <div className="text-zinc-300 text-sm">
          <div className="font-semibold mb-1">Suggestions</div>
          <ul className="list-disc ml-5">
            {analysis.suggestions.map((s, idx) => <li key={idx}>{s}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded bg-zinc-800 p-2 flex items-center justify-between">
      <span className="text-zinc-400">{label}</span>
      <span className="font-semibold text-zinc-100">{value}</span>
    </div>
  );
} 