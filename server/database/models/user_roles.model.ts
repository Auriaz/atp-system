import { sqliteTable, integer } from 'drizzle-orm/sqlite-core'
import { users } from './users.model'
import { roles } from './roles.model'


// Tabela pośrednia (junction table) dla relacji wiele-do-wielu
export const userRoles = sqliteTable('user_roles', {
    userId: integer('user_id').notNull().references(() => users.id),
    roleId: integer('role_id').notNull().references(() => roles.id),
    // Opcjonalnie możesz dodać dodatkowe informacje, np. kiedy przyznano rolę
    assignedAt: integer('assigned_at', { mode: 'timestamp' }).notNull(),
    assignedBy: integer('assigned_by').references(() => users.id),
})

