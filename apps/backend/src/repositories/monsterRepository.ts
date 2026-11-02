
import { prisma } from "../db/prisma";

import type {
  Monster,
  CreateMonsterInput
} from "../types/Monster";

// Include abilities whenever we retrieve a monster.
const withAbilities = {
  abilities: {
    include: {
      ability: true
    }
  }
} as const;

// Represents a Prisma monster record with its relationships.
type DbMonster = {
  id: number;
  name: string;
  hitPoints: number;
  level: number;
  description: string | null;
  abilities: {
    ability: {
      id: number;
      name: string;
      description: string | null;
    };
  }[];
};

// Convert a database monster into our shared application type.
function toMonster(row: DbMonster): Monster {
  return {
    id: row.id,
    name: row.name,
    hitPoints: row.hitPoints,
    level: row.level,

    ...(row.description !== null
      ? { description: row.description }
      : {}),

    abilities: row.abilities.map((entry) => ({
      id: entry.ability.id,
      name: entry.ability.name,
      ...(entry.ability.description !== null
        ? { description: entry.ability.description }
        : {})
    }))
  };
}

export const monsterRepository = {
  async getAll(): Promise<Monster[]> {
    const monsters = await prisma.monster.findMany({
      orderBy: { id: "asc" },
      include: withAbilities
    });

    return monsters.map(toMonster);
  },

  async getById(id: number): Promise<Monster | null> {
    const monster = await prisma.monster.findUnique({
      where: { id },
      include: withAbilities
    });

    return monster ? toMonster(monster) : null;
  },

  // Prisma is doing three things:
  // 1. Creating a new record in Monster.
  // 2. Creating a MonsterAbility record for each selected ability.
  // 3. Connecting those records to existing Ability records using their IDs.
  // Prisma performs this nested write atomically. If one relationship cannot be created, the whole operation rolls back rather than leaving a partially created monster.
  // The include option ensures that the newly created monster is returned with its abilities.
  async add(input: CreateMonsterInput): Promise<Monster> {
    const monster = await prisma.monster.create({
      data: {
        name: input.name,
        level: input.level,
        hitPoints: input.hitPoints,
        description: input.description,

        abilities: {
          create: input.abilityIds.map((abilityId) => ({
            ability: {
              connect: { id: abilityId }
            }
          }))
        }
      },
      include: withAbilities
    });

    return toMonster(monster);
  },

  async remove(id: number): Promise<boolean> {
    const result = await prisma.$transaction(async (tx) => {
      // Remove relationships before deleting the monster.
      await tx.monsterAbility.deleteMany({
        where: { monsterId: id }
      });

      return tx.monster.deleteMany({
        where: { id }
      });
    });

    return result.count > 0;
  }
};
