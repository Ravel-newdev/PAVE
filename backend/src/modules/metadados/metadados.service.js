/**
 * @file metadados.service.js
 * @description Serviço de leitura de entidades estáticas do sistema (Tags e Tipos de Campo).
 */

const { query } = require("../../database/connection");

const listarTags = async () => {
  const { rows } = await query("SELECT id, nome, atributo_1 FROM tag ORDER BY nome ASC");
  return rows;
};

const listarTiposCampo = async () => {
  const { rows } = await query("SELECT id, chave_unica, label, tipo, obrigatoriedade FROM tipo_campo ORDER BY label ASC");
  return rows;
};

module.exports = { listarTags, listarTiposCampo };