import type { Access } from './guard'

export interface ISidebarLink {
    label: string
    icon: string
    to: string
    type: 'basic' | 'settings'
    requiredRoles: Access[] // Role wymagane do wyświetlenia i dostępu
    name?: string
    tree?: {
        label: string
        icon: string
        to: string
    }[]
}

export interface ISidebar {
    isShow: boolean
    isRail: boolean
    isRightSide: boolean
    isShowHelperBar: boolean
    isShowMenuBar: boolean
    links: ISidebarLink[]
}