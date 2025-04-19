export const useSidebar = () => {
  const sidebarLinks: SidebarLink[] = [
    {
      label: 'Homepage',
      icon: 'i-heroicons-home-modern-solid',
      to: '/',
      type: 'basic' as const,
      requiredPermission: null, // Dostępne dla wszystkich
    },
    {
      label: 'Dashboard',
      icon: 'i-heroicons-presentation-chart-line-20-solid',
      to: '/dashboard',
      type: 'basic' as const,
      requiredPermission: null, // Dostępne dla zalogowanych (middleware auth już to sprawdza)
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
      requiredPermission: PERMISSIONS.CONTENT_VIEW,
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
      requiredPermission: PERMISSIONS.MESSAGE_SEND,
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
      requiredPermission: PERMISSIONS.USER_VIEW,
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
      requiredPermission: PERMISSIONS.PROFILE_VIEW,
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
    {
      label: 'Documentation',
      icon: 'i-heroicons-book-open',
      to: '/docs',
      type: 'basic' as const,
      requiredPermission: null, // Dostępne dla wszystkich zalogowanych użytkowników
      name: 'docs',
      tree: [
        {
          label: 'Documentation',
          icon: 'i-heroicons-book-open',
          to: '/docs',
        },
      ],
    },
    // ... pozostałe linki
  ].filter(link => link && typeof link.to === 'string')

  const sidebar = useState<Sidebar>('sidebar', () => ({
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
