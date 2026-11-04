import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

let client: postgres.Sql | null = null;
export let db: ReturnType<typeof drizzle<typeof schema>> | null = null;

if (connectionString) {
  try {
    client = postgres(connectionString, {
      max: process.env.NODE_ENV === "production" ? 10 : 2,
      idle_timeout: 20,
      connect_timeout: 10,
    });
    db = drizzle(client, { schema });
  } catch (error) {
    console.warn(
      "⚠️ Não foi possível conectar ao PostgreSQL. Usando fallback local:",
      error,
    );
  }
}

export { schema };
