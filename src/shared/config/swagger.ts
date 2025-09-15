import swaggerJSDoc from "swagger-jsdoc";
import z from "zod";
import { noteSchema } from "../../features/notes/dtos/note.dto";
import { createNoteSchema } from "../../features/notes/dtos/create-note.dto";
import { updateNoteSchema } from "../../features/notes/dtos/update-note.dto";
import { userSchema } from "../../features/users/dtos/user.dto";
import { createUserSchema } from "../../features/users/dtos/create-user.dto";
import { updateUserSchema } from "../../features/users/dtos/update-user.dto";
import { userParamsSchema } from "../../features/users/dtos/user-params.dto";

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
      {
        name: "Users",
        description: "Operações relacionadas a usuários",
      },
    ],
    components: {
      schemas: {
        Note: z.toJSONSchema(noteSchema),
        CreateNote: z.toJSONSchema(createNoteSchema),
        CreateNoteResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: [
                {
                  id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                  title: "Minha nota",
                  description: "Descrição da minha nota",
                  importance: "baixo",
                  completed: 0,
                },
              ],
            },
          },
        },
        UpdateNote: z.toJSONSchema(updateNoteSchema),
        UpdateNoteResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: {
                id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                title: "Novo titulo da minha nota",
                description: "Nova descrição da nota",
                importance: "medio",
                completed: 1,
              },
            },
          },
        },
        User: z.toJSONSchema(userSchema),
        CreateUser: z.toJSONSchema(createUserSchema),
        CreateResponseUser: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: [
                {
                  id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                  name: "John Doe",
                  email: "john.doe@example.com",
                },
              ],
            },
          },
        },
        UpdateUser: z.toJSONSchema(updateUserSchema),
        UserParams: z.toJSONSchema(userParamsSchema),
        UpdateResponseUser: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Usuário {name} atualizado com sucesso",
            },
          },
        },
        ConflictError: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Recurso já existe",
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
        InternalServerError: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Erro interno do servidor",
            },
          },
        },
      },
    },
  },
  apis: [
    "./src/features/notes/notes.route.ts",
    "./src/features/users/users.routes.ts",
  ],
};

export const swaggerSpec = swaggerJSDoc(options);
