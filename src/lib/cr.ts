export interface ClashRoyaleCard {
  id: number;
  name: string;
  maxLevel: number;
  iconUrls?: { medium?: string; large?: string; }; 
}

export interface ClashRoyalePlayerCard {
  id: number;
  name: string;
  level: number;
  maxLevel: number;
  iconUrls?: { medium?: string; large?: string; };
}

export interface ClashRoyalePlayer {
  tag: string;
  name: string;
  expLevel: number;
  trophies: number;
  currentFavouriteCard?: ClashRoyalePlayerCard;
  currentDeck?: ClashRoyalePlayerCard[];
  cards?: ClashRoyalePlayerCard[];
}

const API_BASE = process.env.CR_API_BASE || "https://api.clashroyale.com/v1";
const TOKEN = process.env.CLASH_ROYALE_API_TOKEN;

if (!TOKEN) {
  // In dev, it's okay to warn; prod should set it.
  console.warn("CLASH_ROYALE_API_TOKEN is not set. API calls will fail.");
}

// Simple in-memory cache (per server instance)
const cache = new Map<string, { expiresAt: number; data: any }>();

async function crFetch<T>(path: string, ttlMs = 60_000): Promise<T> {
  const url = `${API_BASE}${path}`;
  const cacheKey = url;
  const now = Date.now();
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > now) {
    return cached.data as T;
  }

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/json",
    },
    // Revalidate edge cache if any
    next: { revalidate: Math.ceil(ttlMs / 1000) },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`CR API ${res.status} ${res.statusText}: ${text}`);
  }
  const data = (await res.json()) as T;
  cache.set(cacheKey, { expiresAt: now + ttlMs, data });
  return data;
}

export async function getCards(): Promise<ClashRoyaleCard[]> {
  const data = await crFetch<{ items: ClashRoyaleCard[] }>(`/cards`, 12 * 60 * 60 * 1000);
  return data.items;
}

export async function getGlobalTopPlayers(limit = 50): Promise<{ tag: string; name: string; trophies: number; }[]> {
  const data = await crFetch<{ items: { tag: string; name: string; trophies: number; }[] }>(`/locations/global/rankings/players?limit=${limit}`, 5 * 60 * 1000);
  return data.items;
}

export async function getPlayer(rawTag: string): Promise<ClashRoyalePlayer> {
  const tag = normalizeTag(rawTag);
  return await crFetch<ClashRoyalePlayer>(`/players/${encodeURIComponent(tag)}`, 60 * 1000);
}

export interface BattlelogEntry {
  type: string;
  battleTime: string;
  team?: { cards?: { id: number; name: string; iconUrls?: { medium?: string; large?: string } }[] }[];
}

export async function getPlayerBattlelog(rawTag: string): Promise<BattlelogEntry[]> {
  const tag = normalizeTag(rawTag);
  return await crFetch<BattlelogEntry[]>(`/players/${encodeURIComponent(tag)}/battlelog`, 30 * 1000);
}

export function normalizeTag(tag: string): string {
  const t = tag.trim().toUpperCase().replace(/^#/, "");
  return `#${t}`;
} 