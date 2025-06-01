import { relations } from 'drizzle-orm'
import { users } from './models/users.model'
import { roles } from './models/roles.model'
import { userRoles } from './models/user_roles.model'
import { userActivities } from './models/user_activities.model'
import { oAuthAccounts } from './models/o_auth_accounts.model'
import { refreshTokens } from './models/refresh_tokens.model'
import { verificationTokens } from './models/verification_tokens.model'

export { users, roles, userRoles, userActivities, oAuthAccounts, refreshTokens, verificationTokens }


// Definicja relacji dla userRoles
export const userRolesRelations = relations(userRoles, ({ one }) => ({
    user: one(users, {
        fields: [userRoles.userId],
        references: [users.id],
        relationName: 'userRoles'  // Nazwana relacja
    }),
    role: one(roles, {
        fields: [userRoles.roleId],
        references: [roles.id]
    }),
    assignedByUser: one(users, {
        fields: [userRoles.assignedBy],
        references: [users.id],
        relationName: 'assignedRoles'  // Inna nazwana relacja
    })
}));

// Definicja relacji dla users
export const usersRelations = relations(users, ({ many }) => ({
    roles: many(userRoles, {
        relationName: 'userRoles'  // Ta sama nazwa co wyżej
    }),
    assignedRoles: many(userRoles, {
        relationName: 'assignedRoles'  // Ta sama nazwa co wyżej
    }),
    refreshTokens: many(refreshTokens),
    verificationTokens: many(verificationTokens)
}));

export const rolesRelations = relations(roles, ({ many }) => ({
    users: many(userRoles)
}))

export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
    user: one(users, {
        fields: [refreshTokens.userId],
        references: [users.id]
    })
}))

export const verificationTokensRelations = relations(verificationTokens, ({ one }) => ({
    user: one(users, {
        fields: [verificationTokens.userId],
        references: [users.id]
    })
}))

