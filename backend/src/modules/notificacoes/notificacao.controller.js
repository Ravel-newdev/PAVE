/**
 * @file notificacao.controller.js
 * @description Orquestrador de requisições para o domínio de notificações.
 */

const notificacaoService = require("./notificacao.service");

const listar = async (req, res) => {
  const notificacoes = await notificacaoService.listar(req.user.id, req.user.tipo);
  res.status(200).json(notificacoes);
};

const marcarComoLida = async (req, res) => {
  await notificacaoService.marcarComoLida(req.params.id, req.user.id, req.user.tipo);
  res.status(200).json({ message: "Notificação marcada como lida." });
};

const remover = async (req, res) => {
  await notificacaoService.remover(req.params.id, req.user.id, req.user.tipo);
  res.status(204).send();
};

module.exports = { listar, marcarComoLida, remover };