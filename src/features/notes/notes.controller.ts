import { Request, Response } from "express";
import { NotesService } from "./notes.service";
import { CreateNoteSchema } from "./dtos/create-note.dto";
import { UpdateNoteSchema } from "./dtos/update-note.dto";
import { inject, injectable } from "tsyringe";

@injectable()
export class NotesController {
  constructor(@inject("NotesService") private notesService: NotesService) {}

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

    res.status(201).json(createdNote);
  };

  update = (req: Request, res: Response) => {
    const { id } = req.params;
    const { description, title, completed, importance } =
      req.body as UpdateNoteSchema;

    this.notesService.update(id, {
      title,
      description,
      importance,
      completed,
    });

    const updatedNote = this.notesService.getById(id);
    res.status(200).json(updatedNote);
  };

  delete = (req: Request, res: Response) => {
    const { id } = req.params;

    this.notesService.delete(id);

    res.status(204).send();
  };
}
