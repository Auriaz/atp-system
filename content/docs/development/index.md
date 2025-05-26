---
title: 'Dokumentacja deweloperska'
description: 'Kompletna dokumentacja techniczna systemu ATP - architektura, implementacja i przewodniki deweloperskie'
category: 'Development'
version: '3.0.0'
lastUpdated: '2025-12-28'
requiredRole: ['admin', 'developer']
icon: 'i-heroicons-code-bracket'
author: 'Zespół deweloperski ATP'
tags: ['development', 'architektura', 'api', 'dokumentacja-techniczna']
navigation:
  title: 'Dokumentacja deweloperska'
  icon: 'i-heroicons-code-bracket'
---

# Dokumentacja deweloperska ATP System

::alert{type="info"}
**ATP System** to zaawansowana aplikacja pełnostackowa zbudowana na **Nuxt.js 3** z systemem uwierzytelniania JWT, zarządzaniem wielourządzeniowymi sesjami i automatycznym wylogowaniem.
::

## 🏗️ Przegląd techniczny

### Stack technologiczny
::list{type="success"}
- **Frontend**: Vue.js 3 + Nuxt.js 3 + TypeScript
- **Backend**: Nitro Server (zintegrowany z Nuxt.js)
- **Baza danych**: SQLite z Drizzle ORM
- **Uwierzytelnianie**: JWT z refresh tokens
- **Stylowanie**: Tailwind CSS + Nuxt UI
- **Zarządzanie treścią**: Nuxt Content v2
- **Deployment**: Cloudflare Pages + D1 Database
::

## 📋 Spis treści

### 🔧 Podstawy systemu
::card-grid
#default
  ::card{icon="i-heroicons-cube" title="Architektura systemu" to="/docs/development/architektura"}
  Ogólna architektura, komponenty i wzorce projektowe używane w systemie.
  ::

  ::card{icon="i-heroicons-cog-6-tooth" title="Konfiguracja środowiska" to="/docs/development/konfiguracja"}
  Instrukcje instalacji, konfiguracji i uruchomienia projektu w środowisku deweloperskim.
  ::

  ::card{icon="i-heroicons-users" title="Zarządzanie użytkownikami" to="/docs/development/użytkownicy"}
  System użytkowników, ról, uprawnień i zarządzania kontami.
  ::
::

### 🔐 System uwierzytelniania
::card-grid
#default
  ::card{icon="i-heroicons-key" title="Uwierzytelnianie JWT" to="/docs/development/uwierzytelnianie-jwt"}
  **AKTUALNY** - Kompletny przewodnik po systemie JWT z automatycznym wylogowaniem.
  ::

  ::card{icon="i-heroicons-device-phone-mobile" title="Zarządzanie sesjami" to="/docs/development/session-management"}
  **NOWE** - System zarządzania wielourządzeniowymi sesjami użytkowników.
  ::

  ::card{icon="i-heroicons-shield-check" title="API Reference" to="/docs/development/api"}
  Dokumentacja endpointów API, autoryzacji i przykładów użycia.
  ::
::

### 📊 Raporty i historia zmian
::card-grid
#default
  ::card{icon="i-heroicons-clock" title="Changelog JWT" to="/docs/development/changelog-jwt"}
  Historia zmian i aktualizacji systemu uwierzytelniania JWT.
  ::

  ::card{icon="i-heroicons-document-text" title="Implementacja automatycznego wylogowania" to="/docs/development/automatic-logout-implementation"}
  Szczegółowy raport implementacji funkcji automatycznego wylogowania.
  ::

  ::card{icon="i-heroicons-chart-bar" title="Podsumowanie systemu JWT" to="/docs/development/jwt-system-summary"}
  Kompletny status projektu i przegląd funkcjonalności JWT.
  ::
::

## 🚀 Szybki start dla deweloperów

### Wymagania systemowe
- Node.js 18+ 
- npm/yarn/pnpm
- Git

### Instalacja
```bash
# Klonowanie repozytorium
git clone [repository-url] atp-system
cd atp-system

# Instalacja zależności
npm install

# Konfiguracja środowiska
cp .env.example .env
# Uzupełnij zmienne środowiskowe

# Uruchomienie w trybie deweloperskim
npm run dev
```

### Struktura projektu
```
atp-system/
├── app/                    # Aplikacja Nuxt.js
│   ├── components/         # Komponenty Vue
│   ├── composables/        # Composables i logika biznesowa
│   ├── middleware/         # Middleware routingu
│   ├── pages/             # Strony aplikacji
│   └── plugins/           # Pluginy Nuxt
├── server/                # Backend Nitro
│   ├── api/               # Endpointy API
│   ├── database/          # Migracje i schema bazy danych
│   ├── middleware/        # Middleware serwerowy
│   └── utils/             # Narzędzia i serwisy
├── content/               # Dokumentacja Nuxt Content
├── tests/                 # Testy automatyczne
└── docs/                  # Dodatkowa dokumentacja
```

## 🔥 Najnowsze funkcjonalności

### ✅ System zarządzania sesjami (v2.1.0)
- Monitoring aktywnych sesji na różnych urządzeniach
- Możliwość zdalnego wylogowania z wybranych urządzeń
- Detekcja podejrzanej aktywności
- Historia logowań z lokalizacją i informacjami o urządzeniu

