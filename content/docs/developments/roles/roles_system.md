```markdown
---
title: 'System ról w ATP'
description: 'Kompleksowa dokumentacja systemu ról, uprawnień i kontroli dostępu w aplikacji ATP'
category: 'Authorization'
version: '2.0.0'
author: 'ATP Core Team'
createdAt: '2025-04-06'
---

# System Ról i Uprawnień w ATP

## Wprowadzenie

ATP wykorzystuje zaawansowany system ról i uprawnień (Role-Based Access Control - RBAC) z dziedziczeniem uprawnień oraz obsługą wielu ról dla jednego użytkownika. System ten definiuje, co różni użytkownicy mogą widzieć i jakie działania mogą wykonywać w aplikacji.

## Dostępne Role

System ATP definiuje następujące role użytkowników (w hierarchii od najwyższych do najniższych uprawnień):

| Rola | Klucz | Opis |
|------|-------|------|
| Administrator | `ADMIN` | Pełen dostęp do wszystkich funkcji systemu |
| Manager | `MANAGER` | Zarządzanie organizacją, trenerami i sportowcami |
| Trener | `COACH` | Zarządzanie sportowcami i programami treningowymi |
| Redaktor | `EDITOR` | Zarządzanie treściami w systemie |
| Sportowiec | `ATHLETE` | Korzystanie z programów i śledzenie postępów |
| Użytkownik | `USER` | Podstawowe funkcje systemu |
| Obserwator | `OBSERVER` | Tylko przeglądanie publicznych treści |

## Wielorolowy System Uprawnień

Kluczową nowością w systemie ATP jest obsługa wielu ról przypisanych jednemu użytkownikowi. Dzięki temu:

1. Użytkownik może mieć jednocześnie kilka ról (np. być zarówno Trenerem, jak i Sportowcem)
2. Uprawnienia są obliczane na podstawie wszystkich posiadanych ról
3. Posiadanie dowolnej roli z wymaganym uprawnieniem daje dostęp do funkcjonalności

## Hierarchia Ról

System ATP implementuje hierarchię ról, gdzie wyższe role dziedziczą uprawnienia niższych ról:

```
ADMIN
├── MANAGER
│   └── COACH
│       └── ATHLETE
│           └── USER
│               └── OBSERVER
├── EDITOR
│   └── USER
│       └── OBSERVER
└── (wszystkie inne role)
```

## Szczegółowy Opis Ról

### Administrator (ADMIN)
- **Klucz**: ADMIN
- **Kolor**: Primary (niebieski)
- **Ikona**: i-lucide-shield

Administrator ma pełen dostęp do systemu, w tym:
- Zarządzanie użytkownikami i ich rolami
- Dostęp do ustawień systemu
- Zarządzanie wszystkimi treściami
- Tworzenie i zarządzanie programami treningowymi
- Dostęp do wszystkich statystyk i raportów

### Manager (MANAGER)
- **Klucz**: MANAGER
- **Kolor**: Indigo
- **Ikona**: i-lucide-briefcase

Manager zarządza aspektami organizacyjnymi:
- Zarządzanie trenerami i sportowcami
- Przydzielanie trenerów do sportowców
- Tworzenie i zarządzanie grupami treningowymi
- Dostęp do statystyk i raportów
- Zarządzanie harmonogramami

### Trener (COACH)
- **Klucz**: COACH
- **Kolor**: Green (zielony)
- **Ikona**: i-lucide-dumbbell

Trener skupia się na aspektach treningowych:
- Tworzenie i zarządzanie programami treningowymi
- Monitorowanie postępów sportowców
- Dodawanie i edycja ćwiczeń
- Komunikacja ze sportowcami
- Dostęp do statystyk swoich podopiecznych

### Redaktor (EDITOR)
- **Klucz**: EDITOR
- **Kolor**: Violet (fioletowy)
- **Ikona**: i-lucide-edit-3

Redaktor zajmuje się treściami w systemie:
- Tworzenie i edycja artykułów
- Zarządzanie biblioteką mediów
- Publikowanie treści
- Moderacja komentarzy
- Kategoryzowanie i tagowanie treści

### Sportowiec (ATHLETE)
- **Klucz**: ATHLETE
- **Kolor**: Orange (pomarańczowy)
- **Ikona**: i-lucide-running

Sportowiec korzysta z programów treningowych:
- Przeglądanie przypisanych programów treningowych
- Rejestrowanie ukończonych treningów
- Śledzenie własnych postępów
- Komunikacja z trenerem
- Dostęp do osobistych statystyk

### Użytkownik (USER)
- **Klucz**: USER
- **Kolor**: Blue (niebieski)
- **Ikona**: i-lucide-user

Użytkownik ma podstawowy dostęp do systemu:
- Przeglądanie treści
- Podstawowe interakcje z systemem
- Zarządzanie własnym profilem
- Komunikacja z innymi użytkownikami
- Brak dostępu do funkcji premium

### Obserwator (OBSERVER)
- **Klucz**: OBSERVER
- **Kolor**: Gray (szary)
- **Ikona**: i-lucide-eye

Obserwator może tylko przeglądać publiczne treści:
- Przeglądanie publicznych artykułów
- Dostęp do publicznych harmonogramów
- Brak możliwości interakcji z systemem
- Brak dostępu do treści premium
- Dostęp bez konieczności logowania

## System Uprawnień

Poza rolami, system ATP definiuje szczegółowe uprawnienia (permissions) w pliku `permissions.constants.ts`. Uprawnienia są pogrupowane tematycznie i przypisane do ról.

### Implementacja w Modelu Użytkownika

Role są przechowywane w tabeli powiązań `user_roles`:

```typescript
// server/database/schema.ts
export const userRoles = sqliteTable('user_roles', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  roleId: integer('role_id')
    .notNull()
    .references(() => roles.id, { onDelete: 'cascade' }),
  assignedAt: text('assigned_at').notNull(),
  assignedBy: integer('assigned_by')
    .references(() => users.id),
});
```

## Używanie Systemu Ról w Kodzie

### Sprawdzanie Uprawnień w Komponentach Vue

```vue
<script setup>
import { usePermissions } from '~/composables/usePermissions';

