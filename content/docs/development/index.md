---
title: 'Dokumentacja deweloperska'
description: 'ATP System to zaawansowana aplikacja pełnostackowa zbudowana na Nuxt.js 3 z systemem uwierzytelniania JWT i automatycznym wylogowaniem.'
category: 'Development'
version: '2.0.0'
requiredRole: ['admin']
icon: 'i-heroicons-cube'
createdAt: '2025-04-18'
updatedAt: '2025-05-26'
---

# Dokumentacja deweloperska ATP System

Kompleksowa dokumentacja techniczna systemu ATP z najnowszymi implementacjami uwierzytelniania JWT.

## 📋 Spis treści

### Podstawy systemu
- [🏗️ Architektura systemu](/docs/development/architektura) - Ogólna architektura i komponenty
- [⚙️ Konfiguracja środowiska](/docs/development/konfiguracja) - Setup i deployment
- [👥 Zarządzanie użytkownikami](/docs/development/użytkownicy) - System użytkowników i ról

### System uwierzytelniania
- [🔐 Uwierzytelnianie JWT](/docs/development/uwierzytelnianie-jwt) - **NOWE!** Kompletny przewodnik JWT z automatycznym wylogowaniem
- [📝 Changelog JWT](/docs/development/changelog-jwt) - Historia zmian systemu JWT
- [🔑 API Reference](/docs/development/api) - Endpointy i autoryzacja

### Raporty i podsumowania
- [🎯 Implementacja automatycznego wylogowania](/docs/development/automatic-logout-implementation) - Szczegółowy raport implementacji
- [📊 Podsumowanie systemu JWT](/docs/development/jwt-system-summary) - Kompletny status projektu  
- [📋 Aktualizacja dokumentacji](/docs/development/dokumentacja-aktualizacja-summary) - Podsumowanie zmian w dokumentacji

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