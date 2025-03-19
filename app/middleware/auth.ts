export default defineNuxtRouteMiddleware(async (to) => {
    const { session, loggedIn } = useUserSession()
    const { hasRequiredRoles } = useGuard()
    const sidebar = useSidebar()

    // Sprawdź czy mamy prawidłową ścieżkę
    if (!to?.path) {
        console.warn('No path provided')
        return
    }

    // Sprawdź czy sidebar jest zainicjalizowany
    if (!sidebar?.sidebar?.value?.links) {
        console.warn('Sidebar or links not initialized')
        return
    }

    const currentPath = to.path
    const links = sidebar.sidebar.value.links
    // Bezpieczniejsze sprawdzanie ścieżki
    const requiredLink = links.find(link => {
        if (!link?.to || typeof link.to !== 'string') {
            return false
        }
        return currentPath.startsWith(link.to) || currentPath === link.to
    })

    // if (requiredLink?.requiredRoles && !hasRequiredRoles(requiredLink.requiredRoles)) {
    //     console.log('Access denied, redirecting to 403')
    //     return navigateTo('/403')
    // }
})