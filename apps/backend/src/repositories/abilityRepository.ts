import { prisma } from "../db/prisma";

export const abilityRepository = {
  // Fetch all abilities from the database, ordered by name.
  async getAll() {
    const abilities = await prisma.ability.findMany({
      orderBy: { name: "asc" }
    });

    return abilities.map((ability) => ({
      id: ability.id,
      name: ability.name,
      description: ability.description ?? undefined
    }));
  },

  // Count the number of abilities that match the provided IDs.
  // This is useful for validating that all provided ability IDs exist in the database.
  async countByIds(ids: number[]): Promise<number> {
    return prisma.ability.count({
      where: {
        id: { in: ids }
      }
    });
  }
};

