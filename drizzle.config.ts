import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn("DATABASE_URL not found. Drizzle migrations will not be available.");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  ...(databaseUrl && {
    dbCredentials: {
      url: databaseUrl,
    },
  }),
});
