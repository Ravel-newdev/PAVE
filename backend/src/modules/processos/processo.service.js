/**
 * @file processo.service.js
 * @description Serviços de persistência e isolamento transacional para processos seletivos.
 */

const { query, getClient } = require("../../database/connection");

const criarProcesso = async (docenteId, dados) => {
  const { projeto_id, formulario_id, titulo, descricao, data_inicio, data_termino, pdf_edital, n_vagas } = dados;

  const projetoQuery = await query("SELECT docente_id, status FROM projetos WHERE id = $1", [projeto_id]);
  if (projetoQuery.rows.length === 0) throw new Error("Projeto não encontrado.");
  
  const projeto = projetoQuery.rows[0];
  if (projeto.docente_id !== docenteId) throw new Error("Acesso negado.");
  if (projeto.status === 'rascunho' || projeto.status === 'suspenso') {
    throw new Error("Não é possível abrir um processo seletivo para um projeto rascunho ou suspenso.");
  }

  const { rows } = await query(
    `INSERT INTO processo_seletivo (projeto_id, formulario_id, titulo, descricao, data_inicio, data_termino, pdf_edital, n_vagas)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
    [projeto_id, formulario_id, titulo, descricao, data_inicio, data_termino, pdf_edital, n_vagas]
  );

  return { id: rows[0].id, titulo, status: 'aberto' };
};

const atualizarProcesso = async (processoId, docenteId, dados) => {
  const checkQuery = await query(`
    SELECT p.docente_id 
    FROM processo_seletivo ps
    INNER JOIN projetos p ON ps.projeto_id = p.id
    WHERE ps.id = $1
  `, [processoId]);

  if (checkQuery.rows.length === 0) throw new Error("Processo seletivo não encontrado.");
  if (checkQuery.rows[0].docente_id !== docenteId) throw new Error("Acesso negado.");

  const { titulo, descricao, data_inicio, data_termino, pdf_edital, n_vagas, status } = dados;

  await query(
    `UPDATE processo_seletivo 
     SET titulo = COALESCE($1, titulo), 
         descricao = COALESCE($2, descricao), 
         data_inicio = COALESCE($3, data_inicio), 
         data_termino = COALESCE($4, data_termino), 
         pdf_edital = COALESCE($5, pdf_edital), 
         n_vagas = COALESCE($6, n_vagas),
         status = COALESCE($7, status)
     WHERE id = $8`,
    [titulo, descricao, data_inicio, data_termino, pdf_edital, n_vagas, status, processoId]
  );

  return { id: processoId, atualizado: true };
};

const listarCandidatos = async (processoId, docenteId) => {
  const checkQuery = await query(`
    SELECT p.docente_id 
    FROM processo_seletivo ps
    INNER JOIN projetos p ON ps.projeto_id = p.id
    WHERE ps.id = $1
  `, [processoId]);

  if (checkQuery.rows.length === 0) throw new Error("Processo seletivo não encontrado.");
  if (checkQuery.rows[0].docente_id !== docenteId) throw new Error("Acesso negado.");

  const { rows } = await query(`
    SELECT i.id AS inscricao_id, i.data_inscricao, i.status, i.coluna_kanban,
           d.nome AS candidato_nome, d.matricula, d.curso
    FROM inscricao i
    INNER JOIN discentes d ON i.discente_id = d.id
    WHERE i.ps_id = $1
    ORDER BY i.data_inscricao ASC
  `, [processoId]);

  return rows;
};

const realizarInscricao = async (discenteId, dados) => {
  const { ps_id, respostas } = dados;

  const psQuery = await query("SELECT status FROM processo_seletivo WHERE id = $1", [ps_id]);
  if (psQuery.rows.length === 0) throw new Error("Processo seletivo não encontrado.");
  if (psQuery.rows[0].status !== 'aberto') throw new Error("Este processo seletivo não está recebendo inscrições.");

  const inscricaoExistente = await query(
    "SELECT 1 FROM inscricao WHERE ps_id = $1 AND discente_id = $2",
    [ps_id, discenteId]
  );
  if (inscricaoExistente.rows.length > 0) throw new Error("A inscrição para este processo já foi realizada.");

  const client = await getClient();
  try {
    await client.query("BEGIN");

    const resInscricao = await client.query(
      `INSERT INTO inscricao (ps_id, discente_id, status) VALUES ($1, $2, 'pendente') RETURNING id`,
      [ps_id, discenteId]
    );

    const inscricaoId = resInscricao.rows[0].id;

    if (respostas && Array.isArray(respostas) && respostas.length > 0) {
      for (const resposta of respostas) {
        await client.query(
          `INSERT INTO resposta_formulario (inscricao_id, campo_id, valor_texto, arquivo_url) 
           VALUES ($1, $2, $3, $4)`,
          [inscricaoId, resposta.campo_id, resposta.valor_texto, resposta.arquivo_url]
        );
      }
    }

    await client.query("COMMIT");
    return { id: inscricaoId, status: 'pendente' };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const listarInscricoesDiscente = async (discenteId) => {
  const { rows } = await query(`
    SELECT i.id, i.data_inscricao, i.status, 
           ps.titulo AS processo_titulo, p.titulo AS projeto_titulo
    FROM inscricao i
    INNER JOIN processo_seletivo ps ON i.ps_id = ps.id
    INNER JOIN projetos p ON ps.projeto_id = p.id
    WHERE i.discente_id = $1
    ORDER BY i.data_inscricao DESC
  `, [discenteId]);

  return rows;
};

const obterDetalhesInscricao = async (inscricaoId, usuario) => {
  const baseQuery = `
    SELECT i.*, d.nome AS candidato_nome,
           (SELECT json_agg(json_build_object(
              'campo_id', rf.campo_id, 
              'valor', rf.valor_texto, 
              'arquivo', rf.arquivo_url
           ))
            FROM resposta_formulario rf WHERE rf.inscricao_id = i.id) AS respostas,
           p.docente_id AS autor_projeto
    FROM inscricao i
    INNER JOIN discentes d ON i.discente_id = d.id
    INNER JOIN processo_seletivo ps ON i.ps_id = ps.id
    INNER JOIN projetos p ON ps.projeto_id = p.id
    WHERE i.id = $1
  `;

  const { rows } = await query(baseQuery, [inscricaoId]);
  const detalhes = rows[0];

  if (!detalhes) throw new Error("Inscrição não encontrada.");

  /* O isolamento estrito previne a exposição de dados e avaliações entre discentes concorrentes. */
  if (usuario.tipo === 'discente' && detalhes.discente_id !== usuario.id) {
    throw new Error("Acesso negado.");
  }
  if (usuario.tipo === 'docente' && detalhes.autor_projeto !== usuario.id) {
    throw new Error("Acesso negado.");
  }

  /* A supressão desta chave preserva a estrutura de resposta, evitando o vazamento de metadados internos de controle. */
  delete detalhes.autor_projeto;
  return detalhes;
};

const avaliarInscricao = async (inscricaoId, docenteId, dados) => {
  const { nota, comentario, novo_status, coluna_kanban } = dados;

  /* A validação relacional em profundidade é exigida para garantir que a permissão de escrita 
     pertença exclusivamente ao docente autor do projeto original da cadeia. */
  const checkPropriedade = await query(`
    SELECT p.docente_id, i.status AS status_atual
    FROM inscricao i
    INNER JOIN processo_seletivo ps ON i.ps_id = ps.id
    INNER JOIN projetos p ON ps.projeto_id = p.id
    WHERE i.id = $1
  `, [inscricaoId]);

  if (checkPropriedade.rows.length === 0) throw new Error("Inscrição não encontrada.");
  if (checkPropriedade.rows[0].docente_id !== docenteId) throw new Error("Acesso negado.");

  const client = await getClient();
  try {
    await client.query("BEGIN");

    await client.query(
      `INSERT INTO avaliacao (id_inscricao, matr_docente, nota, comentario) 
       VALUES ($1, $2, $3, $4)`,
      [inscricaoId, docenteId, nota, comentario]
    );

    const updateColuna = coluna_kanban !== undefined ? coluna_kanban : 1;

    await client.query(
      `UPDATE inscricao SET status = $1, coluna_kanban = $2 WHERE id = $3`,
      [novo_status, updateColuna, inscricaoId]
    );

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  criarProcesso,
  atualizarProcesso,
  listarCandidatos,
  realizarInscricao,
  listarInscricoesDiscente,
  obterDetalhesInscricao,
  avaliarInscricao
};