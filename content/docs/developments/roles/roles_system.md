---
title: 'System ról w ATP'
description: 'Kompleksowa dokumentacja systemu ról, uprawnień i kontroli dostępu w aplikacji ATP'
category: 'Authorization'
version: '1.0.0'
author: 'ATP Core Team'
createdAt: '2025-03-21'
---

# System Ról i Uprawnień w ATP

## Wprowadzenie

ATP wykorzystuje zaawansowany system ról i uprawnień (Role-Based Access Control - RBAC) z dziedziczeniem uprawnień. System ten definiuje co różni użytkownicy mogą widzieć i jakie działania mogą wykonywać w aplikacji.

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

## Hierarchia Ról

System ATP implementuje hierarchię ról, gdzie wyższe role dziedziczą uprawnienia niższych ról:
ADMIN ├── MANAGER │ └── COACH │ └── ATHLETE │ └── USER │ └── OBSERVER ├── EDITOR │ └── USER │ └── OBSERVER └── (wszystkie inne role)

Szczegółowy Opis Ról
Administrator (ADMIN)
Klucz: ADMIN
Kolor: Primary (niebieski)
Ikona: i-lucide-shield

Administrator ma pełen dostęp do systemu, w tym:

Zarządzanie użytkownikami i ich rolami
Dostęp do ustawień systemu
Zarządzanie wszystkimi treściami
Tworzenie i zarządzanie programami treningowymi
Dostęp do wszystkich statystyk i raportów
Manager (MANAGER)
Klucz: MANAGER
Kolor: Indigo
Ikona: i-lucide-briefcase

Manager zarządza aspektami organizacyjnymi:

Zarządzanie trenerami i sportowcami
Przydzielanie trenerów do sportowców
Tworzenie i zarządzanie grupami treningowymi
Dostęp do statystyk i raportów
Zarządzanie harmonogramami
Trener (COACH)
Klucz: COACH
Kolor: Green (zielony)
Ikona: i-lucide-dumbbell

Trener skupia się na aspektach treningowych:

Tworzenie i zarządzanie programami treningowymi
Monitorowanie postępów sportowców
Dodawanie i edycja ćwiczeń
Komunikacja ze sportowcami
Dostęp do statystyk swoich podopiecznych
Redaktor (EDITOR)
Klucz: EDITOR
Kolor: Violet (fioletowy)
Ikona: i-lucide-edit-3

Redaktor zajmuje się treściami w systemie:

Tworzenie i edycja artykułów
Zarządzanie biblioteką mediów
Publikowanie treści
Moderacja komentarzy
Kategoryzowanie i tagowanie treści
Sportowiec (ATHLETE)
Klucz: ATHLETE
Kolor: Orange (pomarańczowy)
Ikona: i-lucide-running

Sportowiec korzysta z programów treningowych:

Przeglądanie przypisanych programów treningowych
Rejestrowanie ukończonych treningów
Śledzenie własnych postępów
Komunikacja z trenerem
Dostęp do osobistych statystyk
Użytkownik (USER)
Klucz: USER
Kolor: Blue (niebieski)
Ikona: i-lucide-user

Użytkownik ma podstawowy dostęp do systemu:

Przeglądanie treści
Podstawowe interakcje z systemem
Zarządzanie własnym profilem
Komunikacja z innymi użytkownikami
Brak dostępu do funkcji premium
Obserwator (OBSERVER)
Klucz: OBSERVER
Kolor: Gray (szary)
Ikona: i-lucide-eye

Obserwator może tylko przeglądać publiczne treści:

Przeglądanie publicznych artykułów
Dostęp do publicznych harmonogramów
Brak możliwości interakcji z systemem
Brak dostępu do treści premium
Dostęp bez konieczności logowania
System Uprawnień
Poza rolami, system ATP definiuje szczegółowe uprawnienia (permissions) w pliku permissions.constants.ts. Uprawnienia są pogrupowane tematycznie i przypisane do ról.

Przykładowe Uprawnienia
Implementacja w Modelu Użytkownika
Role są przechowywane w tabeli użytkowników:
```
// server/models/users.model.ts
export const users = sqliteTable('users', {
  // ... inne pola
  role: text('role').default(USER_ROLES.USER).$type<UserRole>(),
  // ... inne pola
})
```

