// server/middleware/check-permission.ts

export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname;
  let userRole = '' as UserRole;

  // Ignoruj ścieżki publiczne i autoryzacyjne
  if (path.startsWith('/api/auth/') || path === '/api/health') {
    return;
  }

  // Pobierz sesję użytkownika
  const session = await getUserSession(event);

  // Sprawdź, czy użytkownik jest zalogowany
  if (!session?.user) {
    // Ustaw rolę użytkownika na obserwatora jeśli nie jest zalogowany
    userRole = USER_ROLES.OBSERVER as UserRole;
  } else {
    // Pobierz rolę użytkownika
    userRole = session.user.role as UserRole;
  }

  // Znajdź wymagane uprawnienie dla danej ścieżki
  let requiredPermission: string | null = null;

  for (const [pattern, permission] of Object.entries(API_PERMISSION_MAP)) {
    const regex = new RegExp(`^${pattern}$`);
    if (regex.test(path)) {
      requiredPermission = permission;
      break;
    }
  }

  // Jeśli nie znaleziono mapowania uprawnienia, kontynuuj
  if (!requiredPermission) return;

  // Sprawdź, czy użytkownik ma wymagane uprawnienie
  if (!hasPermission(userRole, requiredPermission as Permission)) {
    // Ustaw status odpowiedzi z błędem i przerwij dalsze przetwarzanie
    // event.respondWith(
    //   new Response(JSON.stringify({
    //     statusCode: 403,
    //     message: 'Forbidden'
    //   }), {
    //     status: 403,
    //     headers: {
    //       'Content-Type': 'application/json'
    //     }
    //   })
    // );

    throw createError({
      statusCode: 403,
      message: 'Forbidden'
    });

    // Zatrzymaj dalsze przetwarzanie żądania
    // return;
  }
});
