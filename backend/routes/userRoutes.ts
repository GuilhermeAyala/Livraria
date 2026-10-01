import express from "express";
import {
  buscarUsuarioDemoController,
  buscarUsuarioPorIdController,
  criarUsuarioController,
  editarUsuarioController,
  excluirUsuarioController,
  listarUsuariosController,
} from "../controllers/userController";
import { requireAdmin, requireSelfOrAdmin, requireSession } from "../middleware/session";

const router = express.Router();

router.get("/", requireSession, requireAdmin, listarUsuariosController);
router.get("/:id", requireSession, requireAdmin, buscarUsuarioPorIdController);
router.post("/", criarUsuarioController);
router.put("/:id", requireSession, requireSelfOrAdmin, editarUsuarioController);
router.delete("/:id", requireSession, requireSelfOrAdmin, excluirUsuarioController);

export default router;
