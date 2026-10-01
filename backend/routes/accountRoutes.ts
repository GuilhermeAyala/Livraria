import express from "express";
import { requireSession, type AuthenticatedRequest } from "../middleware/session";
import { prisma } from "../prismaClient";

const router = express.Router();
router.use(requireSession);

router.get("/cart", async (req: AuthenticatedRequest, res) => {
  const items = await prisma.cartItem.findMany({
    where: { userId: req.userId },
    include: { book: true },
    orderBy: { id: "asc" },
  });
  return res.json(items.map((item) => ({ ...item.book, quantidade: item.quantity })));
});

router.post("/cart", async (req: AuthenticatedRequest, res) => {
  const bookId = Number(req.body?.bookId);
  const quantity = Number(req.body?.quantity ?? 1);
  if (!Number.isInteger(bookId) || bookId <= 0 || !Number.isInteger(quantity) || quantity <= 0) {
    return res.status(400).json({ message: "Livro e quantidade invalidos." });
  }

  const book = await prisma.book.findUnique({ where: { id: bookId } });
  if (!book) return res.status(404).json({ message: "Livro nao encontrado." });

  const item = await prisma.cartItem.upsert({
    where: { userId_bookId: { userId: req.userId!, bookId } },
    update: { quantity: { increment: quantity } },
    create: { userId: req.userId!, bookId, quantity },
    include: { book: true },
  });
  return res.status(201).json({ ...item.book, quantidade: item.quantity });
});

router.patch("/cart/:bookId", async (req: AuthenticatedRequest, res) => {
  const bookId = Number(req.params.bookId);
  const quantity = Number(req.body?.quantity);
  if (!Number.isInteger(bookId) || !Number.isInteger(quantity) || quantity < 0) {
    return res.status(400).json({ message: "Livro e quantidade invalidos." });
  }
  if (quantity === 0) {
    await prisma.cartItem.deleteMany({ where: { userId: req.userId, bookId } });
    return res.status(204).send();
  }
  const item = await prisma.cartItem.update({
    where: { userId_bookId: { userId: req.userId!, bookId } },
    data: { quantity },
    include: { book: true },
  });
  return res.json({ ...item.book, quantidade: item.quantity });
});

router.delete("/cart/:bookId", async (req: AuthenticatedRequest, res) => {
  await prisma.cartItem.deleteMany({ where: { userId: req.userId, bookId: Number(req.params.bookId) } });
  return res.status(204).send();
});

router.get("/favorites", async (req: AuthenticatedRequest, res) => {
  const favorites = await prisma.favorite.findMany({ where: { userId: req.userId }, include: { book: true }, orderBy: { id: "asc" } });
  return res.json(favorites.map((favorite) => favorite.book));
});

router.post("/favorites", async (req: AuthenticatedRequest, res) => {
  const bookId = Number(req.body?.bookId);
  if (!Number.isInteger(bookId) || bookId <= 0) return res.status(400).json({ message: "Livro invalido." });
  const book = await prisma.book.findUnique({ where: { id: bookId } });
  if (!book) return res.status(404).json({ message: "Livro nao encontrado." });
  await prisma.favorite.upsert({ where: { userId_bookId: { userId: req.userId!, bookId } }, update: {}, create: { userId: req.userId!, bookId } });
  return res.status(201).json(book);
});

router.delete("/favorites/:bookId", async (req: AuthenticatedRequest, res) => {
  await prisma.favorite.deleteMany({ where: { userId: req.userId, bookId: Number(req.params.bookId) } });
  return res.status(204).send();
});

export default router;
