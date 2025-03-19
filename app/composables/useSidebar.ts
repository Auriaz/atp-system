import type { Access } from '@@/types/guard'
import type { ISidebar, ISidebarLink } from '@@/types/sidebar'

export const useSidebar = () => {
  const sidebarLinks: ISidebarLink[] = [
    {
      label: 'Homepage',
      icon: 'i-heroicons-home-modern-solid',
      to: '/',
      type: 'basic' as const,
      requiredRoles: ['ROLE_USER', 'ROLE_ADMIN'] as Access[],
    },
    {
      label: 'Dashboard',
      icon: 'i-heroicons-presentation-chart-line-20-solid',
      to: '/dashboard',
      type: 'basic' as const,
      requiredRoles: ['ROLE_USER', 'ROLE_ADMIN'] as Access[],
      name: 'dashboard',
      tree: [
        {
          label: 'Dashboard',
          icon: 'i-heroicons-presentation-chart-line-20-solid',
          to: '/dashboard',
        },
      ],
    },
    {
      label: 'Media',
      icon: 'i-material-symbols-media-link',
      to: '/dashboard/media',
      type: 'basic' as const,
      requiredRoles: ['ROLE_USER', 'ROLE_ADMIN'] as Access[],
      name: 'dashboard-media',
      tree: [
        {
          label: 'Dashboard',
          icon: 'i-heroicons-presentation-chart-line-20-solid',
          to: '/dashboard',
        },
        {
          label: 'Media',
          icon: 'i-material-symbols-media-link',
          to: '/dashboard/media',
        },
      ],
    },
    {
      label: 'Chat',
      icon: 'i-heroicons-chat-bubble-left-right-16-solid',
      to: '/dashboard/chat',
      type: 'basic' as const,
      requiredRoles: ['ROLE_USER', 'ROLE_ADMIN'] as Access[],
      name: 'dashboard-chat',
      tree: [
        {
          label: 'Dashboard',
          icon: 'i-heroicons-presentation-chart-line-20-solid',
          to: '/dashboard',
        },
        {
          label: 'Chat',
          icon: 'i-heroicons-chat-bubble-left-right-16-solid',
          to: '/dashboard/chat',
        },
      ],
    },
    {
      label: 'Users Management',
      icon: 'i-heroicons-user-group-solid',
      to: '/dashboard/users',
      type: 'settings' as const,
      requiredRoles: ['ROLE_ADMIN'] as Access[],
      name: 'dashboard-users',
      tree: [
        {
          label: 'Dashboard',
          icon: 'i-heroicons-presentation-chart-line-20-solid',
          to: '/dashboard',
        },
        {
          label: 'Users',
          icon: 'i-heroicons-user-group-solid',
          to: '/dashboard/users',
        },
      ],
    },
    {
      label: 'Profile',
      icon: 'i-heroicons-user-plus-solid',
      to: '/dashboard/profile',
      type: 'settings' as const,
      requiredRoles: ['ROLE_USER', 'ROLE_ADMIN'] as Access[],
      name: 'dashboard-profile',
      tree: [
        {
          label: 'Dashboard',
          icon: 'i-heroicons-presentation-chart-line-20-solid',
          to: '/dashboard',
        },
        {
          label: 'Profile',
          icon: 'i-heroicons-user-plus-solid',
          to: '/dashboard/profile',
        },
      ],
    },
    // ... pozostałe linki
  ].filter(link => link && typeof link.to === 'string')

  const sidebar = useState<ISidebar>('sidebar', () => ({
    isShow: true,
    isRail: false,
    isRightSide: false,
    isShowHelperBar: true,
    isShowMenuBar: true,
    links: sidebarLinks,
  }))

  const rightSide = () => {
    sidebar.value.isRightSide = true
  }

  const leftSide = () => {
    sidebar.value.isRightSide = false
  }

  const switchSide = () => {
    sidebar.value.isRightSide = !sidebar.value.isRightSide
  }

  const reduceWidth = () => {
    sidebar.value.isRail = true
  }

  const enlargeWidth = () => {
    sidebar.value.isRail = false
  }

  const toggleWidth = () => {
    sidebar.value.isRail = !sidebar.value.isRail
  }

  const toggleShowMenuBar = () => {
    sidebar.value.isShowMenuBar = !sidebar.value.isShowMenuBar
  }

  return {
    sidebar,
    rightSide,
    leftSide,
    switchSide,
    reduceWidth,
    enlargeWidth,
    toggleWidth,
    toggleShowMenuBar,
  }
}