Używanie Systemu Ról w Kodzie
Sprawdzanie Ról w Komponentach Vue
```
<script setup>
import { usePermissions } from '~/composables/usePermissions';

const { can, userRole } = usePermissions();

// Sprawdzanie uprawnień
const canCreateTraining = can(PERMISSIONS.TRAINING_CREATE);
</script>

<template>
  <!-- Ukryj elementy na podstawie uprawnień -->
  <UButton v-if="can(PERMISSIONS.TRAINING_CREATE)">
    Utwórz trening
  </UButton>
  
  <!-- Użyj dyrektywy v-can -->
  <UButton v-can="PERMISSIONS.USER_EDIT">
    Edytuj użytkownika
  </UButton>
</template>
```
Zabezpieczanie Endpointów API
```
// server/api/trainings/create.post.ts
import { PERMISSIONS, hasPermission } from '~/shared/utils/permissions.constants';

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  
  if (!session?.user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    });
  }
  
  // Sprawdź uprawnienia
  if (!hasPermission(session.user.role, PERMISSIONS.TRAINING_CREATE)) {
    throw createError({
      statusCode: 403,
      message: 'Insufficient privileges'
    });
  }
  
  // Kontynuuj obsługę żądania...
});
```
Kontrola Dostępu w Routingu
```
// Definiowanie wymaganych ról dla stron
definePageMeta({
  middleware: ['auth'],
  requiredPermission: PERMISSIONS.SYSTEM_SETTINGS
})
```