const { can, userRoles } = usePermissions();

// Sprawdzanie uprawnień
const canCreateTraining = can(PERMISSIONS.TRAINING_CREATE);
</script>

<template>
  <!-- Ukryj elementy na podstawie uprawnień -->
  <UButton v-if="can(PERMISSIONS.TRAINING_CREATE)">
    Utwórz trening
  </UButton>
  
  <!-- Wyświetl role użytkownika -->
  <div>
    Twoje role:
    <UBadge 
      v-for="role in userRoles" 
      :key="role" 
      :color="USER_ROLE_COLORS[role]"
    >
      {{ ROLE_NAMES[role] }}
    </UBadge>
  </div>
</template>
```

### Zabezpieczanie Endpointów API

```typescript
// server/api/trainings/create.post.ts
import { PERMISSIONS } from '~/shared/utils/permissions.constants';

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  
  if (!session?.user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    });
  }
  
  // Pobierz role użytkownika
  const userRoles = await getUserRoleSlugs(session.user.id);
  
  // Sprawdź uprawnienia z wykorzystaniem cache'a
  const hasRequiredPermission = await checkPermissionByRoles(
    session.user.id,
    userRoles,
    PERMISSIONS.TRAINING_CREATE
  );
  
  if (!hasRequiredPermission) {
    throw createError({
      statusCode: 403,
      message: 'Insufficient privileges'
    });
  }
  
  // Kontynuuj obsługę żądania...
});
```

### Kontrola Dostępu w Routingu

```typescript
// Definiowanie wymaganych uprawnień dla stron
definePageMeta({
  middleware: ['auth'],
  requiredPermission: PERMISSIONS.SYSTEM_SETTINGS
})
```

## Elementy Systemu Uprawnień

### Composable `usePermissions`

Ten composable jest głównym punktem dostępu do systemu uprawnień po stronie klienta:

```typescript
export function usePermissions() {
  const userSession = useState<UserSession>('user-session');
  const { session: authSession } = useUserSession();

  // Pobierz role użytkownika
  const userRoles = computed(() => {
    if (userSession.value?.roles && Array.isArray(userSession.value.roles) && userSession.value.roles.length > 0) {
      return userSession.value.roles;
    } else if (authSession.value?.roles && Array.isArray(authSession.value.roles) && authSession.value.roles.length > 0) {
      return authSession.value.roles;
    } else {
      return [USER_ROLES.OBSERVER];
    }
  });

  // Funkcje sprawdzające uprawnienia
  const can = (permission: Permission) => {
    return hasPermissionMultiRole(userRoles.value, permission);
  };

  const canAll = (permissions: Permission[]) => {
    return hasAllPermissionsMultiRole(userRoles.value, permissions);
  };

  const canAny = (permissions: Permission[]) => {
    return hasAnyPermissionMultiRole(userRoles.value, permissions);
  };

  return { userRoles, can, canAll, canAny };
}
```

### Middleware check-permission.ts

Middleware po stronie serwera zabezpieczające dostęp do endpointów API:

```typescript
export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname;

  // Ignoruj ścieżki publiczne i autoryzacyjne
  if (path.startsWith('/api/auth/') || path === '/api/health') {
    return;
  }

  // Pobierz sesję użytkownika
  const session = await getUserSession(event);

  // Znajdź wymagane uprawnienie dla danej ścieżki
  let requiredPermission = findPermissionForPath(path);

  // Jeśli nie znaleziono mapowania uprawnienia, kontynuuj
  if (!requiredPermission) return;

  // Sprawdź uprawnienia użytkownika
  // ... (implementacja sprawdzania uprawnień)
});
```

### Cachowanie Uprawnień

Dla zwiększenia wydajności system wykorzystuje cachowanie uprawnień użytkownika:

```typescript
async function checkPermissionByRoles(
  userId: number,
  roleSlugs: RoleSlug[],
  requiredPermission: Permission
): Promise<boolean> {
  // Spróbuj pobrać uprawnienia z cache'a
  const cachedPermissions = getCachedPermissions(userId);

  // Jeśli uprawnienia są w cache, użyj ich
  if (cachedPermissions) {
    return cachedPermissions.has(requiredPermission);
  }

  // Jeśli nie ma w cache, oblicz wszystkie uprawnienia
  const allPermissions = getAllPermissionsForRoles(roleSlugs);

  // Zapisz obliczone uprawnienia do cache'a
  setCachedPermissions(userId, allPermissions);

  // Zwróć wynik sprawdzenia
  return allPermissions.includes(requiredPermission);
}
```

## Rozszerzanie Systemu Ról

### Dodawanie Nowej Roli

1. Dodaj nową rolę w roles.constants.ts:

```typescript
export const USER_ROLES = {
  // ... istniejące role
  NUTRITIONIST: 'nutritionist',
} as const;
```

2. Dodaj kolor i ikonę dla nowej roli:

```typescript
export const USER_ROLE_COLORS: Record<RoleSlug, string> = {
  // ... istniejące kolory
  [USER_ROLES.NUTRITIONIST]: 'emerald',
};

