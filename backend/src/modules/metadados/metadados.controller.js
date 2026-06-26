/**
 * @file metadados.controller.js
 * @description Orquestrador de requisições para listagem de metadados.
 */

const metadadosService = require("./metadados.service");

const listarTags = async (req, res) => {
  const tags = await metadadosService.listarTags();
  res.status(200).json(tags);
};

const listarTiposCampo = async (req, res) => {
  const tipos = await metadadosService.listarTiposCampo();
  res.status(200).json(tipos);
};

module.exports = { listarTags, listarTiposCampo };