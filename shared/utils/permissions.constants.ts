// shared/utils/permissions.constants.ts

/**
 * Definicje konkretnych uprawnień w systemie ATP
 * Uprawnienia są pogrupowane tematycznie dla lepszej organizacji
 */
export const PERMISSIONS = {
  // ===== ZARZĄDZANIE UŻYTKOWNIKAMI =====
  USER_VIEW: 'user:view',           // Przeglądanie użytkowników
  USER_CREATE: 'user:create',        // Tworzenie użytkowników
  USER_EDIT: 'user:edit',           // Edycja użytkowników
  USER_DELETE: 'user:delete',        // Usuwanie użytkowników
  USER_ASSIGN_ROLE: 'user:assign_role',  // Przypisywanie ról
  PROFILE_VIEW: 'profile:view',     // Przeglądanie profili użytkowników

  // ===== PROGRAMY TRENINGOWE =====
  TRAINING_VIEW: 'training:view',       // Przeglądanie programów treningowych
  TRAINING_VIEW_ALL: 'training:view:all',  // Przeglądanie wszystkich programów
  TRAINING_CREATE: 'training:create',     // Tworzenie programów treningowych
  TRAINING_EDIT: 'training:edit',        // Edycja programów treningowych
  TRAINING_DELETE: 'training:delete',     // Usuwanie programów treningowych
  TRAINING_ASSIGN: 'training:assign',     // Przypisywanie programów sportowcom
  TRAINING_ENROLL: 'training:enroll',     // Zapisywanie na treningi

  // ===== WYNIKI I POSTĘPY =====
  PROGRESS_VIEW: 'progress:view',       // Przeglądanie własnych postępów
  PROGRESS_VIEW_ALL: 'progress:view:all',  // Przeglądanie wszystkich postępów
  PROGRESS_ADD: 'progress:add',         // Dodawanie wyników
  PROGRESS_EDIT: 'progress:edit',       // Edycja wyników
  PROGRESS_DELETE: 'progress:delete',    // Usuwanie wyników

  // ===== ZARZĄDZANIE TREŚCIĄ =====
  CONTENT_VIEW: 'content:view',        // Przeglądanie treści
  CONTENT_VIEW_PUBLIC: 'content:view:public', // Przeglądanie publicznych treści
  CONTENT_CREATE: 'content:create',     // Tworzenie treści
  CONTENT_EDIT: 'content:edit',        // Edycja treści
  CONTENT_DELETE: 'content:delete',     // Usuwanie treści
  CONTENT_PUBLISH: 'content:publish',   // Publikowanie treści
  CONTENT_LIKE: 'content:like',          // Polubienie treści
  CONTENT_COMMENT: 'content:comment',    // Komentowanie treści

  // ===== KALENDARZ I HARMONOGRAM =====
  SCHEDULE_VIEW: 'schedule:view',       // Przeglądanie własnego harmonogramu
  SCHEDULE_VIEW_ALL: 'schedule:view_all',  // Przeglądanie wszystkich harmonogramów
  SCHEDULE_CREATE: 'schedule:create',     // Tworzenie wydarzeń w harmonogramie
  SCHEDULE_EDIT: 'schedule:edit',        // Edycja wydarzeń w harmonogramie
  SCHEDULE_DELETE: 'schedule:delete',     // Usuwanie wydarzeń z harmonogramu

  // ===== ZARZĄDZANIE SYSTEMEM =====
  SYSTEM_SETTINGS: 'system:settings',    // Zmiana ustawień systemu
  SYSTEM_LOGS: 'system:logs',          // Przeglądanie logów systemu
  SYSTEM_BACKUP: 'system:backup',       // Tworzenie i przywracanie kopii zapasowych

  // ===== KOMUNIKACJA =====
  MESSAGE_SEND: 'message:send',        // Wysyłanie wiadomości
  MESSAGE_VIEW: 'message:view',        // Przeglądanie wiadomości
  NOTIFICATION_SEND: 'notification:send', // Wysyłanie powiadomień

  // ===== STATYSTYKI I RAPORTY =====
  STATS_VIEW: 'stats:view',           // Przeglądanie podstawowych statystyk
  STATS_ADVANCED: 'stats:advanced',     // Zaawansowane statystyki i wykresy
  REPORT_GENERATE: 'report:generate',   // Generowanie raportów

  // Specjalne uprawnienia dla Observer
  MATERIAL_VIEW: 'material:view',         // Przeglądanie materiałów
  PROGRESS_UPDATE: 'progress:update',     // Aktualizacja własnych postępów
  STATISTICS_VIEW: 'statistics:view',     // Przeglądanie własnych statystyk
  STATISTICS_VIEW_GLOBAL: 'statistics:view:global', // Przeglądanie globalnych statystyk
  CERTIFICATE_VIEW: 'certificate:view',   // Przeglądanie certyfikatów
  CERTIFICATE_DOWNLOAD: 'certificate:download', // Pobieranie certyfikatów
  NOTIFICATION_VIEW: 'notification:view', // Przeglądanie powiadomień
  NOTIFICATION_MANAGE: 'notification:manage', // Zarządzanie powiadomieniami
  SETTINGS_VIEW: 'settings:view',         // Przeglądanie ustawień
  SETTINGS_EDIT: 'settings:edit',         // Edycja ustawień
  SETTINGS_NOTIFICATIONS: 'settings:notifications', // Zarządzanie ustawieniami powiadomień
  SEARCH: 'search',                       // Wyszukiwanie
  SURVEY_VIEW: 'survey:view',             // Przeglądanie ankiet
  SURVEY_RESPOND: 'survey:respond',       // Wypełnianie ankiet
  FAQ_VIEW: 'faq:view',                   // Przeglądanie FAQ
  DOCS_VIEW: 'docs:view',                 // Przeglądanie dokumentacji
  CALENDAR_VIEW: 'calendar:view',         // Przeglądanie kalendarza
  CALENDAR_EDIT: 'calendar:edit',         // Edycja kalendarza
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

/**
 * Mapowanie ról na konkretne uprawnienia
 * Każda rola ma przypisany zestaw uprawnień
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  // Administrator ma wszystkie uprawnienia
  [USER_ROLES.ADMIN]: Object.values(PERMISSIONS) as Permission[],

  // Manager - zarządza organizacją, trenerami i sportowcami
  [USER_ROLES.MANAGER]: [
    // Zarządzanie użytkownikami
    PERMISSIONS.USER_VIEW, PERMISSIONS.USER_CREATE, PERMISSIONS.USER_EDIT,

    // Programy treningowe
    PERMISSIONS.TRAINING_VIEW, PERMISSIONS.TRAINING_VIEW_ALL,
    PERMISSIONS.TRAINING_CREATE, PERMISSIONS.TRAINING_EDIT,

    // Wyniki i postępy
    PERMISSIONS.PROGRESS_VIEW_ALL, PERMISSIONS.PROGRESS_EDIT,

    // Treści
    PERMISSIONS.CONTENT_VIEW, PERMISSIONS.CONTENT_CREATE, PERMISSIONS.CONTENT_EDIT,

    // Harmonogram
    PERMISSIONS.SCHEDULE_VIEW_ALL, PERMISSIONS.SCHEDULE_CREATE,
    PERMISSIONS.SCHEDULE_EDIT, PERMISSIONS.SCHEDULE_DELETE,

    // Komunikacja
    PERMISSIONS.MESSAGE_SEND, PERMISSIONS.MESSAGE_VIEW, PERMISSIONS.NOTIFICATION_SEND,

    // Statystyki i raporty
    PERMISSIONS.STATS_VIEW, PERMISSIONS.STATS_ADVANCED, PERMISSIONS.REPORT_GENERATE
  ],

  // Trener - zarządza sportowcami i programami treningowymi
  [USER_ROLES.COACH]: [
    // Zarządzanie użytkownikami
    PERMISSIONS.USER_VIEW,

    // Programy treningowe
    PERMISSIONS.TRAINING_VIEW, PERMISSIONS.TRAINING_VIEW_ALL,
    PERMISSIONS.TRAINING_CREATE, PERMISSIONS.TRAINING_EDIT, PERMISSIONS.TRAINING_ASSIGN,

    // Wyniki i postępy
    PERMISSIONS.PROGRESS_VIEW_ALL, PERMISSIONS.PROGRESS_ADD, PERMISSIONS.PROGRESS_EDIT,

    // Treści
    PERMISSIONS.CONTENT_VIEW,

    // Harmonogram
    PERMISSIONS.SCHEDULE_VIEW, PERMISSIONS.SCHEDULE_VIEW_ALL,
    PERMISSIONS.SCHEDULE_CREATE, PERMISSIONS.SCHEDULE_EDIT,

    // Komunikacja
    PERMISSIONS.MESSAGE_SEND, PERMISSIONS.MESSAGE_VIEW, PERMISSIONS.NOTIFICATION_SEND,

    // Statystyki
    PERMISSIONS.STATS_VIEW, PERMISSIONS.REPORT_GENERATE
  ],

  // Redaktor - zarządza treściami w systemie
  [USER_ROLES.EDITOR]: [
    // Treści
    PERMISSIONS.CONTENT_VIEW, PERMISSIONS.CONTENT_CREATE,
    PERMISSIONS.CONTENT_EDIT, PERMISSIONS.CONTENT_DELETE, PERMISSIONS.CONTENT_PUBLISH,

    // Harmonogram
    PERMISSIONS.SCHEDULE_VIEW,

    // Komunikacja
    PERMISSIONS.MESSAGE_SEND, PERMISSIONS.MESSAGE_VIEW,

    // Podstawowe
    PERMISSIONS.STATS_VIEW
  ],

  // Sportowiec - korzysta z programów i śledzi swoje postępy
  [USER_ROLES.ATHLETE]: [
    // Programy treningowe
    PERMISSIONS.TRAINING_VIEW,

    // Wyniki i postępy
    PERMISSIONS.PROGRESS_VIEW, PERMISSIONS.PROGRESS_ADD,

    // Treści
    PERMISSIONS.CONTENT_VIEW,

    // Harmonogram
    PERMISSIONS.SCHEDULE_VIEW,

    // Komunikacja
    PERMISSIONS.MESSAGE_SEND, PERMISSIONS.MESSAGE_VIEW,

    // Statystyki
    PERMISSIONS.STATS_VIEW
  ],

  // Zwykły użytkownik - podstawowe funkcje
  [USER_ROLES.USER]: [
    // Treści
    PERMISSIONS.CONTENT_VIEW,

    // Harmonogram
    PERMISSIONS.SCHEDULE_VIEW,

    // Komunikacja
    PERMISSIONS.MESSAGE_SEND, PERMISSIONS.MESSAGE_VIEW
  ],

  // Obserwator - tylko przeglądanie publicznych treści
  [USER_ROLES.OBSERVER]: [
    PERMISSIONS.CONTENT_VIEW,
    PERMISSIONS.PROFILE_VIEW,           // Przeglądanie profili
    PERMISSIONS.CONTENT_VIEW_PUBLIC,    // Przeglądanie publicznych treści
    PERMISSIONS.MATERIAL_VIEW,          // Przeglądanie materiałów
    PERMISSIONS.NOTIFICATION_VIEW,      // Przeglądanie powiadomień
    PERMISSIONS.NOTIFICATION_MANAGE,    // Zarządzanie własnymi powiadomieniami
    PERMISSIONS.SETTINGS_VIEW,          // Przeglądanie ustawień
    PERMISSIONS.SETTINGS_EDIT,          // Edycja własnych ustawień
    PERMISSIONS.SETTINGS_NOTIFICATIONS, // Zarządzanie ustawieniami powiadomień
    PERMISSIONS.SEARCH,                 // Podstawowe wyszukiwanie
    PERMISSIONS.FAQ_VIEW,               // Przeglądanie FAQ
    PERMISSIONS.DOCS_VIEW,              // Przeglądanie dokumentacji
    PERMISSIONS.CALENDAR_VIEW,          // Przeglądanie kalendarza
  ]
};


/**
 * Sprawdza, czy użytkownik ma konkretne uprawnienie na podstawie jego roli
 * @param userRole Rola użytkownika
 * @param permission Wymagane uprawnienie
 * @returns true jeśli użytkownik ma uprawnienie, false w przeciwnym przypadku
 */
export function hasPermission(userRole: UserRole, permission: Permission): boolean {
  // Administrator ma wszystkie uprawnienia
  if (userRole === USER_ROLES.ADMIN) return true;

  // Sprawdzamy bezpośrednie uprawnienia roli
  if (ROLE_PERMISSIONS[userRole]?.includes(permission)) return true;

  // Sprawdzamy uprawnienia dziedziczone z innych ról
  const inheritedRoles = ROLE_HIERARCHY[userRole] || [];
  for (const inheritedRole of inheritedRoles) {
    if (ROLE_PERMISSIONS[inheritedRole]?.includes(permission)) return true;
  }

  return false;
}

/**
 * Sprawdza, czy użytkownik ma wszystkie z podanych uprawnień
 * @param userRole Rola użytkownika
 * @param permissions Lista wymaganych uprawnień
 * @returns true jeśli użytkownik ma wszystkie uprawnienia, false w przeciwnym przypadku
 */
export function hasAllPermissions(userRole: UserRole, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(userRole, permission));
}

/**
 * Sprawdza, czy użytkownik ma którekolwiek z podanych uprawnień
 * @param userRole Rola użytkownika
 * @param permissions Lista wymaganych uprawnień
 * @returns true jeśli użytkownik ma przynajmniej jedno uprawnienie, false w przeciwnym przypadku
 */
export function hasAnyPermission(userRole: UserRole, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(userRole, permission));
}

/**
 * Pobiera wszystkie uprawnienia dostępne dla danej roli (bezpośrednie i dziedziczone)
 * @param userRole Rola użytkownika
 * @returns Lista wszystkich uprawnień
 */
export function getAllUserPermissions(userRole: UserRole): Permission[] {
  // Zbiór unikalnych uprawnień
  const permissionsSet = new Set<Permission>();

  // Dodaj bezpośrednie uprawnienia
  ROLE_PERMISSIONS[userRole]?.forEach(perm => permissionsSet.add(perm));

  // Dodaj uprawnienia dziedziczone z innych ról
  const inheritedRoles = ROLE_HIERARCHY[userRole] || [];
  for (const inheritedRole of inheritedRoles) {
    ROLE_PERMISSIONS[inheritedRole]?.forEach(perm => permissionsSet.add(perm));
  }

  return [...permissionsSet];
}