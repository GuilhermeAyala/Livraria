import { prisma } from "../prismaClient";

export type BookCreateData = {
  name: string;
  autor: string;
  year: number;
  price: number;
  quantity: number;
  isAvailable: boolean;
};

export type BookUpdateData = Partial<BookCreateData>;

const ratingsInclude = {
  ratings: {
    select: {
      userId: true,
      rating: true,
    },
  },
} as const;

function withRatingSummary(book: any, userId?: number) {
  const ratings = book.ratings ?? [];
  const total = ratings.reduce((sum: number, item: { rating: number }) => sum + item.rating, 0);

  return {
    ...book,
    ratings: undefined,
    averageRating: ratings.length > 0 ? Number((total / ratings.length).toFixed(2)) : null,
    ratingCount: ratings.length,
    myRating: userId === undefined
      ? null
      : ratings.find((item: { userId: number }) => item.userId === userId)?.rating ?? null,
  };
}

export class BooksRepository {
  async findAll(userId?: number) {
    const books = await prisma.book.findMany({
      orderBy: { id: "asc" },
      include: ratingsInclude,
    });

    return books.map((book) => withRatingSummary(book, userId));
  }

  async findById(id: number, userId?: number) {
    const book = await prisma.book.findUnique({
      where: { id },
      include: ratingsInclude,
    });

    return book ? withRatingSummary(book, userId) : null;
  }

  findUserById(id: number) {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });
  }

  async create(data: BookCreateData) {
    const book = await prisma.book.create({ data });
    return this.findById(book.id);
  }

  async update(id: number, data: BookUpdateData) {
    await prisma.book.update({
      where: { id },
      data,
    });

    return this.findById(id);
  }

  async upsertRating(bookId: number, userId: number, rating: number) {
    await prisma.bookRating.upsert({
      where: {
        userId_bookId: { userId, bookId },
      },
      update: { rating },
      create: { userId, bookId, rating },
    });

    return this.findById(bookId, userId);
  }

  async delete(id: number) {
    await prisma.book.delete({
      where: { id },
    });
  }
}
