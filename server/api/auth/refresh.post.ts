import { defineEventHandler, createError, getHeader, getCookie } from 'h3'


export default defineEventHandler(async (event) => {
    try {
        // Ustawienie nagłówków bezpieczeństwa
        setHeaders(event, {
            'Cache-Control': 'no-store, max-age=0, must-revalidate',
            'Pragma': 'no-cache'
        })

        // Pobierz refresh token z cookie lub header
        let refreshToken: string | undefined

        // Najpierw sprawdź cookie
        refreshToken = getCookie(event, 'refresh-token')

        // Jeśli nie ma w cookie, sprawdź header Authorization
        if (!refreshToken) {
            const authHeader = getHeader(event, 'authorization')
            if (authHeader && authHeader.startsWith('Bearer ')) {
                refreshToken = authHeader.slice(7) // Usuń "Bearer "
            }
        }

        // Jeśli nie ma refresh token, zwróć błąd
        if (!refreshToken) {
            throw createError({
                statusCode: 401,
                message: 'Refresh token is required'
            })
        }

        // Odśwież access token
        const tokenPair = await refreshAccessToken(refreshToken)

        if (!tokenPair) {
            throw createError({
                statusCode: 401,
                message: 'Invalid or expired refresh token'
            })
        }

        // Ustaw nowy refresh token w cookie (HTTPOnly, Secure, SameSite)
        setCookie(event, 'refresh-token', tokenPair.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60, // 30 dni
            path: '/'
        })

        // Zwróć nowy access token
        return createApiResponse(
            {
                accessToken: tokenPair.accessToken,
                expiresIn: 15 * 60 // 15 minut w sekundach
            },
            {
                description: 'Access token has been successfully refreshed'
            }
        )

    } catch (error: any) {
        console.error('Token refresh error:', error)

        // Jeśli błąd to nieważny token, wyczyść cookie
        if (error.statusCode === 401) {
            deleteCookie(event, 'refresh-token')
        }

        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Token refresh failed'
        })
    }
})
