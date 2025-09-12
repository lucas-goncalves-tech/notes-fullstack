import { Router } from "express";

import { db } from "../../database/connection";

import { NotesController } from "./notes.controller";
import { validate } from "../../shared/middleware/validation.middleware";
import { createNoteSchema } from "./dtos/create-note.dto";
import { updateNoteSchema } from "./dtos/update-note.dto";
import { noteParamsSchema } from "./dtos/note-params.dto";
import { NotesService } from "./notes.service";
import { NotesRepository } from "./notes.repository";

const notesRouter = Router();
const notesService = new NotesService(new NotesRepository(db));
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
 *            example:
 *              - id: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
 *                title: "Minha nota"
 *                description: "Descrição da minha nota"
 *                importance: "baixo"
 *                completed: 0
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
 *              $ref: '#/components/schemas/Note'
 *            example:
 *              id: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
 *              title: "Minha nota"
 *              description: "Descrição da minha nota"
 *              importance: "baixo"
 *              completed: 0
 *      404:
 *        description: Mensagem de nota não encontrada.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/NotFound"
 */
notesRouter.get("/:id", notesController.getById);

/**
 * @openapi
 * /api/notes:
 *  post:
 *    summary: Cria uma nova nota.
 *    tags:
 *      - Notas
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/CreateNote'
 *          example:
 *            title: 'Minha nova nota'
 *            description: 'Descrição da minha nota'
 *            importance: 'baixo'
 *    responses:
 *      201:
 *        description: Nota criada com sucesso
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Note"
 *            example:
 *              id: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
 *              title: "Minha nova nota"
 *              description: "Descrição da minha nota"
 *              importance: "baixo"
 *              completed: 0
 *      400:
 *        description: Error de validação
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/BadRequest"
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
 *            description: "Nova descrição da nota"
 *            importance: "medio"
 *            completed: 1
 *    responses:
 *      200:
 *        description: Nota atualizada com sucesso!
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Note"
 *            example:
 *              id: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
 *              title: "Novo titulo da minha nota"
 *              description: "Nova descrição da nota"
 *              importance: "medio"
 *              completed: 1
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
    params: noteParamsSchema,
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
