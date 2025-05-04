import { users, roles, userRoles } from '../../database/schema'

import { eq, and, inArray } from 'drizzle-orm'
import { useDatabase } from '../database'

type User = typeof users.$inferSelect
type Role = typeof roles.$inferSelect
type UserRole = typeof userRoles.$inferSelect
type UserRoleWithRole = UserRole & { role: Role }

/**
 * Pobiera wszystkie role użytkownika
 */
export async function getUserRoles(userId: number): Promise<Role[]> {
    if (!userId) {
        throw new Error('User ID is required')
    }

    const result = await useDatabase().query.userRoles.findMany({
        where: eq(userRoles.userId, userId),
        with: {
            role: true
        }
    })

    return result.map((ur: UserRoleWithRole) => ur.role)
}

/**
 * Pobiera slugi ról użytkownika
 */
export async function getUserRoleSlugs(userId: number): Promise<RoleSlug[]> {
    if (!userId) {
        throw new Error('User ID is required')
    }

    const userRolesData = await getUserRoles(userId)
    return userRolesData.map(role => role.slug as RoleSlug)
}

/**
 * Sprawdza, czy użytkownik ma określoną rolę
 */
export async function hasRole(userId: number, roleSlugs: string | string[]): Promise<boolean> {
    if (!userId) {
        throw new Error('User ID is required')
    }

    if (!roleSlugs || (Array.isArray(roleSlugs) && roleSlugs.length === 0)) {
        return false
    }

    const slugsToCheck = Array.isArray(roleSlugs) ? roleSlugs : [roleSlugs]

    // Pobierz ID ról na podstawie ich slugów
    const roleData = await useDatabase().query.roles.findMany({
        where: inArray(roles.slug, slugsToCheck),
        columns: {
            id: true
        }
    })

    if (roleData.length === 0) return false

    const roleIds = roleData.map(r => r.id)

    // Sprawdź, czy istnieje przypisanie do którejkolwiek z tych ról
    const hasAnyRole = await useDatabase().query.userRoles.findFirst({
        where: and(
            eq(userRoles.userId, userId),
            inArray(userRoles.roleId, roleIds)
        )
    })

    return !!hasAnyRole
}

/**
 * Przypisuje rolę do użytkownika
 */
export async function assignRoleToUser(
    userId: number,
    roleSlug: string,
    assignedBy?: number
): Promise<void> {
    if (!userId) {
        throw new Error('User ID is required')
    }

    if (!roleSlug) {
        throw new Error('Role slug is required')
    }

    const db = useDatabase()

    // Znajdź rolę
    const role = await db.query.roles.findFirst({
        where: eq(roles.slug, roleSlug)
    })

    if (!role) {
        throw new Error(`Role "${roleSlug}" not found`)
    }

    // Sprawdź czy użytkownik istnieje
    const userExists = await db.query.users.findFirst({
        where: eq(users.id, userId),
        columns: { id: true }
    })

    if (!userExists) {
        throw new Error(`User with ID ${userId} not found`)
    }

    // Sprawdź czy użytkownik już ma tę rolę
    const existingAssignment = await db.query.userRoles.findFirst({
        where: and(
            eq(userRoles.userId, userId),
            eq(userRoles.roleId, role.id)
        )
    })

    if (existingAssignment) {
        // Użytkownik już ma tę rolę - nic nie rób
        return
    }

    // Przypisz rolę
    await db.insert(userRoles).values({
        userId,
        roleId: role.id,
        assignedAt: new Date(),
        // Jeśli chcesz używać assignedBy, musisz dodać tę kolumnę do modelu userRoles
        ...(assignedBy ? { assignedBy } : {})
    })
}

/**
 * Usuwa rolę użytkownika
 */
export async function removeRoleFromUser(userId: number, roleSlug: string): Promise<void> {
    if (!userId) {
        throw new Error('User ID is required')
    }

    if (!roleSlug) {
        throw new Error('Role slug is required')
    }

    const db = useDatabase()

    // Znajdź rolę
    const role = await db.query.roles.findFirst({
        where: eq(roles.slug, roleSlug)
    })

    if (!role) {
        throw new Error(`Role "${roleSlug}" not found`)
    }

    // Usuń przypisanie
    await db.delete(userRoles)
        .where(
            and(
                eq(userRoles.userId, userId),
                eq(userRoles.roleId, role.id)
            )
        )
}

