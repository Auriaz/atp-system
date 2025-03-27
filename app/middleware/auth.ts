/**
 * Middleware służący do kontroli dostępu do stron w zależności od uprawnień użytkownika.
 * Jest uruchamiany przy każdej nawigacji i decyduje czy użytkownik ma dostęp do żądanej strony.
 * @see https://nuxt.com/docs/guide/directory-structure/middleware
 */
export default defineNuxtRouteMiddleware((to) => {
    // Podstawowe hooki i stany
    const { loggedIn, user } = useUserSession()
    const toast = useToast()

    // Publiczne ścieżki dostępne dla wszystkich bez logowania
    const publicPaths = [
        '/',
        '/auth/login',
        '/auth/register',
        '/auth/forgot-password',
        '/auth/reset-password',
        '/auth/403',
        '/about',
        '/contact',
        '/faq',
        '/terms',
        '/privacy'
    ]

    // 1. Sprawdzenie publicznych ścieżek - szybkie wyjście
    if (publicPaths.includes(to.path)) {
        return
    }

    // 2. Weryfikacja logowania
    if (!loggedIn.value) {
        // Zapisz ścieżkę, do której użytkownik próbował się dostać (tylko po stronie klienta)
        if (process.client && to.path !== '/auth/login') {
            localStorage.setItem('returnPath', to.fullPath)
        }

        toast.add({
            title: 'Dostęp zabroniony',
            description: 'Musisz się zalogować, aby uzyskać dostęp do tej strony',
            color: 'error'
        })

        return navigateTo('/auth/login')
    }

    // Pobierz rolę użytkownika
    const userRole = user.value?.role || USER_ROLES.OBSERVER

    // 3. Sprawdzenie wymaganych uprawnień na podstawie meta strony
    if (to.meta.requiredPermission) {
        const requiredPermission = to.meta.requiredPermission as Permission

        if (!hasPermission(userRole, requiredPermission)) {
            toast.add({
                title: 'Niewystarczające uprawnienia',
                description: 'Nie masz wymaganych uprawnień, aby uzyskać dostęp do tej strony',
                color: 'error'
            })

            return navigateTo('/auth/403')
        }
    }

    // 4. Obsługa specjalnych przypadków dostępu

    // Sekcja administracyjna
    if (to.path.startsWith('/dashboard/admin') && userRole !== USER_ROLES.ADMIN) {
        toast.add({
            title: 'Dostęp zabroniony',
            description: 'Tylko administratorzy mają dostęp do tej sekcji',
            color: 'error'
        })

        return navigateTo('/auth/403')
    }

    // Sekcja trenera
    if (to.path.startsWith('/dashboard/coach') &&
        !hasPermission(userRole, PERMISSIONS.TRAINING_CREATE)) {
        toast.add({
            title: 'Dostęp zabroniony',
            description: 'Tylko trenerzy mają dostęp do tej sekcji',
            color: 'error'
        })

        return navigateTo('/auth/403')
    }

    // 5. Sprawdzenie uprawnień na podstawie linków sidebar (opcjonalne)
    const sidebar = useSidebar()
    if (sidebar?.sidebar?.value?.links) {
        const currentPath = to.path
        const requiredLink = sidebar.sidebar.value.links.find((link: any) =>
            link?.to && typeof link.to === 'string' &&
            (currentPath.startsWith(link.to) || currentPath === link.to)
        )

        if (requiredLink?.requiredPermission &&
            !hasPermission(userRole, requiredLink.requiredPermission)) {
            toast.add({
                title: 'Niewystarczające uprawnienia',
                description: 'Nie masz wymaganych uprawnień, aby uzyskać dostęp do tej strony',
                color: 'error'
            })

            return navigateTo('/dashboard/403')
        }
    }

    // Logowanie dostępu (w trybie developerskim)
    if (process.dev) {
        console.log(`Access granted to ${to.path} for user with role: ${userRole}`)
    }

    // Dostęp przyznany
    return
})