import type { UserSession } from '#auth-utils';

export default defineNuxtRouteMiddleware(async (to) => {
    // Pomiń inicjalizację po stronie serwera dla niektórych operacji
    if (import.meta.server && to.path.startsWith('/api/')) return;

    // 1. Inicjalizacja i weryfikacja sesji użytkownika
    const userSession = useState<UserSession | null>('user-session');
    const { session: authSession } = useUserSession();

    // Logowanie debug (tylko w trybie dev)
    if (import.meta.dev) {
        console.log('Init middleware: Session status', {
            hasUserSession: !!userSession.value,
            hasAuthSession: !!authSession.value,
            path: to.path
        });
    }

    // 2. Weryfikacja ważności sesji
    if (userSession.value?.expiresAt) {
        const now = Date.now();
        if (Number(userSession.value.expiresAt) < now) {
            // Sesja wygasła - wyloguj użytkownika
            userSession.value = null;

            // Tylko po stronie klienta pokazujemy powiadomienie
            if (import.meta.client && to.path !== '/auth/login') {
                const toast = useToast();
                toast.add({
                    title: 'Session expired',
                    description: 'Your session has expired. Please log in again.',
                    color: 'warning'
                });
            }

            // Przekieruj na stronę logowania, jeśli próbuje uzyskać dostęp do chronionej strony
            if (!to.path.startsWith('/auth/') && !to.path.startsWith('/public/') && to.path !== '/') {
                return navigateTo('/auth/login');
            }
        }
        // 3. Obsługa "Remember Me" - przedłużenie sesji
        else if (userSession.value.rememberMe && Number(userSession.value.expiresAt) - now < 24 * 60 * 60 * 1000) {
            if (import.meta.client) {
                try {
                    await $fetch('/api/auth/refresh', { method: 'POST' });
                } catch (error) {
                    console.error('Failed to refresh auth token:', error);
                }
            }
        }
    }

    // 4. Synchronizacja sesji między useUserSession a useState
    if (authSession.value && !userSession.value) {
        userSession.value = authSession.value;
    }

    // 5. Inicjalizacja preferencji użytkownika
    if (userSession.value && !userSession.value.preferences) {
        userSession.value.preferences = {
            theme: 'system',
            notifications: true
        };
    }

    // 6. Ustawienie motywu
    if (import.meta.client && userSession.value?.preferences?.theme) {
        const colorMode = useColorMode();
        colorMode.preference = userSession.value.preferences.theme;
    }

    // 7. Obsługa cache'a uprawnień
    if (userSession.value?.user?.id) {
        const userRoles = userSession.value.roles || [];

        // Tylko po stronie klienta - cache uprawnień
        if (import.meta.client && userRoles.length > 0) {
            // Sprawdzamy, czy uprawnienia są już w cache
            const userId = userSession.value.user.id;
            const cachedPermissions = getCachedPermissions(userId);

            if (!cachedPermissions) {
                // Jeśli nie ma w cache, oblicz i zapisz
                const permissions = getAllPermissionsForRoles(userRoles);
                setCachedPermissions(userId, permissions);

                if (import.meta.dev) {
                    console.log(`Cached permissions for user ${userId}:`, permissions);
                }
            }
        }
    }
    // 8. Inicjalizacja roli gościa dla niezalogowanych
    else if (!userSession.value && !to.path.startsWith('/auth/')) {
        userSession.value = {
            roles: [USER_ROLES.OBSERVER],
            user: {} as UserSession['user'],
            expiresAt: 0,
            loggedInAt: 0,
            rememberMe: false,
            preferences: {
                theme: 'system',
                notifications: false
            }
        };
    }
});