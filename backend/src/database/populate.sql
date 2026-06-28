-- ============================================================
-- PAVE — Dados de teste
-- Senha de todos os usuários de teste: Senha@123
-- ============================================================

-- ── tipo_campo ───────────────────────────────────────────────
INSERT INTO tipo_campo (chave_unica, label, tipo, obrigatoriedade) VALUES
    ('curriculo',           'Currículo (PDF)',               'arquivo',     false),
    ('historico_acad',      'Histórico Acadêmico (PDF)',     'arquivo',     false),
    ('carta_motivacao',     'Carta de Motivação',            'texto_longo', false),
    ('coeficiente_rend',    'Coeficiente de Rendimento',     'numero',      false),
    ('periodo_cursando',    'Período Atual',                 'numero',      false),
    ('disponibilidade',     'Disponibilidade Semanal (h)',   'numero',      false),
    ('experiencia_previa',  'Experiência Prévia na Área',    'texto_longo', false),
    ('linkedin',            'Link do LinkedIn',              'texto',       false),
    ('portfolio',           'Link de Portfólio / GitHub',    'texto',       false),
    ('declaracao_matricula','Declaração de Matrícula (PDF)', 'arquivo',     false),
    ('campo_texto',         'Resposta curta',               'texto',       false),
    ('campo_texto_longo',   'Parágrafo',                    'texto_longo', false),
    ('campo_selecao',       'Múltipla escolha',             'selecao',     false)
ON CONFLICT (chave_unica) DO NOTHING;

-- ============================================================
DO $$
DECLARE
  -- IDs fixos para referência cruzada
  uid_doc1  UUID := 'a0000001-0000-4000-8000-000000000001';
  uid_doc2  UUID := 'a0000001-0000-4000-8000-000000000002';
  uid_dis1  UUID := 'b0000002-0000-4000-8000-000000000001';
  uid_dis2  UUID := 'b0000002-0000-4000-8000-000000000002';
  uid_dis3  UUID := 'b0000002-0000-4000-8000-000000000003';

  -- projetos
  pid1 UUID := 'c0000003-0000-4000-8000-000000000001';
  pid2 UUID := 'c0000003-0000-4000-8000-000000000002';
  pid3 UUID := 'c0000003-0000-4000-8000-000000000003';
  pid4 UUID := 'c0000003-0000-4000-8000-000000000004';
  pid5 UUID := 'c0000003-0000-4000-8000-000000000005';
  pid6 UUID := 'c0000003-0000-4000-8000-000000000006';

  -- tags
  tid1 UUID := 'd0000004-0000-4000-8000-000000000001';
  tid2 UUID := 'd0000004-0000-4000-8000-000000000002';
  tid3 UUID := 'd0000004-0000-4000-8000-000000000003';
  tid4 UUID := 'd0000004-0000-4000-8000-000000000004';
  tid5 UUID := 'd0000004-0000-4000-8000-000000000005';
  tid6 UUID := 'd0000004-0000-4000-8000-000000000006';

  -- formulários
  fid1 UUID := 'e0000005-0000-4000-8000-000000000001';
  fid2 UUID := 'e0000005-0000-4000-8000-000000000002';

  -- processos seletivos
  psid1 UUID := 'f0000006-0000-4000-8000-000000000001';
  psid2 UUID := 'f0000006-0000-4000-8000-000000000002';
  psid3 UUID := 'f0000006-0000-4000-8000-000000000003';
  psid4 UUID := 'f0000006-0000-4000-8000-000000000004';
  psid5 UUID := 'f0000006-0000-4000-8000-000000000005';

  -- inscrições
  iid1 UUID := '10000007-0000-4000-8000-000000000001';
  iid2 UUID := '10000007-0000-4000-8000-000000000002';
  iid3 UUID := '10000007-0000-4000-8000-000000000003';
  iid4 UUID := '10000007-0000-4000-8000-000000000004';
  iid5 UUID := '10000007-0000-4000-8000-000000000005';
  iid6 UUID := '10000007-0000-4000-8000-000000000006';

  -- tipo_campo ids (buscados pelo chave_unica)
  tc_curriculo   UUID;
  tc_carta       UUID;
  tc_historico   UUID;
  tc_periodo     UUID;
  tc_linkedin    UUID;

  -- campo_formulario ids
  cfid1 UUID := '20000008-0000-4000-8000-000000000001';
  cfid2 UUID := '20000008-0000-4000-8000-000000000002';
  cfid3 UUID := '20000008-0000-4000-8000-000000000003';
  cfid4 UUID := '20000008-0000-4000-8000-000000000004';
  cfid5 UUID := '20000008-0000-4000-8000-000000000005';

  senha_hash TEXT;

