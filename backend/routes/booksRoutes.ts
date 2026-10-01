import express from "express";
import { BooksController } from "../controllers/booksController";
import { BooksRepository } from "../repositories/booksRepository";
import { BooksService } from "../services/booksService";
import { requireAdmin, requireSession } from "../middleware/session";

const router = express.Router();
const booksRepository = new BooksRepository();
const booksService = new BooksService(booksRepository);
const booksController = new BooksController(booksService);

router.get("/", booksController.getAll);
router.post("/:id/ratings", requireSession, booksController.rate);
router.get("/:id", booksController.getById);
router.post("/", requireSession, requireAdmin, booksController.create);
router.put("/:id", requireSession, requireAdmin, booksController.update);
router.delete("/:id", requireSession, requireAdmin, booksController.delete);

export default router;
