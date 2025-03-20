import { useValidatedBody } from 'h3-valibot'
import { createError, defineEventHandler } from 'h3'
import { H3Event } from 'h3'
import { loginSchema } from '~/utils/login'
import { userResource } from '~~/server/database/resources/user'
import { eq } from 'drizzle-orm'
import { createApiResponse } from '~~/server/utils/response'

export default defineEventHandler(async (event) => {
  try {
    const body = await useValidatedBody(event, loginSchema)

    // Ustawienie nagłówków bezpieczeństwa
    // setHeaders(event, {
    //   'Cache-Control': 'no-store, max-age=0, must-revalidate',
    //   'Pragma': 'no-cache'
    // })

    // Sprawdź czy użytkownik istnieje
    const user = await useDatabase()
      .select()
      .from(tables.users)
      .where(eq(tables.users.email, body.email))
      .get()

    if (!user) {
      throw createError({
        status: 401,
        message: 'Invalid email'
      })
    }

    // Sprawdź czy hasło jest poprawne
    if (!await verifyPassword(user.password, body.password)) {
      throw createError({
        status: 401,
        message: 'Invalid password'
      })
    }

    // Oblicz czas wygaśnięcia sesji - standardowo 24 godziny
    // Dla "zapamiętaj mnie" ustaw na 30 dni
    // const sessionDuration = body.rememberMe
    //   ? 30 * 24 * 60 * 60 * 1000 // 30 dni w milisekundach
    //   : 24 * 60 * 60 * 1000;     // 24 godziny w milisekundach

    // Utwórz sesję z odpowiednim czasem wygaśnięcia
    const session = await setUserSession(event, {
      user: {
        // id: user.id,
        email: user.email,
        username: user.username,
        avatarUrl: user.avatarUrl || '',
      },
      loggedInAt: Date.now(),
    })

    // Dodaj logowanie aktywności użytkownika (opcjonalnie)
    // await useDatabase()
    //   .insert(tables.userActivities)
    //   .values({
    //     userId: user.id,
    //     action: 'login',
    //     ip: getClientIp(event),
    //     userAgent: event.node.req.headers['user-agent'] || 'unknown',
    //     details: JSON.stringify({
    //       rememberMe: body.rememberMe || false,
    //       platform: getPlatformFromUserAgent(event.node.req.headers['user-agent'])
    //     }),
    //     createdAt: new Date()
    //   })
    //   .execute()

    return createApiResponse(
      { user: userResource(user), session },
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
// Funkcja pomocnicza do pobierania IP klienta
function getClientIp(event: H3Event) {
  const forwarded = event.node.req.headers['x-forwarded-for']

  if (forwarded) {
    return (typeof forwarded === 'string' ? forwarded : forwarded[0]).split(',')[0]
  }
  return event.node.req.socket.remoteAddress || ''
}

/**
 * Extracts platform information from user agent string
 * @param userAgent The user agent string from request headers
 * @returns Object with platform details
 */
function getPlatformFromUserAgent(userAgent?: string): Record<string, string | boolean> {
  if (!userAgent) return { unknown: true };

  const ua = userAgent.toLowerCase();
  const platformInfo: Record<string, string | boolean> = {
    mobile: false,
    tablet: false,
    desktop: true,
    os: 'unknown',
    browser: 'unknown',
    browserVersion: 'unknown'
  };

  // Detect device type
  if (/(android|webos|iphone|ipod|blackberry|iemobile|opera mini)/i.test(ua)) {
    platformInfo.mobile = true;
    platformInfo.desktop = false;
  } else if (/(ipad|tablet|playbook|silk)|(android(?!.*mobile))/i.test(ua)) {
    platformInfo.tablet = true;
    platformInfo.desktop = false;
  }

  // Detect operating system
  if (/windows/i.test(ua)) {
    platformInfo.os = 'Windows';
  } else if (/macintosh|mac os x/i.test(ua)) {
    platformInfo.os = 'macOS';
  } else if (/linux/i.test(ua)) {
    platformInfo.os = 'Linux';
  } else if (/android/i.test(ua)) {
    platformInfo.os = 'Android';
  } else if (/iphone|ipad|ipod/i.test(ua)) {
    platformInfo.os = 'iOS';
  }

  // Detect browser
  if (/edge|edg/i.test(ua)) {
    platformInfo.browser = 'Edge';
    const match = ua.match(/(edge|edg)\/([\d.]+)/);
    if (match) platformInfo.browserVersion = match[2];
  } else if (/firefox/i.test(ua)) {
    platformInfo.browser = 'Firefox';
    const match = ua.match(/firefox\/([\d.]+)/);
    if (match) platformInfo.browserVersion = match[1];
  } else if (/chrome/i.test(ua)) {
    platformInfo.browser = 'Chrome';
    const match = ua.match(/chrome\/([\d.]+)/);
    if (match) platformInfo.browserVersion = match[1];
  } else if (/safari/i.test(ua)) {
    platformInfo.browser = 'Safari';
    const match = ua.match(/version\/([\d.]+)/);
    if (match) platformInfo.browserVersion = match[1];
  } else if (/msie|trident/i.test(ua)) {
    platformInfo.browser = 'Internet Explorer';
    const match = ua.match(/(msie |rv:)([\d.]+)/);
    if (match) platformInfo.browserVersion = match[2];
  }

  return platformInfo;
}