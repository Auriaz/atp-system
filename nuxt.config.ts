// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  imports: {
    dirs: [
      'composables/**'
    ]
  },
  // https://nuxt.com/modules
  modules: [
    '@nuxthub/core',
    '@nuxt/eslint',
    '@nuxt/content',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxt/ui',
    'nuxt-auth-utils',
    '@vueuse/nuxt',
    '@nuxtjs/i18n'
  ],

  i18n: {
    bundle: {
      optimizeTranslationDirective: false, // Wyłącz optymalizację dyrektywy tłumaczeń
    },

    defaultLocale: 'en',
    locales: [
      { code: 'en', name: 'English', iso: 'en-US', file: 'en.json' }, // Angielski
      { code: 'pl', name: 'Polski', iso: 'pl-PL', file: 'pl.json' }, // Polski
    ],
    lazy: true, // Włącz leniwe ładowanie tłumaczeń
  },

  css: ['~/assets/css/main.css'], // Ścieżka do głównego pliku CSS

  colorMode: {
    preference: 'system', // Domyślnie użyj preferencji systemowych
    fallback: 'light',    // Domyślny tryb, gdy preferencje systemowe są niedostępne
    classSuffix: '',      // Usuń sufiks z klasy (używa 'dark' zamiast 'dark-mode')
  },

  // https://devtools.nuxt.com
  devtools: { enabled: true }, // Włącz narzędzia deweloperskie

  // Zmienne środowiskowe - https://nuxt.com/docs/getting-started/configuration#environment-variables-and-private-tokens
  runtimeConfig: {
    oauth: {
      github: {
        clientId: process.env.NUXT_OAUTH_GITHUB_CLIENT_ID, // Identyfikator klienta GitHub
        clientSecret: process.env.NUXT_OAUTH_GITHUB_CLIENT_SECRET, // Sekret klienta GitHub
        redirectUri: process.env.NUXT_OAUTH_GITHUB_REDIRECT_URI || 'http://localhost:3000/api/auth/github/callback', // Adres przekierowania
        scope: ['user:email'] // Zakres uprawnień
      },
    },

    session: {
      name: 'nuxt-session', // Nazwa sesji
      password: process.env.NUXT_SESSION_PASSWORD || 'b0b7df82584f43b5bef8bf4d5daf06c6', // Hasło sesji
      maxAge: 60 * 60 * 24 * 7, // 1 tydzień
    }
  },

  auth: {
    hash: {
      scrypt: {
        keyLength: 80, // Długość klucza
      }
    }
  },
  // https://nuxt.com/docs/getting-started/upgrade#testing-nuxt-4
  future: { compatibilityVersion: 4 }, // Wersja kompatybilności
  compatibilityDate: '2025-03-01', // Data kompatybilności

  // https://hub.nuxt.com/docs/getting-started/installation#options
  hub: {
    blob: true,
    kv: true,
    database: true,
    // cache: true,
  },

  // nitro: {
  //   experimental: {
  //     tasks: true, // Włącz eksperymentalne zadania
  //     // websocket: true,
  //   },

  // },

  // https://nuxt.com/docs/guide/directory-structure/plugins
  plugins: [
    '~/plugins/permission.directive.ts', // Wtyczka do zarządzania uprawnieniami
  ],

  // content: {
  //   renderer: {
  //     anchorLinks: {
  //       h1: true, h2: true, h3: true, h4: true, h5: true, h6: true, // Włącz linki kotwic dla nagłówków
  //     },
  //   },
  //   build: {
  //     // Konfiguracja markdown
  //     markdown: {
  //       // Spis treści
  //       toc: {
  //         depth: 4, // Głębokość spisu treści
  //         searchDepth: 5, // Głębokość wyszukiwania
  //       },

  //       // Podświetlanie składni
  //       highlight: {
  //         theme: {
  //           default: 'github-light', // Motyw domyślny
  //           dark: 'github-dark',     // Motyw ciemny
  //           sepia: 'monokai'         // Motyw sepia
  //         },
  //       },

  //     },
  //   },
  // },
  // debug: true, // Włącz debugowanie
})