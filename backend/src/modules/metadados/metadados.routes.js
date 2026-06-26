/**
 * @file metadados.routes.js
 * @description Mapeamento de rotas para recursos estáticos.
 */

const { Router } = require("express");
const { authenticate } = require("../../middlewares/auth.middleware");
const metadadosController = require("./metadados.controller");

const router = Router();

router.use(authenticate);

router.get("/tags", metadadosController.listarTags);
router.get("/formularios/tipos-campo", metadadosController.listarTiposCampo);

module.exports = router;