import z from "zod";

export const createUserSchema = z
  .object({
    name: z.string().max(20, "O nome deve conter no máximo 20 caracteres."),
    email: z.email(),
  })
  .strict();

export type CreateUserSchema = z.infer<typeof createUserSchema>;
