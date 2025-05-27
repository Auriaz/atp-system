# 🚀 Quick Commit Guide - ATP System

## 📋 Konwencja Commitów

### Format:
```
type(scope): description

[optional body]
[optional footer]
```

## 🏷️ Typy Commitów

| Typ | Opis | Przykład |
|-----|------|----------|
| `feat` | Nowa funkcjonalność | `feat(auth): add JWT refresh token` |
| `fix` | Naprawa błędu | `fix(sessions): resolve logout issue` |
| `docs` | Dokumentacja | `docs(api): update user endpoints` |
| `style` | Formatowanie kodu | `style(components): fix indentation` |
| `refactor` | Refaktoryzacja | `refactor(auth): simplify token logic` |
| `test` | Testy | `test(sessions): add logout tests` |
| `config` | Konfiguracja | `config(eslint): update rules` |
| `chore` | Inne zadania | `chore(deps): update packages` |

## 🎯 Scope (Zakres)

### Backend:
- `auth` - System uwierzytelniania
- `sessions` - Zarządzanie sesjami
- `users` - Zarządzanie użytkownikami
- `api` - Endpointy API
- `database` - Baza danych
- `middleware` - Middleware

### Frontend:
- `dashboard` - Panel główny
- `components` - Komponenty UI
- `pages` - Strony aplikacji
- `composables` - Composables Vue
- `layouts` - Layouty

### Ogólne:
- `docs` - Dokumentacja
- `tests` - Testy
- `config` - Konfiguracja
- `deps` - Zależności

## ⚡ Szybkie Komendy PowerShell

### Podstawowe operacje:
```powershell
# Status projektu
git status

# Dodaj wszystkie pliki
git add .

# Commit z wiadomością
git commit -m "type(scope): description"

# Push do brancha
git push origin branch-name
```

### Workflow dla faz:
```powershell
# FAZA 0 - Dokumentacja
git checkout develop
git checkout -b feature/docs-organization
# ... zmiany ...
git add .
git commit -m "docs(content): reorganize documentation structure"
git push origin feature/docs-organization

# FAZA 2 - Training Management
git checkout develop
git checkout -b feature/training-management-core
# ... zmiany ...
git add .
git commit -m "feat(training): add training plans database schema"
git push origin feature/training-management-core
```

## 📝 Przykłady Commitów

### FAZA 0 (Dokumentacja):
```bash
docs(content): reorganize docs folder structure
docs(api): complete user management documentation
docs(guides): add admin user management guide
config(content): update navigation system
```

### FAZA 1 (User Management) - COMPLETED:
```bash
feat(auth): implement JWT authentication system
feat(sessions): add multi-device session management
feat(users): add CRUD operations with roles
feat(dashboard): create user management interface
test(sessions): add comprehensive session tests
```

### FAZA 2 (Training Management):
```bash
feat(training): add training plans database schema
feat(training): implement training plans API
feat(training): create exercise library
feat(dashboard): add training plan wizard
feat(components): create session builder component
```

### FAZA 3 (Athlete Management):
```bash
feat(athletes): add athlete profiles system
feat(athletes): implement plan assignment
feat(dashboard): create athlete management interface
```

## 🔧 Przydatne Aliasy

Dodaj do PowerShell Profile (`$PROFILE`):
```powershell
# Git aliasy
function gacp($message) { git add .; git commit -m $message; git push }
function gs { git status }
function gco($branch) { git checkout $branch }
function gcb($branch) { git checkout -b $branch }
function gp { git push }
function gl { git log --oneline -10 }

# ATP System specific
function atp-docs { git add .; git commit -m "docs(content): $args"; git push }
function atp-feat($scope, $desc) { git add .; git commit -m "feat($scope): $desc"; git push }
function atp-fix($scope, $desc) { git add .; git commit -m "fix($scope): $desc"; git push }
```

## 🚨 Ważne Zasady

1. **Zawsze testuj przed commitem**
2. **Jeden commit = jedna logiczna zmiana**
3. **Używaj opisowych wiadomości**
4. **Sprawdź status przed push**
5. **Nie commituj plików konfiguracyjnych z hasłami**

## 📊 Status Commitów dla Wersji

### v0.1.0 - PENDING PHASE 0:
- ⏳ `docs(content): complete documentation organization`
- ⏳ `docs(api): finish user management docs`
- ⏳ `config(content): enhance content management`

### v0.2.0 - PLANNED:
- ⏳ `feat(training): complete training management core`
- ⏳ `feat(exercises): implement exercise library`
- ⏳ `feat(dashboard): add training interface`

---
*Quick Commit Guide dla ATP System | v1.0 | May 27, 2025*
