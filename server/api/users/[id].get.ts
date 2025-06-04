import type { UserResource } from '../../../shared/types/users.types'
import { createApiResponse } from '../../utils/services/response.service'
import { getUserById } from '../../utils/repositories/users.repositories'

/**
 * API Endpoint: GET /api/users/[id]
 * Pobiera pojedynczego użytkownika po ID
 */
export default defineEventHandler(async (event) => {
    // Sprawdź metodę HTTP
    if (!isMethod(event, 'GET')) {
        throw createError({
            statusCode: 405,
            statusMessage: 'Method Not Allowed'
        })
    }

    try {
        // Pobierz ID z parametrów URL
        const userId = getRouterParam(event, 'id')

        if (!userId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'User ID is required'
            })
        }

        // Weryfikacja sesji użytkownika
        const session = await getUserSession(event)
        if (!session?.user) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Unauthorized access'
            })
        }

        // Pobierz użytkownika z repozytorium
        const user = await getUserById(parseInt(userId))

        if (!user) {
            throw createError({
                statusCode: 404,
                statusMessage: 'User not found'
            })
        } return createApiResponse(user, {
            description: 'User retrieved successfully'
        })

    } catch (error: any) {
        console.error('Error fetching user:', error)

        // Jeśli to już jest błąd HTTP, przekaż go dalej
        if (error.statusCode) {
            throw error
        }

        // W przeciwnym razie zwróć błąd serwera
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error'
        })
    }
})
