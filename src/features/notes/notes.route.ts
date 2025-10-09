import { Router } from "express";

import { NotesController } from "./notes.controller";
import { validate } from "../../shared/middleware/validation.middleware";
import { createNoteSchema } from "./dtos/create-note.dto";
import { updateNoteSchema } from "./dtos/update-note.dto";
import { noteParamsSchema } from "./dtos/note-params.dto";
import { container } from "tsyringe";
import { authMiddleware } from "../../shared/middleware/auth.middleware";

const notesRouter = Router();
const notesController = container.resolve(NotesController);

/**
 * @swagger
 * /api/notes:
 *   get:
 *    tags:
 *      - Notas
 *    security:
 *      - bearerAuth: []
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
 *                title: "Minha nota 1"
 *                description: "Descrição da minha nota 1"
 *                importance: "baixo"
 *                completed: 0
 *              - id: "3fa85f64-5717-ds2e-a23d-2c963f66afa6"
 *                title: "Minha nota 2"
 *                description: "Descrição da minha nota 2"
 *                importance: "media"
 *                completed: 1
 *      500:
 *        description: Erro interno no servidor
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/InternalServerError"
 */
notesRouter.get("/", authMiddleware, notesController.getAll);

/**
 * @swagger
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
 *      500:
 *        description: Erro interno no servidor
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/InternalServerError"
 */
notesRouter.get("/:id", notesController.getById);

/**
 * @swagger
 * /api/notes:
 *  post:
 *    summary: Cria uma nova nota.
 *    tags:
 *      - Notas
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/CreateNote'
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
 *      500:
 *        description: Erro interno no servidor!
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/InternalServerError"
 */
notesRouter.post(
  "/",
  authMiddleware,
  validate({
    body: createNoteSchema,
  }),
  notesController.create,
);

/**
 * @swagger
 * /api/notes/{id}:
 *  put:
 *    summary: Atualizar uma nota com base no ID.
 *    tags:
 *      - Notas
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *        description: ID da nota a ser atualizada.
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/UpdateNote'
 *    responses:
 *      200:
 *        description: Nota atualizada com sucesso!
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/UpdateNoteResponse"
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
 *      500:
 *        description: Erro interno no servidor
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/InternalServerError"
 */
notesRouter.put(
  "/:id",
  authMiddleware,
  validate({
    body: updateNoteSchema,
    params: noteParamsSchema,
  }),
  notesController.update,
);

/**
 * @swagger
 * /api/notes/{id}:
 *  delete:
 *    summary: Deletar uma nota com base no ID.
 *    tags:
 *      - Notas
 *    security:
 *      - bearerAuth: []
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
 *      500:
 *        description: Erro interno no servidor
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/InternalServerError"
 */
notesRouter.delete("/:id", authMiddleware, notesController.delete);

export default notesRouter;
