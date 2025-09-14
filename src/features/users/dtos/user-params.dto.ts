import z from "zod";

export const userParamsSchema = z
  .object({
    id: z.uuid(),
  })
  .strict();

export type UserParamsSchema = z.infer<typeof userParamsSchema>;
