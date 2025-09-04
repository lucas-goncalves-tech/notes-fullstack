import z from "zod";

export const createNoteSchema = z
  .object({
    title: z
      .string()
      .min(3, "O título deve ter no mínimo 3 caracteres.")
      .max(50, "O título deve ter no máximo 50 caracteres."),
    description: z
      .string()
      .min(3, "A descrição deve ter no mínimo 3 caracteres.")
      .max(500, "A descrição deve ter no máximo 500 caracteres."),
    importance: z.enum(["baixo", "medio", "alto"]),
  })
  .strict();

export type CreateNoteSchema = z.infer<typeof createNoteSchema>;
