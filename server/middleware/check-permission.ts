
/**
 * Middleware sprawdzające uprawnienia użytkownika do określonych endpointów API
 */
export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname;

  // Ignoruj ścieżki publiczne i autoryzacyjne
  if (path.startsWith('/api/auth/') || path === '/api/health') {
    return;
  }

  // Pobierz sesję użytkownika
  const session = await getUserSession(event);

  // Znajdź wymagane uprawnienie dla danej ścieżki
  let requiredPermission: Permission | null = null;
  for (const [pattern, permission] of Object.entries(API_PERMISSION_MAP)) {
    const regex = new RegExp(`^${pattern}$`);
    if (regex.test(path)) {
      requiredPermission = permission as Permission;
      break;
    }
  }

  // Jeśli nie znaleziono mapowania uprawnienia, kontynuuj
  if (!requiredPermission) return;

  // Jeśli użytkownik nie jest zalogowany, traktuj go jako obserwatora
  if (!session?.user?.id) {
    // Sprawdź czy obserwator ma wymagane uprawnienie
    if (!hasPermission(USER_ROLES.OBSERVER, requiredPermission)) {
      throw createError({
        statusCode: 401,
        message: 'Authentication required'
      });
    }
    return;
  }

  // Pobierz wszystkie role użytkownika
  const userRoles: RoleSlugs = await getUserRoleSlugs(session.user.id);

  // Jeśli użytkownik nie ma żadnych ról, traktuj go jako podstawowego użytkownika
  if (!userRoles?.length) {
    userRoles.push(USER_ROLES.USER);
  }

  // Sprawdź, czy użytkownik ma wymagane uprawnienie w którejkolwiek z posiadanych ról
  // Sprawdź uprawnienie z użyciem cache'a
  const hasRequiredPermission = await checkPermissionByRoles(
    session.user.id,
    userRoles,
    requiredPermission
  );

  if (!hasRequiredPermission) {
    throw createError({
      statusCode: 403,
      message: 'Insufficient permissions'
    });
  }
});

/**
 * Sprawdza czy użytkownik z dowolną z podanych ról ma określone uprawnienie
 * z wykorzystaniem cache'a
 */
async function checkPermissionByRoles(
  userId: number,
  roleSlugs: RoleSlug[],
  requiredPermission: Permission
): Promise<boolean> {
  // Spróbuj pobrać uprawnienia z cache'a
  const cachedPermissions = getCachedPermissions(userId);

  // Jeśli uprawnienia są w cache, użyj ich
  if (cachedPermissions) {
    return cachedPermissions.has(requiredPermission);
  }

  // Jeśli nie ma w cache, oblicz wszystkie uprawnienia
  const allPermissions = getAllPermissionsForRoles(roleSlugs);

  // Zapisz obliczone uprawnienia do cache'a
  setCachedPermissions(userId, allPermissions);

  // Zwróć wynik sprawdzenia
  return allPermissions.includes(requiredPermission);
}