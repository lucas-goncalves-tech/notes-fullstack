import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
    email: z.email("Email inválido"),
    password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
    repassword: z
      .string()
      .min(8, "Confirmação de senha deve ter pelo menos 8 caracteres"),
  })
  .refine((data) => data.password === data.repassword, {
    message: "Senhas não conferem",
    path: ["repassword"],
  });

export const loginSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export const createNoteSchema = z.object({
  title: z
    .string()
    .min(3, "Título deve ter pelo menos 3 caracteres")
    .max(50, "Título deve ter no máximo 50 caracteres"),
  description: z
    .string()
    .min(3, "Descrição deve ter pelo menos 3 caracteres")
    .max(500, "Descrição deve ter no máximo 500 caracteres"),
  importance: z.enum(["baixo", "medio", "alto"]),
});

export const updateNoteSchema = z
  .object({
    title: z
      .string()
      .min(3, "Título deve ter pelo menos 3 caracteres")
      .optional(),
    description: z
      .string()
      .min(3, "Descrição deve ter pelo menos 3 caracteres")
      .optional(),
    importance: z.enum(["baixo", "medio", "alto"]).optional(),
    completed: z.union([z.literal(0), z.literal(1)]).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Pelo menos um campo deve ser fornecido para atualização",
  });

export const updateUserSchema = z
  .object({
    name: z
      .string()
      .min(20, "Nome deve ter pelo menos 20 caracteres")
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Pelo menos um campo deve ser fornecido para atualização",
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type CreateNoteFormData = z.infer<typeof createNoteSchema>;
export type UpdateNoteFormData = z.infer<typeof updateNoteSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
