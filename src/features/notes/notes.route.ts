import { Router } from "express";
import { NotesController } from "./notes.controller";
import { validate } from "../../shared/middleware/validation.middleware";
import { createNoteSchema } from "./dtos/create-note.dto";
import { updateNoteSchema } from "./dtos/update-note.dto";
import { taskParamsSchema } from "./dtos/task-params.dto";
import { NotesService } from "./notes.service";
import { NotesRepository } from "./notes.repository";

const notesRouter = Router();
const notesService = new NotesService(new NotesRepository());
const notesController = new NotesController(notesService);

notesRouter.get("/", notesController.getAll);

notesRouter.get("/:id", notesController.getById);

notesRouter.post(
  "/",
  validate({
    body: createNoteSchema,
  }),
  notesController.create,
);

notesRouter.put(
  "/:id",
  validate({
    body: updateNoteSchema,
    params: taskParamsSchema,
  }),
  notesController.update,
);

notesRouter.delete("/:id", notesController.delete);

export default notesRouter;
