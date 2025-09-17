import { Request, Response } from "express";
import { NotesService } from "./notes.service";
import { CreateNoteSchema } from "./dtos/create-note.dto";
import { UpdateNoteSchema } from "./dtos/update-note.dto";
import { inject, injectable } from "tsyringe";

@injectable()
export class NotesController {
  constructor(@inject("NotesService") private notesService: NotesService) {}

  getAll = async (_req: Request, res: Response) => {
    const notes = await this.notesService.getAll();
    res.json(notes);
  };

  getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const note = await this.notesService.getById(id);

    res.json(note);
  };

  create = async (req: Request, res: Response) => {
    const note = req.body as CreateNoteSchema;

    const createdNote = await this.notesService.create(note);

    res.status(201).json(createdNote);
  };

  update = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { description, title, completed, importance, user_id } =
      req.body as UpdateNoteSchema;

    await this.notesService.update(id, {
      user_id,
      title,
      description,
      importance,
      completed,
    });

    const updatedNote = await this.notesService.getById(id);
    res.status(200).json(updatedNote);
  };

  delete = async (req: Request, res: Response) => {
    const { id } = req.params;

    await this.notesService.delete(id);

    res.status(204).send();
  };
}
