import "dotenv/config";

import { readFileSync } from "node:fs";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Types for our original JSON data.
type SeedMonster = {
  id: number;
  name: string;
  hitPoints: number;
  level: number;
  description?: string | null;
};

type SeedAbility = {
  id: number;
  name: string;
  description?: string | null;
};

// Each pair is [originalMonsterId, originalAbilityId].
type SeedRelationship = [number, number];

// Load JSON files relative to this seed script.
function readJson<T>(filename: string): T {
  const path = new URL(`./data/${filename}`, import.meta.url);
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

const monsters = readJson<SeedMonster[]>("monsters.json");
const abilities = readJson<SeedAbility[]>("abilities.json");
const relationships =
  readJson<SeedRelationship[]>("monsterAbilities.json");

// Use the same Prisma connection setup as our backend.
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!
});

const prisma = new PrismaClient({ adapter });

async function main() {
  // Perform the whole seed inside one transaction.
  // If anything fails, the database changes roll back.
  await prisma.$transaction(async (tx) => {

    // 1. Clear existing development seed data.
    // Delete junction records first to respect foreign keys.
    await tx.monsterAbility.deleteMany();
    await tx.monster.deleteMany();
    await tx.ability.deleteMany();

    // 2. Keep track of original IDs and new database IDs.
    const monsterIdMap = new Map<number, number>();
    const abilityIdMap = new Map<number, number>();

    // 3. Import monsters.
    for (const monster of monsters) {
      if (monsterIdMap.has(monster.id)) {
        throw new Error(`Duplicate source monster ID: ${monster.id}`);
      }

      const created = await tx.monster.create({
        data: {
          name: monster.name,
          hitPoints: monster.hitPoints,
          level: monster.level,
          description: monster.description ?? null
        }
      });

      monsterIdMap.set(monster.id, created.id);
    }

    // 4. Import abilities.
    for (const ability of abilities) {
      if (abilityIdMap.has(ability.id)) {
        throw new Error(`Duplicate source ability ID: ${ability.id}`);
      }

      const created = await tx.ability.create({
        data: {
          name: ability.name,
          description: ability.description ?? null
        }
      });

      abilityIdMap.set(ability.id, created.id);
    }

    // 5. Convert the old relationship IDs to database IDs.
    const monsterAbilities = relationships.map(
      ([sourceMonsterId, sourceAbilityId]) => {
        const monsterId = monsterIdMap.get(sourceMonsterId);
        const abilityId = abilityIdMap.get(sourceAbilityId);

        if (monsterId === undefined || abilityId === undefined) {
          throw new Error(
            `Invalid relationship: ${sourceMonsterId}, ${sourceAbilityId}`
          );
        }

        return { monsterId, abilityId };
      }
    );

    // 6. Create the junction-table records.
    await tx.monsterAbility.createMany({
      data: monsterAbilities
    });
  });

  console.log(
    `Seeded ${monsters.length} monsters, ` +
    `${abilities.length} abilities, and ` +
    `${relationships.length} relationships.`
  );
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
