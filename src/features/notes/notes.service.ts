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

  getAll(): NoteSchemaType[] {
    const notes = this.notesRepository.getAll();
    return notes;
  }

  getById(id: string) {
    const note = this.notesRepository.getByID(id);
    if (!note) {
      throw new NotFoundError("Nota");
    }
    return note;
  }

  create(note: CreateNoteSchema) {
    return this.notesRepository.create(note);
  }

  update(id: string, note: UpdateNoteSchema): NoteSchemaType {
    const noteExists = this.notesRepository.getByID(id);
    if (!noteExists) {
      throw new NotFoundError("Nota");
    }
    const updatedNote = this.notesRepository.update(id, note);

    return updatedNote;
  }

  delete(id: string): void {
    const noteExists = this.notesRepository.getByID(id);
    if (!noteExists) {
      throw new NotFoundError("Nota");
    }
    return this.notesRepository.delete(id);
  }
}
