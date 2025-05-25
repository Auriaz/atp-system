import { useValidatedBody } from 'h3-zod'
import { createError, defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const body = await useValidatedBody(event, LoginFormSchema) as LoginForm

    // Ustawienie nagłówków bezpieczeństwa
    setHeaders(event, {
      'Cache-Control': 'no-store, max-age=0, must-revalidate',
      'Pragma': 'no-cache'
    })

    // Sprawdź czy użytkownik istnieje
    const user = await authenticateUser(body)

    // Pobierz informacje o urządzeniu
    const userAgent = event.node.req.headers['user-agent'] || 'unknown'
    const ipAddress = getClientIp(event) || undefined
    const deviceId = generateDeviceId(userAgent, ipAddress)

    // Pobierz role użytkownika
    const userRoles = await getUserRoleSlugs(user.id)

    // Generuj parę tokenów (access + refresh)
    const tokenPair = await generateTokenPair(
      user.id,
      user.email,
      userRoles,
      deviceId,
      userAgent,
      ipAddress
    )

    // Oblicz czas wygaśnięcia sesji - standardowo 24 godziny
    // Dla "zapamiętaj mnie" ustaw na 30 dni
    const sessionDuration = body.rememberMe
      ? 30 * 24 * 60 * 60 * 1000 // 30 dni w milisekundach
      : 24 * 60 * 60 * 1000;     // 24 godziny w milisekundach

    // Ustaw refresh token w HTTPOnly cookie
    setCookie(event, 'refresh-token', tokenPair.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: body.rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60, // 30 dni lub 1 dzień
      path: '/'
    })

    // Utwórz sesję z odpowiednim czasem wygaśnięcia
    await setUserSession(event, {
      user,
      roles: userRoles,
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
      {
        accessToken: tokenPair.accessToken,
        expiresIn: 15 * 60 // 15 minut w sekundach
      },
      {
        description: 'You have been successfully logged in'
      }
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
