import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { users } from '../schema'

export const userActivities = sqliteTable('user_activities', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id').notNull().references(() => users.id),
    action: text('action').notNull(), // np. 'login', 'logout', 'password_change'
    ip: text('ip'),
    userAgent: text('user_agent'),
    details: text('details'), // dodatkowe dane JSON
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
})