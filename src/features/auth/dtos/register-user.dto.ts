import { z } from "zod";

export const registerUserSchema = z
  .object({
    name: z.string("Nome é obrigatório"),
    email: z.email("Not a valid email"),
    password: z
      .string("Password is required")
      .min(8, "Password must be at least 8 characters long"),
    repassword: z.string("Please confirm your password"),
  })
  .refine((data) => data.password === data.repassword, {
    message: "Passwords do not match",
    path: ["repassword"],
  })
  .strict();

export type RegisterUserDTO = z.infer<typeof registerUserSchema>;
