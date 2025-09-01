import z from "zod";

export const taskParamsSchema = z.object({
  id: z.string("O id tem que ser uma string"),
});