### Kontrola Dostępu w Routingu
## Rozszerzanie Systemu Ról
# Dodawanie Nowej Roli
1. Dodaj nową rolę w roles.constants.ts:
```
export const USER_ROLES = {
  // ... istniejące role
  NUTRITIONIST: 'nutritionist',
} as const;
```
2. Dodaj kolor i ikonę dla nowej roli:
```
export const USER_ROLE_COLORS: Record<UserRole, string> = {
  // ... istniejące kolory
  [USER_ROLES.NUTRITIONIST]: 'emerald',
};

export const USER_ROLE_ICONS: Record<UserRole, string> = {
  // ... istniejące ikony
  [USER_ROLES.NUTRITIONIST]: 'i-lucide-utensils',
};
```
3. Zaktualizuj hierarchię ról:
```
export const ROLE_HIERARCHY: Record<UserRole, UserRole[]> = {
  // ... istniejące role
  [USER_ROLES.NUTRITIONIST]: [USER_ROLES.USER, USER_ROLES.OBSERVER],
  // Zaktualizuj też inne role, które mają dostęp do NUTRITIONIST
  [USER_ROLES.ADMIN]: [...existingRoles, USER_ROLES.NUTRITIONIST],
};
```
4. Przypisz uprawnienia do nowej roli:
```
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
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

## Dodawanie Nowych Uprawnień
1. Zdefiniuj nowe uprawnienie w permissions.constants.ts:
```
export const PERMISSIONS = {
  // ... istniejące uprawnienia
  NUTRITION_VIEW: 'nutrition:view',
  NUTRITION_CREATE: 'nutrition:create',
  NUTRITION_EDIT: 'nutrition:edit',
};
```

2. Przypisz uprawnienia do odpowiednich ról:
```
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [USER_ROLES.ADMIN]: [...existingPermissions, PERMISSIONS.NUTRITION_VIEW, PERMISSIONS.NUTRITION_CREATE, PERMISSIONS.NUTRITION_EDIT],
  [USER_ROLES.NUTRITIONIST]: [...existingPermissions, PERMISSIONS.NUTRITION_VIEW, PERMISSIONS.NUTRITION_CREATE, PERMISSIONS.NUTRITION_EDIT],
  // ... inne role
};
```
## Najlepsze Praktyki
    1. **Użyj hierarchii ról** - pozwoli to na łatwiejsze zarządzanie uprawnieniami
    2. **Sprawdzaj uprawnienia, nie role** - korzystaj z uprawnień zamiast bezpośrednio sprawdzać role
    3. **Centralizuj logikę dostępu** - używaj composables i middleware do sprawdzania uprawnień
    4. **Dokumentuj zmiany** - każda nowa rola lub uprawnienie powinny być udokumentowane
    5. **Testuj kontrolę dostępu** - twórz testy sprawdzające czy uprawnienia działają poprawnie

## Przykładowe Przypadki Użycia
# Przypisywanie Roli Użytkownikowi
```
/ server/api/users/[id]/role.patch.ts
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  const body = await readBody(event);
  const userId = getRouterParam(event, 'id');
  
  // Sprawdź uprawnienia
  if (!hasPermission(session.user.role, PERMISSIONS.USER_ASSIGN_ROLE)) {
    throw createError({
      statusCode: 403,
      message: 'Insufficient privileges'
    });
  }
  
  // Sprawdź poprawność roli
  if (!Object.values(USER_ROLES).includes(body.role)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid role'
    });
  }
  
  // Zaktualizuj rolę użytkownika
  // ...kod aktualizacji...
  
  return { success: true };
});
```
# Filtrowanie Menu na Podstawie Uprawnień
```
// composables/useNavigationMenu.ts
export function useNavigationMenu() {
  const { can } = usePermissions();
  
  const menuItems = computed(() => [
    {
      title: 'Dashboard',
      icon: 'i-lucide-home',
      to: '/dashboard',
      visible: true
    },
    {
      title: 'Użytkownicy',
      icon: 'i-lucide-users',
      to: '/dashboard/users',
      visible: can(PERMISSIONS.USER_VIEW)
    },
    {
      title: 'Treningi',
      icon: 'i-lucide-dumbbell',
      to: '/dashboard/trainings',
      visible: can(PERMISSIONS.TRAINING_VIEW)
    },
    {
      title: 'Zarządzanie treścią',
      icon: 'i-lucide-file-text',
      to: '/dashboard/content',
      visible: can(PERMISSIONS.CONTENT_VIEW)
    },
    {
      title: 'Ustawienia',
      icon: 'i-lucide-settings',
      to: '/dashboard/settings',
      visible: can(PERMISSIONS.SYSTEM_SETTINGS)
    }
  ]);
  
  const visibleMenuItems = computed(() => 
    menuItems.value.filter(item => item.visible)
  );
  
  return {
    menuItems,
    visibleMenuItems
  };
}
```

## Podsumowanie
System ról i uprawnień w ATP pozwala na precyzyjne kontrolowanie dostępu użytkowników do różnych funkcji systemu. Poprzez kombinację hierarchii ról i szczegółowych uprawnień, system zapewnia elastyczność i skalowalność.

---

### Dokumentacja Role-Based Access Control API
## Wprowadzenie do API RBAC
System ATP udostępnia zestaw API do zarządzania rolami i uprawnieniami użytkowników. Poniżej znajduje się dokumentacja dostępnych endpointów.

## Endpointy API
# Pobieranie Listy Ról
```
GET /api/roles
```

Zwraca listę wszystkich dostępnych ról w systemie.

# Wymagane uprawnienia: USER_VIEW
Przykładowa odpowiedź:
```
{
  "status": "success",
  "data": [
    {
      "key": "admin",
      "label": "Administrator",
      "color": "primary",
      "icon": "i-lucide-shield"
    },
    {
      "key": "manager",
      "label": "Manager",
      "color": "indigo",
      "icon": "i-lucide-briefcase"
    },
    // ... inne role
  ]
}
```

# Pobieranie Uprawnień dla Roli
```
GET /api/roles/[key]/permissions
``` 
Zwraca listę uprawnień przypisanych do danej roli.

# Wymagane uprawnienia: USER_VIEW
Przykładowa odpowiedź:
```
{
  "status": "success",
  "data": {
    "role": "coach",
    "permissions": [
      "user:view",
      "training:view",
      "training:create",
      "training:edit",
      // ... inne uprawnienia
    ]
  }
}
```

# Zmiana Roli Użytkownika
```
PATCH /api/users/[id]/role
```
Zmienia rolę danego użytkownika.

# Wymagane uprawnienia: USER_ASSIGN_ROLE

Parametry:
```
{
  "role": "coach"
}
```
Przykładowa odpowiedź:
```
{
  "status": "success",
  "message": {
    "title": "Rola zmieniona",
    "description": "Rola użytkownika została zmieniona na Trener"
  }
}
```

Sprawdzenie Uprawnień Użytkownika
```
GET /api/users/[userId]/permissions
```

Zwraca listę uprawnień danego użytkownika.

# Wymagane uprawnienia: USER_VIEW lub być zalogowanym jako dany użytkownik

Przykładowa odpowiedź:
```
{
  "status": "success",
  "data": {
    "userId": 123,
    "role": "coach",
    "permissions": [
      "user:view",
      "training:view",
      "training:create",
      // ... inne uprawnienia
    ]
  }
}
```
Kody Błędów API
| Kod | Opis |
|-----|------|
| 400 | Nieprawidłowe żądanie, np. niewłaściwa rola |
| 401 | Brak autoryzacji |
| 403 | Brak wystarczających uprawnień |
| 404 | Nie znaleziono zasobu |
| 500 | Błąd serwera |


## Przykłady Użycia API
# Zmiana Roli Użytkownika za Pomocą Fetch API
```
async function changeUserRole(userId, newRole) {
  try {
    const response = await $fetch(`/api/users/${userId}/role`, {
      method: 'PATCH',
      body: { role: newRole }
    });
    
    if (response.status === 'success') {
      toast.add({
        title: response.message.title,
        description: response.message.description,
        color: 'success'
      });
      return true;
    }
  } catch (error) {
    toast.add({
      title: 'Błąd',
      description: error.message || 'Nie udało się zmienić roli',
      color: 'error'
    });
    return false;
  }
}
```
# Pobieranie Uprawnień Użytkownika za Pomocą Axios
```
async function getUserPermissions(userId) {
  try {
    const { data } = await useFetch(`/api/users/${userId}/permissions`);
    
    return data.value?.permissions || [];
  } catch (error) {
    console.error('Błąd pobierania uprawnień:', error);
    return [];
  }
}
```

### Testy Jednostkowe dla Kontroli Dostępu
Rekomendowane jest pisanie testów jednostkowych dla sprawdzania uprawnień:
```
// tests/permissions.test.ts
import { describe, test, expect } from 'vitest'
import { USER_ROLES } from '~/shared/utils/roles.constants'
import { PERMISSIONS, hasPermission } from '~/shared/utils/permissions.constants'

