# API de Notas

Uma API RESTful simples para gerenciar notas, permitindo criar, ler, atualizar e deletar anotações. Este projeto foi desenvolvido como parte de um portfólio técnico, demonstrando boas práticas de desenvolvimento backend com Node.js, Express e TypeScript.

## Funcionalidades

- Criar novas notas com título e conteúdo
- Listar todas as notas
- Obter uma nota específica pelo ID
- Atualizar notas existentes
- Deletar notas
- Documentação interativa da API

## Pré-requisitos

- Node.js v18+
- npm (geralmente vem com o Node.js)

## Instalação

Para instalar as dependências do projeto, execute:

```bash
npm install
```

## Rodando o projeto

### Modo de desenvolvimento

Para rodar o projeto em modo de desenvolvimento com recarregamento automático:

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3333` por padrão.

### Build para produção

Para gerar uma versão otimizada para produção:

```bash
npm run build
```

### Rodando em produção

Após gerar o build, você pode iniciar o servidor com:

```bash
npm start
```

## Testes

Para rodar os testes automatizados:

```bash
npm test
```

## Documentação da API

A API possui documentação interativa gerada com Swagger. Após iniciar o servidor, você pode acessar a documentação em:

```
http://localhost:3333/api-docs
```

A documentação inclui:
- Descrição de todos os endpoints
- Exemplos de requisições e respostas
- Informações sobre códigos de status
- Validações de entrada

## Estrutura da API

- `GET /api/notes` - Lista todas as notas
- `GET /api/notes/:id` - Obtém uma nota específica pelo ID
- `POST /api/notes` - Cria uma nova nota
- `PUT /api/notes/:id` - Atualiza uma nota existente
- `DELETE /api/notes/:id` - Deleta uma nota

## Tecnologias utilizadas

- Node.js
- Express.js
- TypeScript
- SQLite (banco de dados)
- Zod (validação de dados)
- Swagger (documentação da API)
- Jest (testes)