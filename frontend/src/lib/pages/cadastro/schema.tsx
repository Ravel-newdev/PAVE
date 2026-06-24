import * as z from "zod";

export const RegisterValidationSchema = z
  .object({
    name: z
      .string()
      .min(10, "O nome completo deve ter no mínimo 10 caracteres")
      .max(80, "O nome completo deve ter no máximo 80 caracteres"),
    email: z.email("Digite um email válido"),
    cpf: z
      .string()
      .min(11, "CPF deve ter 11 dígitos")
      .max(11, "CPF deve ter 11 dígitos")
      .regex(/^\d+$/, "CPF deve conter apenas números"),
    dateBirth: z
      .string()
      .min(1, "Data de nascimento é obrigatória")
      .refine(
        (value) => {
          const birthDate = new Date(value);
          const today = new Date();

          let age = today.getFullYear() - birthDate.getFullYear();

          const monthDiff = today.getMonth() - birthDate.getMonth();

          if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birthDate.getDate())
          ) {
            age--;
          }

          return age >= 14;
        },
        {
          message: "Você deve ter pelo menos 14 anos",
        },
      ),
    course: z.string().min(1, "Selecione um curso"),
    period: z.string().min(1, "Selecione um curso"),
    password: z
      .string()
      .min(8, "Mínimo de 8 caracteres")
      .max(12, "Máximo de 12 caracteres")
      .regex(/[A-Z]/, "Sua senha deve conter pelo menos uma letra maiúscula")
      .regex(/[a-z]/, "Sua senha deve conter pelo menos uma letra minúscula")
      .regex(/[0-9]/, "Sua senha deve conter pelo menos um número")
      .regex(
        /[^A-Za-z0-9]/,
        "Sua senha deve conter pelo menos um caractere especial",
      ),
  })

export type RegisterFormData = z.infer<typeof RegisterValidationSchema>;
