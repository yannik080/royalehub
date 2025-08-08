import { CARD_META_BY_NAME, CARD_ELIXIR_BY_NAME, CardRole } from "./cardMeta";

export interface DeckAnalysisItemization {
  averageElixir?: number;
  unknownElixirCount: number;
  roleCounts: Record<CardRole, number>;
  hasWinCondition: boolean;
  airDefense: "none" | "light" | "good";
  spellCount: number;
  buildingCount: number;
  splashCount: number;
  resetCount: number;
  cycleCards: number;
  warnings: string[];
  suggestions: string[];
  score?: number;
}

export function analyzeDeckByNames(cardNames: string[]): DeckAnalysisItemization {
  const names = cardNames.filter(Boolean).slice(0, 8);

  const elixirs = names.map((n) => CARD_ELIXIR_BY_NAME[n] ?? undefined);
  const knownElixirs = elixirs.filter((e): e is number => typeof e === "number" && e > 0);
  const averageElixir = knownElixirs.length > 0 ? round2(knownElixirs.reduce((a, b) => a + b, 0) / names.length) : undefined;
  const unknownElixirCount = names.length - knownElixirs.length;

  const roleCounts = Object.fromEntries(
    ["win_condition","air_defense","building","spell","splash","cycle","reset","support"].map((r) => [r, 0])
  ) as Record<CardRole, number>;

  for (const name of names) {
    const roles = CARD_META_BY_NAME[name]?.roles ?? [];
    for (const role of roles) roleCounts[role] += 1;
  }

  const hasWinCondition = roleCounts["win_condition"] > 0;
  const airDefenseLevel = roleCounts["air_defense"] >= 3 ? "good" : roleCounts["air_defense"] >= 1 ? "light" : "none";
  const spellCount = roleCounts["spell"];
  const buildingCount = roleCounts["building"];
  const splashCount = roleCounts["splash"];
  const resetCount = roleCounts["reset"];
  const cycleCards = roleCounts["cycle"];

  const warnings: string[] = [];
  const suggestions: string[] = [];

  if (!hasWinCondition) {
    warnings.push("No clear win condition detected.");
    suggestions.push("Add a primary win condition (e.g., Hog Rider, Miner, Royal Giant, Graveyard).");
  }
  if (airDefenseLevel === "none") {
    warnings.push("No air defense.");
    suggestions.push("Include at least one air-targeting unit or building (e.g., Musketeer, Tesla).");
  }
  if (spellCount < 1) suggestions.push("Add at least one spell for versatility (e.g., Fireball, Log, Zap).");
  if (spellCount > 3) warnings.push("Too many spells may weaken your troop presence.");
  if (buildingCount > 2) warnings.push("Multiple buildings can overcommit; ensure they fit your game plan.");
  if (splashCount === 0) suggestions.push("Include splash damage to handle swarms (e.g., Baby Dragon, Wizard, Bomb Tower).");
  if (resetCount === 0) suggestions.push("Consider a reset card versus Inferno (Zap/Lightning/Electro).");
  if (averageElixir && averageElixir > 4.5) warnings.push("High average elixir; be mindful of cycle and defense.");
  if (cycleCards < 2) suggestions.push("Add one or two cheap cycle cards to improve rotation.");
  if (unknownElixirCount > 0) suggestions.push("Some cards are missing elixir data; analysis may be partial.");

  const score = scoreDeckByNames(names);

  return {
    averageElixir,
    unknownElixirCount,
    roleCounts,
    hasWinCondition,
    airDefense: airDefenseLevel,
    spellCount,
    buildingCount,
    splashCount,
    resetCount,
    cycleCards,
    warnings,
    suggestions,
    score,
  };
}

export function scoreDeckByNames(cardNames: string[]): number {
  const names = cardNames.filter(Boolean).slice(0, 8);
  const roles: Record<CardRole, number> = Object.fromEntries(
    ["win_condition","air_defense","building","spell","splash","cycle","reset","support"].map((r) => [r as CardRole, 0])
  ) as Record<CardRole, number>;
  let elixirKnown = 0;
  let elixirSum = 0;
  for (const n of names) {
    const e = CARD_ELIXIR_BY_NAME[n];
    if (typeof e === "number" && e > 0) {
      elixirSum += e; elixirKnown += 1;
    }
    for (const r of CARD_META_BY_NAME[n]?.roles ?? []) roles[r] += 1;
  }
  const avg = elixirKnown > 0 ? elixirSum / names.length : 3.5;

  let score = 50; // base
  // Win condition
  if (roles.win_condition >= 1) score += 12; else score -= 10;
  // Air defense
  score += Math.min(roles.air_defense * 5, 12);
  // Spells sweet spot 2-3
  if (roles.spell === 0) score -= 10; else if (roles.spell === 1) score += 5; else if (roles.spell === 2) score += 10; else if (roles.spell === 3) score += 7; else score -= 5;
  // Splash coverage
  score += Math.min(roles.splash * 4, 10);
  // Reset
  if (roles.reset > 0) score += 4; else score -= 2;
  // Cycle
  score += Math.min(roles.cycle * 3, 9);
  // Buildings not too many
  if (roles.building > 2) score -= 6; else if (roles.building === 1) score += 3;
  // Elixir curve target ~3.0-4.2
  const diff = Math.abs(avg - 3.6);
  score -= Math.min(diff * 6, 12);

  return Math.max(0, Math.min(100, Math.round(score)));
}

export function suggestRolesToImprove(cardNames: string[]): string[] {
  const names = new Set(cardNames);
  const roles: Record<CardRole, number> = Object.fromEntries(
    ["win_condition","air_defense","building","spell","splash","cycle","reset","support"].map((r) => [r as CardRole, 0])
  ) as Record<CardRole, number>;
  for (const n of names) for (const r of CARD_META_BY_NAME[n]?.roles ?? []) roles[r] += 1;

  const suggestions: string[] = [];
  if (roles.win_condition === 0) suggestions.push("Add a win condition (Hog, Miner, RG, Graveyard, Balloon, X-Bow).");
  if (roles.air_defense < 2) suggestions.push("Add more air defense (Musketeer, Tesla, Archers, Mega Minion, Bats).");
  if (roles.spell < 2) suggestions.push("Aim for 2–3 spells (Fireball/Poison + Log/Zap).");
  if (roles.splash === 0) suggestions.push("Add splash damage (Baby Dragon, Wizard, Bomb Tower).");
  if (roles.reset === 0) suggestions.push("Add a reset card (Zap/Lightning/Electro Wizard).");
  if (roles.cycle < 2) suggestions.push("Include cheap cycle (Skeletons, Ice Spirit, Ice Golem).");
  return suggestions;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
} 