### ✅ Ulepszone uwierzytelnianie JWT (v2.0.0)
- Automatyczne odświeżanie tokenów
- Graceful logout przy wygaśnięciu sesji
- Zwiększone bezpieczeństwo z rotacją refresh tokenów
- Middleware do ochrony tras

## 🛠️ Narzędzia deweloperskie

### Dostępne komendy
```bash
npm run dev          # Uruchomienie serwera deweloperskiego
npm run build        # Budowanie aplikacji produkcyjnej
npm run preview      # Podgląd wersji produkcyjnej
npm run test         # Uruchomienie testów
npm run lint         # Sprawdzanie jakości kodu
npm run generate     # Generowanie statycznej wersji
```

### Debugowanie
- **Vue DevTools** - do debugowania komponentów Vue
- **Nuxt DevTools** - zaawansowane narzędzia deweloperskie Nuxt
- **Network Monitor** - do analizy zapytań API
- **Database Browser** - do przeglądarnia bazy danych SQLite

## 📝 Konwencje kodowania

- **TypeScript** - obowiązkowe typowanie
- **ESLint + Prettier** - formatowanie i linting
- **Conventional Commits** - standardowe commity
- **Component naming** - PascalCase dla komponentów
- **File naming** - kebab-case dla plików

## 🔍 Testowanie

System posiada kompleksowe testy:
- **Testy jednostkowe** - komponenty i funkcje
- **Testy integracyjne** - API endpoints
- **Testy E2E** - scenariusze użytkownika
- **Testy bezpieczeństwa** - uwierzytelnianie i autoryzacja

## 📞 Wsparcie deweloperskie

- **[Issues GitHub](github-issues-link)** - zgłaszanie błędów
- **[Discussions](github-discussions-link)** - dyskusje techniczne
- **[Wiki](github-wiki-link)** - dodatkowa dokumentacja
- **[API Docs](api-docs-link)** - interaktywna dokumentacja API

---

*Dokumentacja aktualizowana: 28 grudnia 2025 | Wersja systemu: v2.1.0*

## 🚀 Najnowsze aktualizacje

### ✨ System JWT 2.0 - Automatyczne wylogowanie

Najnowsza wersja systemu uwierzytelniania wprowadza:

::list{type="success"}
- **Automatyczne wylogowanie** przy błędach refresh tokena
- **Callback system** dla obsługi błędów autoryzacji  
- **Kompleksowe testy** (7/7 passing - 100% success rate)
- **Interaktywny interfejs testowy** dla deweloperów
- **Ulepszone bezpieczeństwo** z HTTPOnly cookies
- **Dokumentacja techniczna** z przykładami kodu
::

### 🧪 System testowania

Nowy katalog `tests/` zawiera:
- Testy backend API (Node.js)
- Interaktywny interfejs testowy (HTML)
- Automatyczny test runner
- Serwer testów przeglądarki

```bash
# Uruchom wszystkie testy
node tests/run-all-tests.cjs

# Uruchom serwer testów przeglądarki  
node tests/serve-browser-tests.cjs
# Otwórz: http://localhost:3001
```

## 🛠️ Dla deweloperów

### Quick Start
1. **Uwierzytelnianie** - Przeczytaj [dokumentację JWT](/docs/development/uwierzytelnianie-jwt)
2. **API Integration** - Sprawdź [API Reference](/docs/development/api)
3. **Testing** - Uruchom testy z katalogu `tests/`
4. **Architecture** - Zapoznaj się z [architekturą](/docs/development/architektura)

### Najważniejsze composables
```typescript
// Uwierzytelnianie użytkownika
const { login, logout, isAuthenticated } = useAuth()

// Zarządzanie tokenami JWT (automatyczne)
const { accessToken, refreshAccessToken } = useJWTAuth()

// System uprawnień
const { can, hasRole } = usePermissions()
```

### Automatyczne wylogowanie
System automatycznie wylogowuje użytkownika gdy:
- Refresh token wygaśnie (30 dni)
- API zwróci błąd 401 z endpointu refresh
- Token zostanie unieważniony

Proces jest całkowicie automatyczny i nie wymaga interwencji developera.

## 🔒 Bezpieczeństwo

### Implementowane zabezpieczenia
- **JWT tokeny** z krótkim czasem życia (15 min)
- **HTTPOnly cookies** dla refresh tokenów  
- **Token rotation** - jednorazowe użycie refresh tokenów
- **CSRF protection** z SameSite cookies
- **Automatic cleanup** wygasłych tokenów

### Best Practices
- Używaj `useAuth()` zamiast bezpośrednio `useJWTAuth()`
- Nigdy nie przechowuj tokenów w localStorage
- Zawsze sprawdzaj `isAuthenticated` przed API calls
- Obsługuj błędy 401/403 w odpowiedzi API

## 📊 Status implementacji

### ✅ Ukończone
- System uwierzytelniania JWT z automatycznym wylogowaniem
- Kompleksowe testy (100% success rate)
- Dokumentacja techniczna i przewodniki
- Bezpieczne przechowywanie tokenów
- Middleware autoryzacji i uprawnień

### ⏳ W planach
- Multi-device session management
- Advanced token rotation strategies
- Rate limiting dla refresh attempts
- Session management dashboard

---

::alert{type="info"}
💡 **Tip**: Zacznij od przeczytania [dokumentacji JWT](/docs/development/uwierzytelnianie-jwt), aby zrozumieć najnowszy system uwierzytelniania.
::