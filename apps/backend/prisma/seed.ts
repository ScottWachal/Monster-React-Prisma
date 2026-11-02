
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const monsters = [
  { id: 1, name: "Goblin Scout", hitPoints: 8, level: 1, description: "A quick goblin sent ahead to locate potential targets." },
  { id: 2, name: "Ogre Brute", hitPoints: 24, level: 3, description: "Large, strong, and not particularly interested in strategy." },
  { id: 3, name: "Frost Drake", hitPoints: 65, level: 8, description: "A young drake that attacks with freezing breath." },
  { id: 4, name: "Cave Spider", hitPoints: 15, level: 2, description: "A pale underground spider that hunts in dark tunnels." },
  { id: 5, name: "Bone Knight", hitPoints: 38, level: 5, description: "An armored skeleton animated by ancient magic." },
  { id: 6, name: "Bog Witch", hitPoints: 32, level: 4, description: "A swamp-dwelling spellcaster who uses curses and poison." },
  { id: 7, name: "Stone Golem", hitPoints: 72, level: 9, description: "A slow but heavily armored guardian carved from stone." },
  { id: 8, name: "Fire Imp", hitPoints: 20, level: 3, description: "A small flying demon that hurls sparks and burning embers." },
  { id: 9, name: "Shadow Hound", hitPoints: 36, level: 6, description: "A dark canine creature that seems to disappear in dim light." },
  { id: 10, name: "Hill Troll", hitPoints: 55, level: 7, description: "A powerful troll known for its strength and rapid healing." },
  { id: 11, name: "Crypt Wraith", hitPoints: 50, level: 8, description: "A restless spirit that drains warmth from the living." },
  { id: 12, name: "Iron Minotaur", hitPoints: 80, level: 10, description: "A massive horned warrior protected by heavy iron armor." },
  { id: 13, name: "Storm Hydra", hitPoints: 110, level: 14, description: "A many-headed beast that crackles with electrical energy." },
  { id: 14, name: "Void Serpent", hitPoints: 135, level: 17, description: "A strange serpent that slips between shadows and empty space." },
  { id: 15, name: "Ancient Dragon", hitPoints: 180, level: 20, description: "An enormous dragon whose age and power are nearly legendary." },
];

const abilities = [
  { id: 1, name: "Quick Strike", description: "A fast attack that catches opponents off guard." },
  { id: 2, name: "Crushing Blow", description: "A powerful physical attack capable of breaking defenses." },
  { id: 3, name: "Frost Breath", description: "Exhales freezing air that damages and slows enemies." },
  { id: 4, name: "Flight", description: "Allows the creature to travel through the air." },
  { id: 5, name: "Venomous Bite", description: "A bite that inflicts poison on its target." },
  { id: 6, name: "Web Trap", description: "Creates sticky webs that restrain enemies." },
  { id: 7, name: "Shield Bash", description: "Strikes an opponent with a shield." },
  { id: 8, name: "Life Drain", description: "Steals vitality from another creature." },
  { id: 9, name: "Stone Skin", description: "Hardens the creature's body against physical attacks." },
  { id: 10, name: "Fireball", description: "Launches a ball of flame at an enemy." },
  { id: 11, name: "Shadow Step", description: "Allows rapid movement between nearby shadows." },
  { id: 12, name: "Regeneration", description: "Gradually restores lost hit points." },
  { id: 13, name: "Lightning Strike", description: "Releases a powerful electrical attack." },
];

// [monsterId, abilityId]
// Monster 1 intentionally has no abilities.
const monsterAbilities: [number, number][] = [
  [2, 2],
  [3, 3], [3, 4],
  [4, 5], [4, 6],
  [5, 7],
  [6, 5], [6, 8],
  [7, 9],
  [8, 10], [8, 4],
  [9, 11],
  [10, 12], [10, 2],
  [11, 8], [11, 11],
  [12, 2], [12, 7],
  [13, 13], [13, 12],
  [14, 11],
  [15, 10], [15, 4],
];

async function main() {
  console.log("Resetting development database...");

  // Delete relationships before the records they reference.
  await prisma.monsterAbility.deleteMany();
  await prisma.monster.deleteMany();
  await prisma.ability.deleteMany();

  // Create monsters and abilities.
  await prisma.monster.createMany({ data: monsters });
  await prisma.ability.createMany({ data: abilities });

  // Create the many-to-many relationships.
  await prisma.monsterAbility.createMany({
    data: monsterAbilities.map(([monsterId, abilityId]) => ({
      monsterId,
      abilityId,
    })),
  });

  console.log(`Seeded ${monsters.length} monsters.`);
  console.log(`Seeded ${abilities.length} abilities.`);
  console.log(`Seeded ${monsterAbilities.length} monster-ability relationships.`);
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
