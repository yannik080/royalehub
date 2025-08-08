import CardIcon from "./CardIcon";

export interface DeckCard { id: number; name: string; icon?: string }

export default function DeckGrid({ cards }: { cards: DeckCard[] }) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {cards.map((c) => (
        <div key={c.id} className="rounded border border-zinc-800 bg-zinc-900 p-2">
          <CardIcon name={c.name} iconUrl={c.icon} />
        </div>
      ))}
    </div>
  );
} 