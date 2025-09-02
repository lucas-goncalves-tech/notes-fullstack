import z from "zod";

export const noteSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  content: z.string(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
});

export type NoteSchema = z.infer<typeof noteSchema>;
