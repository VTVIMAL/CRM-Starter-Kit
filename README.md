# Generic CRM Starter Kit

This repository is being built as a learning-first CRM starter kit using:

- `NestJS` for the backend API
- `Prisma` + `PostgreSQL` for the data layer
- `Docker Compose` for local infrastructure
- `pnpm` workspaces for package management

At the moment, this workspace snapshot mainly contains planning notes in [text.txt](/home/vimal_vt/Desktop/New%20Folder/Generic-CRM-Starter-Kit/text.txt:1). If the app files are missing when you come back, use this README as the "how we were running it" memory aid.

## Expected project shape

These are the main backend paths we were working toward:

```txt
apps/api/
  src/
    main.ts
    app.module.ts
    prisma/
      prisma.module.ts
      prisma.service.ts
    health/
      health.module.ts
      health.service.ts
      health.controller.ts
    contacts/
      contacts.module.ts
      contacts.service.ts
      contacts.controller.ts
  prisma/
    schema.prisma
    migrations/
  .env
  .env.example
  prisma.config.ts
  package.json
  tsconfig.json
  tsconfig.build.json
  nest-cli.json
```

## Backend startup checklist

When the backend files are present again, this is the order to get the API running.

### 1. Start PostgreSQL with Docker

From the repo root:

```bash
docker compose --env-file .env -f infra/docker-compose.yml up -d postgres
docker compose --env-file .env -f infra/docker-compose.yml ps
```

You want the `postgres` service to show as `healthy`.

### 2. Install dependencies

From the repo root:

```bash
pnpm install
```

If you are working only on the API package:

```bash
pnpm --filter @crm-starter-kit/api install
```

### 3. Generate Prisma Client

From `apps/api`:

```bash
pnpm exec prisma generate --config prisma.config.ts
```

Why: Prisma needs to generate the typed client before TypeScript/Nest can use model properties like `prisma.contact`.

### 4. Run migrations

From `apps/api`:

```bash
pnpm exec prisma migrate dev --name init --config prisma.config.ts
```

Use a new migration name only when the schema changes.

### 5. Start the Nest API

From the repo root:

```bash
pnpm --filter @crm-starter-kit/api run dev
```

Or from `apps/api`:

```bash
pnpm run dev
```

### 6. Smoke test the API

```bash
curl http://localhost:3000/health
curl http://localhost:3000/contacts
```

If `/contacts` returns `[]`, that is still success; it just means the database has no contact rows yet.

## Environment setup

We were using two different `DATABASE_URL` values depending on where code was running:

- Root `.env` for Docker Compose:
  - host should be `postgres`
- `apps/api/.env` for local Prisma/Nest execution from the host machine:
  - host should be `localhost`

### Example root `.env`

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=root
POSTGRES_DB=crm
DATABASE_URL=postgresql://postgres:root@postgres:5432/crm
```

### Example `apps/api/.env`

```env
PORT=3000
DATABASE_URL=postgresql://postgres:root@localhost:5432/crm
JWT_SECRET=change-me
```

## Prisma notes

- Prisma 7 uses `prisma.config.ts`
- `schema.prisma` should live in `apps/api/prisma/`
- `PrismaService` extends `PrismaClient`
- `PrismaService` uses:
  - `pg`
  - `@prisma/adapter-pg`
- `onModuleInit()` connects Prisma
- `onModuleDestroy()` disconnects Prisma

## Contacts API notes

We had already established these patterns:

- `GET /contacts`
  - list contacts
- `GET /contacts/:id`
  - fetch one contact by numeric id
- `GET /contacts?q=...`
  - search by first name, last name, or email
- `page` and `limit`
  - for pagination

Important Nest + Prisma concepts we used:

- route params are strings, so use `ParseIntPipe` for numeric ids
- query params are strings, so convert or parse them before service logic
- `findMany()` returns arrays
- `findUnique()` returns one row or `null`
- empty array `[]` is not an error

## Current domain model summary

The current CRM model planning notes live in [text.txt](/home/vimal_vt/Desktop/New%20Folder/Generic-CRM-Starter-Kit/text.txt:1), including:

- `User`
- `Contact`
- `Company`
- `Deal`
- `Activity`
- `Task`
- `CustomFieldDefinition`
- `CustomFieldValue`

## If something breaks

### API starts but `DATABASE_URL` is missing

Make sure:

- `apps/api/.env` exists
- `main.ts` loads env before Nest bootstraps
- you are starting the API from the correct package context

### Prisma model methods like `prisma.contact` are missing

Run:

```bash
cd apps/api
pnpm exec prisma generate --config prisma.config.ts
```

Then restart the TypeScript server/editor if needed.

### Docker Compose says env vars are missing

Use the explicit env file:

```bash
docker compose --env-file .env -f infra/docker-compose.yml up -d postgres
```

## Recommended next implementation order

When resuming development:

1. Restore or recreate the `apps/api` source files if they are missing
2. Bring up Postgres
3. Regenerate Prisma Client
4. Start the API
5. Continue with:
   - `ContactsModule` pagination/search cleanup
   - `CompaniesModule`
   - `AuthModule`

