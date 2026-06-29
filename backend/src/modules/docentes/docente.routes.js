const { Router } = require("express");
const { authenticate, authorize } = require("../../middlewares/auth.middleware");
const docenteController = require("./docente.controller");

const router = Router();

router.use(authenticate);

router.get("/me", authorize("docente"), docenteController.obterPerfil);
router.put("/me", authorize("docente"), docenteController.atualizarPerfil);

module.exports = router;
