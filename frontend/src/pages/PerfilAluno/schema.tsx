import { z } from "zod";

const anoAtual = new Date().getFullYear();

export const profileSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "Nome obrigatório."),

    lastName: z
      .string()
      .min(2, "Sobrenome obrigatório."),

    email: z
      .string()
      .email("E-mail inválido."),

    phone: z
      .string()
      .refine(
        (v) => !v || /^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/.test(v),
        "Telefone inválido."
      ),

    birthDate: z
      .string()
      .refine(
        (v) => !v || !isNaN(Date.parse(v)),
        "Data inválida."
      ),

    avatar: z.string().nullable().optional(),

    institution: z.string(),

    course: z.string(),

    semester: z
      .string()
      .refine(
        (v) => !v || (/^\d{1,2}$/.test(v) && +v >= 1 && +v <= 20),
        "Semestre inválido (1 a 20)."
      ),

    graduationYear: z
      .string()
      .refine(
        (v) => !v || (/^\d{4}$/.test(v) && +v >= 2000 && +v <= anoAtual + 10),
        `Ano inválido (2000 a ${anoAtual + 10}).`
      ),

    about: z
      .string()
      .max(1000, "Máximo de 1000 caracteres."),

    interests: z.array(z.string()),

    curriculo_url: z.string(),

    availability: z
      .enum(["morning", "afternoon", "night", "fulltime"])
      .optional(),

    remote: z.boolean(),

    notifications: z.boolean(),

    currentPassword: z.string(),

    newPassword: z
      .string()
      .refine(
        (v) => !v || v.length >= 8,
        "A nova senha deve ter pelo menos 8 caracteres."
      ),

    confirmPassword: z.string(),
  })
  .refine(
    (data) => !data.newPassword || !!data.currentPassword,
    {
      path: ["currentPassword"],
      message: "Informe a senha atual para alterar a senha.",
    }
  )
  .refine(
    (data) => !data.newPassword || data.newPassword === data.confirmPassword,
    {
      path: ["confirmPassword"],
      message: "As senhas não coincidem.",
    }
  );
