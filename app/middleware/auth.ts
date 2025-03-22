export default defineNuxtRouteMiddleware(async (to) => {
    const { loggedIn, user } = useUserSession()
    const sidebar = useSidebar()
    const toast = useToast()
    const nuxtApp = useNuxtApp()

    // Sprawdź czy mamy prawidłową ścieżkę
    if (!to?.path) {
        console.warn('No path provided')
        return
    }

    // Publiczne ścieżki dostępne dla wszystkich
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

    // Jeśli ścieżka jest publiczna, pozwól na dostęp
    if (publicPaths.includes(to.path)) {
        return
    }

    // Sprawdzanie czy użytkownik jest zalogowany
    if (!loggedIn.value) {
        console.log('User not logged in, redirecting to login')

        // Zapisz pierwotny cel nawigacji, aby wrócić po zalogowaniu
        // Używaj localStorage tylko po stronie klienta
        if (process.client) {
            const returnPath = to.fullPath
            if (returnPath !== '/auth/login') {
                localStorage.setItem('returnPath', returnPath)
            }
        }

        toast.add({
            title: 'Dostęp zabroniony',
            description: 'Musisz się zalogować, aby uzyskać dostęp do tej strony',
            color: 'error'
        })

        return navigateTo('/auth/login')
    }

    // Pobierz rolę zalogowanego użytkownika
    const userRole = user.value?.role || USER_ROLES.OBSERVER

    // Sprawdź czy sidebar jest zainicjalizowany
    if (sidebar?.sidebar?.value?.links) {
        const currentPath = to.path
        const links = sidebar.sidebar.value.links

        // Sprawdź, czy link istnieje w sidebarze i wymaga specjalnych uprawnień
        const requiredLink = links.find((link: any) => {
            if (!link?.to || typeof link.to !== 'string') {
                return false
            }
            return currentPath.startsWith(link.to) || currentPath === link.to
        })

        // Jeśli link istnieje i wymaga określonych uprawnień
        if (requiredLink?.requiredPermission) {
            const hasRequired = hasPermission(userRole, requiredLink.requiredPermission)

            if (!hasRequired) {
                console.log(`Access denied to ${currentPath}, required permission: ${requiredLink.requiredPermission}`)
                toast.add({
                    title: 'Niewystarczające uprawnienia',
                    description: 'Nie masz wymaganych uprawnień, aby uzyskać dostęp do tej strony',
                    color: 'error'
                })

                return navigateTo('/auth/403')
            }
        }
    }

    // Sprawdź meta wymagania strony
    if (to.meta.requiredPermission) {
        const requiredPermission = to.meta.requiredPermission as string
        const hasPagePermission = hasPermission(userRole, requiredPermission as Permission)

        if (!hasPagePermission) {
            console.log(`Access denied to ${to.path}, required permission: ${requiredPermission}`)
            toast.add({
                title: 'Niewystarczające uprawnienia',
                description: 'Nie masz wymaganych uprawnień, aby uzyskać dostęp do tej strony',
                color: 'error'
            })

            return navigateTo('/auth/403')
        }
    }

    // Specjalne sprawdzenia dla sekcji administracyjnych
    if (to.path.startsWith('/dashboard/admin') && userRole !== USER_ROLES.ADMIN) {
        console.log('Admin access denied')
        toast.add({
            title: 'Dostęp zabroniony',
            description: 'Tylko administratorzy mają dostęp do tej sekcji',
            color: 'error'
        })

        return navigateTo('/auth/403')
    }

    // Specjalne sprawdzenia dla sekcji trenera
    if (to.path.startsWith('/dashboard/coach') &&
        !hasPermission(userRole, PERMISSIONS.TRAINING_CREATE)) {
        console.log('Coach access denied')
        toast.add({
            title: 'Dostęp zabroniony',
            description: 'Tylko trenerzy mają dostęp do tej sekcji',
            color: 'error'
        })

        return navigateTo('/auth/403')
    }

    // Logowanie informacji o dostępie (pomocne podczas debugowania)
    console.log(`Access granted to ${to.path} for user with role: ${userRole}`)

    // Jeśli wszystkie warunki zostały spełnione, pozwól na dostęp
    return
})