export interface MenuItem {
    label?: string
    name: string
    icon?: string
    to: string
    items?: MenuItem[]
}