CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE tipo_usuario AS ENUM ('discente', 'docente', 'administrador');

-- Tabela central de autenticação. O id é gerado aqui e herdado por docentes e discentes.
CREATE TABLE usuarios (
    id      UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    email   VARCHAR(150) UNIQUE NOT NULL,
    senha   VARCHAR(255) NOT NULL,
    tipo    tipo_usuario NOT NULL
);

CREATE TABLE docentes (
    id            UUID         PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
    matricula     VARCHAR(20)  UNIQUE NOT NULL,
    nome          VARCHAR(150) NOT NULL,
    telefone      VARCHAR(20),
    departamento  VARCHAR(150),
    foto_url      TEXT,
    bio           TEXT,
    linkedin      VARCHAR(255),
    ativo         BOOLEAN      NOT NULL DEFAULT TRUE,
    criado_em     TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE discentes (
    id              UUID         PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
    matricula       VARCHAR(20)  UNIQUE NOT NULL,
    nome            VARCHAR(150) NOT NULL,
    telefone        VARCHAR(20),
    curso           VARCHAR(150),
    foto_url        TEXT,
    curriculo_url   TEXT,
    bio             TEXT,
    data_nascimento DATE,
    semestre        SMALLINT     CHECK (semestre BETWEEN 1 AND 20),
    ano_conclusao   SMALLINT,
    linkedin        VARCHAR(255),
    disponibilidade VARCHAR(20)  CHECK (disponibilidade IN ('manha', 'tarde', 'noite', 'integral')),
    remoto          BOOLEAN      NOT NULL DEFAULT FALSE,
    notificacoes    BOOLEAN      NOT NULL DEFAULT TRUE,
    interesses      TEXT[],
    ativo           BOOLEAN      NOT NULL DEFAULT TRUE,
    criado_em       TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE projetos (
    id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    docente_id    UUID         NOT NULL REFERENCES docentes(id) ON DELETE RESTRICT,
    titulo        VARCHAR(200) NOT NULL,
    descricao     TEXT,
    carga_hora    INTEGER      CHECK (carga_hora > 0),
    data_inic     DATE,
    data_termino  DATE,
    status        VARCHAR(30)  NOT NULL DEFAULT 'rascunho'
                               CHECK (status IN ('rascunho', 'ativo', 'encerrado', 'suspenso')),
    centro_dep    VARCHAR(150),
    criado_em     TIMESTAMP    NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_datas_projeto CHECK (data_termino IS NULL OR data_termino >= data_inic)
);

CREATE TABLE tag (
    id         UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    atributo_1 VARCHAR(100),
    nome       VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE projeto_tag (
    projeto_id UUID NOT NULL REFERENCES projetos(id) ON DELETE CASCADE,
    tag_id     UUID NOT NULL REFERENCES tag(id)      ON DELETE CASCADE,
    PRIMARY KEY (projeto_id, tag_id)
);

-- Projetos favoritados por discentes
CREATE TABLE favoritos (
    discente_id UUID NOT NULL REFERENCES discentes(id) ON DELETE CASCADE,
    projeto_id  UUID NOT NULL REFERENCES projetos(id)  ON DELETE CASCADE,
    criado_em   TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (discente_id, projeto_id)
);

CREATE TABLE tipo_campo (
    id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    chave_unica    VARCHAR(60) UNIQUE NOT NULL,
    label          VARCHAR(150) NOT NULL,
    tipo           VARCHAR(30) NOT NULL
                               CHECK (tipo IN ('arquivo', 'texto', 'texto_longo', 'numero', 'selecao', 'data')),
    obrigatoriedade BOOLEAN    NOT NULL DEFAULT FALSE
);

CREATE TABLE formulario (
    id        UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    id_ps     UUID,
    titulo    VARCHAR(200) NOT NULL,
    descricao TEXT,
    criado_em TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE campo_formulario (
    id             UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    formulario_id  UUID         NOT NULL REFERENCES formulario(id) ON DELETE CASCADE,
    tipo_id        UUID         NOT NULL REFERENCES tipo_campo(id) ON DELETE RESTRICT,
    label_override VARCHAR(200),
    opcoes         JSONB,
    obrigatorio    BOOLEAN      NOT NULL DEFAULT FALSE,
    ordem          INTEGER      NOT NULL DEFAULT 1
);

-- Campos padrão (sem label_override) continuam únicos por formulário;
-- perguntas personalizadas podem reutilizar o mesmo tipo_id.
CREATE UNIQUE INDEX campo_formulario_std_unique
    ON campo_formulario (formulario_id, tipo_id)
    WHERE label_override IS NULL;

CREATE TABLE processo_seletivo (
    id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    projeto_id    UUID         NOT NULL REFERENCES projetos(id)  ON DELETE RESTRICT,
    formulario_id UUID         REFERENCES formulario(id)         ON DELETE SET NULL,
    titulo        VARCHAR(200) NOT NULL,
    descricao     TEXT,
    data_inicio   DATE,
    data_termino  DATE,
    status        VARCHAR(30)  NOT NULL DEFAULT 'aberto'
                               CHECK (status IN ('aberto', 'encerrado', 'cancelado')),
    pdf_edital    VARCHAR(500),
    n_vagas       INTEGER      CHECK (n_vagas > 0),
    criado_em     TIMESTAMP    NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_datas_ps CHECK (data_termino IS NULL OR data_termino >= data_inicio)
);

CREATE TABLE inscricao (
    id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    ps_id          UUID        NOT NULL REFERENCES processo_seletivo(id) ON DELETE RESTRICT,
    discente_id    UUID        NOT NULL REFERENCES discentes(id)         ON DELETE RESTRICT,
    data_inscricao TIMESTAMP   NOT NULL DEFAULT NOW(),
    status         VARCHAR(30) NOT NULL DEFAULT 'pendente'
                               CHECK (status IN ('pendente', 'em_analise', 'aprovado', 'reprovado', 'desistencia')),
    coluna_kanban  INTEGER     NOT NULL DEFAULT 1,
    obs            TEXT,

    UNIQUE (ps_id, discente_id)
);

CREATE TABLE resposta_formulario (
    id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    inscricao_id UUID         NOT NULL REFERENCES inscricao(id)        ON DELETE CASCADE,
    campo_id     UUID         NOT NULL REFERENCES campo_formulario(id) ON DELETE RESTRICT,
    valor_texto  TEXT,
    arquivo_url  VARCHAR(500),

    UNIQUE (inscricao_id, campo_id),

    CONSTRAINT chk_resposta CHECK (
        valor_texto IS NOT NULL OR arquivo_url IS NOT NULL
    )
);

CREATE TABLE avaliacao (
    id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    id_inscricao UUID         NOT NULL REFERENCES inscricao(id) ON DELETE CASCADE,
    matr_docente UUID         NOT NULL REFERENCES docentes(id)  ON DELETE RESTRICT,
    nota         NUMERIC(4,2) CHECK (nota >= 0 AND nota <= 10),
    comentario   TEXT,
    avaliado_em  TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE certificado (
    id               UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    inscricao_id     UUID         UNIQUE REFERENCES inscricao(id)  ON DELETE RESTRICT,
    discente_id      UUID         NOT NULL REFERENCES discentes(id) ON DELETE RESTRICT,
    projeto_id       UUID         NOT NULL REFERENCES projetos(id)  ON DELETE RESTRICT,
    codigo_validacao VARCHAR(100) UNIQUE NOT NULL DEFAULT gen_random_uuid()::TEXT,
    emitido_em       TIMESTAMP    NOT NULL DEFAULT NOW(),
    carga_horaria    INTEGER      CHECK (carga_horaria > 0),
    arquivo_url      VARCHAR(500)
);

CREATE TABLE notificacao (
    id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    docente_id  UUID         REFERENCES docentes(id)  ON DELETE CASCADE,
    discente_id UUID         REFERENCES discentes(id) ON DELETE CASCADE,
    titulo      VARCHAR(200) NOT NULL,
    mensagem    TEXT         NOT NULL,
    tipo        VARCHAR(30)  NOT NULL
                             CHECK (tipo IN ('inscricao', 'selecao', 'certificado', 'sistema')),
    lida        BOOLEAN      NOT NULL DEFAULT FALSE,
    criado_em   TIMESTAMP    NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_notif_destinatario CHECK (
        docente_id IS NOT NULL OR discente_id IS NOT NULL
    )
);

-- Token de redefinição de senha com expiração e controle de uso
CREATE TABLE password_reset_tokens (
    id         UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID         NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    token      VARCHAR(255) UNIQUE NOT NULL,
    expira_em  TIMESTAMP    NOT NULL,
    usado      BOOLEAN      NOT NULL DEFAULT FALSE
);

-- Índices
CREATE INDEX idx_projetos_docente      ON projetos(docente_id);
CREATE INDEX idx_projetos_status       ON projetos(status);
CREATE INDEX idx_ps_projeto            ON processo_seletivo(projeto_id);
CREATE INDEX idx_ps_status             ON processo_seletivo(status);
CREATE INDEX idx_inscricao_ps          ON inscricao(ps_id);
CREATE INDEX idx_inscricao_discente    ON inscricao(discente_id);
CREATE INDEX idx_inscricao_status      ON inscricao(status);
CREATE INDEX idx_campo_form_formulario ON campo_formulario(formulario_id);
CREATE INDEX idx_resposta_inscricao    ON resposta_formulario(inscricao_id);
CREATE INDEX idx_avaliacao_inscricao   ON avaliacao(id_inscricao);
CREATE INDEX idx_notif_discente        ON notificacao(discente_id);
CREATE INDEX idx_notif_docente         ON notificacao(docente_id);
CREATE INDEX idx_favoritos_discente    ON favoritos(discente_id);
CREATE INDEX idx_prt_usuario           ON password_reset_tokens(usuario_id);

ALTER TABLE formulario
    ADD CONSTRAINT fk_formulario_ps
    FOREIGN KEY (id_ps) REFERENCES processo_seletivo(id) ON DELETE SET NULL;