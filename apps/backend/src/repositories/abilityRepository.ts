
import { prisma } from "../db/prisma";
import type { Ability, AbilityInput } from "../types/Monster";

type DbAbility = {
  id: number;
  name: string;
  description: string | null;
};

function toAbility(row: DbAbility): Ability {
  return {
    id: row.id,
    name: row.name,
    ...(row.description === null
      ? {}
      : { description: row.description })
  };
}

export const abilityRepository = {
  async getAll(): Promise<Ability[]> {
    const abilities = await prisma.ability.findMany({
      orderBy: { name: "asc" }
    });

    return abilities.map(toAbility);
  },

  // Used when creating monsters to validate that all provided ability IDs exist in the database.
  async countByIds(ids: number[]): Promise<number> {
    return prisma.ability.count({
      where: { id: { in: ids } }
    });
  },

  // How many monsters currently use this ability, so we can prevent deletion if it's in use.
  // Querying the join table directly is more efficient than loading all monsters and counting them in memory.
  async countUsage(id: number): Promise<number> {
    return prisma.monsterAbility.count({
      where: { abilityId: id }
    });
  },

  // Get a single ability by its ID. Returns null if the ability does not exist.
  async getById(id: number): Promise<Ability | null> {
    const ability = await prisma.ability.findUnique({
      where: { id }
    });

    return ability ? toAbility(ability) : null;
  },
  
  // Get a single ability by its name. Returns null if the ability does not exist.
  async getByName(name: string): Promise<Ability | null> {
    const ability = await prisma.ability.findUnique({
      where: { name }
    });

    return ability ? toAbility(ability) : null;
  },

  // Add a new ability to the database. Returns the created ability.
  async add(input: AbilityInput): Promise<Ability> {
    const ability = await prisma.ability.create({
      data: {
        name: input.name,
        description: input.description || null
      }
    });

    return toAbility(ability);
  },

  // Update an existing ability. Returns the updated ability, or throws an error if the ability does not exist.
  // Note: We don't allow updating the ID of an ability, since it's a primary key and should be immutable.
  async update(
    id: number,
    input: AbilityInput
  ): Promise<Ability> {
    const ability = await prisma.ability.update({
      where: { id },
      data: {
        name: input.name,
        description: input.description || null
      }
    });

    return toAbility(ability);
  },

  // Remove an existing ability. Returns true if the ability was found and deleted, false otherwise.
  async remove(id: number): Promise<boolean> {
    const result = await prisma.ability.deleteMany({
      where: { id }
    });

    return result.count > 0;
  }
};
