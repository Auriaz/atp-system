import type { ISidebarLink } from '~~/types/sidebar'

export const useGuard = () => {
  const { session } = useUserSession()

  const getUserRoles = (): string[] => {
    return session.value?.user?.roles || []
  }

  const hasRole = (role: string): boolean => {
    const userRoles = getUserRoles()
    return userRoles.includes(role)
  }

  const hasRequiredRoles = (requiredRoles: string[]): boolean => {
    if (!requiredRoles.length) return true
    const userRoles = getUserRoles()
    if (!userRoles.length) return false

    return requiredRoles.some(requiredRole =>
      userRoles.includes(requiredRole)
    )
  }

  const filterLinksByRoles = (links: ISidebarLink[]): ISidebarLink[] => {
    return links.filter(link => {
      if (!link.requiredRoles?.length) return true
      return hasRequiredRoles(link.requiredRoles)
    })
  }

  return {
    getUserRoles,
    hasRole,
    hasRequiredRoles,
    filterLinksByRoles,
  }
}
