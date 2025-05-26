/**
 * Middleware służący do kontroli dostępu do stron w zależności od uprawnień użytkownika.
 * Jest uruchamiany przy każdej nawigacji i decyduje czy użytkownik ma dostęp do żądanej strony.
 * @see https://nuxt.com/docs/guide/directory-structure/middleware
 */
export default defineNuxtRouteMiddleware((to) => {
    // Podstawowe hooki i stany
    const { isAuthenticated, session } = useAuth()
    const { can } = usePermissions() // Używamy zaktualizowanego composable
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
    }    // 2. Weryfikacja logowania
    if (!isAuthenticated.value) {
        // Zapisz ścieżkę, do której użytkownik próbował się dostać (tylko po stronie klienta)
        if (import.meta.client && to.path !== '/auth/login') {
            localStorage.setItem('returnPath', to.fullPath)
        }

        toast.add({
            title: 'Access Denied',
            description: 'You must be logged in to access this page',
            color: 'error'
        })

        return navigateTo('/auth/login')
    }

    // 3. Sprawdzenie wymaganych uprawnień na podstawie meta strony
    if (to.meta.requiredPermission) {
        const requiredPermission = to.meta.requiredPermission as Permission

        // Używamy composable 'can' do sprawdzenia uprawnień, które obsługuje wiele ról
        if (!can(requiredPermission)) {
            toast.add({
                title: 'Insufficient Permissions',
                description: 'You don\'t have the required permissions to access this page',
                color: 'error'
            })

            return navigateTo('/auth/403')
        }
    }

    // 4. Obsługa specjalnych przypadków dostępu

    // Sekcja administracyjna - sprawdzamy czy użytkownik ma rolę ADMIN
    if (to.path.startsWith('/dashboard/admin') && !session.value?.roles?.includes(USER_ROLES.ADMIN)) {
        toast.add({
            title: 'Access Denied',
            description: 'Only administrators have access to this section',
            color: 'error'
        })

        return navigateTo('/auth/403')
    }

    // Sekcja trenera - używamy 'can' do sprawdzenia uprawnień
    if (to.path.startsWith('/dashboard/coach') && !can(PERMISSIONS.TRAINING_CREATE)) {
        toast.add({
            title: 'Access Denied',
            description: 'Only coaches have access to this section',
            color: 'error'
        })

        return navigateTo('/auth/403')
    }

    // 5. Sprawdzenie uprawnień na podstawie linków sidebar 
    const sidebar = useSidebar()
    const sidebarLinks = sidebar?.sidebar?.value?.links || []

    if (sidebarLinks.length > 0) {
        const currentPath = to.path

        // Szukamy wszystkich pasujących linków (może być kilka)
        const matchingLinks = sidebarLinks
            .filter((link: SidebarLink) =>
                link?.to && typeof link.to === 'string' &&
                (currentPath.startsWith(link.to) || currentPath === link.to)
            )
            .sort((a, b) => (b.to?.length || 0) - (a.to?.length || 0)) // Sortuj od najdłuższej ścieżki

        // Sprawdź najbardziej szczegółowy link (najdłuższa pasująca ścieżka)
        const mostSpecificLink = matchingLinks[0]

        if (mostSpecificLink?.requiredPermission && !can(mostSpecificLink.requiredPermission)) {
            toast.add({
                title: 'Insufficient Permissions',
                description: 'You don\'t have the required permissions to access this page',
                color: 'error'
            })

            return navigateTo('/auth/403')
        }
    }

    // Logowanie dostępu (w trybie developerskim)
    if (import.meta.dev) {
        console.log(`Access granted to ${to.path} for user with roles: ${session.value.roles.join(', ') || 'none'}`)
    }

    // Dostęp przyznany
    return
})