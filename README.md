# Projeto Notas (ExpressJS)

> Versão 1.0.0 — Backend Express com TypeScript, Zod, Injeção de Dependência (tsyringe).

## Sumário

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Requisitos](#requisitos)
- [Configuração](#configuração)
- [Execução](#execução)
- [Scripts NPM](#scripts-npm)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Endpoints](#endpoints)
- [Qualidade de Código](#qualidade-de-código)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Boas Práticas e Convenções](#boas-práticas-e-convenções)
- [Troubleshooting](#troubleshooting)
- [Licença](#licença)

## Visão Geral

Este projeto implementa uma API RESTful para gestão de recursos do domínio do sistema (ex.: notas, usuários e autenticação). O foco é manter uma arquitetura limpa (SOLID), validações robustas e camadas bem definidas.

### Stack

- **Express** para camada HTTP (roteamento, middlewares).
- **TypeScript** para tipagem estática e DX aprimorada.
- **Zod** para validação de schemas/DTOs.
- **tsyringe** para Injeção de Dependência (DI).
- **JWT** para autenticação e autorização.
- **bcrypt** para hashing de senhas.
- **cors** habilitado para clientes externos.
- **helmet** para headers de segurança.
- **better-sqlite3** como driver de banco de dados SQLite (persistência local, simples e performática).
- **Redis** para cache/blacklist de tokens e suporte a sessões/processos assíncronos.

### Camadas

- **Controllers**: orquestram requisições/respostas.
- **Services**: regras de negócio, orquestração entre repositórios.
- **Repositories**: acesso a dados.
- **DTOs/Validators**: contrato de entrada/saída com Zod.
- **Middlewares**: autenticação, erros, logs, CORS, etc.

## Requisitos

- Node.js 18+
- Yarn ou NPM

## Configuração

1. Clone o repositório e instale dependências:

```bash
npm install
# ou
yarn
```

2. Crie o arquivo `.env` na raiz do projeto (baseie-se em `.env.example` se disponível).

3. (Opcional) Ajuste portas, logs e níveis de segurança conforme necessidade.

## Execução

### Desenvolvimento

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Produção

```bash
npm run start
```

## Scripts NPM

- `start`: `node dist/main.js`
- `dev`: `ts-node-dev --respawn --transpile-only src/main.ts`
- `build`: `tsc`
- `lint`: `eslint src/**/*.ts`
- `format`: `prettier --write src/**/*.ts`
- `prepare`: `husky install`

## Variáveis de Ambiente

O projeto utiliza um arquivo `.env` na raiz, baseado em `.env.example`.  
Essas variáveis controlam portas, autenticação, criptografia e conexões externas.

| Variável                 | Descrição                                                                 |
| ------------------------ | ------------------------------------------------------------------------- |
| `PORT`                   | Porta onde o servidor Express será executado. Ex: `3333`.                 |
| `DATABASE_PATH`          | Caminho do banco de dados (por exemplo, SQLite). Ex: `./database.sqlite`. |
| `BCRYPT_SALT_ROUNDS`     | Número de rounds de salt para hash de senha com bcrypt. Ex: `10`.         |
| `JWT_SECRET`             | Chave secreta usada para assinar tokens JWT de acesso.                    |
| `JWT_EXPIRES_IN`         | Tempo de expiração do token de acesso. Ex: `15m`, `1h`, `7d`.             |
| `JWT_REFRESH_SECRET`     | Chave secreta usada para assinar tokens de refresh.                       |
| `JWT_REFRESH_EXPIRES_IN` | Tempo de expiração do token de refresh. Ex: `7d`, `30d`.                  |
| `REDIS_URL`              | URL de conexão com o Redis.                                               |
| `NODE_ENV`               | Ambiente de execução: `development`, `production` ou `test`.              |

> **Dica:**
>
> - Mantenha segredos (`JWT_SECRET`, `JWT_REFRESH_SECRET`) fora do repositório.
> - Em produção, defina `NODE_ENV=production` para otimizar desempenho.
> - Configure o Redis apenas se sua camada de cache ou autenticação exigir.

## Endpoints

| Método | Caminho     | Fonte                                |
| ------ | ----------- | ------------------------------------ |
| DELETE | `/:id`      | `src/features/notes/notes.route.ts`  |
| DELETE | `/:id`      | `src/features/users/users.routes.ts` |
| GET    | `/`         | `src/features/notes/notes.route.ts`  |
| GET    | `/`         | `src/features/users/users.routes.ts` |
| GET    | `/:id`      | `src/features/users/users.routes.ts` |
| GET    | `/logout`   | `src/features/auth/auth.routes.ts`   |
| GET    | `/me`       | `src/features/auth/auth.routes.ts`   |
| GET    | `/refresh`  | `src/features/auth/auth.routes.ts`   |
| POST   | `/`         | `src/features/notes/notes.route.ts`  |
| POST   | `/login`    | `src/features/auth/auth.routes.ts`   |
| POST   | `/register` | `src/features/auth/auth.routes.ts`   |
| PUT    | `/:id`      | `src/features/notes/notes.route.ts`  |
| PUT    | `/:id`      | `src/features/users/users.routes.ts` |

> **Observação:** Prefixos globais (ex.: `/api`) podem ser aplicados em `app.ts`/`server.ts`. Consulte os arquivos de rotas para o payload esperado e validações de Zod.

## Qualidade de Código

- **ESLint** configurado para padronização e análise estática.
- **Prettier** para formatação consistente.
- **tsconfig.json** com strict mode recomendado.

## Estrutura de Pastas

```text
projeto-notas-expressjs/
├── src/
│   ├── app.ts                 # Configuração principal do Express
│   ├── main.ts                # Ponto de entrada da aplicação
│   ├── routes.ts              # Definição das rotas principais
│   ├── database/              # Configuração e migrações do banco de dados
│   │   ├── connection.ts
│   │   ├── migrate.ts
│   │   └── migrations/        # Arquivos de migração SQL
│   ├── features/              # Módulos de funcionalidades (Auth, Notes, Users)
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.service.ts
│   │   │   └── dtos/
│   │   ├── notes/
│   │   │   ├── notes.controller.ts
│   │   │   ├── notes.route.ts
│   │   │   ├── notes.repository.ts
│   │   │   ├── notes.service.ts
│   │   │   └── dtos/
│   │   └── users/
│   │       ├── users.controller.ts
│   │       ├── users.routes.ts
│   │       ├── users.repository.ts
│   │       ├── users.service.ts
│   │       └── dtos/
│   └── shared/                # Módulos compartilhados (erros, middleware, config)
│       ├── config/
│       │   ├── container.ts   # Configuração do tsyringe (DI)
│       │   └── swagger.ts     # Configuração do Swagger
│       ├── errors/            # Classes de erros customizadas
│       ├── middleware/        # Middlewares globais (autenticação, tratamento de erros, rate limit)
│       ├── redis/             # Configuração do cliente Redis
│       └── services/          # Serviços compartilhados (ex: blacklist de tokens)
├── .env.exemple               # Exemplo de variáveis de ambiente
├── package.json               # Dependências e scripts do projeto
├── tsconfig.json              # Configuração do TypeScript
└── README.md                  # Este arquivo
```

## Boas Práticas e Convenções

- Commits seguindo Conventional Commits (`feat:`, `fix:`, `chore:`...).
- PRs pequenas e testáveis; mantenha cobertura de testes.
- Tratamento centralizado de erros e logs estruturados.
- Validação de entrada com Zod nos DTOs.
- Services sem dependência de Express (testáveis).
- Repositórios com interfaces (facilitam mocks em testes).
- Nunca exponha segredos no repositório.

## Troubleshooting

- **Porta em uso**: altere `PORT` no `.env`.
- **Falha nas migrações**: valide `DATABASE_URL` e conectividade.
- **CORS**: ajuste a whitelist no middleware de CORS.
- **Tipos quebrados**: rode `npm run build` para feedback do TypeScript.

## Licença

Distribuído sob a licença MIT. Consulte `LICENSE` se presente.
