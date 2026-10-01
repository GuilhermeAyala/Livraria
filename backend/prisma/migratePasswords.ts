import { prisma } from "../prismaClient";
import { hashPassword } from "../auth";

async function main() {
  const usuarios = await prisma.user.findMany({
    select: { id: true, passwordHash: true },
  });

  let migradas = 0;

  for (const usuario of usuarios) {
    if (usuario.passwordHash.startsWith("scrypt:")) continue;

    await prisma.user.update({
      where: { id: usuario.id },
      data: { passwordHash: hashPassword(usuario.passwordHash) },
    });
    migradas += 1;
  }

  console.log(`${migradas} senha(s) migrada(s) para hash scrypt.`);
}

main().finally(async () => {
  await prisma.$disconnect();
});
