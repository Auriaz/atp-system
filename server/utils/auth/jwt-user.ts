/**
 * JWT User utilities for accessing authenticated user information from JWT tokens
 */

export interface JWTUser {
    userId: number;
    email: string;
    roles: string[];
    iat?: number;
    exp?: number;
}

/**
 * Get JWT user information from event context
 * This is populated by the jwt-auth middleware
 */
export function getJWTUser(event: any): JWTUser | null {
    return event.context.jwtUser || null;
}

/**
 * Require JWT user authentication
 * Throws an error if no JWT user is found
 */
export function requireJWTUser(event: any): JWTUser {
    const jwtUser = getJWTUser(event);

    if (!jwtUser) {
        throw createError({
            statusCode: 401,
            message: 'JWT authentication required'
        });
    }

    return jwtUser;
}

/**
 * Get authenticated user ID from JWT or session
 * Falls back to session-based authentication if no JWT user found
 */
export async function getAuthenticatedUserId(event: any): Promise<number | null> {
    // Try JWT first
    const jwtUser = getJWTUser(event);
    if (jwtUser) {
        return jwtUser.userId;
    }

    // Fall back to session
    const session = await getUserSession(event);
    return session?.user?.id || null;
}

/**
 * Require authenticated user (JWT or session)
 * Returns user ID or throws error
 */
export async function requireAuthenticatedUser(event: any): Promise<number> {
    const userId = await getAuthenticatedUserId(event);

    if (!userId) {
        throw createError({
            statusCode: 401,
            message: 'Authentication required'
        });
    }

    return userId;
}

/**
 * Check if the current user (JWT or session) has specific roles
 */
export async function hasUserRoles(event: any, requiredRoles: string[]): Promise<boolean> {
    // Try JWT first
    const jwtUser = getJWTUser(event);
    if (jwtUser) {
        return requiredRoles.some(role => jwtUser.roles.includes(role));
    }

    // Fall back to session
    const session = await getUserSession(event);
    if (!session?.user?.id) {
        return false;
    }

    const userRoles = await getUserRoleSlugs(session.user.id);
    return requiredRoles.some(role => userRoles.includes(role as any));
}

/**
 * Require specific roles for the current user
 */
export async function requireUserRoles(event: any, requiredRoles: string[]): Promise<void> {
    const hasRoles = await hasUserRoles(event, requiredRoles);

    if (!hasRoles) {
        throw createError({
            statusCode: 403,
            message: `Access denied. Required roles: ${requiredRoles.join(', ')}`
        });
    }
}
