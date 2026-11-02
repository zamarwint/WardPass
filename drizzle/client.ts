import "server-only";

import { drizzle } from "drizzle-orm/neon-http";
import { schema } from "./schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to connect to the database.");
}

export const db = drizzle(databaseUrl, { schema });