export const USER_ROLE_ICONS: Record<RoleSlug, string> = {
  // ... istniejące ikony
  [USER_ROLES.NUTRITIONIST]: 'i-lucide-utensils',
};
```

3. Zaktualizuj hierarchię ról:

```typescript
export const ROLE_HIERARCHY: Record<RoleSlug, RoleSlugs> = {
  // ... istniejące role
  [USER_ROLES.NUTRITIONIST]: [USER_ROLES.USER, USER_ROLES.OBSERVER],
  // Zaktualizuj też inne role, które mają dostęp do NUTRITIONIST
  [USER_ROLES.ADMIN]: [...existingRoles, USER_ROLES.NUTRITIONIST],
};
```

4. Przypisz uprawnienia do nowej roli:

```typescript
export const ROLE_PERMISSIONS: Record<RoleSlug, Permission[]> = {
  // ... istniejące role
  [USER_ROLES.NUTRITIONIST]: [
    PERMISSIONS.USER_VIEW,
    PERMISSIONS.NUTRITION_VIEW,
    PERMISSIONS.NUTRITION_CREATE,
    PERMISSIONS.NUTRITION_EDIT,
    // ... inne uprawnienia
  ],
};
```

5. Dodaj rolę do bazy danych:

```sql
INSERT INTO roles (name, slug, description, is_system, created_at)
VALUES ('Dietetyk', 'nutritionist', 'Zarządzanie dietą i planami żywieniowymi', 1, CURRENT_TIMESTAMP);
```

### Dodawanie Nowych Uprawnień

1. Zdefiniuj nowe uprawnienie w permissions.constants.ts:

```typescript
export const PERMISSIONS = {
  // ... istniejące uprawnienia
  NUTRITION_VIEW: 'nutrition:view',
  NUTRITION_CREATE: 'nutrition:create',
  NUTRITION_EDIT: 'nutrition:edit',
};
```

2. Przypisz uprawnienia do odpowiednich ról:

```typescript
export const ROLE_PERMISSIONS: Record<RoleSlug, Permission[]> = {
  [USER_ROLES.ADMIN]: [...existingPermissions, PERMISSIONS.NUTRITION_VIEW, PERMISSIONS.NUTRITION_CREATE, PERMISSIONS.NUTRITION_EDIT],
  [USER_ROLES.NUTRITIONIST]: [...existingPermissions, PERMISSIONS.NUTRITION_VIEW, PERMISSIONS.NUTRITION_CREATE, PERMISSIONS.NUTRITION_EDIT],
  // ... inne role
};
```

## Najlepsze Praktyki

1. **Używaj uprawnień, nie ról** - zawsze sprawdzaj uprawnienia (`can(PERMISSION)`), zamiast bezpośrednio sprawdzać role użytkownika
2. **Wykorzystuj composable `usePermissions`** - zapewnia to spójne sprawdzanie uprawnień w całej aplikacji
3. **Pamiętaj o cache'owaniu** - dla wydajności, uprawnienia są cachowane po stronie klienta i serwera
4. **Dokumentuj nowe uprawnienia** - każde nowe uprawnienie powinno mieć jasno określony cel i być przypisane do odpowiednich ról
5. **Testuj kontrolę dostępu** - szczególnie przy dodawaniu nowych funkcjonalności

## Debugowanie Uprawnień

Podczas rozwoju aplikacji przydatne jest narzędzie do debugowania uprawnień:

```vue
<!-- components/PermissionDebugger.vue -->
<template>
  <div v-if="import.meta.dev" class="border p-4 rounded-lg">
    <h3 class="text-lg font-medium mb-2">Debugger uprawnień</h3>
    <div class="flex items-center gap-2 mb-2">
      <span>Role użytkownika:</span>
      <UBadge 
        v-for="role in userRoles" 
        :key="role" 
        :color="USER_ROLE_COLORS[role]"
      >
        {{ role }}
      </UBadge>
    </div>
    <div class="mb-4">
      <p class="text-sm text-gray-500">Testuj uprawnienia:</p>
      <div class="flex gap-2 mt-1">
        <UInput v-model="testPermission" placeholder="Wpisz uprawnienie" />
        <UButton @click="testCan">Sprawdź</UButton>
      </div>
      <p class="mt-2" v-if="testedPermission">
        {{ canAccess ? '✓ Masz uprawnienie' : '✗ Brak uprawnienia' }}
        <code>{{ testedPermission }}</code>
      </p>
    </div>
  </div>
