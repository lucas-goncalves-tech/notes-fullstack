import swaggerJSDoc from "swagger-jsdoc";
import z from "zod";
import { noteSchema } from "../../features/notes/dtos/note.dto";
import { createNoteSchema } from "../../features/notes/dtos/create-note.dto";
import { updateNoteSchema } from "../../features/notes/dtos/update-note.dto";
import { createUserSchema } from "../../features/users/dtos/create-user.dto";
import { registerUserSchema } from "../../features/auth/dtos/register-user.dto";
import { userMinimalSchema } from "../../features/users/dtos/user.dto";
import { loginUserSchema } from "../../features/auth/dtos/login-user.dto";

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
        name: "Auth",
        description: "Operações relacioandas a cadastro de usuários",
      },
    ],
    components: {
      schemas: {
        Note: z.toJSONSchema(noteSchema),
        CreateNote: z.toJSONSchema(createNoteSchema),
        CreateNoteResponse: {
          type: "object",
          properties: {
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
        User: z.toJSONSchema(userMinimalSchema),
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
        RegisterUserDto: z.toJSONSchema(registerUserSchema),
        LoginUserDto: z.toJSONSchema(loginUserSchema),
        LoginResponse: {
          type: "object",
          properties: {
            token: {
              type: "string",
              example:
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzZmE4NWY2NC01NzE3LTQ1NjItYjNmYy0yYzk2M2Y2NmFmYTYiLCJpYXQiOjE2ODgwODc0MDAsImV4cCI6MTY4ODA5MTAwMH0.dQw4w9WgXcQ",
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
        UnauthorizedError: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Token inválido ou expirado!",
            },
          },
        },
      },
    },
  },
  apis: [
    "./src/features/notes/notes.route.ts",
    "./src/features/users/users.routes.ts",
    "./src/features/auth/auth.routes.ts",
  ],
};

export const swaggerSpec = swaggerJSDoc(options);
