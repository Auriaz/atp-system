---
title: 'Konfiguracja środowiska'
description: 'Dokumentacja ta przedstawia kompletny proces konfiguracji środowiska deweloperskiego dla systemu ATP. Postępuj zgodnie z instrukcjami, aby poprawnie skonfigurować projekt.'
category: 'Development'
version: '1.0.0'
requiredRole: ['admin']
icon: 'i-heroicons-cube'
# Brak wymagań dotyczących roli - wszyscy mają dostęp
createdAt: '2025-04-18'
---

# Konfiguracja środowiska

::alert{type="info"}
Dokumentacja ta przedstawia kompletny proces konfiguracji środowiska deweloperskiego dla systemu ATP. Postępuj zgodnie z instrukcjami, aby poprawnie skonfigurować projekt.
::

## Wymagania systemowe

Przed rozpoczęciem pracy z ATP System upewnij się, że spełniasz następujące wymagania:

::list{type="primary"}
- **Node.js** - wersja 16.x lub nowsza
- **PNPM** - wersja 7.x lub nowsza (zalecany menedżer pakietów)
- **Git** - dowolna aktualna wersja
- **Edytor kodu** - zalecany Visual Studio Code
::

### Rozszerzenia VS Code

::card{icon="i-heroicons-puzzle-piece"}
#title
Zalecane rozszerzenia VS Code
#description
Poniższe rozszerzenia znacząco ułatwią pracę z projektem:

- **Vue Language Features (Volar)** - wsparcie dla plików Vue
- **TypeScript Vue Plugin (Volar)** - integracja TypeScript z Vue
- **ESLint** - linting kodu JavaScript/TypeScript
- **Prettier** - formatowanie kodu
- **Tailwind CSS IntelliSense** - podpowiedzi dla klas Tailwind
- **MDC** - wsparcie dla Markdown Content
::

## Instalacja projektu

::tabs
#tab{name="Klonowanie repozytorium" icon="i-heroicons-code-bracket"}
```bash
git clone [adres-repo] atp-system
cd atp-system
```

#tab{name="Instalacja zależności" icon="i-heroicons-package"}
```bash
pnpm install
```

#tab{name="Inicjalizacja bazy danych" icon="i-heroicons-database"}
```bash
pnpm db:setup
```
Ta komenda utworzy bazę danych SQLite, przeprowadzi migracje i doda przykładowe dane.

#tab{name="Uruchomienie projektu" icon="i-heroicons-play"}
```bash
pnpm dev
```
Aplikacja będzie dostępna pod adresem: `http://localhost:3000`
::

## Konfiguracja zmiennych środowiskowych

Przed uruchomieniem aplikacji skopiuj plik .env.example do .env:

```bash
cp .env.example .env
```

::code-group
```bash [.env.example]
# Tryb aplikacji
NODE_ENV="development"

# Nuxt Auth Session Secret
NUXT_SESSION_PASSWORD=your-very-secret-key-change-me
JWT_EXPIRY=7d
JWT_REFRESH_EXPIRY=30d
```
::

::callout{type="warning"}
Nigdy nie udostępniaj pliku .env z prawdziwymi danymi uwierzytelniającymi w repozytorium kodu!
::

## Struktura projektu

Projekt ATP System ma następującą strukturę katalogów:

::card{icon="i-heroicons-folder"}
#title
Główna struktura projektu
#description
```
├── app/                # Kod źródłowy aplikacji
│   ├── components/     # Komponenty Vue
│   ├── composables/    # Reużywalne funkcje (composables)
│   ├── layouts/        # Układy stron
│   ├── middleware/     # Middleware Nuxt
│   └── pages/          # Strony aplikacji
├── content/            # Treści zarządzane przez Nuxt Content
├── public/             # Statyczne pliki publiczne
├── server/             # Kod serwera
│   ├── api/            # Endpointy API
│   ├── database/       # Definicje bazy danych
│   ├── middleware/     # Middleware serwera
│   └── utils/          # Narzędzia serwerowe
├── shared/             # Kod współdzielony między klientem a serwerem
│   ├── types/          # Definicje TypeScript
│   └── utils/          # Narzędzia współdzielone
├── .nuxt/              # Pliki wygenerowane przez Nuxt (ignorowane w git)
├── .output/            # Pliki wyjściowe produkcyjne (ignorowane w git)
└── nuxt.config.ts      # Konfiguracja Nuxt
```
::

## Skrypty NPM

ATP System udostępnia zestaw przydatnych skryptów:

::list{type="info"}
- `pnpm dev` - uruchamia serwer deweloperski
- `pnpm build` - buduje aplikację produkcyjną
- `pnpm start` - uruchamia zbudowaną aplikację
- `pnpm lint` - sprawdza kod pod kątem błędów
- `pnpm test` - uruchamia testy
- `pnpm db:migrate` - wykonuje migracje bazy danych
- `pnpm db:seed` - wypełnia bazę danych danymi testowymi
- `pnpm db:reset` - resetuje bazę danych do stanu początkowego
::

## Konfiguracja TypeScript

ATP System wykorzystuje TypeScript dla lepszej jakości kodu. Główna konfiguracja znajduje się w pliku tsconfig.json:

```ts [tsconfig.json]{3-6}
{
  "compilerOptions": {
    "strict": true,
    "jsx": "preserve",
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "skipLibCheck": true,
    "paths": {
      "~/*": ["./*"],
      "@/*": ["./*"]
    }
  },
  "exclude": ["node_modules"]
}
```

