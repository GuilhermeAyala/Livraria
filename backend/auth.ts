import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const SESSION_COOKIE = "livraria_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7;

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, 64).toString("hex");
  return `scrypt:${salt}:${derivedKey}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [algorithm, salt, key] = storedHash.split(":");
  if (algorithm !== "scrypt" || !salt || !key) return false;

  const expected = Buffer.from(key, "hex");
  const actual = scryptSync(password, salt, expected.length);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export function createSessionToken() {
  return randomBytes(32).toString("hex");
}

export function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function getSessionCookie(token: string, maxAgeSeconds = 60 * 60 * 24 * 7) {
  return `${SESSION_COOKIE}=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${maxAgeSeconds}`;
}

export function getSessionToken(req: { headers: { cookie?: string } }) {
  const cookies = req.headers.cookie?.split(";").map((item) => item.trim()) ?? [];
  const sessionCookie = cookies.find((item) => item.startsWith(`${SESSION_COOKIE}=`));
  return sessionCookie?.slice(`${SESSION_COOKIE}=`.length) || null;
}

export { SESSION_DURATION_MS };
