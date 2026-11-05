import path from "node:path";
import { loadEnvConfig } from "@next/env";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

async function main() {
  loadEnvConfig(process.cwd());

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.warn(
      "⚠️ DATABASE_URL não informada. Pulando execução de migrações.",
    );
    return;
  }

  console.log("Iniciando migração do banco de dados Calafrio...");
  const client = postgres(dbUrl, { max: 1 });
  const db = drizzle(client);

  const pastaMigracoes = path.resolve(process.cwd(), "drizzle");
  await migrate(db, { migrationsFolder: pastaMigracoes });
  await client.end();

  console.log("✓ Migrações aplicadas com sucesso!");
}

main().catch((err) => {
  console.error("❌ Erro fatal durante a migração do banco:", err);
  process.exit(1);
});
