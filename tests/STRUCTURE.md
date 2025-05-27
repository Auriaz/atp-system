# 📋 Struktura Testów - ATP System

## 🏗️ Organizacja Testów

Testy zostały uporządkowane według typów i zakresu działania:

### 📁 `/unit` - Testy Jednostkowe (18 plików)
Testują pojedyncze funkcje i komponenty w izolacji:
- `test-auto-logout.js/.cjs` - Automatyczne wylogowanie
- `test-auto-refresh.js/.cjs` - Odświeżanie tokenów
- `test-basic-auth.js/.cjs` - Podstawowa autoryzacja
- `test-db-schema.js` - Schema bazy danych
- `test-fetch.js/.cjs` - Funkcje fetch API
- `test-jwt-auth.js/.cjs` - Autoryzacja JWT
- `test-migration.js` - Migracje bazy danych
- `test-revocation.js` - Odwołanie tokenów
- `test-simple-jwt.js/.cjs` - Proste testy JWT
- `test-simple-session.js` - Podstawowe sesje
- `test-token-refresh.js/.cjs` - Odświeżanie tokenów

### 📁 `/integration` - Testy Integracyjne (8 plików)
Testują współpracę między komponentami:
- `test-api-final.js` - Finalne testy API
- `test-composable-integration.js/.cjs` - Integracja composables
- `test-detailed-session.js` - Szczegółowe testy sesji
- `test-jwt-flow.js/.cjs` - Przepływ JWT
- `test-session-management.cjs` - Zarządzanie sesjami
- `validate-session-management.js` - Walidacja sesji

### 📁 `/e2e` - Testy End-to-End (5 plików)
Testują kompletne scenariusze użytkownika:
- `test-comprehensive-session.js` - Kompleksowe testy sesji
- `test-final-validation.js/.cjs/.ps1` - Finalna walidacja
- `test-multi-device.js` - Testy wielourządzeniowe

### 📁 `/browser` - Testy Przeglądarki (3 pliki)
Testy w środowisku przeglądarki:
- `debug-registration.js` - Debug rejestracji
- `session-management-test.html` - Testy sesji HTML
- `test-auth.html` - Testy autoryzacji HTML

### 📁 `/session-management` - Specjalistyczne Testy Sesji
Dedykowany katalog dla testów zarządzania sesjami (struktura zachowana).

## 🚀 Uruchamianie Testów

### Wszystkie testy
```powershell
cd tests
node run-all-tests.js
```

### Testy jednostkowe
```powershell
cd tests/unit
# Uruchom konkretny test
node test-basic-auth.js
```

### Testy integracyjne
```powershell
cd tests/integration
# Uruchom konkretny test
node test-api-final.js
```

### Testy E2E
```powershell
cd tests/e2e
# Uruchom test PowerShell
.\test-final-validation.ps1
```

### Testy przeglądarki
```powershell
cd tests
node serve-browser-tests.js
# Otwórz w przeglądarce: http://localhost:3001
```

## 📊 Statystyki

- **Łącznie testów**: 34 pliki
- **Testy jednostkowe**: 18 plików (53%)
- **Testy integracyjne**: 8 plików (24%)
- **Testy E2E**: 5 plików (15%)
- **Testy przeglądarki**: 3 pliki (8%)

## ✅ Status Jakości

- ✅ **100% organizacja**: Wszystkie testy w odpowiednich katalogach
- ✅ **Czytelna struktura**: Łatwe nawigowanie i znajdowanie testów
- ✅ **Skalowalna**: Możliwość łatwego dodawania nowych testów
- ✅ **Dokumentowana**: Jasne opisy i instrukcje

---

*Reorganizacja wykonana: 27 maja 2025*  
*Status: ✅ Complete*
