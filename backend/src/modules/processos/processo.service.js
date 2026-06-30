/**
 * @file processo.service.js
 * @description Serviços de persistência e isolamento transacional para processos seletivos.
 */

const { query, getClient } = require("../../database/connection");
const { criar: criarNotificacao } = require("../notificacoes/notificacao.service");

const criarProcesso = async (docenteId, dados) => {
  const { projeto_id, campos_chaves, titulo, descricao, data_inicio, data_termino, pdf_edital, n_vagas } = dados;

  const projetoQuery = await query("SELECT docente_id, status FROM projetos WHERE id = $1", [projeto_id]);
  if (projetoQuery.rows.length === 0) throw new Error("Projeto não encontrado.");

  const projeto = projetoQuery.rows[0];
  if (projeto.docente_id !== docenteId) throw new Error("Acesso negado.");
  if (projeto.status === 'rascunho' || projeto.status === 'suspenso') {
    throw new Error("Não é possível abrir um processo seletivo para um projeto rascunho ou suspenso.");
  }

  const client = await getClient();
  let processoId;
  let formulario_id = null;
  try {
    await client.query("BEGIN");
    if (Array.isArray(campos_chaves) && campos_chaves.length > 0) {
      const fRes = await client.query(
        `INSERT INTO formulario (titulo) VALUES ($1) RETURNING id`,
        [titulo ?? 'Formulário de candidatura']
      );
      formulario_id = fRes.rows[0].id;

      for (let i = 0; i < campos_chaves.length; i++) {
        const tcRes = await client.query(
          `SELECT id FROM tipo_campo WHERE chave_unica = $1`, [campos_chaves[i]]
        );
        if (tcRes.rows.length > 0) {
          await client.query(
            `INSERT INTO campo_formulario (formulario_id, tipo_id, obrigatorio, ordem) VALUES ($1, $2, true, $3)`,
            [formulario_id, tcRes.rows[0].id, i + 1]
          );
        }
      }
    }

    const res = await client.query(
      `INSERT INTO processo_seletivo (projeto_id, formulario_id, titulo, descricao, data_inicio, data_termino, pdf_edital, n_vagas)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [projeto_id, formulario_id, titulo, descricao, data_inicio, data_termino, pdf_edital, n_vagas]
    );
    processoId = res.rows[0].id;

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }

  // Notifica discentes que favoritaram o projeto
  const favoritos = await query(
    `SELECT f.discente_id FROM favoritos f WHERE f.projeto_id = $1`,
    [projeto_id]
  );
  const projetoRow = await query(`SELECT titulo FROM projetos WHERE id = $1`, [projeto_id]);
  const projetoTitulo = projetoRow.rows[0]?.titulo ?? 'projeto';

  await Promise.all(
    favoritos.rows.map((f) =>
      criarNotificacao({
        discente_id: f.discente_id,
        titulo: 'Novo processo seletivo disponível',
        mensagem: `Um novo processo seletivo foi aberto para o projeto "${projetoTitulo}". Candidate-se agora!`,
        tipo: 'sistema',
      })
    )
  );

  return { id: processoId, formulario_id, titulo, status: 'aberto' };
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

  const { titulo, descricao, data_inicio, data_termino, pdf_edital, n_vagas, status, campos_chaves } = dados;

  // Se vieram campos padrão e o processo ainda não tem formulário, cria um
  if (Array.isArray(campos_chaves) && campos_chaves.length > 0) {
    const psRow = await query(`SELECT formulario_id FROM processo_seletivo WHERE id = $1`, [processoId]);
    let fid = psRow.rows[0]?.formulario_id;
    if (!fid) {
      const fRes = await query(`INSERT INTO formulario (titulo) VALUES ($1) RETURNING id`, [titulo ?? 'Formulário de candidatura']);
      fid = fRes.rows[0].id;
      await query(`UPDATE processo_seletivo SET formulario_id = $1 WHERE id = $2`, [fid, processoId]);
    }
    // Sincroniza campos padrão: remove todos os padrão e reinserindo os selecionados
    const camposPadrao = await query(`SELECT id FROM campo_formulario WHERE formulario_id = $1 AND label_override IS NULL`, [fid]);
    if (camposPadrao.rows.length > 0) {
      const ids = camposPadrao.rows.map((r) => r.id);
      await query(`DELETE FROM resposta_formulario WHERE campo_id = ANY($1::int[])`, [ids]);
      await query(`DELETE FROM campo_formulario WHERE id = ANY($1::int[])`, [ids]);
    }
    for (let i = 0; i < campos_chaves.length; i++) {
      const tcRes = await query(`SELECT id FROM tipo_campo WHERE chave_unica = $1`, [campos_chaves[i]]);
      if (tcRes.rows.length > 0) {
        await query(
          `INSERT INTO campo_formulario (formulario_id, tipo_id, obrigatorio, ordem) VALUES ($1, $2, true, $3)`,
          [fid, tcRes.rows[0].id, i + 1]
        );
      }
    }
  }

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

  if (status === 'encerrado' || status === 'cancelado') {
    const inscritos = await query(
      `SELECT i.discente_id, ps.titulo AS processo_titulo
       FROM inscricao i
       INNER JOIN processo_seletivo ps ON i.ps_id = ps.id
       WHERE i.ps_id = $1 AND i.status IN ('pendente', 'em_analise')`,
      [processoId]
    );
    await Promise.all(
      inscritos.rows.map((r) =>
        criarNotificacao({
          discente_id: r.discente_id,
          titulo: 'Processo seletivo encerrado',
          mensagem: `O processo seletivo "${r.processo_titulo}" foi encerrado antes de uma decisão sobre sua candidatura.`,
          tipo: 'sistema',
        })
      )
    );
  }

  const { rows } = await query(`SELECT formulario_id FROM processo_seletivo WHERE id = $1`, [processoId]);
  return { id: processoId, formulario_id: rows[0]?.formulario_id ?? null, atualizado: true };
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
           d.nome AS candidato_nome, d.matricula, d.curso, d.foto_url,
           COALESCE(
             (SELECT json_agg(json_build_object(
                'campo_id',   rf.campo_id,
                'label',      COALESCE(cf.label_override, tc.label),
                'tipo',       tc.tipo,
                'valor_texto',rf.valor_texto,
                'arquivo_url',rf.arquivo_url
              ) ORDER BY cf.ordem)
              FROM resposta_formulario rf
              INNER JOIN campo_formulario cf ON rf.campo_id = cf.id
              INNER JOIN tipo_campo tc ON cf.tipo_id = tc.id
              WHERE rf.inscricao_id = i.id),
             '[]'::json
           ) AS respostas
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

    // Notifica o docente do projeto sobre a nova candidatura
    const infoQuery = await query(`
      SELECT p.docente_id, p.titulo AS projeto_titulo, d.nome AS discente_nome
      FROM processo_seletivo ps
      INNER JOIN projetos p ON ps.projeto_id = p.id
      INNER JOIN discentes d ON d.id = $1
      WHERE ps.id = $2
    `, [discenteId, ps_id]);

    if (infoQuery.rows.length > 0) {
      const { docente_id, projeto_titulo, discente_nome } = infoQuery.rows[0];
      await criarNotificacao({
        docente_id,
        titulo: 'Nova candidatura recebida',
        mensagem: `${discente_nome} se inscreveu em um processo seletivo do projeto "${projeto_titulo}".`,
        tipo: 'inscricao',
      });
    }

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
    SELECT i.id, i.ps_id, i.data_inscricao, i.status,
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

    if (nota !== undefined || comentario !== undefined) {
      await client.query(
        `INSERT INTO avaliacao (id_inscricao, matr_docente, nota, comentario) VALUES ($1, $2, $3, $4)`,
        [inscricaoId, docenteId, nota ?? null, comentario ?? null]
      );
    }

    const updateColuna = coluna_kanban !== undefined ? coluna_kanban : 1;

    await client.query(
      `UPDATE inscricao SET status = $1, coluna_kanban = $2 WHERE id = $3`,
      [novo_status, updateColuna, inscricaoId]
    );

    await client.query("COMMIT");

    // Notifica o discente se a decisão for definitiva
    if (novo_status === 'aprovado' || novo_status === 'reprovado') {
      const infoQuery = await query(`
        SELECT i.discente_id, p.titulo AS projeto_titulo
        FROM inscricao i
        INNER JOIN processo_seletivo ps ON i.ps_id = ps.id
        INNER JOIN projetos p ON ps.projeto_id = p.id
        WHERE i.id = $1
      `, [inscricaoId]);

      if (infoQuery.rows.length > 0) {
        const { discente_id, projeto_titulo } = infoQuery.rows[0];
        const aprovado = novo_status === 'aprovado';
        await criarNotificacao({
          discente_id,
          titulo: aprovado ? 'Candidatura aprovada!' : 'Resultado da seleção',
          mensagem: aprovado
            ? `Parabéns! Sua candidatura ao projeto "${projeto_titulo}" foi aprovada.`
            : `Sua candidatura ao projeto "${projeto_titulo}" não foi aprovada nesta rodada.`,
          tipo: 'selecao',
        });
      }
    }
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const obterProcesso = async (processoId) => {
  const { rows } = await query(
    `SELECT id, projeto_id, formulario_id, titulo, descricao, data_inicio, data_termino, status, n_vagas, criado_em
     FROM processo_seletivo WHERE id = $1`,
    [processoId]
  );
  if (!rows[0]) throw new Error("Processo seletivo não encontrado.");
  return rows[0];
};

const listarProcessosDoProjeto = async (projetoId) => {
  const { rows } = await query(
    `SELECT id, formulario_id, titulo, descricao, data_inicio, data_termino, status, n_vagas
     FROM processo_seletivo WHERE projeto_id = $1 AND status = 'aberto'
     ORDER BY criado_em DESC`,
    [projetoId]
  );
  return rows;
};

module.exports = {
  criarProcesso,
  atualizarProcesso,
  listarCandidatos,
  realizarInscricao,
  listarInscricoesDiscente,
  obterDetalhesInscricao,
  avaliarInscricao,
  obterProcesso,
  listarProcessosDoProjeto,
};