## Konfiguracja Nuxt.js

Główna konfiguracja Nuxt.js znajduje się w pliku nuxt.config.ts:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    // ... inne moduły
  ],
  experimental: {
    // Eksperymentalne funkcje
    inlineSSRStyles: false,
    viewTransition: true,
    renderJsonPayloads: true
  },
  ui: {
    // Konfiguracja UI
    icons: ['lucide', 'heroicons']
  },
  // ... reszta konfiguracji
})
```

## Konfiguracja bazy danych

### Inicjalizacja bazy danych

Baza danych jest inicjalizowana w pliku `server/database/index.ts`:

```ts [server/database/index.ts]{4-6,10-12}
import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import * as schema from './schema'

// Inicjalizacja DB przy starcie serwera
let _db: ReturnType<typeof drizzle<typeof schema>> | null = null

export function useDatabase() {
  if (!_db) {
    const sqlite = new Database('.data/hub/db.sqlite')
    _db = drizzle(sqlite, { schema })
  }
  return _db
}
```

### Migracje bazy danych

System używa migracji Drizzle ORM, które są definiowane w katalogu `drizzle/`:

```ts [drizzle/0001_initial.ts]
import { sql } from 'drizzle-orm'

export async function up(db) {
  await sql`CREATE TABLE users (...)`
}

export async function down(db) {
  await sql`DROP TABLE users`
}
```

Aby uruchomić migracje, użyj polecenia:

```bash
pnpm drizzle:migrate
```

## Konfiguracja ESLint

ATP System używa ESLint do statycznej analizy kodu. Konfiguracja znajduje się w pliku eslint.config.mjs:

```js [eslint.config.mjs]
export default defineEslintConfig([
  // Podstawowe reguły
  {
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-multiple-template-root': 'off',
      'vue/require-default-prop': 'off',
      'vue/no-v-model-argument': 'off'
    }
  }
])
```

## Konfiguracja Tailwind CSS

Konfiguracja Tailwind CSS znajduje się w pliku tailwind.config.js:

```js [tailwind.config.js]{6,9-15```js [tailwind.config.js]{6,9-15```js [tailwind.config.js]{6,9-15```js [tailwind.config.js]{6,9-15}
export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './assets/**/*.css',
    './nuxt.config.{js,ts}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          '300': 'var(--color-primary-300)',
          '600': 'var(--color-primary-600)',
          '800': 'var(--color-primary-800)',
          '900': 'var(--color-primary-900)',
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
  ]
}
```

## Debugowanie i rozwiązywanie problemów

::tabs
#tab{name="Typowe problemy" icon="i-heroicons-bug-ant"}
::list{type="warning"}
- **Problem z instalacją zależności**:
  ```bash
  rm -rf node_modules
  pnpm install
  ```

- **Błędy TypeScript**:
  ```bash
  pnpm nuxi typecheck
  ```

- **Problemy z bazą danych**:
  ```bash
  pnpm db:reset
  ```

- **Czyszczenie cache Nuxt**:
  ```bash
  pnpm nuxi cleanup
  ```
::

#tab{name="Debugowanie Vue" icon="i-heroicons-code-bracket-square"}
Dla debugowania komponenty Vue można używać Vue DevTools:

1. Zainstaluj rozszerzenie Vue DevTools w przeglądarce
2. Uruchom aplikację w trybie deweloperskim
3. Otwórz narzędzia deweloperskie przeglądarki i przejdź do zakładki Vue

::callout{type="info"}
Nuxt DevTools są automatycznie dostępne w trybie deweloperskim pod adresem `/_nuxt-devtools`
::

#tab{name="Logowanie" icon="i-heroicons-document-text"}
Logowanie po stronie serwera:

```ts [server/api/example.ts]
export default defineEventHandler(async (event) => {
  console.log('Obsługa zapytania:', event.path)
  
  // Używanie logger'a z Nitro
  const logger = useLogger()
  logger.info('To jest informacja')
  logger.error('To jest błąd', { context: 'dodatkowe dane' })
  
  // ...
})
```

Włączanie logowania SQL:

```ts [server/database/index.ts]{5}
const _db = drizzle(sqlite, { 
  schema,
  logger: process.env.NODE_ENV === 'development'
})
```
::

## Narzędzia wspomagające

::card{icon="i-heroicons-wrench-screwdriver"}
#title
Przydatne narzędzia
#description
- **API Client**: Używaj Postman lub Thunder Client (VSCode) do testowania API
- **SQLite Browser**: DB Browser dla SQLite do podglądu i edycji bazy danych
- **Node.js Inspector**: Użyj `node --inspect` do debugowania kodu Node.js
- **Performance Monitoring**: Nuxt oferuje wbudowane narzędzia monitorowania wydajności w trybie deweloperskim
::

## Zasoby

::alert{type="success"}
Poniżej znajdziesz linki do oficjalnej dokumentacji używanych technologii.
::

::list{type="info"}
- [Dokumentacja Nuxt.js](https://nuxt.com/docs)
- [Dokumentacja Drizzle ORM](https://orm.drizzle.team/docs/overview)
- [Dokumentacja Tailwind CSS](https://tailwindcss.com/docs)
- [Dokumentacja Nuxt UI](https://ui.nuxt.com/)
- [Dokumentacja Nuxt Content](https://content.nuxt.com/)
::

Similar code found with 2 license types