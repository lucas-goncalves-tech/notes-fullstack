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
  .strict();

export type UpdateNoteSchema = z.infer<typeof updateNoteSchema>;
