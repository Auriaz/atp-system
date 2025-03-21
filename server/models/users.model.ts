import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { USER_STATUSES } from '../../shared/utils/constants/user.constants'

export const users = sqliteTable('users', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    username: text('username').notNull(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    avatarUrl: text('avatar_url'),
    firstName: text('first_name'),
    lastName: text('last_name'),
    bio: text('bio'),
    status: text('status').default(USER_STATUSES.ACTIVE).$type<UserStatus>(),
    isAgreedToTerms: integer('is_agreed_to_terms').notNull().default(0),
    isOAuthAccount: integer('is_oauth_account', { mode: 'boolean' }).default(false),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }),
})
