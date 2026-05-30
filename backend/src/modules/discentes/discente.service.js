/**
 * @file discente.service.js
 * @description Serviço de persistência para operações exclusivas do perfil discente.
 */

const { query } = require("../../database/connection");

const listarFavoritos = async (discenteId) => {
  const { rows } = await query(`
    SELECT p.id, p.titulo, p.status, d.nome AS docente_nome, f.criado_em AS favoritado_em
    FROM favoritos f
    INNER JOIN projetos p ON f.projeto_id = p.id
    INNER JOIN docentes d ON p.docente_id = d.id
    WHERE f.discente_id = $1
    ORDER BY f.criado_em DESC
  `, [discenteId]);

  return rows;
};

module.exports = { listarFavoritos };