export interface SidebarLink {
    label: string
    icon: string
    to: string
    type: 'basic' | 'settings'
    requiredPermission?: Permission | null  // Zmiana: używamy uprawnień zamiast ról
    requiredRoles?: RoleSlugs | null        // Zachowujemy dla kompatybilności wstecznej
    name?: string
    tree?: {
        label: string
        icon: string
        to: string
    }[]
}

export interface Sidebar {
    isShow: boolean
    isRail: boolean
    isRightSide: boolean
    isShowHelperBar: boolean
    isShowMenuBar: boolean
    links: SidebarLink[]
}