</template>

<script setup>
import { usePermissions } from '~/composables/usePermissions';
import { USER_ROLE_COLORS } from '~/shared/utils/roles.constants';

const { userRoles, can } = usePermissions();
const testPermission = ref('');
const testedPermission = ref('');
const canAccess = ref(false);

function testCan() {
  testedPermission.value = testPermission.value;
  canAccess.value = can(testPermission.value);
}
</script>
```

## Wnioski

System ról i uprawnień w ATP został zmodernizowany, aby obsługiwać wielu użytkowników z wieloma rolami. Dzięki temu:

1. Użytkownicy mogą mieć różne zestawy uprawnień w zależności od kontekstu
2. Uprawnienia są sprawdzane na podstawie wszystkich ról użytkownika
3. System jest bardziej elastyczny i skalowalny

Właściwe wykorzystanie tego systemu pomaga w implementacji zasady najmniejszych uprawnień (Principle of Least Privilege), zwiększając bezpieczeństwo i kontrolę nad dostępem do zasobów i funkcji aplikacji.
```

Ta poprawiona dokumentacja uwzględnia:

1. Wielorolowy system uprawnień zamiast pojedynczej roli
2. Aktualne implementacje funkcji `usePermissions`, `useGuard` i innych komponentów
3. Wprowadzony system cachowania uprawnień
4. Nowe podejście do filtrowania elementów sidebar według uprawnień
5. Aktualizację metod sprawdzania uprawnień z uwzględnieniem wielu ról

Dokument jest aktualny względem obecnego stanu kodu i najlepszych praktyk w systemie ATP.Ta poprawiona dokumentacja uwzględnia:

1. Wielorolowy system uprawnień zamiast pojedynczej roli
2. Aktualne implementacje funkcji `usePermissions`, `useGuard` i innych komponentów
3. Wprowadzony system cachowania uprawnień
4. Nowe podejście do filtrowania elementów sidebar według uprawnień
5. Aktualizację metod sprawdzania uprawnień z uwzględnieniem wielu ról

Dokument jest aktualny względem obecnego stanu kodu i najlepszych praktyk w systemie ATP.