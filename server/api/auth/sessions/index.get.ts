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
        const payload = verifyAccessToken(token)

        if (!payload) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Unauthorized - Invalid token'
            })
        }

        // Pobierz sesje użytkownika
        const sessions = await sessionManagementService.getUserSessions(payload.userId)

        // Pobierz statystyki
        const stats = await sessionManagementService.getSessionStats(payload.userId)

        return {
            success: true,
            data: {
                sessions,
                stats
            }
        }

    } catch (error: any) {
        console.error('Get sessions error:', error)

        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.statusMessage || 'Failed to retrieve sessions'
        })
    }
})
