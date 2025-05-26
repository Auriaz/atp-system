---
title: 'Zarządzanie wielourządzeniowymi sesjami'
description: 'Kompleksowy system zarządzania sesjami użytkowników na wielu urządzeniach z monitoringiem bezpieczeństwa'
category: 'Development'
version: '1.0.0'
lastUpdated: '2025-12-28'
requiredRole: ['admin', 'developer']
icon: 'i-heroicons-device-phone-mobile'
author: 'Zespół deweloperski ATP'
tags: ['sesje', 'bezpieczeństwo', 'uwierzytelnianie', 'multi-device']
navigation:
  title: 'Zarządzanie sesjami'
  icon: 'i-heroicons-device-phone-mobile'
---

# System zarządzania wielourządzeniowymi sesjami

::alert{type="success"}
System ATP posiada zaawansowany system zarządzania sesjami, który umożliwia użytkownikom monitorowanie, zarządzanie i zabezpieczanie dostępu do konta na wielu urządzeniach i lokalizacjach.
::

## 🎯 Główne funkcjonalności

### Podstawowe możliwości
::list{type="success"}
- **Monitoring sesji** - Przegląd wszystkich aktywnych sesji z informacjami o urządzeniu i lokalizacji
- **Zarządzanie sesjami** - Anulowanie pojedynczych sesji lub wszystkich sesji z wyjątkiem bieżącej
- **Panel bezpieczeństwa** - Przegląd prób logowania i statystyk sesji
- **Rozpoznawanie urządzeń** - Automatyczna detekcja i nazywanie typów urządzeń
- **Śledzenie lokalizacji** - Przybliżona lokalizacja na podstawie geolokalizacji IP
::

### Funkcje bezpieczeństwa
::list{type="warning"}
- **Ochrona bieżącej sesji** - Niemożność przypadkowego anulowania aktualnej sesji
- **Grupowe zarządzanie sesjami** - Anulowanie wszystkich innych sesji w przypadku incydentów bezpieczeństwa
- **Walidacja sesji** - Automatyczne czyszczenie wygasłych lub nieprawidłowych sesji
- **Aktualizacje w czasie rzeczywistym** - Żywe aktualizacje statusu sesji
::

## 🛠️ Szczegóły implementacji

### Schema bazy danych

System zarządzania sesjami rozszerza istniejącą tabelę `refresh_tokens` o następujące pola:

```sql
-- Migracja: 0006_sharp_zuras.sql
ALTER TABLE refresh_tokens ADD COLUMN device_name TEXT;
ALTER TABLE refresh_tokens ADD COLUMN location TEXT;
ALTER TABLE refresh_tokens ADD COLUMN is_current INTEGER DEFAULT false;
```

### Endpointy API

#### GET `/api/auth/sessions`
Pobiera wszystkie aktywne sesje dla uwierzytelnionego użytkownika.

**Nagłówki**: `Authorization: Bearer <access_token>`

**Odpowiedź**:
```json
{
  "sessions": [
    {
      "id": "uuid",
      "device_name": "Chrome na Windows",
      "location": "Warszawa, PL",
      "is_current": true,
      "last_used": "2025-05-26T14:00:00Z",
      "created_at": "2025-05-25T10:00:00Z"
    }
  ],
  "stats": {
    "total_sessions": 3,
    "current_session_id": "uuid"
  }
}
```

#### DELETE `/api/auth/sessions/[id]`
Anuluje określoną sesję według ID.

**Nagłówki**: `Authorization: Bearer <access_token>`

**Odpowiedź**:
```json
{
  "success": true,
  "message": "Sesja została pomyślnie anulowana"
}
```

#### POST `/api/auth/sessions/revoke`
Endpoint do grupowego zarządzania sesjami.

**Nagłówki**: `Authorization: Bearer <access_token>`

