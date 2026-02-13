import z from "zod";

export const createUserSchema = z
  .object({
    name: z.string().max(20, "O nome deve conter no máximo 20 caracteres."),
    email: z.email(),
    password_hash: z.string(),
  })
  .strict();

export type CreateUserDTO = z.infer<typeof createUserSchema>;
