import { prisma } from "../src/db/prisma";
import { sampleMonsters } from "../src/data/sampleMonsters";

async function seed() {
  // DEVELOPMENT ONLY: clear existing monsters
  await prisma.monster.deleteMany();

  // Insert original sample data, allowing DB to generate IDs
  await prisma.monster.createMany({
    data: sampleMonsters.map(({ id, ...monster }) => monster)
  });

  console.log("Monsters seeded!");
}

seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });