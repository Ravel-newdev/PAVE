import { z } from "zod";

export const experienceSchema = z.object({
  company: z
    .string()
    .min(2, "Informe a empresa."),

  position: z
    .string()
    .min(2, "Informe o cargo."),

  startDate: z.string(),

  endDate: z.string(),

  description: z
    .string()
    .max(500, "Máximo de 500 caracteres.")
});

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

    phone: z.string(),

    birthDate: z.string(),

    avatar: z
      .string()
      .nullable()
      .optional(),

    institution: z
      .string()
      .min(2),

    course: z
      .string()
      .min(2),

    semester: z.string(),

    graduationYear: z.string(),

    about: z
      .string()
      .max(1000),

    interests: z.array(z.string()),

    experiences: z.array(experienceSchema),

    availability: z.enum([
      "morning",
      "afternoon",
      "night",
      "fulltime",
    ]),

    remote: z.boolean(),

    notifications: z.boolean(),

    currentPassword: z.string(),

    newPassword: z.string(),

    confirmPassword: z.string(),
  })
  .refine(
    (data) => {
      if (!data.newPassword && !data.confirmPassword) {
        return true;
      }

      return data.newPassword === data.confirmPassword;
    },
    {
      path: ["confirmPassword"],
      message: "As senhas não coincidem.",
    }
  );