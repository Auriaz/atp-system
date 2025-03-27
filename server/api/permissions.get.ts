export default defineEventHandler(async (event) => {
  // Ten endpoint powinien być dostępny tylko w trybie deweloperskim
  if (process.env.NODE_ENV === 'production') {
    throw createError({
      statusCode: 404,
      message: 'Not found'
    });
  }

  const query = getQuery(event);
  const path = query.path as string;
  const permission = query.permission as string;
  const role = query.role as string;

  const result: Record<string, any> = {};

  // Znajdź uprawnienie dla ścieżki
  if (path) {
    result.pathPermission = findPermissionForPath(path);
  }

  // Znajdź ścieżki dla uprawnienia
  if (permission) {
    result.permissionPaths = findPathsForPermission(permission);
  }

  // // Sprawdź uprawnienia dla roli
  // if (role && ROLE_PERMISSIONS[role]) {
  //   result.rolePermissions = ROLE_PERMISSIONS[role];
  // }

  return result;
});
