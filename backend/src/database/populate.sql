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
