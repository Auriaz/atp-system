/**
 * Test endpoint for JWT authentication
 * This endpoint demonstrates how to use JWT authentication in API routes
 */
import { getJWTUser, getAuthenticatedUserId } from '../utils/auth/jwt-user'

export default defineEventHandler(async (event) => {
    try {
        // This endpoint will automatically be protected by the jwt-auth middleware
        // The middleware will validate the JWT token and populate event.context.jwtUser

        // Get JWT user information
        const jwtUser = getJWTUser(event);

        // Get user ID using the utility function (works with both JWT and session)
        const userId = await getAuthenticatedUserId(event);

        if (!userId) {
            throw createError({
                statusCode: 401,
                message: 'Authentication required'
            });
        }

        // Get full user information from database
        const user = await getUserById(userId);

        if (!user) {
            throw createError({
                statusCode: 404,
                message: 'User not found'
            });
        }

        // Return authentication information
        return createApiResponse({
            message: 'JWT authentication successful',
            authMethod: jwtUser ? 'JWT' : 'Session',
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                roles: jwtUser ? jwtUser.roles : await getUserRoleSlugs(user.id)
            },
            jwtInfo: jwtUser ? {
                issuedAt: new Date((jwtUser.iat || 0) * 1000).toISOString(),
                expiresAt: new Date((jwtUser.exp || 0) * 1000).toISOString(),
                timeUntilExpiry: jwtUser.exp ? Math.max(0, jwtUser.exp - Math.floor(Date.now() / 1000)) : 0
            } : null
        }, {
            statusCode: 200,
            description: 'Authentication information retrieved successfully'
        });

    } catch (error: any) {
        console.error('JWT test error:', error);
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Internal server error'
        });
    }
});
