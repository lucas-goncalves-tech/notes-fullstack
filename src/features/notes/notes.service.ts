import { NotFoundError } from "../../shared/erros/not-found.error";
import { CreateNoteSchema } from "./dtos/create-note.dto";
import { UpdateNoteSchema } from "./dtos/update-note.dto";
import { INotes } from "./notes.interface";
import { NotesRepository } from "./notes.repository";

export class NotesService {
  constructor(private notesRepository: NotesRepository) {}

  getAll(): INotes[] {
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

  update(id: string, note: UpdateNoteSchema) {
    const noteExists = this.notesRepository.findById(id);
    if (!noteExists) {
      throw new NotFoundError("Nota");
    }
    const updatedId = this.notesRepository.update(id, note);

    return updatedId;
  }

  delete(id: string) {
    const noteExists = this.notesRepository.findById(id);
    if (!noteExists) {
      throw new NotFoundError("Nota");
    }
    return this.notesRepository.delete(id);
  }
}
