const { Router } = require("express");
const { registerDiscente, registerDocente, login } = require("./auth.controller");

const router = Router();

router.post("/register/discente", registerDiscente);
router.post("/register/docente", registerDocente);
router.post("/login", login);

module.exports = router;