describe('System uprawnień', () => {
  test('Administrator ma dostęp do wszystkich uprawnień', () => {
    expect(hasPermission(USER_ROLES.ADMIN, PERMISSIONS.USER_CREATE)).toBe(true)
    expect(hasPermission(USER_ROLES.ADMIN, PERMISSIONS.SYSTEM_SETTINGS)).toBe(true)
    expect(hasPermission(USER_ROLES.ADMIN, PERMISSIONS.CONTENT_PUBLISH)).toBe(true)
  })
  
  test('Trener ma dostęp do zarządzania treningami', () => {
    expect(hasPermission(USER_ROLES.COACH, PERMISSIONS.TRAINING_CREATE)).toBe(true)
    expect(hasPermission(USER_ROLES.COACH, PERMISSIONS.TRAINING_EDIT)).toBe(true)
  })
  
  test('Trener nie ma dostępu do ustawień systemu', () => {
    expect(hasPermission(USER_ROLES.COACH, PERMISSIONS.SYSTEM_SETTINGS)).toBe(false)
  })
  
  test('Obserwator ma dostęp tylko do przeglądania treści', () => {
    expect(hasPermission(USER_ROLES.OBSERVER, PERMISSIONS.CONTENT_VIEW)).toBe(true)
    expect(hasPermission(USER_ROLES.OBSERVER, PERMISSIONS.CONTENT_CREATE)).toBe(false)
  })
})
```

### Debugowanie Uprawnień
Podczas rozwoju aplikacji przydatne może być narzędzie do debugowania uprawnień:
```
<!-- components/PermissionDebugger.vue -->
<template>
  <div v-if="developmentMode" class="border p-4 rounded-lg">
    <h3 class="text-lg font-medium mb-2">Debugger uprawnień</h3>
    <div class="flex items-center gap-2 mb-2">
      <span>Aktualna rola:</span>
      <UBadge :color="roleColor">{{ userRole }}</UBadge>
    </div>
    <div class="mb-4">
      <p class="text-sm text-gray-500">Dostępne uprawnienia:</p>
      <div class="flex flex-wrap gap-1 mt-1">
        <UBadge 
          v-for="perm in userPermissions" 
          :key="perm" 
          color="gray" 
          size="xs"
        >
          {{ perm }}
        </UBadge>
      </div>
    </div>
    <div>
      <UInput 
        v-model="testPermission" 
        placeholder="Wpisz uprawnienie do sprawdzenia" 
      />
      <div class="mt-2">
        <UButton 
          size="sm" 
          :color="hasPermission ? 'success' : 'error'"
          @click="checkPermission"
        >
          {{ hasPermission ? 'Masz uprawnienie' : 'Brak uprawnienia' }}
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { USER_ROLE_COLORS } from '~/shared/utils/roles.constants';
import { usePermissions } from '~/composables/usePermissions';

