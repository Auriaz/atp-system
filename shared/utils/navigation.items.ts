import type { NavigationMenuItem } from '#ui/types';
// Menu structure for the entire application
export const navigationItems: NavigationMenuItem[] = [
  // Main page elements
  {
    label: 'Home',
    to: '/',
    icon: 'i-heroicons-home'
  },

  { label: 'About', to: '/about' },

  { label: 'Contact', to: '/contact' },

  // Documentation section
  {
    label: 'Docs',
    to: '/docs',
    icon: 'i-heroicons-book-open',
    children: [
      {
        label: 'Introduction',
        to: '/docs/public/introduction',
        icon: 'i-heroicons-information-circle',
        description: 'Introduction to documentation and basic information about the project'
      },
      {
        label: 'Getting Started',
        to: '/docs/public/getting-started',
        icon: 'i-heroicons-play',
        description: 'How to start working with the project, installation and configuration'
      },
      {
        label: 'Guides',
        to: '/docs/public/guides',
        icon: 'i-heroicons-map',
        description: 'Guides to various aspects of the project',
      },
      // {
      //   label: 'API',
      //   icon: 'i-heroicons-code-bracket',
      //   description: 'API documentation, available endpoints and their description',
      // }
    ]
  },
  // Blog section
  // {
  //   label: 'Blog',
  //   to: '/blog',
  //   icon: 'i-heroicons-newspaper'
  // },
  // FAQ
  {
    label: 'FAQ',
    to: '/faq',
    icon: 'i-heroicons-question-mark-circle'
  },
]

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