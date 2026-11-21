import "server-only";

import { drizzle } from "drizzle-orm/neon-http";
import { schema } from "./schema";
import { sql } from "drizzle-orm";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to connect to the database.");
}

export const db = drizzle(databaseUrl, { schema });

export type RlsSessionContext = {
  userId?: string | null;
  role?: string | null;
  bypassRls?: boolean;
};

/**
 * Executes database operations within an explicit PostgreSQL Row Level Security (RLS) context.
 * Sets `app.current_user_id` and `app.current_user_role` (or `app.bypass_rls`) session settings
 * local to the transaction block.
 */
export async function withRls<T>(
  context: RlsSessionContext,
  callback: (tx: typeof db) => Promise<T>,
): Promise<T> {
  return db.transaction(async (tx) => {
    if (context.bypassRls) {
      await tx.execute(sql`SELECT set_config('app.bypass_rls', 'on', true)`);
    } else {
      if (context.userId) {
        await tx.execute(
          sql`SELECT set_config('app.current_user_id', ${context.userId}, true)`,
        );
      }
      if (context.role) {
        await tx.execute(
          sql`SELECT set_config('app.current_user_role', ${context.role}, true)`,
        );
      }
    }
    return callback(tx as unknown as typeof db);
  });
}

/**
 * Convenience helper to run database operations scoped to an authenticated user's session.
 */
export async function withUserRls<T>(
  session: { user: { id: string; role?: string | null } },
  callback: (tx: typeof db) => Promise<T>,
): Promise<T> {
  return withRls(
    {
      userId: session.user.id,
      role: session.user.role ?? "user",
    },
    callback,
  );
}
