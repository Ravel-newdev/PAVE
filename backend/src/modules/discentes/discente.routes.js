/**
 * @file discente.routes.js
 * @description Mapeamento de rotas restritas ao perfil discente.
 */

const { Router } = require("express");
const { authenticate, authorize } = require("../../middlewares/auth.middleware");
const { criarUploadMiddleware } = require("../../cloudflare/upload");
const discenteController = require("./discente.controller");

const router = Router();

router.use(authenticate);

router.get("/me",              authorize("discente"), discenteController.obterPerfil);
router.put("/me",              authorize("discente"), discenteController.atualizarPerfil);
router.post("/me/foto",        authorize("discente"), criarUploadMiddleware("foto"),      discenteController.uploadFoto);
router.post("/me/curriculo",   authorize("discente"), criarUploadMiddleware("documento"), discenteController.uploadCurriculo);
router.get("/favoritos",       authorize("discente"), discenteController.listarFavoritos);

module.exports = router;