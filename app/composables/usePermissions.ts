export function usePermissions() {
  const { userSession } = useUserSession();

  // Obliczanie roli użytkownika z sesji
  const userRole = computed<UserRole>(() =>
    userSession.value?.user?.role || 'observer'
  );

  // Wszystkie uprawnienia użytkownika
  const userPermissions = computed(() =>
    getAllUserPermissions(userRole.value)
  );

  // Sprawdzanie czy użytkownik ma konkretne uprawnienie
  const can = (permission: Permission) =>
    hasPermission(userRole.value, permission);

  // Sprawdzanie czy użytkownik ma wszystkie z podanych uprawnień
  const canAll = (permissions: Permission[]) =>
    hasAllPermissions(userRole.value, permissions);

  // Sprawdzanie czy użytkownik ma którekolwiek z podanych uprawnień
  const canAny = (permissions: Permission[]) =>
    hasAnyPermission(userRole.value, permissions);

  return {
    userRole,
    userPermissions,
    can,
    canAll,
    canAny
  };
} export const useUsePermissions = () => {
  return ref()
}
