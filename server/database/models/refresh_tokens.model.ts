import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { users } from './users.model'

export const refreshTokens = sqliteTable('refresh_tokens', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    token: text('token').notNull().unique(), // Hashed refresh token
    deviceId: text('device_id'), // Identyfikator urządzenia/przeglądarki
    userAgent: text('user_agent'), // Info o przeglądarce/urządzeniu
    ipAddress: text('ip_address'), // IP użytkownika
    isRevoked: integer('is_revoked', { mode: 'boolean' }).default(false),
    expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    lastUsedAt: integer('last_used_at', { mode: 'timestamp' }),
})
