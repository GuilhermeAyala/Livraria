import assert from "node:assert/strict";
import type { AddressInfo } from "node:net";
import { app } from "../index";
import { hashPassword } from "../auth";
import { prisma } from "../prismaClient";
import { OrderStatus, Role } from "../generated/prisma/client";

type ApiResponse<T = any> = {
  status: number;
  data: T;
  cookie: string;
};

async function api<T>(
  baseUrl: string,
  path: string,
  options: RequestInit = {},
  cookie = "",
): Promise<ApiResponse<T>> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (cookie) headers.set("Cookie", cookie);

  const response = await fetch(`${baseUrl}${path}`, { ...options, headers });
  const data = await response.json().catch(() => null);
  const responseCookie = response.headers.get("set-cookie")?.split(";")[0] ?? cookie;
  return { status: response.status, data, cookie: responseCookie };
}

function expectStatus(response: ApiResponse, expected: number) {
  assert.equal(
    response.status,
    expected,
    `Status esperado ${expected}, recebido ${response.status}: ${JSON.stringify(response.data)}`,
  );
}

async function main() {
  const testId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const userEmail = `order-user-${testId}@livraria.local`;
  const adminEmail = `order-admin-${testId}@livraria.local`;
  const bookName = `Livro teste order ${testId}`;
  const password = "Teste@12345";
  const server = app.listen(0);
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const port = (server.address() as AddressInfo).port;
  const baseUrl = `http://127.0.0.1:${port}`;

  let userId: number | null = null;
  let adminId: number | null = null;
  let bookId: number | null = null;
  const testBookIds: number[] = [];

  try {
    const user = await prisma.user.create({
      data: { name: "Usuario teste order", email: userEmail, passwordHash: hashPassword(password), role: Role.USER },
    });
    const admin = await prisma.user.create({
      data: { name: "Admin teste order", email: adminEmail, passwordHash: hashPassword(password), role: Role.ADMIN },
    });
    const book = await prisma.book.create({
      data: { name: bookName, autor: "Teste", year: 2026, price: 40, quantity: 10, isAvailable: true },
    });
    const unavailableBook = await prisma.book.create({
      data: { name: `Livro indisponivel ${testId}`, autor: "Teste", year: 2026, price: 30, quantity: 2, isAvailable: false },
    });
    const outOfStockBook = await prisma.book.create({
      data: { name: `Livro sem estoque ${testId}`, autor: "Teste", year: 2026, price: 30, quantity: 0, isAvailable: true },
    });
    userId = user.id;
    adminId = admin.id;
    bookId = book.id;
    testBookIds.push(book.id, unavailableBook.id, outOfStockBook.id);

    const userLogin = await api(baseUrl, "/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: userEmail, password }),
    });
    expectStatus(userLogin, 200);
    const userCookie = userLogin.cookie;
    assert.ok(userCookie.startsWith("livraria_session="));

    const userCatalog = await api<any[]>(baseUrl, "/books", {}, userCookie);
    expectStatus(userCatalog, 200);
    assert.ok(userCatalog.data.some((item) => item.id === bookId));
    assert.ok(!userCatalog.data.some((item) => item.id === unavailableBook.id));
    assert.ok(!userCatalog.data.some((item) => item.id === outOfStockBook.id));

    const forbiddenBookUpdate = await api(baseUrl, `/books/${bookId}`, {
      method: "PUT",
      body: JSON.stringify({
        name: bookName,
        autor: "Teste",
        year: 2026,
        price: 40,
        quantity: 10,
        isAvailable: true,
      }),
    }, userCookie);
    expectStatus(forbiddenBookUpdate, 403);

    const adminLogin = await api(baseUrl, "/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: adminEmail, password }),
    });
    expectStatus(adminLogin, 200);
    const adminCookie = adminLogin.cookie;

    const adminCatalog = await api<any[]>(baseUrl, "/books", {}, adminCookie);
    expectStatus(adminCatalog, 200);
    assert.ok(adminCatalog.data.some((item) => item.id === unavailableBook.id));
    assert.ok(adminCatalog.data.some((item) => item.id === outOfStockBook.id));

    const adminBookUpdate = await api<any>(baseUrl, `/books/${bookId}`, {
      method: "PUT",
      body: JSON.stringify({
        name: bookName,
        autor: "Teste",
        year: 2025,
        price: 40,
        quantity: 10,
        isAvailable: true,
      }),
    }, adminCookie);
    expectStatus(adminBookUpdate, 200);
    assert.equal(adminBookUpdate.data.year, 2025);

    const addCart = await api(baseUrl, "/me/cart", {
      method: "POST",
      body: JSON.stringify({ bookId, quantity: 2 }),
    }, userCookie);
    expectStatus(addCart, 201);

    const createOrder = await api<any>(baseUrl, "/orders", {
      method: "POST",
      body: JSON.stringify({ paymentMethod: "BOLETO" }),
    }, userCookie);
    expectStatus(createOrder, 201);
    const firstOrderId = createOrder.data.id as number;
    assert.equal(createOrder.data.status, OrderStatus.AGUARDANDO_PAGAMENTO);
    assert.equal(createOrder.data.subtotal, 80);
    assert.equal(createOrder.data.discount, 12);
    assert.equal(createOrder.data.total, 68);
    assert.equal(createOrder.data.paymentReference.length, 48);
    assert.equal(createOrder.data.items.length, 1);

    const persistedOrder = await prisma.order.findUnique({ where: { id: firstOrderId }, include: { items: true } });
    assert.ok(persistedOrder);
    assert.equal(persistedOrder.items[0].quantity, 2);
    assert.equal((await prisma.book.findUniqueOrThrow({ where: { id: bookId } })).quantity, 8);
    assert.equal(await prisma.cartItem.count({ where: { userId } }), 0);

    const userOrders = await api<any[]>(baseUrl, "/orders", {}, userCookie);
    expectStatus(userOrders, 200);
    assert.ok(userOrders.data.some((order) => order.id === firstOrderId));

    const forbiddenStatusChange = await api(baseUrl, `/orders/${firstOrderId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ statusIndex: 2 }),
    }, userCookie);
    expectStatus(forbiddenStatusChange, 403);

    const adminOrders = await api<any[]>(baseUrl, "/orders", {}, adminCookie);
    expectStatus(adminOrders, 200);
    assert.ok(adminOrders.data.some((order) => order.id === firstOrderId && order.user.email === userEmail));

    for (const statusIndex of [1, 2, 3, 4, 5, 6]) {
      const statusUpdate = await api<any>(baseUrl, `/orders/${firstOrderId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ statusIndex }),
      }, adminCookie);
      expectStatus(statusUpdate, 200);
      assert.equal(statusUpdate.data.statusIndex, statusIndex);
    }

    const refreshedUserOrders = await api<any[]>(baseUrl, "/orders", {}, userCookie);
    expectStatus(refreshedUserOrders, 200);
    assert.equal(
      refreshedUserOrders.data.find((order) => order.id === firstOrderId)?.status,
      OrderStatus.ENTREGUE,
    );

    const deliveredCancellation = await api(baseUrl, `/orders/${firstOrderId}/cancel`, { method: "POST" }, userCookie);
    expectStatus(deliveredCancellation, 400);

    const secondCart = await api(baseUrl, "/me/cart", {
      method: "POST",
      body: JSON.stringify({ bookId, quantity: 1 }),
    }, userCookie);
    expectStatus(secondCart, 201);

    const secondOrder = await api<any>(baseUrl, "/orders", {
      method: "POST",
      body: JSON.stringify({ paymentMethod: "CREDITO" }),
    }, userCookie);
    expectStatus(secondOrder, 201);
    assert.equal(secondOrder.data.status, OrderStatus.PAGAMENTO_EM_ANALISE);
    assert.equal((await prisma.book.findUniqueOrThrow({ where: { id: bookId } })).quantity, 7);

    const cancelled = await api<any>(baseUrl, `/orders/${secondOrder.data.id}/cancel`, { method: "POST" }, userCookie);
    expectStatus(cancelled, 200);
    assert.equal(cancelled.data.status, OrderStatus.CANCELADO);
    assert.equal((await prisma.book.findUniqueOrThrow({ where: { id: bookId } })).quantity, 8);

    console.log("Order flow integration test passed.");
  } finally {
    if (userId || adminId) {
      await prisma.user.deleteMany({ where: { id: { in: [userId, adminId].filter((id): id is number => id !== null) } } });
    }
    if (testBookIds.length > 0) await prisma.book.deleteMany({ where: { id: { in: testBookIds } } });
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