const { userRole, userPermissions, can } = usePermissions();
const developmentMode = process.env.NODE_ENV === 'development';

const testPermission = ref('');
const hasPermission = ref(false);

const roleColor = computed(() => USER_ROLE_COLORS[userRole.value] || 'gray');

function checkPermission() {
  hasPermission.value = can(testPermission.value);
}
</script>
```
### Zaawansowane Techniki RBAC
## Dynamiczne Uprawnienia na Podstawie Kontekstu
W niektórych przypadkach uprawnienia mogą zależeć nie tylko od roli, ale również od kontekstu (np. relacji między użytkownikami):
```
// composables/useContextualPermissions.ts
export function useContextualPermissions() {
  const { userRole, can } = usePermissions();
  
  // Sprawdza, czy użytkownik może edytować konkretny trening
  const canEditTraining = (training) => {
    // Administrator i manager mogą edytować wszystkie treningi
    if (can(PERMISSIONS.TRAINING_EDIT_ALL)) return true;
    
    // Trener może edytować tylko swoje treningi lub treningi swoich podopiecznych
    if (userRole.value === USER_ROLES.COACH) {
      return training.coachId === userSession.value.user.id || 
             isAthleteUnderCoach(training.athleteId, userSession.value.user.id);
    }
    
    return false;
  };
  
  return {
    canEditTraining,
    // Inne kontekstowe sprawdzenia uprawnień...
  };
}
```
## Uprawnienia Oparte na Atrybutach (ABAC)
Dla bardziej zaawansowanych przypadków można rozszerzyć system o uprawnienia oparte na atrybutach:
```
// shared/utils/abac.ts
export function checkAttributeBasedAccess(
  userRole: UserRole, 
  action: string, 
  resource: any, 
  context: any = {}
): boolean {
  // Reguły dostępu oparte na atrybutach
  const rules = {
    'training:edit': (role, resource, context) => {
      // Administrator i manager mają pełen dostęp
      if (role === USER_ROLES.ADMIN || role === USER_ROLES.MANAGER) return true;
      
      // Trener może edytować tylko swoje treningi
      if (role === USER_ROLES.COACH) {
        return resource.coachId === context.userId;
      }
      
      return false;
    },
    // Inne reguły...
  };
  
  // Sprawdź, czy istnieje reguła dla danej akcji
  if (rules[action]) {
    return rules[action](userRole, resource, context);
  }
  
  // Domyślnie sprawdź zwykłe uprawnienia
  return hasPermission(userRole, action);
}
```
### Wnioski
System ról i uprawnień w ATP zapewnia elastyczne zarządzanie dostępem użytkowników. Dzięki hierarchii ról, szczegółowym uprawnieniom i możliwości rozszerzania, system może być łatwo dostosowany do zmieniających się wymagań aplikacji.

Właściwe wykorzystanie tego systemu pomaga w implementacji zasady najmniejszych uprawnień (Principle of Least Privilege), zwiększając bezpieczeństwo i kontrolę nad dostępem do zasobów i funkcji aplikacji.

