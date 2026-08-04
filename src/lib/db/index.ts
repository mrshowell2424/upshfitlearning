import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

let db: any;

if (connectionString) {
  const client = postgres(connectionString);
  db = drizzle(client, { schema });
} else {
  // During build, DATABASE_URL may not be available
  // Create a stub that will fail at runtime if actually used
  db = new Proxy({}, {
    get: () => {
      throw new Error("DATABASE_URL environment variable is required");
    }
  });
}

export { db };
