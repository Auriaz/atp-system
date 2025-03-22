// server/middleware/check-permission.ts

/**
 * Mapowanie ścieżek API na wymagane uprawnienia
 */
const API_PERMISSION_MAP = {
  // Użytkownicy
  '/api/users': PERMISSIONS.USER_VIEW,
  '/api/users/create': PERMISSIONS.USER_CREATE,
  '/api/users/\\d+/edit': PERMISSIONS.USER_EDIT,
  '/api/users/\\d+/delete': PERMISSIONS.USER_DELETE,

  // Treningi
  '/api/trainings': PERMISSIONS.TRAINING_VIEW,
  '/api/trainings/all': PERMISSIONS.TRAINING_VIEW_ALL,
  '/api/trainings/create': PERMISSIONS.TRAINING_CREATE,
  '/api/trainings/\\d+/edit': PERMISSIONS.TRAINING_EDIT,

  // Treści
  '/api/content': PERMISSIONS.CONTENT_VIEW,
  '/api/content/create': PERMISSIONS.CONTENT_CREATE,
  '/api/content/\\d+/edit': PERMISSIONS.CONTENT_EDIT,
  '/api/content/\\d+/publish': PERMISSIONS.CONTENT_PUBLISH,

  // ... inne mapowania
};

export default defineEventHandler(async (event) => {
  // Pobierz ścieżkę żądania
  const path = getRequestURL(event).pathname;
  let userRole = USER_ROLES.OBSERVER as UserRole;
  console.log('[ PATH ] ', path);

  // Ignoruj ścieżki publiczne i autoryzacyjne
  if (path.startsWith('/api/auth/') || path === '/api/health') {
    return;
  }

  // Pobierz sesję użytkownika
  const session = await getUserSession(event);

  if (session?.user) {
    userRole = session.user.role as UserRole;
    // throw createError({
    //   statusCode: 401,
    //   message: 'Unauthorized'
    // });
  }

  // Pobierz rolę użytkownika

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

    throw createError({
      statusCode: 403,
      message: 'Insufficient privileges'
    });
  }
});
