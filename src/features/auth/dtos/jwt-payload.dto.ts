import z from "zod";

export const jwtPayloadSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
  role: z.enum(["user", "admin"]),
  iat: z.number(),
  exp: z.number(),
});

export type JWTPayloadDTO = z.infer<typeof jwtPayloadSchema>;
