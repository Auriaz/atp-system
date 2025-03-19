import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    username: text('username').notNull(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    avatarUrl: text('avatar_url'),
    firstName: text('first_name'),
    lastName: text('last_name'),

    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }),
})

export const userActivities = sqliteTable('user_activities', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id').notNull().references(() => users.id),
    action: text('action').notNull(), // np. 'login', 'logout', 'password_change'
    ip: text('ip'),
    userAgent: text('user_agent'),
    details: text('details'), // dodatkowe dane JSON
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
})

// export const sessions = sqliteTable('sessions', {
//     id: integer('id').primaryKey({ autoIncrement: true }),
//     userId: integer('user_id').notNull(),
//     token: text('token').notNull(),
//     expiresAt: integer('expires_at').notNull(),
//     loggedInAt: integer('logged_in_at').notNull(),
// })

// export const userRoles = sqliteTable('user_roles', {
//     userId: integer('user_id').notNull(),
//     role: text('role').notNull(),
// })

// export const userSessions = sqliteTable('user_sessions', {
//     userId: integer('user_id').notNull(),
//     sessionId: integer('session_id').notNull(),
// })

