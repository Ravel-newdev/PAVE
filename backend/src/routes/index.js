/**
 * @file index.js
 * @description Ponto de entrada do roteamento da aplicação.
 * Centraliza a montagem da árvore de rotas mapeando os prefixos para seus respectivos domínios.
 */

const { Router } = require("express");
const authRoutes = require("../modules/auth/auth.routes");
const projetoRoutes = require("../modules/projetos/projeto.routes");
const { processoRouter, inscricaoRouter } = require("../modules/processos/processo.routes");
const notificacaoRoutes = require("../modules/notificacoes/notificacao.routes");
const metadadosRoutes = require("../modules/metadados/metadados.routes");
const discenteRoutes   = require("../modules/discentes/discente.routes");
const docenteRoutes    = require("../modules/docentes/docente.routes");
const formularioRoutes = require("../modules/formularios/formulario.routes");
const uploadRoutes     = require("../modules/uploads/upload.routes");

const router = Router();

router.use("/auth",        authRoutes);
router.use("/projetos",    projetoRoutes);
router.use("/processos",   processoRouter);
router.use("/inscricoes",  inscricaoRouter);
router.use("/notificacoes",notificacaoRoutes);
router.use("/discentes",   discenteRoutes);
router.use("/docentes",    docenteRoutes);
router.use("/formularios", formularioRoutes);
router.use("/uploads",     uploadRoutes);
router.use("/",            metadadosRoutes);

module.exports = router;