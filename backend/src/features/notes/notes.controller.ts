import { Request, Response } from "express";
import { NotesService } from "./notes.service";
import { CreateNoteSchema } from "./dtos/create-note.dto";
import { UpdateNoteSchema } from "./dtos/update-note.dto";
import { inject, injectable } from "tsyringe";

@injectable()
export class NotesController {
  constructor(@inject("NotesService") private notesService: NotesService) {}

  getAll = async (req: Request, res: Response) => {
    const autheticatedUser = req.user;
    const notes = await this.notesService.getAll(autheticatedUser);
    res.json(notes);
  };

  getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const note = await this.notesService.getById(id);

    res.json(note);
  };

  create = async (req: Request, res: Response) => {
    const note = req.body as CreateNoteSchema;
    const autheticatedUser = req.user;

    const createdNote = await this.notesService.create(autheticatedUser, note);

    res.status(201).json(createdNote);
  };

  update = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { description, title, completed, importance } =
      req.body as UpdateNoteSchema;
    const autheticatedUser = req?.user;

    const updatedNote = await this.notesService.update(autheticatedUser, id, {
      title,
      description,
      importance,
      completed,
    });

    res.status(200).json(updatedNote);
  };

  delete = async (req: Request, res: Response) => {
    const { id } = req.params;
    const autheticatedUser = req?.user;

    await this.notesService.delete(autheticatedUser, id);

    res.status(204).send();
  };
}
