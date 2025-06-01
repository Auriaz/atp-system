import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { users } from './users.model'

export const verificationTokens = sqliteTable('verification_tokens', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    token: text('token').notNull().unique(),
    type: text('type').notNull(), // 'email_verification', 'password_reset'
    expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
    isUsed: integer('is_used', { mode: 'boolean' }).notNull().default(false),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$default(() => new Date()),
    usedAt: integer('used_at', { mode: 'timestamp' })
})

export type VerificationToken = typeof verificationTokens.$inferSelect
export type InsertVerificationToken = typeof verificationTokens.$inferInsert
