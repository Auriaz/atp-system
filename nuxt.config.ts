// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // https://nuxt.com/modules
  modules: [
    '@nuxthub/core',
    '@nuxt/eslint',
    // '@nuxt/content',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxt/ui',
    'nuxt-auth-utils',
    // '@pinia/nuxt',
    // 'pinia-plugin-persistedstate/nuxt',
    '@vueuse/nuxt'
  ],

  css: ['~/assets/css/main.css'],

  colorMode: {
    preference: 'system', // domyślnie użyj systemowych preferencji
    fallback: 'light',    // domyślny tryb, gdy preferencje systemowe są niedostępne
    classSuffix: '',      // usuwa sufiks z klasy (używa 'dark' zamiast 'dark-mode')
  },

  // https://devtools.nuxt.com
  devtools: { enabled: true },

  // Env variables - https://nuxt.com/docs/getting-started/configuration#environment-variables-and-private-tokens
  runtimeConfig: {
    oauth: {
      github: {
        clientId: process.env.NUXT_OAUTH_GITHUB_CLIENT_ID,
        clientSecret: process.env.NUXT_OAUTH_GITHUB_CLIENT_SECRET,
        redirectUri: process.env.NUXT_OAUTH_GITHUB_REDIRECT_URI || 'http://localhost:3000/api/auth/github/callback',
        scope: ['user:email']
      },
    },

    session: {
      name: 'nuxt-session',
      password: process.env.NUXT_SESSION_PASSWORD || '',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    }
  },

  auth: {
    hash: {
      scrypt: {
        keyLength: 80,
      }
    }
  },
  // https://nuxt.com/docs/getting-started/upgrade#testing-nuxt-4
  future: { compatibilityVersion: 4 },
  compatibilityDate: '2025-03-01',

  // https://hub.nuxt.com/docs/getting-started/installation#options
  hub: {
    blob: true,
    kv: true,
    database: true,
    // cache: true,
  },

  nitro: {
    experimental: {
      tasks: true,
      // websocket: true,
    },
  },

  // https://nuxt.com/docs/guide/directory-structure/plugins
  plugins: [
    '~/plugins/permission.directive.ts',
  ],
})