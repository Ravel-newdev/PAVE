/**
 * @file auth.routes.js
 * @description Roteamento e acoplamento de validadores do módulo de autenticação.
 * Mapeia as URLs públicas de gerenciamento de identidades injetando os esquemas Zod.
 */

const { Router } = require("express");
const validate = require("../../middlewares/validator.middleware");
const {
  registerDiscenteSchema,
  registerDocenteSchema,
  loginSchema,
  recoverPasswordSchema,
  resetPasswordSchema,
} = require("./auth.schema");
const {
  registerDiscente,
  registerDocente,
  login,
  recoverPassword,
  resetPassword,
} = require("./auth.controller");

const router = Router();

router.post("/register/discente", validate(registerDiscenteSchema), registerDiscente);
router.post("/register/docente", validate(registerDocenteSchema), registerDocente);
router.post("/login", validate(loginSchema), login);
router.post("/recuperar-senha", validate(recoverPasswordSchema), recoverPassword);
router.post("/reset-senha", validate(resetPasswordSchema), resetPassword);

module.exports = router;