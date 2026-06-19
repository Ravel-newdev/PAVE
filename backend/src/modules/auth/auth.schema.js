/**
 * @file auth.schema.js
 * @description Esquemas de validação de dados para o módulo de autenticação.
 */

const { z } = require("zod");

const registerDiscenteSchema = z.object({
  nome: z.string({
    error: (issue) => issue.input === undefined ? "O campo nome é obrigatório." : "O campo nome deve ser um texto."
  })
    .min(3, { error: "O nome deve conter ao menos 3 caracteres." })
    .max(150),
    
  email: z.string({
    error: (issue) => issue.input === undefined ? "O campo e-mail é obrigatório." : "O campo e-mail deve ser um texto."
  })
    .email({ error: "Formato de e-mail institucional inválido." })
    .max(150),
    
  senha: z.string({
    error: (issue) => issue.input === undefined ? "O campo senha é obrigatório." : "O campo senha deve ser um texto."
  })
    .min(6, { error: "A senha deve conter ao menos 6 caracteres." })
    .max(255),
    
  matricula: z.string({
    error: (issue) => issue.input === undefined ? "O campo matrícula é obrigatório." : "O campo matrícula deve ser um texto."
  })
    .min(6, { error: "A matrícula deve conter ao menos 6 caracteres." })
    .max(20),
    
  curso: z.string({
    error: (issue) => issue.input === undefined ? "O campo curso é obrigatório." : "O campo curso deve ser um texto."
  })
    .min(3, { error: "O curso deve conter ao menos 3 caracteres." })
    .max(150),
    
  telefone: z.string({
    error: "O campo telefone deve ser um texto."
  })
    .max(20)
    .optional(),
});

const registerDocenteSchema = z.object({
  nome: z.string({
    error: (issue) => issue.input === undefined ? "O campo nome é obrigatório." : "O campo nome deve ser um texto."
  })
    .min(3, { error: "O nome deve conter ao menos 3 caracteres." })
    .max(150),
    
  email: z.string({
    error: (issue) => issue.input === undefined ? "O campo e-mail é obrigatório." : "O campo e-mail deve ser um texto."
  })
    .email({ error: "Formato de e-mail institucional inválido." })
    .max(150),
    
  senha: z.string({
    error: (issue) => issue.input === undefined ? "O campo senha é obrigatório." : "O campo senha deve ser um texto."
  })
    .min(6, { error: "A senha deve conter ao menos 6 caracteres." })
    .max(255),
    
  matricula: z.string({
    error: (issue) => issue.input === undefined ? "O campo matrícula é obrigatório." : "O campo matrícula deve ser um texto."
  })
    .min(6, { error: "A matrícula deve conter ao menos 6 caracteres." })
    .max(20),
    
  departamento: z.string({
    error: (issue) => issue.input === undefined ? "O campo departamento é obrigatório." : "O campo departamento deve ser um texto."
  })
    .min(3, { error: "O departamento deve conter ao menos 3 caracteres." })
    .max(150),
    
  telefone: z.string({
    error: "O campo telefone deve ser um texto."
  })
    .max(20)
    .optional(),
});

const loginSchema = z.object({
  email: z.string({
    error: (issue) => issue.input === undefined ? "O campo e-mail é obrigatório." : "O campo e-mail deve ser um texto."
  })
    .email({ error: "Formato de e-mail inválido." }),
    
  senha: z.string({
    error: (issue) => issue.input === undefined ? "O campo senha é obrigatório." : "O campo senha deve ser um texto."
  })
    .min(1, { error: "O campo senha não pode estar vazio." }),
});

const recoverPasswordSchema = z.object({
  email: z.string({
    error: (issue) => issue.input === undefined ? "O campo e-mail é obrigatório." : "O campo e-mail deve ser um texto."
  })
    .email({ error: "Formato de e-mail inválido." }),
});

const resetPasswordSchema = z.object({
  token: z.string({
    error: (issue) => issue.input === undefined ? "O token de redefinição é obrigatório." : "O token de redefinição deve ser um texto."
  })
    .min(1, { error: "O token de redefinição não pode estar vazio." }),
    
  novaSenha: z.string({
    error: (issue) => issue.input === undefined ? "A nova senha é obrigatória." : "A nova senha deve ser um texto."
  })
    .min(6, { error: "A nova senha deve conter ao menos 6 caracteres." }),
});

module.exports = {
  registerDiscenteSchema,
  registerDocenteSchema,
  loginSchema,
  recoverPasswordSchema,
  resetPasswordSchema,
};