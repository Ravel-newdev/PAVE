CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE docentes (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    matricula     VARCHAR(20) UNIQUE NOT NULL,
    nome          VARCHAR(150) NOT NULL,
    email         VARCHAR(150) UNIQUE NOT NULL,
    telefone      VARCHAR(20),
    departamento  VARCHAR(150),
    senha         VARCHAR(255) NOT NULL,
    ativo         BOOLEAN     NOT NULL DEFAULT TRUE,
    criado_em     TIMESTAMP   NOT NULL DEFAULT NOW()
);

CREATE TABLE discentes (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    matricula     VARCHAR(20) UNIQUE NOT NULL,
    nome          VARCHAR(150) NOT NULL,
    email         VARCHAR(150) UNIQUE NOT NULL,
    telefone      VARCHAR(20),
    curso         VARCHAR(150),
    senha         VARCHAR(255) NOT NULL,
    ativo         BOOLEAN     NOT NULL DEFAULT TRUE,
    criado_em     TIMESTAMP   NOT NULL DEFAULT NOW()
);

CREATE TABLE projetos (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    docente_id    UUID        NOT NULL REFERENCES docentes(id) ON DELETE RESTRICT,
    titulo        VARCHAR(200) NOT NULL,
    descricao          TEXT,
    carga_hora    INTEGER     CHECK (carga_hora > 0),
    data_inic     DATE,
    data_termino  DATE,
    status        VARCHAR(30) NOT NULL DEFAULT 'rascunho'
                              CHECK (status IN ('rascunho', 'ativo', 'encerrado', 'suspenso')),
    centro_dep    VARCHAR(150),
    criado_em     TIMESTAMP   NOT NULL DEFAULT NOW(),
 
    CONSTRAINT chk_datas_projeto CHECK (data_termino IS NULL OR data_termino >= data_inic)
);

