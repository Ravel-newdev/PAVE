-- Migração: suporte a perguntas personalizadas no formulário

ALTER TABLE campo_formulario
  ADD COLUMN IF NOT EXISTS label_override VARCHAR(200),
  ADD COLUMN IF NOT EXISTS opcoes         JSONB;

-- Remove constraint única absoluta e substitui por índice parcial
-- (campos padrão continuam únicos por formulário; personalizados podem repetir tipo)
ALTER TABLE campo_formulario
  DROP CONSTRAINT IF EXISTS campo_formulario_formulario_id_tipo_id_key;

CREATE UNIQUE INDEX IF NOT EXISTS campo_formulario_std_unique
  ON campo_formulario (formulario_id, tipo_id)
  WHERE label_override IS NULL;

-- Tipos genéricos para perguntas personalizadas
INSERT INTO tipo_campo (chave_unica, label, tipo, obrigatoriedade) VALUES
  ('campo_texto',       'Resposta curta',   'texto',       false),
  ('campo_texto_longo', 'Parágrafo',        'texto_longo', false),
  ('campo_selecao',     'Múltipla escolha', 'selecao',     false)
ON CONFLICT (chave_unica) DO NOTHING;
