import { z } from "zod";

export const RegisterValidationSchema = z.object({
  nome: z.string().min(5, "Mínimo de 5 caracteres").max(200, "Máximo de 200 caracteres"),
  matricula: z.string().length(6, "A matrícula deve ter exatamente 6 dígitos").regex(/^\d{6}$/, "A matrícula deve conter apenas números"),
  email: z.string().email("E-mail inválido"),
  curso: z.string().min(2, "Mínimo de 2 caracteres").max(100).optional().or(z.literal("")),
  departamento: z.string().min(2, "Mínimo de 2 caracteres").max(100).optional().or(z.literal("")),
  senha: z.string().min(6, "Mínimo de 6 caracteres"),
  confirmarSenha: z.string(),
}).refine((data) => data.senha === data.confirmarSenha, {
  message: "As senhas não coincidem.",
  path: ["confirmarSenha"],
});

export type RegisterFormData = z.infer<typeof RegisterValidationSchema>;
