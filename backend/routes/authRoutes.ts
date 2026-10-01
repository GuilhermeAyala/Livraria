import express from "express";
import { loginController, logoutController, meController } from "../controllers/authController";
import { requireSession } from "../middleware/session";

const router = express.Router();
router.post("/login", loginController);
router.get("/me", requireSession, meController);
router.post("/logout", requireSession, logoutController);

export default router;
