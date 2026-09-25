import express from "express";
import { BooksController } from "../controllers/booksController";
import { BooksRepository } from "../repositories/booksRepository";
import { BooksService } from "../services/booksService";

const router = express.Router();
const booksRepository = new BooksRepository();
const booksService = new BooksService(booksRepository);
const booksController = new BooksController(booksService);

router.get("/", booksController.getAll);
router.get("/:id", booksController.getById);
router.post("/", booksController.create);
router.put("/:id", booksController.update);
router.delete("/:id", booksController.delete);

export default router;
