import * as z from 'zod';

export const RegisterValidationSchema = z.object({
    name: z
    .string()
    .min(5, 'Mínimo de 5 caracteres')
    .max(20, 'Máximo de 20 caracteres'),
      address: z
      .string()
    .min(5, 'Mínimo de 5 caracteres')
    .max(20, 'Máximo de 20 caracteres'),
      cpf: z
      .string()
    .min(5, 'Mínimo de 5 caracteres')
    .max(20, 'Máximo de 20 caracteres'),
      dateBirth: z
      .string()
    .min(5, 'Mínimo de 5 caracteres')
    .max(20, 'Máximo de 20 caracteres'),
      course: z
      .string()
    .min(5, 'Mínimo de 5 caracteres')
    .max(20, 'Máximo de 20 caracteres'),
      period: z
      .string()
    .min(5, 'Mínimo de 5 caracteres')
    .max(20, 'Máximo de 20 caracteres'),
      password: z
      .string()
    .min(5, 'Mínimo de 5 caracteres')
    .max(20, 'Máximo de 20 caracteres'),
      confirmPassword: z
      .string()
    .min(5, 'Mínimo de 5 caracteres')
    .max(20, 'Máximo de 20 caracteres'),
});

export type LoginFormData = z.infer<typeof RegisterValidationSchema>;