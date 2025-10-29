import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const categories = [
    "Technology",
    "Science",
    "Health",
    "Business",
    "Education",
    "Travel",
    "Lifestyle",
    "Sports",
    "Food",
    "Entertainment",
    "Politics",
    "Art",
    "History",
    "Environment",
    "Culture",
  ];

  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log("✅ Categories seeded!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
