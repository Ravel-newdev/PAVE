const { query } = require("../../database/connection");

const listarCampos = async (formularioId) => {
  const { rows } = await query(
    `SELECT cf.id, tc.chave_unica, tc.tipo,
            COALESCE(cf.label_override, tc.label) AS label,
            cf.obrigatorio, cf.ordem, cf.opcoes
     FROM campo_formulario cf
     INNER JOIN tipo_campo tc ON cf.tipo_id = tc.id
     WHERE cf.formulario_id = $1
     ORDER BY cf.ordem ASC`,
    [formularioId]
  );
  return rows;
};

const criarCampo = async (formularioId, { tipo_chave, label_override, opcoes, obrigatorio, ordem }) => {
  const tcRes = await query(`SELECT id FROM tipo_campo WHERE chave_unica = $1`, [tipo_chave]);
  if (tcRes.rows.length === 0) throw new Error(`Tipo de campo desconhecido: ${tipo_chave}`);
  const tipo_id = tcRes.rows[0].id;

  const ordemFinal = ordem ?? (
    (await query(
      `SELECT COALESCE(MAX(ordem), 0) + 1 AS prox FROM campo_formulario WHERE formulario_id = $1`,
      [formularioId]
    )).rows[0].prox
  );

  const { rows } = await query(
    `INSERT INTO campo_formulario (formulario_id, tipo_id, label_override, opcoes, obrigatorio, ordem)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
    [formularioId, tipo_id, label_override ?? null, opcoes ? JSON.stringify(opcoes) : null, obrigatorio ?? false, ordemFinal]
  );
  return rows[0];
};

const limparCamposPersonalizados = async (formularioId) => {
  await query(
    `DELETE FROM campo_formulario WHERE formulario_id = $1 AND label_override IS NOT NULL`,
    [formularioId]
  );
};

module.exports = { listarCampos, criarCampo, limparCamposPersonalizados };
