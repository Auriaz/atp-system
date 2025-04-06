import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { users } from '../schema'

export const oAuthAccounts = sqliteTable('oauth_accounts', {
    id: integer('id').primaryKey({ autoIncrement: true }), // np. 'google', 'facebook'
    userId: integer('user_id').notNull().references(() => users.id),
    provider: text('provider').notNull(),
    providerUserId: text('provider_user_id').notNull(),
    accessToken: text('access_token').notNull(),
    refreshToken: text('refresh_token'),
    providerData: text('provider_data'),
    email: text('email'),
    username: text('username'),
    avatarUrl: text('avatar_url'),
    expiresAt: integer('expires_at').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }),
})