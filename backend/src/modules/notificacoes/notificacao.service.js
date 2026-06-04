/**
 * @file notificacao.service.js
 * @description Serviço de persistência para notificações.
 * Implementa o isolamento dinâmico de leitura e exclusão baseado no perfil do usuário (docente ou discente).
 */

const { query } = require("../../database/connection");

const listar = async (usuarioId, tipoUsuario) => {
  const colunaId = tipoUsuario === 'docente' ? 'docente_id' : 'discente_id';
  const { rows } = await query(`
    SELECT id, titulo, mensagem, tipo, lida, criado_em
    FROM notificacao
    WHERE ${colunaId} = $1
    ORDER BY criado_em DESC
  `, [usuarioId]);

  return rows;
};

const marcarComoLida = async (notificacaoId, usuarioId, tipoUsuario) => {
  const colunaId = tipoUsuario === 'docente' ? 'docente_id' : 'discente_id';
  const { rowCount } = await query(`
    UPDATE notificacao SET lida = TRUE 
    WHERE id = $1 AND ${colunaId} = $2
  `, [notificacaoId, usuarioId]);

  if (rowCount === 0) throw new Error("Notificação não encontrada.");
};

const remover = async (notificacaoId, usuarioId, tipoUsuario) => {
  const colunaId = tipoUsuario === 'docente' ? 'docente_id' : 'discente_id';
  const { rowCount } = await query(`
    DELETE FROM notificacao 
    WHERE id = $1 AND ${colunaId} = $2
  `, [notificacaoId, usuarioId]);

  if (rowCount === 0) throw new Error("Notificação não encontrada.");
};

module.exports = { listar, marcarComoLida, remover };