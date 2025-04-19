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
        to: '/docs/introduction',
        icon: 'i-heroicons-information-circle',
        description: 'Introduction to documentation and basic information about the project'
      },
      {
        label: 'Getting Started',
        to: '/docs/getting-started',
        icon: 'i-heroicons-play',
        description: 'How to start working with the project, installation and configuration'
      },
      {
        label: 'Guides',
        icon: 'i-heroicons-map',
        description: 'Guides to various aspects of the project',
      },
      {
        label: 'API',
        icon: 'i-heroicons-code-bracket',
        description: 'API documentation, available endpoints and their description',
      }
    ]
  },
  // Blog section
  {
    label: 'Blog',
    to: '/blog',
    icon: 'i-heroicons-newspaper'
  },
  // FAQ
  {
    label: 'FAQ',
    to: '/faq',
    icon: 'i-heroicons-question-mark-circle'
  },
]
