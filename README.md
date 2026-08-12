# SaaS Church

SaaS Church is a multi-tenant church management platform.

## Status

- Backend API implemented
- Frontend planned / in progress
- PostgreSQL database with Prisma ORM
- JWT authentication
- Tenant isolation by churchId

## Backend

The backend is inside the functions directory.

Stack:

- Node.js 24
- TypeScript
- Fastify
- Prisma
- PostgreSQL
- Zod
- JWT
- bcryptjs
- pnpm

## Main Modules

- Auth
- Members
- Small Groups
- Paths
- Ministries
- Events
- Finance

## Local Backend Setup

From the project root:

cd functions
pnpm install
pnpm exec prisma generate
pnpm exec prisma migrate dev
pnpm dev

## Environment Variables

Create functions/.env with:

DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="your-secret"
PORT=3002

## Test User

From functions:

pnpm exec tsx scripts/create-test-user.ts

Default credentials:

Email: admin@igreja.com
Password: senha123

## API

Base URL:

http://localhost:3002

Main routes:

GET /api/health
POST /api/auth/login

GET /api/members
POST /api/members
PUT /api/members/:id
DELETE /api/members/:id

GET /api/small-groups
POST /api/small-groups
PUT /api/small-groups/:id
DELETE /api/small-groups/:id

GET /api/paths
POST /api/paths
PUT /api/paths/:id
DELETE /api/paths/:id

GET /api/ministries
POST /api/ministries
PUT /api/ministries/:id
DELETE /api/ministries/:id

GET /api/events
POST /api/events
PUT /api/events/:id
DELETE /api/events/:id

GET /api/finance
POST /api/finance
PUT /api/finance/:id
DELETE /api/finance/:id

## Frontend

Frontend documentation will be added later after implementation.

## License

Private project.
