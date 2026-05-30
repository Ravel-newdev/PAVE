/**
 * @file notificacao.routes.js
 * @description Mapeamento de rotas de notificações.
 */

const { Router } = require("express");
const { authenticate } = require("../../middlewares/auth.middleware");
const notificacaoController = require("./notificacao.controller");

const router = Router();

router.use(authenticate);

router.get("/", notificacaoController.listar);
router.patch("/:id/lida", notificacaoController.marcarComoLida);
router.delete("/:id", notificacaoController.remover);

module.exports = router;