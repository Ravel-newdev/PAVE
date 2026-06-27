const { Router } = require("express");
const { authenticate } = require("../../middlewares/auth.middleware");
const formularioController = require("./formulario.controller");

const router = Router();

router.use(authenticate);

router.get("/:id/campos", formularioController.listarCampos);

module.exports = router;
