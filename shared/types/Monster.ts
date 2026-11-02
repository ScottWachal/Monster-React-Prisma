export interface Ability {
  id: number;
  name: string;
  description?: string;
}

export interface Monster {
  id: number;
  name: string;
  level: number;
  hitPoints: number;
  description?: string;
  abilities: Ability[];
}

export type CreateMonsterInput =
  Omit<Monster, "id" | "abilities">;