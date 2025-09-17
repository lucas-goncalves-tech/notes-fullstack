import { inject, injectable } from "tsyringe";
import { NotFoundError } from "../../shared/erros/not-found.error";
import { CreateNoteSchema } from "./dtos/create-note.dto";
import { UpdateNoteSchema } from "./dtos/update-note.dto";
import { NotesRepository } from "./notes.repository";
import { NoteSchemaType } from "./dtos/note.dto";

@injectable()
export class NotesService {
  constructor(
    @inject("NotesRepository") private notesRepository: NotesRepository,
  ) {}

  async getAll(): Promise<NoteSchemaType[]> {
    const notes = await this.notesRepository.getAll();
    return notes;
  }

  async getById(id: string) {
    const note = await this.notesRepository.getByID(id);
    if (!note) {
      throw new NotFoundError("Nota");
    }
    return note;
  }

  async create(note: CreateNoteSchema) {
    return await this.notesRepository.create(note);
  }

  async update(id: string, note: UpdateNoteSchema): Promise<NoteSchemaType> {
    const noteExists = await this.notesRepository.getByID(id);
    if (!noteExists) {
      throw new NotFoundError("Nota");
    }
    const updatedNote = await this.notesRepository.update(id, note);
    if (!updatedNote) {
      throw new NotFoundError("Usuário");
    }

    return updatedNote;
  }

  async delete(id: string): Promise<void> {
    const noteExists = await this.notesRepository.getByID(id);
    if (!noteExists) {
      throw new NotFoundError("Nota");
    }
    this.notesRepository.delete(id);
  }
}
