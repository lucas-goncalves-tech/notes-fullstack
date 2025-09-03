import { NotFoundError } from "../../shared/erros/not-found.error";
import { CreateNoteSchema } from "./dtos/create-note.dto";
import { UpdateNoteSchema } from "./dtos/update-note.dto";
import { INote } from "./notes.interface";
import { NotesRepository } from "./notes.repository";

export class NotesService {
  constructor(private notesRepository: NotesRepository) {}

  getAll(): INote[] {
    const notes = this.notesRepository.getAll();
    return notes;
  }

  getById(id: string) {
    const note = this.notesRepository.findById(id);
    if (!note) {
      throw new NotFoundError("Nota");
    }
    return note;
  }

  create(note: CreateNoteSchema) {
    return this.notesRepository.create(note);
  }

  update(id: string, note: UpdateNoteSchema): INote {
    const noteExists = this.notesRepository.findById(id);
    if (!noteExists) {
      throw new NotFoundError("Nota");
    }
    const updatedNote = this.notesRepository.update(id, note);

    return updatedNote;
  }

  delete(id: string): void {
    const noteExists = this.notesRepository.findById(id);
    if (!noteExists) {
      throw new NotFoundError("Nota");
    }
    return this.notesRepository.delete(id);
  }
}
