import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding word list...");
  console.log("Looking for words.txt at:", join(__dirname, "words.txt"));

  const words = readFileSync(join(__dirname, "words.txt"), "utf-8")
    .split("\n")
    .map((w) => w.trim())
    .filter((w) => w.length === 5);

  console.log(`Found ${words.length} words`);

  await prisma.word.createMany({
    data: words.map((word: string, index: number) => ({
      word: word.toUpperCase(),
      index,
    })),
    skipDuplicates: true,
  });

  console.log(`Seeded ${words.length} words.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