**Ciało żądania**:
```json
```json
{
  "action": "revoke_all_others" | "revoke_all"
}
```

**Odpowiedź**:
```json
{
  "success": true,
  "message": "Sesje zostały pomyślnie anulowane",
  "revoked_count": 2
}
```

### Komponenty Frontend

#### SessionManagement.vue
Główny komponent interfejsu zarządzania sesjami.

**Funkcjonalności**:
- Responsywny design z komponentami Nuxt UI
- Ładowanie danych sesji w czasie rzeczywistym
- Dialogi potwierdzające dla akcji bezpieczeństwa
- Wyświetlanie urządzenia i lokalizacji
- Podświetlanie bieżącej sesji

#### useSessionManagement.ts
Composable do funkcjonalności zarządzania sesjami.

**Metody**:
- `fetchSessions()`: Ładowanie sesji użytkownika
- `revokeSession(id)`: Anulowanie określonej sesji
- `revokeAllOthers()`: Anulowanie wszystkich z wyjątkiem bieżącej
- `revokeAll()`: Anulowanie wszystkich sesji (wylogowanie)

### Integracja z nawigacją

Strona zarządzania sesjami jest dostępna przez:
- **Trasa**: `/dashboard/sessions`
- **Pasek boczny**: Link "Zarządzanie sesjami" z ikoną urządzenia
- **Ścieżka nawigacji**: Dashboard → Zarządzanie sesjami

## 🎯 Instrukcja użytkowania

### Dla użytkowników

1. **Dostęp do zarządzania sesjami**:
   - Zaloguj się do swojego konta
   - Przejdź do Pulpitu nawigacyjnego
   - Kliknij "Zarządzanie sesjami" w pasku bocznym

2. **Monitorowanie sesji**:
   - Przeglądaj wszystkie aktywne sesje
   - Sprawdzaj typy urządzeń i lokalizacje
   - Identyfikuj podejrzaną aktywność

3. **Zarządzanie sesjami**:
   - Anuluj pojedyncze podejrzane sesje
   - Użyj "Anuluj wszystkie inne" w przypadku incydentów bezpieczeństwa
   - Bieżąca sesja jest chroniona przed przypadkowym anulowaniem

### Dla deweloperów

#### Dodawanie śledzenia sesji
```typescript
// W serwisie uwierzytelniania
await sessionManagementService.createSession(userId, {
  device_name: detectDevice(userAgent),
  location: await getLocationFromIP(ip),
  is_current: true
})
```

#### Niestandardowe dane sesji
```typescript
// Rozszerzanie informacji o sesji
const sessionData = {
  device_name: 'Niestandardowa nazwa urządzenia',
  location: 'Niestandardowa lokalizacja',
  metadata: {
    browser: 'Chrome 120',
    os: 'Windows 11'
  }
}
```

## 🔒 Zagadnienia bezpieczeństwa

### Najlepsze praktyki
::list{type="warning"}
- Regularne monitorowanie sesji
- Natychmiastowe anulowanie podejrzanych sesji
- Używanie bezpiecznych tokenów sesji
- Automatyczne wygasanie sesji
- Śledzenie lokalizacji na podstawie IP
::

### Prywatność
::list{type="info"}
- Dane lokalizacji są przybliżone (poziom miasta/kraju)
- Brak precyzyjnego śledzenia lokalizacji
- Kontrola użytkownika nad danymi sesji
- Bezpieczne przechowywanie tokenów
::

## 🧪 Testowanie

### Testowanie manualne
1. Zaloguj się z wielu urządzeń/przeglądarek
2. Zweryfikuj, czy sesje pojawiają się w interfejsie zarządzania
3. Przetestuj funkcjonalność anulowania sesji
4. Potwierdź poprawne działanie środków bezpieczeństwa

### Testowanie automatyczne
- Testy endpointów API
- Testy integracji komponentów
- Weryfikacja migracji bazy danych
- Testy walidacji bezpieczeństwa

## 🚀 Deployment

### Środowisko deweloperskie
```bash
# Uruchomienie serwera deweloperskiego
npm run dev

# Generowanie migracji bazy danych
npm run db:generate

# Testowanie zarządzania sesjami
# Przejdź do http://localhost:3000/dashboard/sessions
```

### Środowisko produkcyjne
1. Upewnij się, że migracja bazy danych została zastosowana
2. Skonfiguruj zmienne środowiskowe dla geolokalizacji IP
3. Ustaw odpowiednie nagłówki CORS i bezpieczeństwa
4. Monitoruj wydajność zarządzania sesjami

## 📈 Migracja z poprzedniej wersji

System zarządzania sesjami jest wstecznie kompatybilny:
- Istniejące sesje bez danych urządzenia/lokalizacji będą wyświetlane jako "Nieznane"
- Wszystkie nowe sesje automatycznie będą zawierać rozszerzone dane
- Brak zmian naruszających istniejący przepływ uwierzytelniania

## 🆘 Wsparcie i rozwiązywanie problemów

### Typowe problemy

1. **Sesje się nie pojawiają**:
   - Zweryfikuj tokeny uwierzytelniania
   - Sprawdź status migracji bazy danych
   - Upewnij się, że endpointy API są dostępne

2. **Lokalizacja się nie wyświetla**:
   - Sprawdź serwis geolokalizacji IP
   - Zweryfikuj łączność sieciową
   - Przejrzyj ustawienia prywatności

3. **Nie można anulować sesji**:
   - Potwierdź uprawnienia użytkownika
   - Zweryfikuj własność sesji
   - Sprawdź ochronę bieżącej sesji

### Tryb debugowania
Włącz logowanie debugowania w środowisku deweloperskim:
```typescript
// W nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    sessionDebug: true
  }
})
```

## 🔮 Przyszłe ulepszenia

- Powiadomienia push dla nowych sesji
- Szczegółowe fingerprinting urządzeń
- Alerty geofencing
- Panel analityczny sesji
- Integracja z uwierzytelnianiem dwuskładnikowym

---

*Dokumentacja wersji 1.0.0 | Ostatnia aktualizacja: 28 grudnia 2025*
