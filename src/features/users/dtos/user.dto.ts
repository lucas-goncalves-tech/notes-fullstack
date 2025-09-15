import z from "zod";

export const userSchema = z.object({
  id: z.string(),
  name: z.string().max(20, "O nome deve conter no máximo 20 caracteres."),
  email: z.email(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type UserSchemaType = z.infer<typeof userSchema>;
