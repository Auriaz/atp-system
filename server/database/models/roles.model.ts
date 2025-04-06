import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const roles = sqliteTable('roles', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull().unique(),
    slug: text('slug').notNull().unique(), // np. "admin", "user", "editor"
    description: text('description'),
    isSystem: integer('is_system', { mode: 'boolean' }).default(false), // Zaznacz role systemowe, których nie można usunąć
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }),
})
