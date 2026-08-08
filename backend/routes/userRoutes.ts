import express from "express";
import {
  buscarUsuarioPorIdController,
  criarUsuarioController,
  editarUsuarioController,
  excluirUsuarioController,
  listarUsuariosController,
} from "../controllers/userController";

const router = express.Router();

router.get("/", listarUsuariosController);
router.get("/:id", buscarUsuarioPorIdController);
router.post("/", criarUsuarioController);
router.put("/:id", editarUsuarioController);
router.delete("/:id", excluirUsuarioController);

export default router;
