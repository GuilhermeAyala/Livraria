import express from "express";
import { OrderController } from "../controllers/orderController";
import { requireAdmin, requireSession } from "../middleware/session";
import { OrderRepository } from "../repositories/orderRepository";
import { OrderService } from "../services/orderService";

const router = express.Router();
const orderController = new OrderController(new OrderService(new OrderRepository()));

router.use(requireSession);
router.post("/", orderController.create);
router.get("/", orderController.list);
router.get("/:id", orderController.getById);
router.patch("/:id/status", requireAdmin, orderController.updateStatus);
router.post("/:id/cancel", orderController.cancel);

export default router;
