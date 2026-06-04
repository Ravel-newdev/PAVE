/**
 * @file processo.routes.js
 * @description Instâncias de roteadores independentes para o módulo de processos seletivos e inscrições.
 */

const { Router } = require("express");
const validate = require("../../middlewares/validator.middleware");
const { authenticate, authorize } = require("../../middlewares/auth.middleware");
const {
  createProcessoSchema,
  updateProcessoSchema,
  createInscricaoSchema,
  avaliarInscricaoSchema
} = require("./processo.schema");
const processoController = require("./processo.controller");

const processoRouter = Router();
const inscricaoRouter = Router();

processoRouter.use(authenticate);
inscricaoRouter.use(authenticate);

processoRouter.post("/", authorize("docente"), validate(createProcessoSchema), processoController.criarProcesso);
processoRouter.put("/:id", authorize("docente"), validate(updateProcessoSchema), processoController.atualizarProcesso);
processoRouter.get("/:id/candidatos", authorize("docente"), processoController.listarCandidatos);

inscricaoRouter.post("/", authorize("discente"), validate(createInscricaoSchema), processoController.realizarInscricao);
inscricaoRouter.get("/", authorize("discente"), processoController.listarMinhasInscricoes);
inscricaoRouter.get("/:id", processoController.obterDetalhesInscricao);
inscricaoRouter.post("/:id/avaliar", authorize("docente"), validate(avaliarInscricaoSchema), processoController.avaliarInscricao);

module.exports = {
  processoRouter,
  inscricaoRouter
};