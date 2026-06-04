/**
 * @file discente.controller.js
 * @description Orquestrador de requisições do domínio discente.
 */

const discenteService = require("./discente.service");

const listarFavoritos = async (req, res) => {
  const favoritos = await discenteService.listarFavoritos(req.user.id);
  res.status(200).json(favoritos);
};

module.exports = { listarFavoritos };