export const useGuard = () => {
  const { session } = useAuth()
  const { can } = usePermissions()

  const getUserRoles = (): string[] => {
    return session.value?.roles || []
  }

  const hasRole = (role: string): boolean => {
    const userRoles = getUserRoles()
    return userRoles.includes(role)
  }

  const hasRequiredRoles = (requiredRoles: string[]): boolean => {
    if (!requiredRoles?.length) return true
    const userRoles = getUserRoles()
    if (!userRoles.length) return false

    return requiredRoles.some(requiredRole =>
      userRoles.includes(requiredRole)
    )
  }

  // Nowa funkcja do filtrowania linków według uprawnień
  const filterLinksByPermissions = (links: SidebarLink[]): SidebarLink[] => {
    return links.filter(link => {
      // Jeśli link nie wymaga uprawnień, pokaż go
      if (!link.requiredPermission) return true

      // W przeciwnym razie sprawdź uprawnienie
      return can(link.requiredPermission)
    })
  }

  // Zachowujemy dla kompatybilności wstecznej
  const filterLinksByRoles = (links: SidebarLink[]): SidebarLink[] => {
    return links.filter(link => {
      // Jeśli link używa nowego systemu uprawnień
      if (link.requiredPermission) {
        return can(link.requiredPermission)
      }

      // Jeśli używa starego systemu ról
      if (!link.requiredRoles?.length) return true
      return hasRequiredRoles(link.requiredRoles)
    })
  }

  return {
    getUserRoles,
    hasRole,
    hasRequiredRoles,
    filterLinksByRoles,
    filterLinksByPermissions,
  }
}
