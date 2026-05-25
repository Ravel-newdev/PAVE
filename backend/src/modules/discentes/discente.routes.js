/**
 * @file discente.routes.js
 * @description Mapeamento de rotas restritas ao perfil discente.
 */

const { Router } = require("express");
const { authenticate, authorize } = require("../../middlewares/auth.middleware");
const discenteController = require("./discente.controller");

const router = Router();

router.use(authenticate);

router.get("/favoritos", authorize("discente"), discenteController.listarFavoritos);

module.exports = router;