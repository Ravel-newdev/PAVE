/**
 * @file processo.schema.js
 * @description Esquemas de validação de dados para o módulo de Processos Seletivos, Inscrições e Avaliações.
 */

const { z } = require("zod");

const baseProcessoSchema = z.object({
  projeto_id: z.string().uuid({ error: "O identificador do projeto deve ser um UUID válido." }),
  formulario_id: z.string().uuid({ error: "O identificador do formulário deve ser um UUID válido." }).optional(),
  titulo: z.string({ required_error: "O título do processo seletivo é obrigatório." }).min(5).max(200),
  descricao: z.string().optional(),
  data_inicio: z.string().date({ error: "Data de início em formato inválido." }).optional(),
  data_termino: z.string().date({ error: "Data de término em formato inválido." }).optional(),
  pdf_edital: z.string().url({ error: "O link do edital deve ser uma URL válida." }).max(500).optional(),
  n_vagas: z.number().int().positive({ error: "O número de vagas deve ser maior que zero." }).optional()
});

const validarDatasProcesso = (data) => {
  if (data.data_inicio && data.data_termino) {
    return new Date(data.data_termino) >= new Date(data.data_inicio);
  }
  return true;
};

const mensagemDatasProcesso = {
  message: "A data de término não pode ser anterior à data de início.",
  path: ["data_termino"]
};

const createProcessoSchema = baseProcessoSchema.refine(validarDatasProcesso, mensagemDatasProcesso);

const updateProcessoSchema = baseProcessoSchema.partial().extend({
  status: z.enum(['aberto', 'encerrado', 'cancelado'], {
    errorMap: () => ({ message: "Status inválido para o processo seletivo." })
  }).optional()
}).refine(validarDatasProcesso, mensagemDatasProcesso);

const createInscricaoSchema = z.object({
  ps_id: z.string().uuid({ error: "O identificador do processo seletivo deve ser um UUID válido." }),
  respostas: z.array(
    z.object({
      campo_id: z.string().uuid({ error: "Identificador de campo inválido." }),
      valor_texto: z.string().optional(),
      arquivo_url: z.string().url().optional()
    })
  ).optional()
}).refine(data => {
  if (data.respostas) {
    return data.respostas.every(r => r.valor_texto !== undefined || r.arquivo_url !== undefined);
  }
  return true;
}, { message: "Cada resposta deve conter um texto ou o link de um arquivo.", path: ["respostas"] });

const avaliarInscricaoSchema = z.object({
  nota: z.number().min(0).max(10, { error: "A nota deve estar entre 0 e 10." }).optional(),
  comentario: z.string().optional(),
  novo_status: z.enum(['em_analise', 'aprovado', 'reprovado', 'desistencia'], {
    errorMap: () => ({ message: "Status de transição de inscrição inválido." })
  }),
  coluna_kanban: z.number().int().positive().optional()
});

module.exports = {
  createProcessoSchema,
  updateProcessoSchema,
  createInscricaoSchema,
  avaliarInscricaoSchema
};