import { Router } from "express";
import type { NextFunction, Request, Response } from "express";
import * as authController from "../controllers/authController";
import * as bookController from "../controllers/bookController";
import * as cartController from "../controllers/cartController";
import * as favoriteController from "../controllers/favoriteController";
import * as orderController from "../controllers/orderController";
import * as profileController from "../controllers/profileController";
import { requireAdmin, simulateAuth } from "../middlewares/auth";
import { asyncHandler } from "../utils/asyncHandler";

export const apiRoutes = Router();

apiRoutes.post("/auth/register", asyncHandler(authController.register));
apiRoutes.post("/auth/login", asyncHandler(authController.login));

apiRoutes.get("/books", asyncHandler(bookController.index));
apiRoutes.post("/books", simulateAuth, requireAdmin, asyncHandler(bookController.store));
apiRoutes.put("/books/:id", simulateAuth, requireAdmin, asyncHandler(bookController.update));
apiRoutes.delete("/books/:id", simulateAuth, requireAdmin, asyncHandler(bookController.destroy));

apiRoutes.get("/cart", simulateAuth, asyncHandler(cartController.index));
apiRoutes.post("/cart/items", simulateAuth, asyncHandler(cartController.store));
apiRoutes.patch("/cart/items/:bookId", simulateAuth, asyncHandler(cartController.update));
apiRoutes.delete("/cart/items/:bookId", simulateAuth, asyncHandler(cartController.destroy));

apiRoutes.get("/favorites", simulateAuth, asyncHandler(favoriteController.index));
apiRoutes.post("/favorites/:bookId", simulateAuth, asyncHandler(favoriteController.store));
apiRoutes.delete("/favorites/:bookId", simulateAuth, asyncHandler(favoriteController.destroy));

apiRoutes.get("/profile", simulateAuth, asyncHandler(profileController.show));
apiRoutes.patch("/profile", simulateAuth, asyncHandler(profileController.update));
apiRoutes.post("/profile/cards", simulateAuth, asyncHandler(profileController.storeCard));

apiRoutes.post("/orders", simulateAuth, asyncHandler(orderController.store));

apiRoutes.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({ error: err.message || "Erro interno do servidor." });
});
