import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { USER_STATUSES, type UserStatus } from '../../../shared/utils/user.constants'

export const users = sqliteTable('users', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    username: text('username').notNull(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    avatarUrl: text('avatar_url'),
    firstName: text('first_name'),
    lastName: text('last_name'),
    bio: text('bio'),
    // primaryRole: text('role').default(USER_ROLES.USER).$type<UserRole>(), // Default role is USER
    status: text('status').default(USER_STATUSES.ACTIVE).$type<UserStatus>(),
    isAgreedToTerms: integer('is_agreed_to_terms').notNull().default(0),
    isEmailVerified: integer('is_email_verified', { mode: 'boolean' }).notNull().default(false),
    emailVerifiedAt: integer('email_verified_at', { mode: 'timestamp' }),
    isOAuthAccount: integer('is_oauth_account', { mode: 'boolean' }).default(false),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }),
})