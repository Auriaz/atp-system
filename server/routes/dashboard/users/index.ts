import { getQuery } from 'h3';

/**
 * Endpoint GET /api/dashboard/users
 * Pobiera listę użytkowników z zastosowaniem filtrowania, sortowania i paginacji
 */
export default defineEventHandler(async (event) => {
  // Sprawdź sesję użytkownika
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized access'
    });
  }

  // Pobierz role użytkownika
  const userRoles = await getUserRoleSlugs(session.user.id);

  // Sprawdź uprawnienia z wykorzystaniem cache'a
  let hasRequiredPermission = false;
  const cachedPermissions = getCachedPermissions(session.user.id);

  if (cachedPermissions) {
    // Sprawdź w cache'u
    hasRequiredPermission = cachedPermissions.has(PERMISSIONS.USER_VIEW);
  } else {
    // Jeśli nie ma w cache, oblicz wszystkie uprawnienia
    const allPermissions = getAllPermissionsForRoles(userRoles);
    await setCachedPermissions(session.user.id, allPermissions);

    hasRequiredPermission = allPermissions.includes(PERMISSIONS.USER_VIEW);
  }

  if (!hasRequiredPermission) {
    throw createError({
      statusCode: 403,
      message: 'Insufficient permissions'
    });
  }

  try {
    // Pobierz i zwaliduj parametry zapytania
    const rawQuery = getQuery(event);
    const validatedQuery = validateQuery(UserQuerySchema, rawQuery);

    // Wywołaj funkcję repozytorium dla pobierania użytkowników
    const { users: usersList, total } = await getUsersWithFilters(validatedQuery);

    // Formatowanie odpowiedzi
    return {
      success: true,
      data: usersList.map(user => ({
        ...user,
        // Dodaj formatowane daty
        // createdAtAgo: user.createdAt ? formatDistanceToNow(new Date(user.createdAt)) : null,
        // updatedAtAgo: user.updatedAt ? formatDistanceToNow(new Date(user.updatedAt)) : null,
        // // Formatuj role dla UI
        // roleNames: user.roles.map(role => ROLE_NAMES[role] || role),
        // roleColors: user.roles.map(role => USER_ROLE_COLORS[role] || 'gray'),
        // roleIcons: user.roles.map(role => USER_ROLE_ICONS[role] || 'i-lucide-user')
      })),
      pagination: {
        page: validatedQuery.page,
        limit: validatedQuery.limit,
        total,
        totalPages: Math.ceil(total / validatedQuery.limit)
      },
      meta: {
        // Dostępne role do filtrowania
        roleOptions: Object.entries(ROLE_NAMES).map(([value, label]) => ({ value, label })),
        // Dostępne statusy użytkowników
        statusOptions: [
          { value: 'all', label: 'All statuses' },
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
          { value: 'pending', label: 'Pending' },
          { value: 'suspended', label: 'Suspended' }
        ],
        // Uprawnienia zalogowanego użytkownika
        permissions: {
          canCreate: hasPermissionMultiRole(userRoles, PERMISSIONS.USER_CREATE),
          canEdit: hasPermissionMultiRole(userRoles, PERMISSIONS.USER_EDIT),
          canDelete: hasPermissionMultiRole(userRoles, PERMISSIONS.USER_DELETE),
          canAssignRoles: hasPermissionMultiRole(userRoles, PERMISSIONS.USER_ASSIGN_ROLE)
        }
      }
    };
  } catch (error) {
    console.error('Error fetching users:', error);

    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to fetch users'
    });
  }
});

