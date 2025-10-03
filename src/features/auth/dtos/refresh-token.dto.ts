import z from "zod";

export const refreshTokenSchema = z.object({
  UUID: z.uuid(),
  user_id: z.string(),
});

export type RefreshTokenDTO = z.infer<typeof refreshTokenSchema>;
