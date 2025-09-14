import z from "zod";

export const updateUserSchema = z
  .object({
    name: z
      .string()
      .min(20, "O nome deve conter no máximo 20 caracteres.")
      .optional(),
    email: z.email().optional(),
  })
  .strict();

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
