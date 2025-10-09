import z from "zod";

export const userSchema = z.object({
  id: z.string(),
  name: z.string().min(3, "Name is required"),
  email: z.email("Not a valid email"),
  password_hash: z.string().min(1, "Password hash is required"),
  role: z.enum(["user", "admin"]).default("user"),
  created_at: z.string(),
  updated_at: z.string(),
});

export const userMinimalSchema = userSchema.omit({
  password_hash: true,
});
export const usersSchema = z.array(
  userSchema.omit({
    password_hash: true,
  }),
);

export type UserDTO = z.infer<typeof userSchema>;
export type UserMinimalSchema = z.infer<typeof userMinimalSchema>;
