import z from "zod";

export const createNoteSchema = z
  .object({
    title: z.string().min(3, "O título deve ter no mínimo 3 caracteres."),
    content: z.string(),
  })
  .strict();

export type CreateNoteSchema = z.infer<typeof createNoteSchema>;
