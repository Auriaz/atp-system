import { useValidatedBody } from 'h3-valibot'
import { createError, defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const body = await useValidatedBody(event, loginSchema) as LoginFormData

    // Ustawienie nagłówków bezpieczeństwa
    setHeaders(event, {
      'Cache-Control': 'no-store, max-age=0, must-revalidate',
      'Pragma': 'no-cache'
    })
    // Sprawdź czy użytkownik istnieje
    const user = await authenticateUser(body)

    // Oblicz czas wygaśnięcia sesji - standardowo 24 godziny
    // Dla "zapamiętaj mnie" ustaw na 30 dni
    const sessionDuration = body.rememberMe
      ? 30 * 24 * 60 * 60 * 1000 // 30 dni w milisekundach
      : 24 * 60 * 60 * 1000;     // 24 godziny w milisekundach


    // Utwórz sesję z odpowiednim czasem wygaśnięcia
    await setUserSession(event, {
      user,
      roles: await getUserRoleSlugs(user.id),
      loggedInAt: Date.now(),
      expiresAt: Date.now() + sessionDuration,
      rememberMe: body.rememberMe || false
    })

    // Dodaj logowanie aktywności użytkownika (opcjonalnie)
    await useDatabase()
      .insert(tables.userActivities)
      .values({
        userId: user.id,
        action: 'login',
        ip: getClientIp(event),
        userAgent: event.node.req.headers['user-agent'] || 'unknown',
        details: JSON.stringify({
          rememberMe: body.rememberMe || false,
          platform: getPlatformFromUserAgent(event.node.req.headers['user-agent'])
        }),
        createdAt: new Date()
      })
      .execute()
      .catch(error => console.error('Failed to log user activity:', error))

    return createApiResponse(
      null,
      { title: 'Login successful', description: 'You have been successfully logged in' }
    )
    // kod logowania
  } catch (error) {
    console.error('Detailed login error:', error);
    throw createError({
      statusCode: 500,
      message: 'Authentication error: ' + error, // zmieniono treść wiadomości z oryginalnej
      cause: error
    });
  }
})
