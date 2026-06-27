const { query } = require("../../database/connection");

const listarCampos = async (formularioId) => {
  const { rows } = await query(
    `SELECT cf.id, tc.chave_unica, tc.label, tc.tipo, cf.obrigatorio, cf.ordem
     FROM campo_formulario cf
     INNER JOIN tipo_campo tc ON cf.tipo_id = tc.id
     WHERE cf.formulario_id = $1
     ORDER BY cf.ordem ASC`,
    [formularioId]
  );
  return rows;
};

module.exports = { listarCampos };
