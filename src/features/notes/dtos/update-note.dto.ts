import z from "zod";

export const updateNoteSchema = z
  .object({
    title: z
      .string()
      .min(3, "O título deve ter no mínimo 3 caracteres.")
      .optional(),
    content: z.string().optional(),
  })
  .strict();

export type UpdateNoteSchema = z.infer<typeof updateNoteSchema>;
