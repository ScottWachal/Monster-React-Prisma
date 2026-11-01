import { prisma } from "../db/prisma";

import type {
  Monster,
  CreateMonsterInput
} from "../types/Monster";

// Convert a database record to our application's Monster type.
type DbMonster = {
  id: number;
  name: string;
  hitPoints: number;
  level: number;
  description: string | null;
};

// this function converts a database record to our application's Monster type
// it handles the case where the description is null in the database
// and converts it to undefined in our application's Monster type 
// this is important because our application's Monster type has an optional description field, while the database record has a nullable description field
function toMonster(row: DbMonster): Monster {
  return {
    id: row.id,
    name: row.name,
    hitPoints: row.hitPoints,
    level: row.level,
    ...(row.description === null
      ? {}
      : { description: row.description })
  };
}

export const monsterRepository = {
  async getAll(): Promise<Monster[]> {
    const monsters = await prisma.monster.findMany({
      orderBy: { id: "asc" }
    });

    return monsters.map(toMonster);
  },

  async getById(id: number): Promise<Monster | null> {
    const monster = await prisma.monster.findUnique({
      where: { id }
    });

    return monster ? toMonster(monster) : null;
  },

  async add(input: CreateMonsterInput): Promise<Monster> {
    const monster = await prisma.monster.create({
      data: input
    });

    return toMonster(monster);
  },

  async remove(id: number): Promise<boolean> {
    const result = await prisma.monster.deleteMany({
      where: { id }
    });

    return result.count > 0;
  }
};