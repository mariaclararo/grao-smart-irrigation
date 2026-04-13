//carrega variáveis arquivo .env
import "dotenv/config";
//carrega
import { defineConfig, env } from "prisma/config";
export default defineConfig({
 //define onde está schema.prisma
 schema: "prisma/schema.prisma",
 migrations: {
 //define onde estão as migrations
 path: "prisma/migrations",
 //define onde está o seed.ts
 //seed: "tsx prisma/seed.ts",
 },
 datasource: {
 // Define a conexão do banco de dados de forma segura
 url: env("DATABASE_URL"),
 },
});
