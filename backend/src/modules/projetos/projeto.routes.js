/**
 * @file projeto.routes.js
 * @description Mapeamento de rotas e acoplamento de middlewares de segurança.
 */

const { Router } = require("express");
const validate = require("../../middlewares/validator.middleware");
const { authenticate, authorize } = require("../../middlewares/auth.middleware");
const {
  createProjetoSchema,
  updateProjetoSchema,
  updateStatusSchema
} = require("./projeto.schema");
const projetoController = require("./projeto.controller");

const router = Router();

// Todas as rotas de projetos exigem autenticação prévia
router.use(authenticate);

// Leitura (acesso liberado a docentes e discentes)
router.get("/", projetoController.listarProjetos);
router.get("/:id", projetoController.obterProjeto);

// Escrita (acesso estritamente restrito a docentes)
router.post("/", authorize("docente"), validate(createProjetoSchema), projetoController.criarProjeto);
router.put("/:id", authorize("docente"), validate(updateProjetoSchema), projetoController.atualizarProjeto);
router.patch("/:id/status", authorize("docente"), validate(updateStatusSchema), projetoController.alterarStatus);
router.delete("/:id", authorize("docente"), projetoController.excluirProjeto);

// Ações discentes
router.post("/:id/favorito", authorize("discente"), projetoController.alternarFavorito);

module.exports = router;