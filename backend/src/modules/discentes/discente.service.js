/**
 * @file discente.service.js
 * @description Serviço de persistência para operações exclusivas do perfil discente.
 */

const { query } = require("../../database/connection");

const listarFavoritos = async (discenteId) => {
  const { rows } = await query(`
    SELECT p.id, p.titulo, p.status, p.descricao, p.centro_dep, p.carga_hora,
           p.data_inic, p.data_termino, p.docente_id AS autor_id,
           d.nome AS autor_nome, f.criado_em AS favoritado_em,
           COALESCE(
             (SELECT json_agg(json_build_object('id', t.id, 'nome', t.nome))
              FROM projeto_tag pt
              INNER JOIN tag t ON pt.tag_id = t.id
              WHERE pt.projeto_id = p.id),
             '[]'::json
           ) AS tags
    FROM favoritos f
    INNER JOIN projetos p ON f.projeto_id = p.id
    INNER JOIN docentes d ON p.docente_id = d.id
    WHERE f.discente_id = $1
    ORDER BY f.criado_em DESC
  `, [discenteId]);

  return rows;
};

const obterPerfil = async (discenteId) => {
  const { rows } = await query(
    `SELECT d.nome, d.matricula, d.curso, d.telefone, d.foto_url, d.curriculo_url,
            d.bio, d.data_nascimento, d.semestre, d.ano_conclusao, d.linkedin,
            d.disponibilidade, d.remoto, d.notificacoes, d.interesses,
            u.email
     FROM discentes d
     INNER JOIN usuarios u ON u.id = d.id
     WHERE d.id = $1`,
    [discenteId]
  );
  if (!rows[0]) throw new Error("Discente não encontrado.");
  return rows[0];
};

const atualizarPerfil = async (discenteId, dados) => {
  const {
    nome, telefone, curso, bio, data_nascimento, semestre, ano_conclusao,
    linkedin, disponibilidade, remoto, notificacoes, interesses,
  } = dados;

  const { rows } = await query(
    `UPDATE discentes SET
       nome            = COALESCE($1,  nome),
       telefone        = COALESCE($2,  telefone),
       curso           = COALESCE($3,  curso),
       bio             = COALESCE($4,  bio),
       data_nascimento = COALESCE($5,  data_nascimento),
       semestre        = COALESCE($6,  semestre),
       ano_conclusao   = COALESCE($7,  ano_conclusao),
       linkedin        = COALESCE($8,  linkedin),
       disponibilidade = COALESCE($9,  disponibilidade),
       remoto          = COALESCE($10, remoto),
       notificacoes    = COALESCE($11, notificacoes),
       interesses      = COALESCE($12, interesses)
     WHERE id = $13
     RETURNING nome, matricula, curso`,
    [
      nome, telefone, curso, bio, data_nascimento, semestre, ano_conclusao,
      linkedin, disponibilidade, remoto, notificacoes,
      interesses ? interesses : null,
      discenteId,
    ]
  );
  if (!rows[0]) throw new Error("Discente não encontrado.");
  return rows[0];
};

const atualizarFoto = async (discenteId, fotoUrl) => {
  await query(`UPDATE discentes SET foto_url = $1 WHERE id = $2`, [fotoUrl, discenteId]);
};

const atualizarCurriculo = async (discenteId, curriculoUrl) => {
  await query(`UPDATE discentes SET curriculo_url = $1 WHERE id = $2`, [curriculoUrl, discenteId]);
};

module.exports = { listarFavoritos, obterPerfil, atualizarPerfil, atualizarFoto, atualizarCurriculo };