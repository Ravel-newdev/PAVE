/**
 * @file projeto.controller.js
 * @description Despachante de requisições do módulo de projetos.
 */

const projetoService = require("./projeto.service");

const criarProjeto = async (req, res) => {
  const projeto = await projetoService.criar(req.user.id, req.body);
  res.status(201).json(projeto);
};

const listarProjetos = async (req, res) => {
  const projetos = await projetoService.listar(req.user, req.query);
  res.status(200).json(projetos);
};

const obterProjeto = async (req, res) => {
  const projeto = await projetoService.obterPorId(req.params.id, req.user);
  res.status(200).json(projeto);
};

const atualizarProjeto = async (req, res) => {
  const projeto = await projetoService.atualizar(req.params.id, req.user.id, req.body);
  res.status(200).json(projeto);
};

const alterarStatus = async (req, res) => {
  await projetoService.alterarStatus(req.params.id, req.user.id, req.body.status);
  res.status(200).json({ message: "Status do projeto atualizado com sucesso." });
};

const alternarFavorito = async (req, res) => {
  const resultado = await projetoService.alternarFavorito(req.params.id, req.user.id);
  res.status(200).json(resultado);
};

module.exports = {
  criarProjeto,
  listarProjetos,
  obterProjeto,
  atualizarProjeto,
  alterarStatus,
  alternarFavorito
};