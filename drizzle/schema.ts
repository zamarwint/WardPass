import {
  pgTable,
  index,
  foreignKey,
  text,
  timestamp,
  uniqueIndex,
  boolean,
  pgPolicy,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import type { VaultItemType } from "@/lib/types/VaultType";

export const account = pgTable(
  "account",
  {
    id: text().primaryKey().notNull(),
    accountId: text().notNull(),
    providerId: text().notNull(),
    userId: text().notNull(),
    accessToken: text(),
    refreshToken: text(),
    idToken: text(),
    accessTokenExpiresAt: timestamp({ precision: 3, mode: "date" }),
    refreshTokenExpiresAt: timestamp({ precision: 3, mode: "date" }),
    scope: text(),
    password: text(),
    createdAt: timestamp({ precision: 3, mode: "date" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ precision: 3, mode: "date" }).notNull(),
  },
  (table) => [
    index("account_userId_idx").using(
      "btree",
      table.userId.asc().nullsLast().op("text_ops"),
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "account_userId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    pgPolicy("account_admin_all", {
      as: "permissive",
      for: "all",
      using: sql`current_setting('app.current_user_role', true) = 'admin' or current_setting('app.bypass_rls', true) = 'on'`,
      withCheck: sql`current_setting('app.current_user_role', true) = 'admin' or current_setting('app.bypass_rls', true) = 'on'`,
    }),
    pgPolicy("account_user_manage_own", {
      as: "permissive",
      for: "all",
      using: sql`${table.userId} = current_setting('app.current_user_id', true)`,
      withCheck: sql`${table.userId} = current_setting('app.current_user_id', true)`,
    }),
    pgPolicy("account_insert_unauth", {
      as: "permissive",
      for: "insert",
      withCheck: sql`current_setting('app.current_user_id', true) is null or current_setting('app.current_user_id', true) = '' or current_setting('app.bypass_rls', true) = 'on' or ${table.userId} = current_setting('app.current_user_id', true)`,
    }),
  ],
).enableRLS();

export const verification = pgTable(
  "verification",
  {
    id: text().primaryKey().notNull(),
    identifier: text().notNull(),
    value: text().notNull(),
    expiresAt: timestamp({ precision: 3, mode: "date" }).notNull(),
    createdAt: timestamp({ precision: 3, mode: "date" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ precision: 3, mode: "date" }).notNull(),
  },
  (table) => [
    index("verification_identifier_idx").using(
      "btree",
      table.identifier.asc().nullsLast().op("text_ops"),
    ),
    pgPolicy("verification_admin_all", {
      as: "permissive",
      for: "all",
      using: sql`current_setting('app.current_user_role', true) = 'admin' or current_setting('app.bypass_rls', true) = 'on'`,
      withCheck: sql`current_setting('app.current_user_role', true) = 'admin' or current_setting('app.bypass_rls', true) = 'on'`,
    }),
    pgPolicy("verification_public_flow", {
      as: "permissive",
      for: "all",
      using: sql`true`,
      withCheck: sql`true`,
    }),
  ],
).enableRLS();

export const session = pgTable(
  "session",
  {
    id: text().primaryKey().notNull(),
    expiresAt: timestamp({ precision: 3, mode: "date" }).notNull(),
    token: text().notNull(),
    createdAt: timestamp({ precision: 3, mode: "date" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ precision: 3, mode: "date" }).notNull(),
    ipAddress: text(),
    userAgent: text(),
    userId: text().notNull(),
    impersonatedBy: text(),
  },
  (table) => [
    uniqueIndex("session_token_key").using(
      "btree",
      table.token.asc().nullsLast().op("text_ops"),
    ),
    index("session_userId_idx").using(
      "btree",
      table.userId.asc().nullsLast().op("text_ops"),
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "session_userId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    pgPolicy("session_admin_all", {
      as: "permissive",
      for: "all",
      using: sql`current_setting('app.current_user_role', true) = 'admin' or current_setting('app.bypass_rls', true) = 'on'`,
      withCheck: sql`current_setting('app.current_user_role', true) = 'admin' or current_setting('app.bypass_rls', true) = 'on'`,
    }),
    pgPolicy("session_user_manage_own", {
      as: "permissive",
      for: "all",
      using: sql`${table.userId} = current_setting('app.current_user_id', true)`,
      withCheck: sql`${table.userId} = current_setting('app.current_user_id', true)`,
    }),
    pgPolicy("session_insert_unauth", {
      as: "permissive",
      for: "insert",
      withCheck: sql`current_setting('app.current_user_id', true) is null or current_setting('app.current_user_id', true) = '' or current_setting('app.bypass_rls', true) = 'on' or ${table.userId} = current_setting('app.current_user_id', true)`,
    }),
  ],
).enableRLS();

