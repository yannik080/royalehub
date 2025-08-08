import { NextResponse } from "next/server";
import { getGlobalTopPlayers, getPlayer, getPlayerBattlelog } from "@/lib/cr";

export const revalidate = 300; // 5 minutes

interface DeckKeyed {
  key: string;
  cards: { id: number; name: string; icon?: string }[];
  count: number;
}

function sleep(ms: number) { return new Promise((r) => setTimeout(r, ms)); }

export async function GET(req: Request) {
  try {
    if (!process.env.CLASH_ROYALE_API_TOKEN) {
      return NextResponse.json({ error: "Missing CLASH_ROYALE_API_TOKEN. Set it in .env.local and restart the server." }, { status: 503 });
    }

    const { searchParams } = new URL(req.url);
    const limitParam = Number(searchParams.get("limit") ?? "");
    const slow = searchParams.get("mode") === "slow";
    const limit = Number.isFinite(limitParam) && limitParam > 0 && limitParam <= 50 ? limitParam : 12;

    const top = await getGlobalTopPlayers(limit);
    const results: DeckKeyed[] = [];
    const map = new Map<string, DeckKeyed>();

    let success = 0;
    let failed = 0;
    let consecutive429 = 0;

    const targetSuccess = Math.min(10, top.length);

    for (const p of top) {
      try {
        const player = await getPlayer(p.tag);
        let deck = (player.currentDeck || []).map((c) => ({ id: c.id, name: c.name, icon: c.iconUrls?.medium || c.iconUrls?.large }));
        if (deck.length !== 8) {
          try {
            const log = await getPlayerBattlelog(p.tag);
            const last = log?.find((e) => e?.team?.[0]?.cards?.length === 8);
            if (last?.team?.[0]?.cards) {
              deck = last.team[0].cards.map((c) => ({ id: c.id, name: c.name, icon: c.iconUrls?.medium || c.iconUrls?.large }));
            }
          } catch {}
        }
        if (deck.length === 8) {
          const key = deck.map((c) => c.id).sort((a, b) => a - b).join("-");
          const existing = map.get(key);
          if (existing) existing.count += 1;
          else {
            const entry: DeckKeyed = { key, cards: deck, count: 1 };
            map.set(key, entry);
            results.push(entry);
          }
        }
        success++;
        consecutive429 = 0;
      } catch (e: any) {
        failed++;
        if (String(e?.message || "").includes("429")) {
          consecutive429++;
          const backoff = Math.min(1500, 200 * consecutive429);
          await sleep(backoff);
        }
      }
      if (success >= targetSuccess && results.length >= 4) break;
      // small pacing delay to avoid rate limits
      await sleep(slow ? 300 : 120);
    }

    if (success === 0) {
      return NextResponse.json({ error: "No player data could be fetched. Check API token and Allowed IP (401/403)." }, { status: 502 });
    }

    results.sort((a, b) => b.count - a.count);
    return NextResponse.json({ items: results.slice(0, 50), stats: { success, failed } });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Failed to build meta" }, { status: 500 });
  }
} 