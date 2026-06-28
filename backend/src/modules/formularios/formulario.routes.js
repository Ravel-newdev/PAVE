const { Router } = require("express");
const { authenticate } = require("../../middlewares/auth.middleware");
const formularioController = require("./formulario.controller");

const router = Router();

router.use(authenticate);

router.get("/:id/campos", formularioController.listarCampos);
router.post("/:id/campos", formularioController.criarCampo);
router.delete("/:id/campos/personalizados", formularioController.limparCamposPersonalizados);

module.exports = router;
