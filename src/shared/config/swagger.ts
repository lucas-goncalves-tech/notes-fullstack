import swaggerJSDoc from "swagger-jsdoc";
import z from "zod";
import { noteSchema } from "../../features/notes/dtos/note.dto";
import { createNoteSchema } from "../../features/notes/dtos/create-note.dto";
import { updateNoteSchema } from "../../features/notes/dtos/update-note.dto";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de notas",
      version: "1.0.0",
      description: "Uma API simples para gerenciar notas.",
    },
    tags: [
      {
        name: "Notas",
        description: "Operações relacionadas a notas",
      },
    ],
    components: {
      schemas: {
        Note: z.toJSONSchema(noteSchema),
        CreateNote: z.toJSONSchema(createNoteSchema),
        CreateResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Nota {title} criada com sucesso",
            },
          },
        },
        UpdateNote: z.toJSONSchema(updateNoteSchema),
        UpdateResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Nota {title} atualizada com sucesso",
            },
          },
        },
        BadRequest: {
          type: "object",
          properties: {
            message: {},
            error: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  path: {},
                  message: {},
                },
              },
            },
          },
          example: {
            message: "Error de validação",
            error: [
              {
                path: "title",
                message: "O título deve ter no mínimo 3 caracteres.",
              },
            ],
          },
        },
        NotFound: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Recurso não encontrado!",
            },
          },
        },
      },
    },
  },
  apis: ["./src/features/notes/notes.route.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);
