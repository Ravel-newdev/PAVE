const { query } = require("../../database/connection");
 const obterPorId = async (id) => {
  const { rows } = await query(
  `SELECT d.nome, d.telefone, d.departamento, d.matricula, d.criado_em, u.email
   FROM docentes d
   INNER JOIN usuarios u ON u.id = d.id
   WHERE d.id = $1`,
  [id]
);
  if (!rows[0]) throw new Error("Docente não encontrado.");
  return rows[0];
};
 
const atualizar = async (id, dados) => {
  const { nome, telefone, departamento } = dados;
  await query(
    `UPDATE docentes
     SET nome = COALESCE($1, nome),
         telefone = COALESCE($2, telefone),
         departamento = COALESCE($3, departamento)
     WHERE id = $4`,
    [nome || null, telefone || null, departamento || null, id]
  );
  return obterPorId(id);
};
 
module.exports = { obterPorId, atualizar };
