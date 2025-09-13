import z from "zod";

export const userSchema = z.object({
  id: z.string(),
  name: z.string().min(20, "O nome deve conter no máximo 20 caracteres."),
  email: z.email().brand<"email">(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type UserSchema = z.infer<typeof userSchema>;
