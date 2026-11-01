import { sampleMonsters } from "../data/sampleMonsters";
import type {
  CreateMonsterInput,
  Monster,
} from "../types/Monster";

let monsters: Monster[] = sampleMonsters.map((monster) => ({
  ...monster,
}));

let nextId =
  Math.max(...monsters.map((monster) => monster.id), 0) + 1;

export const monsterRepository = {
  async getAll(): Promise<Monster[]> {
    return monsters.map((monster) => ({
      ...monster,
    }));
  },

  async getById(id: number): Promise<Monster | null> {
    const monster = monsters.find(
      (monster) => monster.id === id,
    );

    return monster ? { ...monster } : null;
  },

  async add(input: CreateMonsterInput): Promise<Monster> {
    const monster: Monster = {
      id: nextId++,
      ...input,
    };

    monsters = [...monsters, monster];

    return { ...monster };
  },

  async remove(id: number): Promise<boolean> {
    const originalLength = monsters.length;

    monsters = monsters.filter(
      (monster) => monster.id !== id,
    );

    return monsters.length < originalLength;
  },
};