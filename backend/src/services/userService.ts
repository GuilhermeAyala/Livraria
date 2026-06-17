import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { prisma } from "../config/prisma";

const authSecret = process.env.AUTH_SECRET || "livraria-dev-secret";

type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = createHmac("sha256", salt).update(password).digest("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, passwordHash: string) {
  const [salt, hash] = passwordHash.split(":");
  if (!salt || !hash) return false;

  const incoming = createHmac("sha256", salt).update(password).digest("hex");
  const storedBuffer = Buffer.from(hash);
  const incomingBuffer = Buffer.from(incoming);

  return storedBuffer.length === incomingBuffer.length && timingSafeEqual(storedBuffer, incomingBuffer);
}

function createStudyToken(userId: number) {
  const payload = Buffer.from(JSON.stringify({ userId })).toString("base64url");
  const signature = createHmac("sha256", authSecret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export async function ensureUser(userId: number) {
  return prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: {
      id: userId,
      name: "Usuario Demo",
      email: `usuario${userId}@livraria.local`,
      passwordHash: hashPassword("123456"),
    },
  });
}

export async function registerUser(input: RegisterInput) {
  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash: hashPassword(input.password),
    },
    select: { id: true, name: true, email: true, role: true, address: true },
  });

  return { user, token: createStudyToken(user.id) };
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !verifyPassword(password, user.passwordHash)) {
    throw new Error("Email ou senha invalidos.");
  }

  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role, address: user.address },
    token: createStudyToken(user.id),
  };
}

export async function getProfile(userId: number) {
  await ensureUser(userId);

  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      address: true,
      paymentCards: {
        select: {
          id: true,
          type: true,
          holderName: true,
          brand: true,
          lastFourDigits: true,
          expiresAt: true,
        },
      },
    },
  });
}

export async function updateProfile(userId: number, data: { name?: string; address?: string }) {
  await ensureUser(userId);

  return prisma.user.update({
    where: { id: userId },
    data,
    select: { id: true, name: true, email: true, role: true, address: true },
  });
}

export async function addPaymentCard(
  userId: number,
  data: { type: string; holderName: string; brand: string; cardNumber: string; expiresAt: string },
) {
  await ensureUser(userId);

  const lastFourDigits = data.cardNumber.slice(-4);

  return prisma.paymentCard.create({
    data: {
      userId,
      type: data.type,
      holderName: data.holderName,
      brand: data.brand,
      lastFourDigits,
      expiresAt: new Date(data.expiresAt),
    },
  });
}
