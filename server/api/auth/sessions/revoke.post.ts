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

        // Pobierz body zapytania
        const body = await readBody(event)
        const { currentSessionId, revokeAll = false } = body

        let revokedCount = 0

        if (revokeAll) {
            // Usuń wszystkie sesje
            revokedCount = await sessionManagementService.revokeAllSessions(payload.userId)
        } else if (currentSessionId) {
            // Usuń wszystkie sesje oprócz aktualnej
            revokedCount = await sessionManagementService.revokeAllOtherSessions(
                payload.userId,
                currentSessionId
            )
        } else {
            throw createError({
                statusCode: 400,
                statusMessage: 'Missing currentSessionId or revokeAll parameter'
            })
        }

        return {
            success: true,
            message: `Successfully revoked ${revokedCount} session(s)`,
            revokedCount
        }

    } catch (error: any) {
        console.error('Revoke sessions error:', error)

        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.statusMessage || 'Failed to revoke sessions'
        })
    }
})
