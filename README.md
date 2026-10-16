# G.R.A.O — Rural Management and Optimized Agriculture

A web application for managing agricultural properties and monitoring irrigation data. This repository contains both the API and the web application.

## Features

- Register and manage producers, employees, and subscription plans.
- Organize farms, fields, and crops.
- Manage devices and sensors, and record sensor readings.
- Authenticate users with JWT.
- View notifications and farm health summaries.

## Tech stack

- **Frontend:** React, TypeScript, Vite, and Material UI.
- **Backend:** Node.js, TypeScript, and Fastify.
- **Database:** PostgreSQL.
- **ORM and migrations:** Prisma.

## Prerequisites

- Node.js and npm.
- Docker Desktop with Docker Compose, or a PostgreSQL instance.

## Local setup

1. Clone the repository and install the API and frontend dependencies:

   ```bash
   git clone <REPOSITORY_URL>
   cd grao-smart-irrigation
   npm install
   npm --prefix grao-frontend install
   ```

2. Create your local environment file from the example:

   ```bash
   cp .env.example .env
   ```

   In Windows PowerShell, use `Copy-Item .env.example .env`.
   Replace all example values before running the project. The `.env` file is local and must not be committed to Git.

3. Start PostgreSQL with Docker Compose:

   ```bash
   docker compose up -d db
   ```

   Compose reads `POSTGRES_PASSWORD` from `.env`. If you use an existing PostgreSQL instance, set `DATABASE_URL` to that database's credentials, host, port, and database name.

4. Generate the Prisma client and apply the migrations:

   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. Start the API in one terminal:

   ```bash
   npm run dev
   ```

   The API is available at `http://localhost:3000`; the Swagger documentation is at `http://localhost:3000/docs`.

6. Start the frontend in a second terminal:

   ```bash
   npm --prefix grao-frontend run dev
   ```

   Vite serves the application at `http://localhost:5173`. The frontend currently sends requests to the API at `http://localhost:3000`.

## Initial data

To insert or update the three subscription plans used by the application, run:

```bash
npx prisma db seed
```

The seed synchronizes plans with IDs 1, 2, and 3. It does not delete producers, users, or other data.

## Repository structure

```text
.
├── grao-frontend/   # React web application
├── lib/             # Prisma client shared by the API
├── prisma/          # Schema, migrations, and seed
└── src/              # Fastify API
```

## License

Distributed under the MIT License. See [LICENSE](./LICENSE).
