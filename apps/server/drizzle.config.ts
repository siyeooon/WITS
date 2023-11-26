import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./schema.ts",
  driver: "mysql2",
  dbCredentials: {
    uri: "",
  },
  verbose: true,
  strict: true,
});
