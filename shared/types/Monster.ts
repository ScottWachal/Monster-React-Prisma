export type Monster = {
  id: number;
  name: string;
  hitPoints: number;
  level: number;
  description?: string;
};

export type CreateMonsterInput = Omit<Monster, "id">;