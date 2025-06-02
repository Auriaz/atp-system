export async function requirePermission(event: any, permission: Permission): Promise<void> {
    const session = await getUserSession(event)

    if (!session?.user?.id) {
        if (!hasPermissionMultiRole([USER_ROLES.OBSERVER], permission)) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Authentication required'
            })
        }
        return
    }

    const userRoles: RoleSlugs = await getUserRoleSlugs(session.user.id)

    if (!userRoles?.length) {
        userRoles.push(USER_ROLES.USER)
    }

    const hasRequiredPermission = hasPermissionMultiRole(userRoles, permission)

    if (!hasRequiredPermission) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Insufficient permissions'
        })
    }
}

export async function getCurrentUserRoles(event: any): Promise<RoleSlugs> {
    const session = await getUserSession(event)

    if (!session?.user?.id) {
        return [USER_ROLES.OBSERVER]
    }

    const userRoles: RoleSlugs = await getUserRoleSlugs(session.user.id)

    if (!userRoles?.length) {
        return [USER_ROLES.USER]
    }

    return userRoles
}

export async function requireAnyPermission(event: any, permissions: Permission[]): Promise<void> {
    const userRoles = await getCurrentUserRoles(event)

    const hasAnyPermission = permissions.some(permission =>
        hasPermissionMultiRole(userRoles, permission)
    )

    if (!hasAnyPermission) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Insufficient permissions'
        })
    }
}