/**
 * Pobiera domyślną rolę użytkownika
 * Możesz zdefiniować własną logikę priorytetyzacji ról
 */
export async function getDefaultRole(userId: number): Promise<string> {
    if (!userId) {
        throw new Error('User ID is required')
    }

    const userRolesData = await getUserRoles(userId)

    if (userRolesData.length === 0) {
        return USER_ROLES.USER // Domyślna rola, jeśli użytkownik nie ma przypisanych ról
    }

    // Priorytetyzacja ról - możesz dostosować tę logikę
    const rolePriority = [
        USER_ROLES.ADMIN,    // Najwyższy priorytet
        USER_ROLES.EDITOR,
        USER_ROLES.MANAGER,
        USER_ROLES.COACH,
        USER_ROLES.ATHLETE,
        USER_ROLES.USER      // Najniższy priorytet
    ]

    // Znajdź rolę o najwyższym priorytecie
    const roleSlugs = userRolesData.map(r => r.slug)

    for (const priorityRole of rolePriority) {
        if (roleSlugs.includes(priorityRole)) {
            return priorityRole
        }
    }

    // Jeśli żadna z priorytetowych ról nie pasuje, zwróć pierwszą dostępną
    return roleSlugs[0]
}

/**
 * Przypisuje podstawową rolę dla nowego użytkownika
 */
export async function assignDefaultUserRole(userId: number): Promise<void> {
    if (!userId) {
        throw new Error('User ID is required')
    }

    await assignRoleToUser(userId, USER_ROLES.USER)
}

/**
 * Sprawdza, czy użytkownik ma dostęp do określonego zasobu
 * na podstawie wymaganych ról
 */
export async function checkAccess(
    userId: number,
    requiredRoles: string[]
): Promise<boolean> {
    if (!userId) {
        throw new Error('User ID is required')
    }

    // Jeśli nie określono wymaganych ról, zakładamy, że dostęp jest dozwolony
    if (!requiredRoles || requiredRoles.length === 0) return true

    // Sprawdź, czy użytkownik ma którąkolwiek z wymaganych ról
    return await hasRole(userId, requiredRoles)
}

/**
 * Pobiera wszystkich użytkowników z określoną rolą
 */
export async function getUsersByRole(roleSlug: string): Promise<User[]> {
    if (!roleSlug) {
        throw new Error('Role slug is required')
    }

    // Znajdź ID roli
    const role = await useDatabase().query.roles.findFirst({
        where: eq(roles.slug, roleSlug),
        columns: { id: true }
    })

    if (!role) {
        throw new Error(`Role "${roleSlug}" not found`)
    }

    // Pobierz wszystkich użytkowników z tą rolą
    const userRolesData = await useDatabase().query.userRoles.findMany({
        where: eq(userRoles.roleId, role.id),
        with: {
            user: true
        }
    })

    return userRolesData.map(ur => ur.user)
}

/**
 * Zlicza użytkowników z określoną rolą
 */
export async function countUsersByRole(roleSlug: string): Promise<number> {
    if (!roleSlug) {
        throw new Error('Role slug is required')
    }

    const db = useDatabase()

    // Znajdź ID roli
    const role = await db.query.roles.findFirst({
        where: eq(roles.slug, roleSlug),
        columns: { id: true }
    })

    if (!role) {
        return 0
    }

    // Zlicz użytkowników z tą rolą
    const count = await db.select({ count: sql`count(*)` })
        .from(userRoles)
        .where(eq(userRoles.roleId, role.id))

    return Number(count[0]?.count) || 0
}


/**
 * Pobiera szczegółowe informacje o rolach użytkownika wraz z informacją o przypisaniu
 */
export async function getUserRolesWithAssignmentInfo(userId: number) {
    const db = useDatabase()

    return db.query.userRoles.findMany({
        where: eq(userRoles.userId, userId),
        with: {
            role: true,
            assignedByUser: true
        }
    })
}