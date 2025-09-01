import { Request, Response } from "express";
import { NotesService } from "./notes.service";
import { CreateNoteSchema } from "./dtos/create-note.dto";
import { UpdateNoteSchema } from "./dtos/update-note.dto";

export class NotesController {
  constructor(private notesService: NotesService) {}

  getAll = (_req: Request, res: Response): void => {
    const notes = this.notesService.getAll();
    res.json(notes);
  };

  getById = (req: Request, res: Response) => {
    const { id } = req.params;
    const note = this.notesService.getById(id);

    res.json(note);
  };

  create = (req: Request, res: Response) => {
    const note = req.body as CreateNoteSchema;

    const createdNote = this.notesService.create(note);

    res.status(201).json({
      message: `Nota ${createdNote.title} adicionada com sucesso!`,
    });
  };

  update = (req: Request, res: Response) => {
    const { id } = req.params;
    const { content, title } = req.body as UpdateNoteSchema;

    const updatedId = this.notesService.update(id, {
      content,
      title,
    });

    res.status(200).json({
      message: `Nota ${updatedId} atualizada com sucesso!`,
    });
  };

  delete = (req: Request, res: Response) => {
    const { id } = req.params;

    this.notesService.delete(id);

    res.status(204).send();
  };
}
