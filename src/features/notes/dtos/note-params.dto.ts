import z from "zod";

export const noteParamsSchema = z.object({
  id: z.string("O id tem que ser uma string"),
});
