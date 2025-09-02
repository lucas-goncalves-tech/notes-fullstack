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

/**
 * @openapi
 * /api/notes:
 *   get:
 *    tags:
 *      - Notas
 *    summary: Lista de todas as notas.
 *    responses:
 *      200:
 *        description: Lista completa de notas.
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: "#/components/schemas/Note"
 *            example: [
 *                 {
 *                   "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
 *                   "title": "Minha nota",
 *                   "content": "Descrição da minha nota",
 *                   "created_at": "2025-09-02 14:57:09",
 *                   "updated_at": "2025-09-02 14:57:09"
 *                 }
 *               ]
 */
notesRouter.get("/", notesController.getAll);

/**
 * @openapi
 * /api/notes/{id}:
 *  get:
 *    tags:
 *      - Notas
 *    summary: Lista a nota pelo ID.
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *        description: ID único da nota.
 *    responses:
 *      200:
 *        description: Detalhe de uma nota.
 *        content:
 *          application/json:
 *            schema:
 *                $ref: '#/components/schemas/Note'
 *            example: [
 *                 {
 *                   "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
 *                   "title": "Minha nota",
 *                   "content": "Descrição da minha nota",
 *                   "created_at": "2025-09-02 14:57:09",
 *                   "updated_at": "2025-09-02 14:57:09"
 *                 }
 *               ]
 *      404:
 *        description: Mensagem de nota não encontrada.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/NotFound"
 *
 */
notesRouter.get("/:id", notesController.getById);

/**
 * @openapi
 * /api/notes:
 *  post:
 *    summary: Cria uma nova nota.
 *    tags:
 *      - Notas
 *    responses:
 *      201:
 *        description: Nota criada com sucesso
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/CreateResponse"
 *      400:
 *        description: Error de validação
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/BadRequest"
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            allOf:
 *              - $ref: '#/components/schemas/CreateNote'
 *              - type: object
 *                example:
 *                  title: 'Minha nova nota'
 *                  content: 'Descrição da minha nota'
 */
notesRouter.post(
  "/",
  validate({
    body: createNoteSchema,
  }),
  notesController.create,
);

/**
 * @openapi
 * /api/notes/{id}:
 *  put:
 *    summary: Atualizar uma nota com base no ID.
 *    tags:
 *      - Notas
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *        description: ID da nota a ser atualizada
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/UpdateNote'
 *          example:
 *            title: "Novo titulo da minha nota"
 *            content: "Nova descrição da nota"
 *    responses:
 *      200:
 *        description: Nota atualizada com sucesso!
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/UpdateResponse"
 *      400:
 *        description: Error de validação
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/BadRequest"
 *      404:
 *        description: Nota não encontrada
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/NotFound"
 */
notesRouter.put(
  "/:id",
  validate({
    body: updateNoteSchema,
    params: taskParamsSchema,
  }),
  notesController.update,
);

/**
 * @openapi
 * /api/notes/{id}:
 *  delete:
 *    summary: Deletar uma nota com base no ID.
 *    tags:
 *      - Notas
 *    parameters:
 *      - name: id
 *        in: path
 *        schema:
 *          type: string
 *        required: true
 *        description: ID da nota a ser deletada.
 *    responses:
 *      204:
 *        description: Nota excluida com sucesso.
 *      404:
 *        description: Nota não encontrada
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/NotFound"
 */
notesRouter.delete("/:id", notesController.delete);

export default notesRouter;
