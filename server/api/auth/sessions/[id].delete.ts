import { sessionManagementService } from '~~/server/utils/services/session-management.service'
import { verifyAccessToken } from '~~/server/utils/services/jwt.service'

export default defineEventHandler(async (event) => {
    try {
        // Sprawdź autoryzację
        const authHeader = getHeader(event, 'authorization')
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Unauthorized - Missing or invalid token'
            })
        }

        const token = authHeader.slice(7)
        const payload = await verifyAccessToken(token)

        if (!payload) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Unauthorized - Invalid token'
            })
        }

        // Pobierz ID sesji z parametrów URL
        const sessionId = getRouterParam(event, 'id')
        if (!sessionId || isNaN(Number(sessionId))) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Invalid session ID'
            })
        }

        // Usuń (unieważnij) sesję
        const success = await sessionManagementService.revokeSession(
            payload.userId,
            Number(sessionId)
        )

        if (!success) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Session not found or already revoked'
            })
        }

        return {
            success: true,
            message: 'Session revoked successfully'
        }

    } catch (error: any) {
        console.error('Revoke session error:', error)

        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.statusMessage || 'Failed to revoke session'
        })
    }
})
