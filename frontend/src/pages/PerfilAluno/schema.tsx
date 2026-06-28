import { z } from "zod";

export const profileSchema = z
  .object({
    firstName: z.string().min(2, "Nome obrigatório."),
    lastName:  z.string().min(2, "Sobrenome obrigatório."),
    email:     z.string().email("E-mail inválido."),
    avatar:    z.string().nullable().optional(),
    course:    z.string(),
    semester:  z
      .string()
      .refine(
        (v) => !v || (/^\d{1,2}$/.test(v) && +v >= 1 && +v <= 20),
        "Semestre inválido (1 a 20)."
      ),
    about:        z.string().max(1000, "Máximo de 1000 caracteres."),
    interests:    z.array(z.string()),
    curriculo_url: z.string(),
    availability: z.enum(["morning", "afternoon", "night", "fulltime"]).optional(),
    remote:        z.boolean(),
    notifications: z.boolean(),
    currentPassword: z.string(),
    newPassword: z
      .string()
      .refine((v) => !v || v.length >= 8, "A nova senha deve ter pelo menos 8 caracteres."),
    confirmPassword: z.string(),
  })
  .refine(
    (data) => !data.newPassword || !!data.currentPassword,
    { path: ["currentPassword"], message: "Informe a senha atual para alterar a senha." }
  )
  .refine(
    (data) => !data.newPassword || data.newPassword === data.confirmPassword,
    { path: ["confirmPassword"], message: "As senhas não coincidem." }
  );
