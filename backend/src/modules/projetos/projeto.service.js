/**
 * @file projeto.service.js
 * @description Serviços de persistência e isolamento de regras de negócio de projetos.
 */

const { query, getClient } = require("../../database/connection");
const { criar: criarNotificacao } = require("../notificacoes/notificacao.service");

const criar = async (docenteId, dados) => {
  const { titulo, descricao, carga_hora, data_inic, data_termino, centro_dep, tags } = dados;
  
  const tituloCheck = await query("SELECT 1 FROM projetos WHERE titulo = $1", [titulo]);
  if (tituloCheck.rows.length > 0) {
    throw new Error("Já existe um projeto cadastrado com este título.");
  }

  const client = await getClient();

  try {
    await client.query("BEGIN");

    const resProjeto = await client.query(
      `INSERT INTO projetos (docente_id, titulo, descricao, carga_hora, data_inic, data_termino, centro_dep)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [docenteId, titulo, descricao, carga_hora, data_inic, data_termino, centro_dep]
    );

    const projetoId = resProjeto.rows[0].id;

    if (tags && Array.isArray(tags) && tags.length > 0) {
      for (const tagId of tags) {
        await client.query(
          `INSERT INTO projeto_tag (projeto_id, tag_id) VALUES ($1, $2)`,
          [projetoId, tagId]
        );
      }
    }

    await client.query("COMMIT");
    return { id: projetoId, titulo, status: 'rascunho' };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const listar = async (usuario, filtros) => {
  let baseQuery = `
    SELECT p.id, p.titulo, p.centro_dep, p.status, p.criado_em, p.docente_id AS autor_id, d.nome AS autor_nome,
      COALESCE(
        (SELECT json_agg(json_build_object('id', t.id, 'nome', t.nome))
         FROM projeto_tag pt
         INNER JOIN tag t ON pt.tag_id = t.id
         WHERE pt.projeto_id = p.id),
        '[]'::json
      ) AS tags,
      (SELECT ps.n_vagas FROM processo_seletivo ps
       WHERE ps.projeto_id = p.id AND ps.status = 'aberto'
       ORDER BY ps.criado_em DESC LIMIT 1) AS n_vagas
    FROM projetos p
    INNER JOIN docentes d ON p.docente_id = d.id
    WHERE 1=1
  `;
  const params = [];
  let paramCount = 1;

  // Filtro de isolamento lógico: discentes não visualizam rascunhos
  if (usuario.tipo === 'discente') {
    baseQuery += ` AND p.status != 'rascunho'`;
  }

  if (filtros.status) {
    baseQuery += ` AND p.status = $${paramCount++}`;
    params.push(filtros.status);
  }

  baseQuery += ` ORDER BY p.criado_em DESC`;

  const { rows } = await query(baseQuery, params);
  return rows;
};

const obterPorId = async (projetoId, usuario) => {
  const baseQuery = `
    SELECT p.*, d.nome AS autor_nome,
      COALESCE(
        (SELECT json_agg(json_build_object('id', t.id, 'nome', t.nome))
         FROM projeto_tag pt
         INNER JOIN tag t ON pt.tag_id = t.id
         WHERE pt.projeto_id = p.id),
        '[]'::json
      ) AS tags
    FROM projetos p
    INNER JOIN docentes d ON p.docente_id = d.id
    WHERE p.id = $1
  `;

  const { rows } = await query(baseQuery, [projetoId]);
  const projeto = rows[0];

  if (!projeto) {
    throw new Error("Projeto não encontrado.");
  }

  if (usuario.tipo === 'discente' && projeto.status === 'rascunho') {
    throw new Error("Acesso negado.");
  }

  return projeto;
};

const atualizar = async (projetoId, docenteId, dados) => {
  const checkOwnership = await query("SELECT docente_id FROM projetos WHERE id = $1", [projetoId]);
  
  if (checkOwnership.rows.length === 0) throw new Error("Projeto não encontrado.");
  if (checkOwnership.rows[0].docente_id !== docenteId) throw new Error("Acesso negado.");

  const { titulo, descricao, carga_hora, data_inic, data_termino, centro_dep, tags } = dados;
  const client = await getClient();

  try {
    await client.query("BEGIN");

    // Construção dinâmica de update omitida por brevidade, assumindo atualização integral dos campos escalares
    await client.query(
      `UPDATE projetos 
       SET titulo = COALESCE($1, titulo), 
           descricao = COALESCE($2, descricao), 
           carga_hora = COALESCE($3, carga_hora), 
           data_inic = COALESCE($4, data_inic), 
           data_termino = COALESCE($5, data_termino), 
           centro_dep = COALESCE($6, centro_dep)
       WHERE id = $7`,
      [titulo, descricao, carga_hora, data_inic, data_termino, centro_dep, projetoId]
    );

    if (tags !== undefined) {
      await client.query(`DELETE FROM projeto_tag WHERE projeto_id = $1`, [projetoId]);
      for (const tagId of tags) {
        await client.query(
          `INSERT INTO projeto_tag (projeto_id, tag_id) VALUES ($1, $2)`,
          [projetoId, tagId]
        );
      }
    }

    await client.query("COMMIT");
    return { id: projetoId, atualizado: true };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const alterarStatus = async (projetoId, docenteId, novoStatus) => {
  const checkOwnership = await query("SELECT docente_id, status FROM projetos WHERE id = $1", [projetoId]);
  
  if (checkOwnership.rows.length === 0) throw new Error("Projeto não encontrado.");
  if (checkOwnership.rows[0].docente_id !== docenteId) throw new Error("Acesso negado.");

  const statusAnterior = checkOwnership.rows[0].status;
  await query(`UPDATE projetos SET status = $1 WHERE id = $2`, [novoStatus, projetoId]);

  if (novoStatus === 'ativo' && statusAnterior !== 'ativo') {
    const [favoritos, projetoRow] = await Promise.all([
      query(`SELECT discente_id FROM favoritos WHERE projeto_id = $1`, [projetoId]),
      query(`SELECT titulo FROM projetos WHERE id = $1`, [projetoId]),
    ]);
    const titulo = projetoRow.rows[0]?.titulo ?? 'projeto';
    await Promise.all(
      favoritos.rows.map((f) =>
        criarNotificacao({
          discente_id: f.discente_id,
          titulo: 'Projeto favoritado agora está ativo',
          mensagem: `O projeto "${titulo}" que você favoritou está ativo e com inscrições abertas.`,
          tipo: 'sistema',
        })
      )
    );
  }
};

const alternarFavorito = async (projetoId, discenteId) => {
  const check = await query(
    `SELECT 1 FROM favoritos WHERE projeto_id = $1 AND discente_id = $2`,
    [projetoId, discenteId]
  );

  if (check.rows.length > 0) {
    await query(
      `DELETE FROM favoritos WHERE projeto_id = $1 AND discente_id = $2`,
      [projetoId, discenteId]
    );
    return { message: "Projeto removido dos favoritos.", favoritado: false };
  } else {
    await query(
      `INSERT INTO favoritos (projeto_id, discente_id) VALUES ($1, $2)`,
      [projetoId, discenteId]
    );
    return { message: "Projeto adicionado aos favoritos.", favoritado: true };
  }
};

const excluir = async (projetoId, docenteId) => {
  const check = await query("SELECT docente_id, status FROM projetos WHERE id = $1", [projetoId]);
  if (check.rows.length === 0) throw new Error("Projeto não encontrado.");
  if (check.rows[0].docente_id !== docenteId) throw new Error("Acesso negado.");
  if (check.rows[0].status !== "rascunho") throw new Error("Apenas projetos em rascunho podem ser excluídos.");
  await query("DELETE FROM projetos WHERE id = $1", [projetoId]);
};

module.exports = {
  criar,
  listar,
  obterPorId,
  atualizar,
  alterarStatus,
  alternarFavorito,
  excluir
};