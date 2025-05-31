import type { UserSession } from '#auth-utils';
import { USER_ROLES } from '../../shared/utils/roles.constants';
import type { Permission } from '../../shared/utils/permissions.constants';
import { hasPermissionMultiRole, hasAllPermissionsMultiRole, hasAnyPermissionMultiRole } from '../../shared/utils/permissions.constants';

export function usePermissions() {
  // Użyj istniejącej sesji lub proxy, które będzie reaktywnie aktualizowane
  const userSession = useState<UserSession>('user-session');
  // Użyj useUserSession z Nuxt Auth do uzyskania sesji
  const { session: authSession } = useUserSession();

  // Połączenie obu źródeł sesji dla większej niezawodności
  const combinedSession = computed(() => {
    return userSession.value || authSession.value;
  });

  // Pobierz role użytkownika
  const userRoles = computed(() => {
    // Najpierw spróbuj pobrać z userSession
    if (userSession.value?.roles && Array.isArray(userSession.value.roles) && userSession.value.roles.length > 0) {
      return userSession.value.roles;
    }
    // Następnie spróbuj pobrać z authSession
    else if (authSession.value?.roles && Array.isArray(authSession.value.roles) && authSession.value.roles.length > 0) {
      return authSession.value.roles;
    }
    // Fallback do roli obserwatora
    else {
      return [USER_ROLES.OBSERVER];
    }
  });

  // Sprawdź, czy użytkownik ma określone uprawnienie
  const can = (permission: Permission) => {
    // Użyj hasPermissionMultiRole do sprawdzenia uprawnień
    const result = hasPermissionMultiRole(userRoles.value, permission);

    return result;
  };

  // Sprawdź, czy użytkownik ma wszystkie z podanych uprawnień
  const canAll = (permissions: Permission[]) => {
    return hasAllPermissionsMultiRole(userRoles.value, permissions);
  };

  // Sprawdź, czy użytkownik ma którekolwiek z podanych uprawnień
  const canAny = (permissions: Permission[]) => {
    return hasAnyPermissionMultiRole(userRoles.value, permissions);
  };

  return {
    userRoles,
    can,
    canAll,
    canAny
  };
}