CREATE TABLE tag (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    atributo_1    VARCHAR(100),           -- atributo_1 conforme DER
    nome          VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE projeto_tag (
    projeto_id    UUID NOT NULL REFERENCES projetos(id) ON DELETE CASCADE,
    tag_id        UUID NOT NULL REFERENCES tag(id)      ON DELETE CASCADE,
    PRIMARY KEY (projeto_id, tag_id)
);

CREATE TABLE tipo_campo (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    chave_unica         VARCHAR(60) UNIQUE NOT NULL,   -- ex: 'curriculo', 'historico_acad'
    label               VARCHAR(150) NOT NULL,          -- ex: 'Currículo (PDF)'
    tipo                VARCHAR(30) NOT NULL
                                    CHECK (tipo IN ('arquivo', 'texto', 'texto_longo', 'numero', 'selecao', 'data')),
    obrigatoriedade     BOOLEAN     NOT NULL DEFAULT FALSE  -- sugestão de padrão
);

CREATE TABLE formulario (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    id_ps         UUID,                                 -- preenchido após criar o P.S.
    titulo        VARCHAR(200) NOT NULL,
    descricao          TEXT,
    criado_em     TIMESTAMP   NOT NULL DEFAULT NOW()
);

CREATE TABLE campo_formulario (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    formulario_id UUID        NOT NULL REFERENCES formulario(id) ON DELETE CASCADE,
    tipo_id       UUID        NOT NULL REFERENCES tipo_campo(id) ON DELETE RESTRICT,
    obrigatorio   BOOLEAN     NOT NULL DEFAULT FALSE,
    ordem         INTEGER     NOT NULL DEFAULT 1,
 
    UNIQUE (formulario_id, tipo_id)    -- mesmo tipo não pode aparecer duas vezes no mesmo form
);

CREATE TABLE processo_seletivo (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    projeto_id    UUID        NOT NULL REFERENCES projetos(id)   ON DELETE RESTRICT,
    formulario_id UUID        REFERENCES formulario(id)          ON DELETE SET NULL,
    titulo        VARCHAR(200) NOT NULL,
    descricao          TEXT,
    data_inicio   DATE,
    data_termino  DATE,
    status        VARCHAR(30) NOT NULL DEFAULT 'aberto'
                              CHECK (status IN ('aberto', 'encerrado', 'cancelado')),
    pdf_edital    VARCHAR(500),
    n_vagas       INTEGER     CHECK (n_vagas > 0),
    criado_em     TIMESTAMP   NOT NULL DEFAULT NOW(),
 
    CONSTRAINT chk_datas_ps CHECK (data_termino IS NULL OR data_termino >= data_inicio)
);

CREATE TABLE inscricao (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    ps_id           UUID        NOT NULL REFERENCES processo_seletivo(id) ON DELETE RESTRICT,
    discente_id     UUID        NOT NULL REFERENCES discentes(id)         ON DELETE RESTRICT,
    data_inscricao  TIMESTAMP   NOT NULL DEFAULT NOW(),
    status          VARCHAR(30) NOT NULL DEFAULT 'pendente'
                                CHECK (status IN ('pendente', 'em_analise', 'aprovado', 'reprovado', 'desistencia')),
    coluna_kanban   INTEGER     NOT NULL DEFAULT 1,
    obs             TEXT,
 
    UNIQUE (ps_id, discente_id)   -- um discente só pode se inscrever uma vez por P.S.
);

CREATE TABLE resposta_formulario (
    id                  UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
    inscricao_id        UUID  NOT NULL REFERENCES inscricao(id)        ON DELETE CASCADE,
    campo_id            UUID  NOT NULL REFERENCES campo_formulario(id) ON DELETE RESTRICT,
    valor_texto         TEXT,
    arquivo_url         VARCHAR(500),
 
    UNIQUE (inscricao_id, campo_id),  -- uma resposta por campo por inscrição
 
    CONSTRAINT chk_resposta CHECK (
        valor_texto IS NOT NULL OR arquivo_url IS NOT NULL
    )
);

CREATE TABLE avaliacao (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    id_inscricao    UUID        NOT NULL REFERENCES inscricao(id)  ON DELETE CASCADE,
    matr_docente    UUID        NOT NULL REFERENCES docentes(id)   ON DELETE RESTRICT,
    nota            NUMERIC(4,2) CHECK (nota >= 0 AND nota <= 10),
    comentario      TEXT,
    avaliado_em     TIMESTAMP   NOT NULL DEFAULT NOW()
);

CREATE TABLE certificado (
    id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    inscricao_id      UUID        UNIQUE REFERENCES inscricao(id)  ON DELETE RESTRICT,
    discente_id       UUID        NOT NULL REFERENCES discentes(id) ON DELETE RESTRICT,
    projeto_id        UUID        NOT NULL REFERENCES projetos(id)  ON DELETE RESTRICT,
    codigo_validacao  VARCHAR(100) UNIQUE NOT NULL DEFAULT gen_random_uuid()::TEXT,
    emitido_em        TIMESTAMP   NOT NULL DEFAULT NOW(),
    carga_horaria     INTEGER     CHECK (carga_horaria > 0),
    arquivo_url       VARCHAR(500)
);

CREATE TABLE notificacao (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    docente_id    UUID        REFERENCES docentes(id)  ON DELETE CASCADE,
    discente_id   UUID        REFERENCES discentes(id) ON DELETE CASCADE,
    titulo        VARCHAR(200) NOT NULL,
    mensagem      TEXT        NOT NULL,
    tipo          VARCHAR(30) NOT NULL
                              CHECK (tipo IN ('inscricao', 'selecao', 'certificado', 'sistema')),
    lida          BOOLEAN     NOT NULL DEFAULT FALSE,
    criado_em     TIMESTAMP   NOT NULL DEFAULT NOW(),
 
    CONSTRAINT chk_notif_destinatario CHECK (
        docente_id IS NOT NULL OR discente_id IS NOT NULL
    )
);

CREATE INDEX idx_projetos_docente       ON projetos(docente_id);
CREATE INDEX idx_projetos_status        ON projetos(status);
CREATE INDEX idx_ps_projeto             ON processo_seletivo(projeto_id);
CREATE INDEX idx_ps_status              ON processo_seletivo(status);
CREATE INDEX idx_inscricao_ps           ON inscricao(ps_id);
CREATE INDEX idx_inscricao_discente     ON inscricao(discente_id);
CREATE INDEX idx_inscricao_status       ON inscricao(status);
CREATE INDEX idx_campo_form_formulario  ON campo_formulario(formulario_id);
CREATE INDEX idx_resposta_inscricao     ON resposta_formulario(inscricao_id);
CREATE INDEX idx_avaliacao_inscricao    ON avaliacao(id_inscricao);
CREATE INDEX idx_notif_discente         ON notificacao(discente_id);
CREATE INDEX idx_notif_docente          ON notificacao(docente_id);

ALTER TABLE formulario
    ADD CONSTRAINT fk_formulario_ps
    FOREIGN KEY (id_ps) REFERENCES processo_seletivo(id) ON DELETE SET NULL;

--==Povopamento==
INSERT INTO tipo_campo (chave_unica, label, tipo, obrigatoriedade) VALUES
    ('curriculo',          'Currículo (PDF)',               'arquivo',     false),
    ('historico_acad',     'Histórico Acadêmico (PDF)',     'arquivo',     false),
    ('carta_motivacao',    'Carta de Motivação',            'texto_longo', false),
    ('coeficiente_rend',   'Coeficiente de Rendimento',     'numero',      false),
    ('periodo_cursando',   'Período Atual',                 'numero',      false),
    ('disponibilidade',    'Disponibilidade Semanal (h)',   'numero',      false),
    ('experiencia_previa', 'Experiência Prévia na Área',    'texto_longo', false),
    ('linkedin',           'Link do LinkedIn',              'texto',       false),
    ('portfolio',          'Link de Portfólio / GitHub',    'texto',       false),
    ('declaracao_matricula','Declaração de Matrícula (PDF)','arquivo',     false);