export const user = pgTable(
  "user",
  {
    id: text().primaryKey().notNull(),
    name: text().notNull(),
    email: text().notNull(),
    emailVerified: boolean().default(false).notNull(),
    image: text(),
    createdAt: timestamp({ precision: 3, mode: "date" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ precision: 3, mode: "date" }).notNull(),
    banExpires: timestamp({ precision: 3, withTimezone: true, mode: "date" }),
    banReason: text(),
    banned: boolean(),
    role: text(),
  },
  (table) => [
    uniqueIndex("user_email_key").using(
      "btree",
      table.email.asc().nullsLast().op("text_ops"),
    ),
    pgPolicy("user_admin_all", {
      as: "permissive",
      for: "all",
      using: sql`current_setting('app.current_user_role', true) = 'admin' or current_setting('app.bypass_rls', true) = 'on'`,
      withCheck: sql`current_setting('app.current_user_role', true) = 'admin' or current_setting('app.bypass_rls', true) = 'on'`,
    }),
    pgPolicy("user_view_own", {
      as: "permissive",
      for: "select",
      using: sql`${table.id} = current_setting('app.current_user_id', true)`,
    }),
    pgPolicy("user_update_own", {
      as: "permissive",
      for: "update",
      using: sql`${table.id} = current_setting('app.current_user_id', true)`,
      withCheck: sql`${table.id} = current_setting('app.current_user_id', true) and (${table.role} is null or ${table.role} = 'user')`,
    }),
    pgPolicy("user_insert_unauth", {
      as: "permissive",
      for: "insert",
      withCheck: sql`current_setting('app.current_user_id', true) is null or current_setting('app.current_user_id', true) = '' or current_setting('app.bypass_rls', true) = 'on' or ${table.id} = current_setting('app.current_user_id', true)`,
    }),
  ],
).enableRLS();

export const vault = pgTable(
  "vault",
  {
    id: text().primaryKey().notNull(),
    name: text().notNull(),
    slug: text().notNull(),
    icon: text().notNull(),
    iconColor: text(),
    createdAt: timestamp({ precision: 3, mode: "date" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ precision: 3, mode: "date" })
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date())
      .notNull(),
    userId: text().notNull(),
    encryptedKey: text(),
    hashIv: text(),
    keyIv: text(),
    salt: text(),
    verificationHash: text(),
  },
  (table) => [
    uniqueIndex("vault_slug_key").using(
      "btree",
      table.slug.asc().nullsLast().op("text_ops"),
    ),
    index("vault_userId_idx").using(
      "btree",
      table.userId.asc().nullsLast().op("text_ops"),
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "vault_userId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    pgPolicy("vault_admin_all", {
      as: "permissive",
      for: "all",
      using: sql`current_setting('app.current_user_role', true) = 'admin' or current_setting('app.bypass_rls', true) = 'on'`,
      withCheck: sql`current_setting('app.current_user_role', true) = 'admin' or current_setting('app.bypass_rls', true) = 'on'`,
    }),
    pgPolicy("vault_user_manage_own", {
      as: "permissive",
      for: "all",
      using: sql`${table.userId} = current_setting('app.current_user_id', true)`,
      withCheck: sql`${table.userId} = current_setting('app.current_user_id', true)`,
    }),
  ],
).enableRLS();

export const vaultItem = pgTable(
  "vaultItem",
  {
    id: text().primaryKey().notNull(),
    itemType: text().$type<VaultItemType>().notNull(),
    encryptedData: text(),
    iv: text(),
    createdAt: timestamp({ precision: 3, mode: "date" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ precision: 3, mode: "date" })
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date())
      .notNull(),
    deletedAt: timestamp({ precision: 3, mode: "date" }),
    vaultId: text().notNull(),
  },
  (table) => [
    index("vaultItem_vaultId_idx").using(
      "btree",
      table.vaultId.asc().nullsLast().op("text_ops"),
    ),
    foreignKey({
      columns: [table.vaultId],
      foreignColumns: [vault.id],
      name: "vaultItem_vaultId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    pgPolicy("vault_item_admin_all", {
      as: "permissive",
      for: "all",
      using: sql`current_setting('app.current_user_role', true) = 'admin' or current_setting('app.bypass_rls', true) = 'on'`,
      withCheck: sql`current_setting('app.current_user_role', true) = 'admin' or current_setting('app.bypass_rls', true) = 'on'`,
    }),
    pgPolicy("vault_item_user_manage_own", {
      as: "permissive",
      for: "all",
      using: sql`exists (select 1 from "vault" where "vault"."id" = ${table.vaultId} and "vault"."userId" = current_setting('app.current_user_id', true))`,
      withCheck: sql`exists (select 1 from "vault" where "vault"."id" = ${table.vaultId} and "vault"."userId" = current_setting('app.current_user_id', true))`,
    }),
  ],
).enableRLS();

export const userRelations = relations(user, ({ many }) => ({
  accounts: many(account),
  sessions: many(session),
  vaults: many(vault),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}));

export const vaultRelations = relations(vault, ({ one, many }) => ({
  user: one(user, { fields: [vault.userId], references: [user.id] }),
  vaultItems: many(vaultItem),
}));

export const vaultItemRelations = relations(vaultItem, ({ one }) => ({
  vault: one(vault, { fields: [vaultItem.vaultId], references: [vault.id] }),
}));

export const schema = {
  user,
  session,
  account,
  verification,
  vault,
  vaultItem,
  userRelations,
  sessionRelations,
  accountRelations,
  vaultRelations,
  vaultItemRelations,
};
