/**
 * @file processo.controller.js
 * @description Orquestrador de requisições do módulo de recrutamento.
 */

const processoService = require("./processo.service");

const criarProcesso = async (req, res) => {
  const processo = await processoService.criarProcesso(req.user.id, req.body);
  res.status(201).json(processo);
};

const atualizarProcesso = async (req, res) => {
  const processo = await processoService.atualizarProcesso(req.params.id, req.user.id, req.body);
  res.status(200).json(processo);
};

const listarCandidatos = async (req, res) => {
  const candidatos = await processoService.listarCandidatos(req.params.id, req.user.id);
  res.status(200).json(candidatos);
};

const realizarInscricao = async (req, res) => {
  const inscricao = await processoService.realizarInscricao(req.user.id, req.body);
  res.status(201).json(inscricao);
};

const listarMinhasInscricoes = async (req, res) => {
  const inscricoes = await processoService.listarInscricoesDiscente(req.user.id);
  res.status(200).json(inscricoes);
};

const obterDetalhesInscricao = async (req, res) => {
  const detalhes = await processoService.obterDetalhesInscricao(req.params.id, req.user);
  res.status(200).json(detalhes);
};

const avaliarInscricao = async (req, res) => {
  await processoService.avaliarInscricao(req.params.id, req.user.id, req.body);
  res.status(200).json({ message: "Avaliação registrada e status da inscrição atualizado com sucesso." });
};

module.exports = {
  criarProcesso,
  atualizarProcesso,
  listarCandidatos,
  realizarInscricao,
  listarMinhasInscricoes,
  obterDetalhesInscricao,
  avaliarInscricao
};