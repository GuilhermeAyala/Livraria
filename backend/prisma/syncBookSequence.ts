import { prisma } from "../prismaClient";

async function main() {
  const sequenceRows = await prisma.$queryRawUnsafe<Array<{ sequence_name: string | null }>>(`
    SELECT pg_get_serial_sequence('public."Book"', 'id') AS sequence_name;
  `);

  const sequenceName = sequenceRows[0]?.sequence_name;
  if (!sequenceName) {
    throw new Error('A sequencia da coluna public."Book".id nao foi encontrada.');
  }

  await prisma.$executeRawUnsafe(
    `SELECT setval($1::regclass, COALESCE((SELECT MAX(id) FROM public."Book"), 0) + 1, false);`,
    sequenceName,
  );

  console.log(`Sequencia ${sequenceName} sincronizada com sucesso.`);
}

main()
  .catch((error) => {
    console.error("Nao foi possivel sincronizar a sequencia da tabela Book.", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
