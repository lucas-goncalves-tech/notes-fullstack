export interface INote {
  id: string;
  title: string;
  description: string;
  importance: "baixo" | "medio" | "alto";
  completed: 1 | 0;
  created_at: Date;
  updated_at: Date;
}
