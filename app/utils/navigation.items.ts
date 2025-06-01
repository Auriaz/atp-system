import type { NavigationMenuItem, DropdownMenuItem } from '#ui/types';

// Navigation items composable - must be called within Vue context
export const useNavigationItems = () => {
  const { logout } = useAuth()

  // Main navigation menu items using UNavigationMenu structure - reactive
  const mainNavigationItems = computed<NavigationMenuItem[][]>(() => [
    [
      {
        label: 'Strona główna',
        icon: 'i-lucide-home',
        to: '/',

      },
      {
        label: 'Funkcje',
        icon: 'i-lucide-zap',
        to: '/features',
        children: [
          {
            label: 'Zarządzanie zawodnikami',
            description: 'Kompletny system zarządzania danymi sportowców',
            icon: 'i-lucide-users',
            to: '/features/athletes'
          },
          {
            label: 'Planowanie treningów',
            description: 'Narzędzia do tworzenia i zarządzania planami treningowymi',
            icon: 'i-lucide-calendar',
            to: '/features/training'
          },
          {
            label: 'Analiza wydajności',
            description: 'Zaawansowane analizy i statystyki wydajności',
            icon: 'i-lucide-trending-up',
            to: '/features/analytics'
          },
          {
            label: 'Raporty i eksport',
            description: 'Generowanie raportów i eksport danych',
            icon: 'i-lucide-file-text',
            to: '/features/reports'
          }
        ]
      },
      {
        label: 'Cennik',
        icon: 'i-lucide-credit-card',
        to: '/pricing',
      },
      {
        label: 'Dokumentacja',
        icon: 'i-lucide-book-open',
        to: '/docs',
        children: [
          {
            label: 'Przegląd dokumentacji',
            description: 'Ogólny przegląd systemu ATP',
            icon: 'i-lucide-book-open',
            to: '/docs'
          },
          {
            label: 'Pierwsze kroki',
            description: 'Rozpocznij pracę z systemem',
            icon: 'i-lucide-rocket',
            to: '/docs/getting-started'
          },
          {
            label: 'Dla użytkowników',
            description: 'Przewodnik dla użytkowników',
            icon: 'i-lucide-user',
            to: '/docs/user'
          },
          {
            label: 'Dla sportowców',
            description: 'Funkcje dla sportowców',
            icon: 'i-lucide-trophy',
            to: '/docs/athlete'
          },
          {
            label: 'Dla trenerów',
            description: 'Narzędzia dla trenerów',
            icon: 'i-lucide-whistle',
            to: '/docs/coach'
          },
          {
            label: 'Raporty',
            description: 'System raportowania',
            icon: 'i-lucide-bar-chart',
            to: '/docs/reports'
          },
          {
            label: 'FAQ',
            description: 'Często zadawane pytania',
            icon: 'i-lucide-help-circle',
            to: '/docs/faq'
          }
        ]
      }
    ],
    [
      {
        label: 'O nas',
        icon: 'i-lucide-users',
        to: '/about',
      },
      {
        label: 'Kontakt',
        icon: 'i-lucide-mail',
        to: '/contact',
      }
    ]
  ])

  // Mobile navigation menu items (vertical orientation with collapsed support) - reactive
  const mobileNavigationItems = computed<NavigationMenuItem[][]>(() => [
    [{
      label: 'ben@example.com',
      slot: 'account',
      disabled: true
    }],
    [
      {
        label: 'Główne',
        type: 'label'
      },
      ...(mainNavigationItems.value[0] || [])
    ],
    [
      {
        label: 'Dodatkowe',
        type: 'label'
      },
      ...(mainNavigationItems.value[1] || [])
    ]
  ])

  // User navigation menu items - reactive structure
  const userNavigationMobileItems = computed<NavigationMenuItem[][]>(() => [
    [
      {
        label: 'Opcje użytkownika',
        type: 'label'
      },
      {
        label: 'Profil',
        icon: 'i-lucide-user',
        to: '/dashboard/profile'
      },
      {
        label: 'Ustawienia',
        icon: 'i-lucide-settings',
        to: '/dashboard/settings'
      },
      {
        label: 'Dashboard',
        icon: 'i-lucide-layout-dashboard',
        to: '/dashboard'
      }
    ],
    [
      {
        label: 'Wyloguj się',
        icon: 'i-lucide-log-out',
        onSelect: () => logout()
      }
    ]
  ])

  const userDropdownItems = computed<DropdownMenuItem[][]>(() => [
    [{
      label: 'ben@example.com',
      slot: 'account',
      disabled: true
    }],
    [
      {
        label: 'Profil',
        icon: 'i-lucide-user',
        to: '/dashboard/profile'
      },
      {
        label: 'Ustawienia',
        icon: 'i-lucide-settings',
        to: '/dashboard/settings'
      },
      {
        label: 'Dashboard',
        icon: 'i-lucide-layout-dashboard',
        to: '/dashboard'
      }
    ],
    [
      {
        label: 'Wyloguj się',
        icon: 'i-lucide-log-out',
        onSelect: () => logout()
      }
    ]
  ])

  return {
    mainNavigationItems,
    mobileNavigationItems,
    userNavigationMobileItems,
    userDropdownItems
  }
}

// Sekcje linków w stopce
export const footerLinks = [
  {
    title: 'System',
    links: [
      // { name: 'Funkcje', url: '/#features' },
      // { name: 'Cennik', url: '/pricing' },
      { name: 'FAQ', url: '/faq' },
      // { name: 'Przewodnik', url: '/guides' },
      // { name: 'Blog', url: '/blog' }
    ]
  },
  {
    title: 'Firma',
    links: [
      { name: 'O nas', url: '/about' },
      // { name: 'Zespół', url: '/about#team' },
      // { name: 'Kariera', url: '/careers' },
      // { name: 'Partnerzy', url: '/partners' },
      // { name: 'Prasa', url: '/press' }
    ]
  },
  {
    title: 'Wsparcie',
    links: [
      { name: 'Kontakt', url: '/contact' },
      // { name: 'Pomoc', url: '/help' },
      { name: 'Dokumentacja', url: '/docs' },
      // { name: 'Status systemu', url: '/status' },
      // { name: 'Szkolenia', url: '/training' }
    ]
  },
  {
    title: 'Prawne',
    links: [
      { name: 'Regulamin', url: '/legal/terms' },
      { name: 'Prywatność', url: '/legal/privacy' },
      { name: 'Cookies', url: '/legal/cookies' },
      { name: 'Licencje', url: '/legal/licenses' },
      { name: 'RODO', url: '/legal/gdpr' }
    ]
  }
]