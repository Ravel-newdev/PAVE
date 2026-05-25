/**
 * @file projeto.schema.js
 * @description Esquemas de validação de dados para o módulo de Projetos.
 */

const { z } = require("zod");

// 1. Definição estrita da forma do objeto (ZodObject)
const baseProjetoSchema = z.object({
  titulo: z.string({
    error: (issue) => issue.input === undefined ? "O título é obrigatório." : "O título deve ser um texto."
  }).min(5, { error: "O título deve conter ao menos 5 caracteres." }).max(200),
  
  descricao: z.string({
    error: "A descrição deve ser um texto."
  }).optional(),
  
  carga_hora: z.number({
    error: "A carga horária deve ser um número inteiro."
  }).int().positive({ error: "A carga horária deve ser superior a zero." }).optional(),
  
  data_inic: z.string({
    error: "A data de início deve ser uma string em formato ISO."
  }).date().optional(),
  
  data_termino: z.string({
    error: "A data de término deve ser uma string em formato ISO."
  }).date().optional(),
  
  centro_dep: z.string({
    error: "O centro/departamento deve ser um texto."
  }).max(150).optional(),
  
  tags: z.array(
    z.string().uuid({ error: "O identificador da tag deve ser um UUID válido." })
  ).optional()
});

// 2. Isolamento da regra de negócio de datas
const validarDatas = (data) => {
  if (data.data_inic && data.data_termino) {
    return new Date(data.data_termino) >= new Date(data.data_inic);
  }
  return true; // Se omitidas, a validação é ignorada
};

const mensagemDatas = { 
  message: "A data de término não pode ser anterior à data de início.", 
  path: ["data_termino"] 
};

// 3. Composição dos esquemas finais (ZodEffects)
const createProjetoSchema = baseProjetoSchema.refine(validarDatas, mensagemDatas);

const updateProjetoSchema = baseProjetoSchema.partial().refine(validarDatas, mensagemDatas);

const updateStatusSchema = z.object({
  status: z.enum(['rascunho', 'ativo', 'encerrado', 'suspenso'], {
    errorMap: () => ({ message: "Status inválido. Valores permitidos: rascunho, ativo, encerrado, suspenso." })
  })
});

module.exports = {
  createProjetoSchema,
  updateProjetoSchema,
  updateStatusSchema
};