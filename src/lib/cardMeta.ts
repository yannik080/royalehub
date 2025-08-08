export type CardRole =
  | "win_condition"
  | "air_defense"
  | "building"
  | "spell"
  | "splash"
  | "cycle"
  | "reset"
  | "support";

export interface CardMeta {
  elixir?: number;
  roles: CardRole[];
}

// Minimal starter dataset. Extend over time.
export const CARD_META_BY_NAME: Record<string, CardMeta> = {
  "Hog Rider": { elixir: 4, roles: ["win_condition"] },
  "Giant": { elixir: 5, roles: ["win_condition", "support"] },
  "Golem": { elixir: 8, roles: ["win_condition", "support"] },
  "Royal Giant": { elixir: 6, roles: ["win_condition"] },
  "Graveyard": { elixir: 5, roles: ["win_condition", "spell"] },
  "X-Bow": { elixir: 6, roles: ["win_condition", "building"] },
  "Mortar": { elixir: 4, roles: ["win_condition", "building"] },
  "Miner": { elixir: 3, roles: ["win_condition"] },
  "Balloon": { elixir: 5, roles: ["win_condition", "air_defense"] },
  "Goblin Barrel": { elixir: 3, roles: ["win_condition", "spell"] },
  "Royal Hogs": { elixir: 5, roles: ["win_condition"] },
  "Ram Rider": { elixir: 5, roles: ["win_condition", "support"] },
  "Electro Giant": { elixir: 8, roles: ["win_condition", "support", "reset"] },
  "Mega Knight": { elixir: 7, roles: ["support", "splash"] },
  "P.E.K.K.A": { elixir: 7, roles: ["support"] },
  "Knight": { elixir: 3, roles: ["cycle", "support"] },
  "Ice Spirit": { elixir: 1, roles: ["cycle", "support"] },
  "Ice Golem": { elixir: 2, roles: ["cycle", "support"] },
  "Skeletons": { elixir: 1, roles: ["cycle"] },
  "Fireball": { elixir: 4, roles: ["spell", "splash"] },
  "Log": { elixir: 2, roles: ["spell", "splash"] },
  "The Log": { elixir: 2, roles: ["spell", "splash"] },
  "Arrows": { elixir: 3, roles: ["spell", "splash"] },
  "Zap": { elixir: 2, roles: ["spell", "reset"] },
  "Lightning": { elixir: 6, roles: ["spell", "reset"] },
  "Rocket": { elixir: 6, roles: ["spell"] },
  "Tornado": { elixir: 3, roles: ["spell", "splash"] },
  "Poison": { elixir: 4, roles: ["spell", "splash"] },
  "Barbarian Barrel": { elixir: 2, roles: ["spell", "splash"] },
  "Goblin Cage": { elixir: 4, roles: ["building", "air_defense"] },
  "Tesla": { elixir: 4, roles: ["building", "air_defense"] },
  "Inferno Tower": { elixir: 5, roles: ["building", "air_defense", "reset"] },
  "Bomb Tower": { elixir: 5, roles: ["building", "splash"] },
  "Cannon": { elixir: 3, roles: ["building"] },
  "Archers": { elixir: 3, roles: ["air_defense", "cycle"] },
  "Musketeer": { elixir: 4, roles: ["air_defense", "support"] },
  "Mega Minion": { elixir: 3, roles: ["air_defense", "support"] },
  "Minions": { elixir: 3, roles: ["air_defense"] },
  "Minion Horde": { elixir: 5, roles: ["air_defense"] },
  "Bats": { elixir: 2, roles: ["air_defense", "cycle"] },
  "Hunter": { elixir: 4, roles: ["air_defense", "splash"] },
  "Electro Wizard": { elixir: 4, roles: ["reset", "air_defense", "support"] },
  "Ewiz": { elixir: 4, roles: ["reset", "air_defense", "support"] },
  "Phoenix": { elixir: 4, roles: ["air_defense", "support"] },
  "Baby Dragon": { elixir: 4, roles: ["air_defense", "splash"] },
  "Wizard": { elixir: 5, roles: ["air_defense", "splash"] },
};

export const CARD_ELIXIR_BY_NAME: Record<string, number> = Object.fromEntries(
  Object.entries(CARD_META_BY_NAME).map(([name, meta]) => [name, meta.elixir ?? 0])
); 