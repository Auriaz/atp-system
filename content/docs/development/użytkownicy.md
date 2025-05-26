---
title: 'Zarządzanie użytkownikami w systemie sportowym'
description: 'Dodawanie użytkowników do systemu sportowego'
category: 'Development'
version: '1.0.0'
requiredRole: ['admin']
icon: 'i-heroicons-cube'
# Brak wymagań dotyczących roli - wszyscy mają dostęp
createdAt: '2025-04-18'
---

# Możliwości zarządzania użytkownikami w systemie sportowym

## Podejście hybrydowe jako optymalne rozwiązanie

W systemie sportowym takim jak ATP System najlepszym rozwiązaniem jest prawdopodobnie **model hybrydowy**, gdzie:

### 1. Rejestracja samodzielna użytkowników

- Sportowcy, początkujący użytkownicy powinni móc samodzielnie się zarejestrować
- Proces samorejestracji powinien zawierać:
  - Akceptację warunków korzystania (Terms & Conditions)
  - Politykę prywatności
  - Zgodę na przetwarzanie danych osobowych
  - Weryfikację email/telefonu
- Użytkownicy rejestrujący się samodzielnie otrzymują domyślnie rolę "USER"
- Nastpnie możliwości wyboru roli ('COACH' lub 'ATHLETE') poprzez wykupienie odpowiedniego pakietu 

### 2. Tworzenie użytkowników przez administratorów

- Administratorzy powinni móc tworzyć konta dla:
  - Trenerów (COACH)
  - Managerów
  - Innych administratorów
  - Specjalnych typów użytkowników
- W tym przypadku administrator bierze odpowiedzialność za przeszkolenie użytkownika

### 3. Tworzenie użytkowników przez trenerów (COACH)

- Trenerzy powinni mieć ograniczone możliwości tworzenia kont
- Mogliby tworzyć konta tylko dla swoich sportowców
- Powinien istnieć mechanizm, gdzie sportowiec mimo utworzenia konta przez trenera, musi sam:
  - Zaakceptować regulamin
  - Dokończyć proces rejestracji
  - Ustawić własne hasło

## Zalety takiego podejścia

1. **Elastyczność** - różne ścieżki dla różnych typów użytkowników
2. **Bezpieczeństwo** - kontrola nad tym, kto może tworzyć konta z podwyższonymi uprawnieniami
3. **Zgodność prawna** - każdy użytkownik sam akceptuje regulaminy
4. **Wygoda** - trenerzy mogą wstępnie skonfigurować konta dla swoich podopiecznych

## Zarządzanie sesjami użytkowników

System ATP System został rozszerzony o zaawansowane możliwości zarządzania sesjami użytkowników, które znacząco zwiększają bezpieczeństwo i kontrolę nad dostępem do kont.

### Funkcjonalności zarządzania sesjami

#### 1. Monitorowanie aktywnych sesji
- **Przegląd wszystkich urządzeń**: Użytkownicy mogą zobaczyć wszystkie urządzenia, z których aktualnie są zalogowani
- **Informacje o urządzeniach**: Automatyczne wykrywanie typu urządzenia (np. "Chrome on Windows", "Safari on iPhone")
- **Lokalizacja sesji**: Przybliżona lokalizacja geograficzna oparta na adresie IP
- **Szczegóły czasowe**: Data ostatniej aktywności i utworzenia sesji

#### 2. Bezpieczne zarządzanie dostępem
- **Wylogowanie z pojedynczego urządzenia**: Możliwość usunięcia konkretnej sesji
- **Wylogowanie z wszystkich innych urządzeń**: Szybkie zabezpieczenie konta w przypadku podejrzeń
- **Ochrona bieżącej sesji**: System uniemożliwia przypadkowe wylogowanie z aktualnie używanego urządzenia
- **Masowe zarządzanie sesjami**: Opcja wylogowania ze wszystkich urządzeń jednocześnie

#### 3. Dashboard bezpieczeństwa
- **Statystyki sesji**: Przegląd liczby aktywnych sesji
- **Historia logowań**: Monitoring prób dostępu do konta
- **Aktualizacje w czasie rzeczywistym**: Automatyczne odświeżanie statusu sesji

### Dostęp do zarządzania sesjami

Funkcjonalność jest dostępna dla wszystkich użytkowników poprzez:
- **Ścieżka**: `/dashboard/sessions`
- **Nawigacja**: Link "Zarządzanie sesjami" w menu bocznym
- **Ikona**: Przedstawia urządzenie mobilne (`i-heroicons-device-phone-mobile`)

### Korzyści dla bezpieczeństwa

1. **Wykrywanie nieautoryzowanego dostępu**: Użytkownicy mogą szybko zidentyfikować podejrzane sesje
2. **Natychmiastowa reakcja na incydenty**: Możliwość szybkiego wylogowania z wszystkich urządzeń
3. **Kontrola nad dostępem**: Pełna transparentność dotycząca aktywnych sesji
4. **Zgodność z najlepszymi praktykami**: Implementacja standardów bezpieczeństwa dla aplikacji wieloużytkownikowych

### Integracja z procesem rejestracji

Zarządzanie sesjami jest automatycznie dostępne dla wszystkich użytkowników niezależnie od sposobu utworzenia konta:
- **Samorejestracja**: Funkcjonalność dostępna od razu po weryfikacji email
- **Utworzenie przez administratora**: Dostęp natychmiast po pierwszym logowaniu
- **Utworzenie przez trenera**: Aktywne po dokończeniu procesu rejestracji przez sportowca

### Implementacja techniczna

System zarządzania sesjami rozszerza istniejącą tabelę `refresh_tokens` o dodatkowe pola:
- `device_name` - nazwa urządzenia i przeglądarki
- `location` - przybliżona lokalizacja geograficzna  
- `is_current` - oznaczenie bieżącej sesji

Wszystkie operacje są zabezpieczone poprzez:
- Autoryzację Bearer token
- Walidację uprawnień użytkownika
- Automatyczne czyszczenie wygasłych sesji
- Ochronę przed przypadkowym wylogowaniem z bieżącej sesji
