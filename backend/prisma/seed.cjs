const { PrismaClient } = require('@prisma/client');
const tours = require('./catalog/tours.json');

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction(
    tours.map((tour) =>
      prisma.tour.upsert({
        where: { slug: tour.slug },
        update: tour,
        create: tour,
      }),
    ),
  );

  console.log(`Catálogo actualizado: ${tours.length} tours.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
