import z from "zod";

export const updateNoteSchema = z
  .object({
    title: z
      .string()
      .min(3, "O título deve ter no mínimo 3 caracteres.")
      .optional(),
    description: z
      .string()
      .min(3, "A descrição deve ter no mínimo 3 caracteres.")
      .optional(),
    importance: z.enum(["baixo", "medio", "alto"]).optional(),
    completed: z.union([z.literal(0), z.literal(1)]).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Pelo menos um campo deve ser fornecido para atualização",
  })
  .strict();

export type UpdateNoteSchema = z.infer<typeof updateNoteSchema>;
