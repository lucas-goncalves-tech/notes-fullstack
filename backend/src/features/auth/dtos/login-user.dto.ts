import z from "zod";

export const loginUserSchema = z.object({
  email: z.email("O email informado é inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

export const loginPayloadSchema = z.object({
  accessToken: z.string(),
});

export type LoginPayloadDTO = z.infer<typeof loginPayloadSchema>;
export type LoginUserDTO = z.infer<typeof loginUserSchema>;
