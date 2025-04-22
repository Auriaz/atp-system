// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
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
    // '@pinia/nuxt',
    // 'pinia-plugin-persistedstate/nuxt',
    '@vueuse/nuxt',
    // '@nuxtjs/i18n'
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
      password: process.env.NUXT_SESSION_PASSWORD || 'b0b7df82584f43b5bef8bf4d5daf06c6',
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
    // Poprawa kompatybilności z Cloudflare
    // esbuild: {
    //   options: {
    //     target: 'es2022',
    //     tsconfigRaw: {
    //       compilerOptions: {
    //         experimentalDecorators: true,
    //       }
    //     }
    //   }
    // }
  },

  vite: {
    build: {
      sourcemap: true,
      rollupOptions: {
        treeshake: {
          moduleSideEffects: (id) => {
            return id.includes('@cloudflare/unenv-preset') ||
              id.includes('node:process') ||
              id.includes('node:events');
          }
        }
      }
    },
    css: {
      devSourcemap: true
    }
  },

  // https://nuxt.com/docs/guide/directory-structure/plugins
  plugins: [
    '~/plugins/permission.directive.ts',
  ],

  content: {
    renderer: {
      // navigation: {
      //   fields: ['title', 'description', 'category', 'navigation', 'icon', 'version', 'requiredRole'],
      // },

      // Konfiguracja dokumentów
      // documentDriven: {
      //   page: true,
      //   navigation: true,
      //   injectSeoMeta: true,
      // },
      // Konfiguracja wyszukiwania
      // search: {
      //   full: true,
      //   fields: ['title', 'description', 'category', 'tags'],
      // },
      // Konfiguracja nagłówków
      anchorLinks: {
        h1: true, h2: true, h3: true, h4: true, h5: true, h6: true,
      },
    },
    build: {




      // Konfiguracja markdown
      markdown: {
        // Spis treści
        toc: {
          depth: 4,
          searchDepth: 5,
        },


        // Podświetlanie składni
        highlight: {
          theme: {
            default: 'github-light',
            dark: 'github-dark',
            sepia: 'monokai'
          },
        },

        // Wtyczki Remark (dla Markdown)
        // remarkPlugins: {
        //   'remark-emoji': {
        //     emoticon: true
        //   },
        //   'remark-squeeze-paragraphs': {},
        //   'remark-gfm': {} // GitHub Flavored Markdown
        // },

        // // Wtyczki Rehype (dla HTML)
        // rehypePlugins: {
        //   'rehype-external-links': {
        //     target: '_blank',
        //     rel: 'noopener nofollow'
        //   }
        // },

      },
    },
    // // Komponenty Markdown - POPRAWIONE
    // components: {
    //   tags: {
    //     'info-box': 'InfoBox',
    //     'warning': 'UAlert',
    //     'tip': 'UTip'
    //   }
    // },
    // Włączenie nawigacji automatycznej

    // Konfiguracja eksperymentalna
    // experimental: {
    //   clientDB: true,
    //   stripQueryParameters: false,
    //   cacheContents: true,
    // }
  }
})