BEGIN
  senha_hash := crypt('Senha@123', gen_salt('bf', 12));

  -- ── usuarios ────────────────────────────────────────────────
  INSERT INTO usuarios (id, email, senha, tipo) VALUES
    (uid_doc1, 'prof.ana@pave.ufc.br',    senha_hash, 'docente'),
    (uid_doc2, 'prof.carlos@pave.ufc.br', senha_hash, 'docente'),
    (uid_dis1, 'joao.silva@pave.ufc.br',  senha_hash, 'discente'),
    (uid_dis2, 'maria.lima@pave.ufc.br',  senha_hash, 'discente'),
    (uid_dis3, 'pedro.costa@pave.ufc.br', senha_hash, 'discente')
  ON CONFLICT (email) DO NOTHING;

  -- ── docentes ────────────────────────────────────────────────
  INSERT INTO docentes (id, matricula, nome, telefone, departamento, bio, linkedin) VALUES
    (uid_doc1, 'SIAPE001', 'Ana Beatriz Ferreira',  '(85) 98800-0001', 'Departamento de Computação',
     'Professora pesquisadora na área de Inteligência Artificial e Aprendizado de Máquina.',
     'https://linkedin.com/in/ana-beatriz-ferreira'),
    (uid_doc2, 'SIAPE002', 'Carlos Eduardo Mendes', '(85) 98800-0002', 'Departamento de Engenharia de Software',
     'Especialista em segurança de sistemas e arquitetura de software distribuído.',
     NULL)
  ON CONFLICT (id) DO NOTHING;

  -- ── discentes ───────────────────────────────────────────────
  INSERT INTO discentes (id, matricula, nome, telefone, curso, bio, semestre, disponibilidade, remoto, interesses) VALUES
    (uid_dis1, '2021001001', 'João Victor Silva',   '(85) 99900-0001', 'Ciência da Computação',
     'Apaixonado por dados e IA. Busco experiência em projetos de pesquisa aplicada.',
     6, 'tarde', true, ARRAY['Machine Learning', 'Python', 'Data Science']),
    (uid_dis2, '2021001002', 'Maria Clara Lima',    '(85) 99900-0002', 'Engenharia de Software',
     'Desenvolvedora full-stack com interesse em segurança e arquitetura de sistemas.',
     7, 'manha', false, ARRAY['Segurança da Informação', 'Backend', 'APIs REST']),
    (uid_dis3, '2022001003', 'Pedro Henrique Costa', '(85) 99900-0003', 'Sistemas de Informação',
     NULL, 4, NULL, false, NULL)
  ON CONFLICT (id) DO NOTHING;

  -- ── tags ────────────────────────────────────────────────────
  INSERT INTO tag (id, nome) VALUES
    (tid1, 'Machine Learning'),
    (tid2, 'Desenvolvimento Web'),
    (tid3, 'Banco de Dados'),
    (tid4, 'Segurança da Informação'),
    (tid5, 'Redes de Computadores'),
    (tid6, 'Inteligência Artificial')
  ON CONFLICT (nome) DO NOTHING;

  -- ── projetos ────────────────────────────────────────────────
  INSERT INTO projetos (id, docente_id, titulo, descricao, carga_hora, data_inic, data_termino, status, centro_dep) VALUES
    (pid1, uid_doc1,
     'Análise de Dados Educacionais com Machine Learning',
     'Pesquisa aplicada ao uso de algoritmos de ML para identificar padrões de evasão em cursos universitários. O projeto envolve coleta, pré-processamento e modelagem de dados institucionais.',
     20, '2026-03-01', '2026-12-31', 'ativo', 'Centro de Ciências'),

    (pid2, uid_doc1,
     'Plataforma de Gestão de Projetos de Extensão',
     'Desenvolvimento de um sistema web para gerenciar projetos de extensão universitária, integrando docentes, discentes e a comunidade externa.',
     16, '2026-02-01', '2026-11-30', 'ativo', 'Centro de Tecnologia'),

    (pid3, uid_doc2,
     'Detecção de Intrusão em Redes com Deep Learning',
     'Projeto de pesquisa voltado à construção de modelos de redes neurais para identificação de ataques cibernéticos em ambientes de rede corporativa.',
     20, '2026-04-01', '2026-12-31', 'ativo', 'Centro de Tecnologia'),

    (pid4, uid_doc2,
     'Banco de Dados Distribuído para IoT',
     'Estudo e implementação de arquitetura de banco de dados distribuído para suportar dispositivos IoT em larga escala, com foco em consistência e disponibilidade.',
     12, '2025-08-01', '2026-06-30', 'encerrado', 'Centro de Tecnologia'),

    (pid5, uid_doc1,
     'Chatbot de Suporte ao Estudante com NLP',
     'Desenvolvimento de um assistente virtual baseado em processamento de linguagem natural para responder dúvidas frequentes de alunos sobre vida acadêmica.',
     16, '2026-05-01', '2026-12-31', 'ativo', 'Centro de Ciências'),

    (pid6, uid_doc2,
     'Segurança em APIs REST: Boas Práticas e Auditoria',
     'Projeto de pesquisa e extensão para levantamento de vulnerabilidades comuns em APIs REST, com produção de guia de boas práticas e ferramenta de auditoria automatizada.',
     12, NULL, NULL, 'rascunho', 'Centro de Tecnologia')
  ON CONFLICT (id) DO NOTHING;

  -- ── projeto_tag ──────────────────────────────────────────────
  INSERT INTO projeto_tag (projeto_id, tag_id) VALUES
    (pid1, tid1), (pid1, tid6),
    (pid2, tid2), (pid2, tid3),
    (pid3, tid4), (pid3, tid6),
    (pid4, tid3), (pid4, tid5),
    (pid5, tid6), (pid5, tid2),
    (pid6, tid4)
  ON CONFLICT DO NOTHING;

  -- ── formulários ──────────────────────────────────────────────
  INSERT INTO formulario (id, titulo, descricao) VALUES
    (fid1, 'Formulário de Candidatura — Pesquisa',
     'Formulário padrão para candidatura em projetos de pesquisa. Inclui currículo, histórico e carta de motivação.'),
    (fid2, 'Formulário de Candidatura — Extensão',
     'Formulário voltado a projetos de extensão. Foca em disponibilidade e experiência prévia.')
  ON CONFLICT (id) DO NOTHING;

  -- busca ids dos tipos de campo
  SELECT id INTO tc_curriculo  FROM tipo_campo WHERE chave_unica = 'curriculo';
  SELECT id INTO tc_carta      FROM tipo_campo WHERE chave_unica = 'carta_motivacao';
  SELECT id INTO tc_historico  FROM tipo_campo WHERE chave_unica = 'historico_acad';
  SELECT id INTO tc_periodo    FROM tipo_campo WHERE chave_unica = 'periodo_cursando';
  SELECT id INTO tc_linkedin   FROM tipo_campo WHERE chave_unica = 'linkedin';

  -- ── campos de formulário ─────────────────────────────────────
  INSERT INTO campo_formulario (id, formulario_id, tipo_id, obrigatorio, ordem) VALUES
    (cfid1, fid1, tc_curriculo,  true,  1),
    (cfid2, fid1, tc_historico,  true,  2),
    (cfid3, fid1, tc_carta,      false, 3),
    (cfid4, fid2, tc_carta,      true,  1),
    (cfid5, fid2, tc_periodo,    true,  2)
  ON CONFLICT (id) DO NOTHING;

  -- ── processos seletivos ──────────────────────────────────────
  INSERT INTO processo_seletivo (id, projeto_id, formulario_id, titulo, descricao, data_inicio, data_termino, status, n_vagas) VALUES
    (psid1, pid1, fid1,
     'Seleção de Bolsistas — ML Educacional 2026.1',
     'Processo seletivo para 3 vagas de bolsista no projeto de análise de dados educacionais. Exige conhecimento em Python e estatística.',
     '2026-03-01', '2026-03-31', 'encerrado', 3),

    (psid2, pid2, fid2,
     'Seleção de Voluntários — Plataforma de Extensão',
     'Busca de 4 voluntários para auxiliar no desenvolvimento frontend e backend da plataforma de gestão de extensão.',
     '2026-04-01', '2026-04-30', 'aberto', 4),

    (psid3, pid3, fid1,
     'Seleção de Pesquisadores — Segurança em Redes',
     'Vagas para 2 bolsistas com foco em machine learning aplicado à segurança cibernética.',
     '2026-04-15', '2026-05-15', 'aberto', 2),

    (psid4, pid5, fid2,
     'Seleção para Equipe de NLP',
     'Processo para integrar 3 discentes ao projeto de chatbot. Desejável experiência com Python e APIs.',
     '2026-05-01', '2026-05-31', 'aberto', 3),

    (psid5, pid1, fid1,
     'Seleção Complementar — ML Educacional 2026.2',
     'Segunda rodada de seleção para reforço da equipe no segundo semestre.',
     '2026-07-01', '2026-07-31', 'aberto', 2)
  ON CONFLICT (id) DO NOTHING;

  -- ── inscrições ───────────────────────────────────────────────
  INSERT INTO inscricao (id, ps_id, discente_id, status, coluna_kanban) VALUES
    (iid1, psid1, uid_dis1, 'aprovado',    3),
    (iid2, psid1, uid_dis2, 'reprovado',   4),
    (iid3, psid2, uid_dis1, 'em_analise',  2),
    (iid4, psid2, uid_dis3, 'pendente',    1),
    (iid5, psid3, uid_dis2, 'em_analise',  2),
    (iid6, psid4, uid_dis3, 'em_analise',  2)
  ON CONFLICT (id) DO NOTHING;

  -- ── notificações ─────────────────────────────────────────────
  INSERT INTO notificacao (docente_id, discente_id, titulo, mensagem, tipo, lida) VALUES
    (NULL,     uid_dis1, 'Candidatura aprovada!',
     'Parabéns! Sua candidatura ao projeto "Análise de Dados Educacionais com Machine Learning" foi aprovada.',
     'selecao', false),

    (NULL,     uid_dis2, 'Resultado da seleção',
     'Infelizmente sua candidatura ao projeto "Análise de Dados Educacionais com Machine Learning" não foi aprovada nesta rodada.',
     'selecao', true),

    (uid_doc1, NULL,     'Nova candidatura recebida',
     'João Victor Silva se inscreveu no processo "Seleção de Voluntários — Plataforma de Extensão".',
     'inscricao', false),

    (uid_doc2, NULL,     'Nova candidatura recebida',
     'Maria Clara Lima se inscreveu no processo "Seleção de Pesquisadores — Segurança em Redes".',
     'inscricao', false),

    (NULL,     uid_dis3, 'Nova vaga disponível',
     'Um novo processo seletivo foi aberto para o projeto "Chatbot de Suporte ao Estudante com NLP". Candidate-se até 31/05.',
     'sistema', false),

    (uid_doc1, NULL,     'Processo seletivo encerrado',
     'O processo "Seleção de Bolsistas — ML Educacional 2026.1" foi encerrado automaticamente com 2 candidatos.',
     'sistema', true);

END $$;
