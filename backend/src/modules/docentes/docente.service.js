const { query } = require("../../database/connection");

const obterPerfil = async (docenteId) => {
  const { rows } = await query(
    `SELECT d.nome, d.matricula, d.telefone, d.departamento, d.criado_em, u.email
     FROM docentes d
     INNER JOIN usuarios u ON u.id = d.id
     WHERE d.id = $1`,
    [docenteId]
  );
  if (!rows[0]) throw new Error("Docente não encontrado.");
  return rows[0];
};

const atualizarPerfil = async (docenteId, { nome, telefone, departamento }) => {
  await query(
    `UPDATE docentes SET
       nome        = COALESCE($1, nome),
       telefone    = COALESCE($2, telefone),
       departamento = COALESCE($3, departamento)
     WHERE id = $4`,
    [nome, telefone, departamento, docenteId]
  );
};

module.exports = { obterPerfil, atualizarPerfil };
