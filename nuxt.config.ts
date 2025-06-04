// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // ================================
  // KONFIGURACJA IMPORTÓW
  // ================================
  imports: {
    dirs: [
      'composables/**', // Automatyczny import composables
      'stores/**',      // Automatyczny import stores (Pinia)
      'utils/**',       // Automatyczny import narzędzi pomocniczych
      'api/**',         // Automatyczny import API
    ]
  },

  // ================================
  // MODUŁY NUXT
  // ================================
  modules: [
    '@nuxthub/core',      // Moduł NuxtHub
    '@nuxt/eslint',       // ESLint dla Nuxt
    '@nuxt/content',      // System zarządzania treścią
    '@nuxt/fonts',        // Optymalizacja czcionek
    '@nuxt/icon',         // Ikony
    '@nuxt/image',        // Optymalizacja obrazów
    '@nuxt/scripts',      // Zarządzanie skryptami
    '@nuxt/test-utils',   // Narzędzia do testowania
    '@nuxt/ui',           // Komponenty UI
    'nuxt-auth-utils',    // Uwierzytelnianie
    '@vueuse/nuxt',       // Kompozycje VueUse
    '@nuxtjs/i18n'        // Internacjonalizacja
  ],

  // ================================
  // INTERNACJONALIZACJA (i18n)
  // ================================
  i18n: {
    bundle: {
      optimizeTranslationDirective: false, // Wyłącz optymalizację dyrektywy tłumaczeń
    },
    defaultLocale: 'en', // Domyślny język
    locales: [
      { code: 'en', name: 'English', iso: 'en-US', file: 'en.json' },
      { code: 'pl', name: 'Polski', iso: 'pl-PL', file: 'pl.json' },
    ],
    lazy: true, // Leniwe ładowanie tłumaczeń
  },

  // ================================
  // STYLE CSS
  // ================================
  css: ['~/assets/css/main.css'],

  // ================================
  // TRYB KOLORÓW (DARK/LIGHT)
  // ================================
  colorMode: {
    preference: 'system', // Użyj preferencji systemowych
    fallback: 'light',    // Tryb domyślny
    classSuffix: '',      // Bez sufiksu klasy
  },

  // ================================
  // NARZĘDZIA DEWELOPERSKIE
  // ================================
  devtools: { enabled: true },

  // ================================
  // KONFIGURACJA RUNTIME
  // ================================
  runtimeConfig: {
    // Konfiguracja OAuth
    oauth: {
      github: {
        clientId: process.env.NUXT_OAUTH_GITHUB_CLIENT_ID,
        clientSecret: process.env.NUXT_OAUTH_GITHUB_CLIENT_SECRET,
        redirectUri: process.env.NUXT_OAUTH_GITHUB_REDIRECT_URI || 'http://localhost:3000/api/auth/github/callback',
        scope: ['user:email']
      },
    },
    // Konfiguracja sesji
    session: {
      name: 'nuxt-session',
      password: process.env.NUXT_SESSION_PASSWORD || 'b0b7df82584f43b5bef8bf4d5daf06c6',
      maxAge: 60 * 60 * 24 * 7, // 1 tydzień
    },
    sessionDebug: true, // Debugowanie sesji
  },

  // ================================
  // UWIERZYTELNIANIE
  // ================================
  auth: {
    hash: {
      scrypt: {
        keyLength: 80, // Długość klucza szyfrowania
      }
    }
  },

  // ================================
  // KOMPATYBILNOŚĆ I PRZYSZŁOŚĆ
  // ================================
  future: { compatibilityVersion: 4 },
  compatibilityDate: '2025-03-01',

  // ================================
  // KONFIGURACJA NUXTHUB
  // ================================
  hub: {
    blob: true,     // Przechowywanie plików
    kv: true,       // Baza klucz-wartość
    database: true, // Baza danych
    cache: true,    // Cache
  },

  // ================================
  // KONFIGURACJA NITRO
  // ================================
  nitro: {
    experimental: {
      tasks: true,   // Eksperymentalne zadania
      openAPI: true, // Generowanie dokumentacji OpenAPI
    },
  },

  // ================================
  // WTYCZKI
  // ================================
  plugins: [
    '~/plugins/permission.directive.ts', // Dyrektywa uprawnień
  ],

  // ================================
  // REGUŁY ROUTINGU
  // ================================
  routeRules: {
    '/.well-known/**': { static: true } // Statyczne pliki .well-known
  },

  // ================================
  // KONFIGURACJA OBRAZÓW
  // ================================
  image: {
    screens: {
      xs: 320,   // Bardzo małe ekrany
      sm: 640,   // Małe ekrany
      md: 768,   // Średnie ekrany
      lg: 1024,  // Duże ekrany
      xl: 1280,  // Bardzo duże ekrany
      xxl: 1536, // Największe ekrany
    },
  },

  // ================================
  // KONFIGURACJA UI
  // ================================
  ui: {
    theme: {
      colors: [
        // Kolory podstawowe
        'primary',
        'secondary',
        'tertiary',

        // Kolory statusów
        'info',
        'success',
        'warning',
        'error',

        // Kolory ról użytkowników
        'admin',
        'coach',
        'athlete',
        'observer',
        'manager',
        'user',
        'editor',

        // Kolory priorytetów
        'neutral',
        'highest',
        'veryHigh',
        'high',
        'medium',
        'low',
        'veryLow',
        'lowest',
      ]
    }
  }
})