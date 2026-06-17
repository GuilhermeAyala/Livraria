import { prisma } from "../config/prisma";
import { toFrontendBook } from "./bookService";
import { ensureUser } from "./userService";

export async function getFavorites(userId: number) {
  await ensureUser(userId);

  const favorites = await prisma.favorite.findMany({
    where: { userId },
    include: { book: true },
    orderBy: { id: "asc" },
  });

  return favorites.map((favorite: any) => toFrontendBook(favorite.book));
}

export async function addFavorite(userId: number, bookId: number) {
  await ensureUser(userId);

  const favorite = await prisma.favorite.upsert({
    where: { userId_bookId: { userId, bookId } },
    create: { userId, bookId },
    update: {},
    include: { book: true },
  });

  return toFrontendBook(favorite.book);
}

export async function removeFavorite(userId: number, bookId: number) {
  await ensureUser(userId);

  await prisma.favorite.delete({
    where: { userId_bookId: { userId, bookId } },
  });
}
