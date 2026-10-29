export interface Monster {
  id: number;
  name: string;
  hitPoints: number;
  level: number;
  description?: string;
}

export interface CreateMonsterInput {
  name: string;
  hitPoints: number;
  level: number;
  description?: string;
}