import { pgTable, index, foreignKey, text, timestamp, uniqueIndex, boolean } from "drizzle-orm/pg-core"
import { relations, sql } from "drizzle-orm"
import type { VaultItemType } from "@/lib/types/VaultType"



export const account = pgTable("account", {
	id: text().primaryKey().notNull(),
	accountId: text().notNull(),
	providerId: text().notNull(),
	userId: text().notNull(),
	accessToken: text(),
	refreshToken: text(),
	idToken: text(),
	accessTokenExpiresAt: timestamp({ precision: 3, mode: 'date' }),
	refreshTokenExpiresAt: timestamp({ precision: 3, mode: 'date' }),
	scope: text(),
	password: text(),
	createdAt: timestamp({ precision: 3, mode: 'date' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'date' }).notNull(),
}, (table) => [
	index("account_userId_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "account_userId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const verification = pgTable("verification", {
	id: text().primaryKey().notNull(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: timestamp({ precision: 3, mode: 'date' }).notNull(),
	createdAt: timestamp({ precision: 3, mode: 'date' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'date' }).notNull(),
}, (table) => [
	index("verification_identifier_idx").using("btree", table.identifier.asc().nullsLast().op("text_ops")),
]);

export const session = pgTable("session", {
	id: text().primaryKey().notNull(),
	expiresAt: timestamp({ precision: 3, mode: 'date' }).notNull(),
	token: text().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'date' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'date' }).notNull(),
	ipAddress: text(),
	userAgent: text(),
	userId: text().notNull(),
	impersonatedBy: text(),
}, (table) => [
	uniqueIndex("session_token_key").using("btree", table.token.asc().nullsLast().op("text_ops")),
	index("session_userId_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "session_userId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const user = pgTable("user", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	emailVerified: boolean().default(false).notNull(),
	image: text(),
	createdAt: timestamp({ precision: 3, mode: 'date' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'date' }).notNull(),
	banExpires: timestamp({ precision: 3, withTimezone: true, mode: 'date' }),
	banReason: text(),
	banned: boolean(),
	role: text(),
}, (table) => [
	uniqueIndex("user_email_key").using("btree", table.email.asc().nullsLast().op("text_ops")),
]);

export const vault = pgTable("vault", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	slug: text().notNull(),
	icon: text().notNull(),
	iconColor: text(),
	createdAt: timestamp({ precision: 3, mode: 'date' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'date' }).notNull(),
	userId: text().notNull(),
	encryptedKey: text(),
	hashIv: text(),
	keyIv: text(),
	salt: text(),
	verificationHash: text(),
}, (table) => [
	uniqueIndex("vault_slug_key").using("btree", table.slug.asc().nullsLast().op("text_ops")),
	index("vault_userId_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "vault_userId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const vaultItem = pgTable("vaultItem", {
	id: text().primaryKey().notNull(),
	itemType: text().$type<VaultItemType>().notNull(),
	encryptedData: text(),
	iv: text(),
	createdAt: timestamp({ precision: 3, mode: 'date' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'date' }).notNull(),
	deletedAt: timestamp({ precision: 3, mode: 'date' }),
	vaultId: text().notNull(),
}, (table) => [
	index("vaultItem_vaultId_idx").using("btree", table.vaultId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.vaultId],
			foreignColumns: [vault.id],
			name: "vaultItem_vaultId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

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
