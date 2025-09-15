import z from "zod";

export const noteSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  description: z.string(),
  importance: z.enum(["baixo", "medio", "alto"]),
  completed: z.union([z.literal(0), z.literal(1)]),
  created_at: z.string(),
  updated_at: z.string(),
});

export type NoteSchemaType = z.infer<typeof noteSchema>;
