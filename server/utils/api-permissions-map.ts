/**
 * Mapowanie ścieżek API na wymagane uprawnienia
 * 
 * Ten plik zawiera mapowanie wszystkich ścieżek API na uprawnienia,
 * które są wymagane do dostępu do danego zasobu.
 */
export const API_PERMISSION_MAP: Record<string, Permission> = {
  // Użytkownicy
  '/api/users': PERMISSIONS.USER_VIEW,             // Lista użytkowników
  '/api/users/profile': PERMISSIONS.PROFILE_VIEW,  // Przeglądanie profili
  '/api/users/create': PERMISSIONS.USER_CREATE,    // Tworzenie użytkowników
  '/api/users/\\d+/edit': PERMISSIONS.USER_EDIT,   // Edycja użytkowników
  '/api/users/\\d+/delete': PERMISSIONS.USER_DELETE, // Usuwanie użytkowników
  '/api/users/me': PERMISSIONS.PROFILE_VIEW,       // Własny profil

  // Treningi
  '/api/trainings': PERMISSIONS.TRAINING_VIEW,     // Lista treningów
  '/api/trainings/all': PERMISSIONS.TRAINING_VIEW_ALL, // Wszystkie treningi
  '/api/trainings/create': PERMISSIONS.TRAINING_CREATE, // Tworzenie treningów
  '/api/trainings/\\d+/edit': PERMISSIONS.TRAINING_EDIT, // Edycja treningów
  '/api/trainings/\\d+': PERMISSIONS.TRAINING_VIEW, // Szczegóły treningu
  '/api/trainings/enroll': PERMISSIONS.TRAINING_ENROLL, // Zapisanie na trening
  '/api/trainings/\\d+/unenroll': PERMISSIONS.TRAINING_ENROLL, // Wypisanie z treningu

  // Treści
  '/api/content': PERMISSIONS.CONTENT_VIEW,         // Lista treści
  '/api/content/public': PERMISSIONS.CONTENT_VIEW_PUBLIC, // Publiczne treści
  '/api/content/create': PERMISSIONS.CONTENT_CREATE, // Tworzenie treści
  '/api/content/\\d+/edit': PERMISSIONS.CONTENT_EDIT, // Edycja treści
  '/api/content/\\d+/publish': PERMISSIONS.CONTENT_PUBLISH, // Publikowanie treści
  '/api/content/\\d+': PERMISSIONS.CONTENT_VIEW,    // Szczegóły treści
  '/api/content/\\d+/like': PERMISSIONS.CONTENT_LIKE, // Polubienie treści
  '/api/content/\\d+/unlike': PERMISSIONS.CONTENT_LIKE, // Odlubienie treści
  '/api/content/\\d+/comment': PERMISSIONS.CONTENT_COMMENT, // Komentowanie treści

  // Materiały szkoleniowe
  '/api/materials': PERMISSIONS.MATERIAL_VIEW,      // Lista materiałów
  '/api/materials/\\d+': PERMISSIONS.MATERIAL_VIEW, // Szczegóły materiału
  // '/api/materials/create': PERMISSIONS.MATERIAL_CREATE, // Tworzenie materiałów
  // '/api/materials/\\d+/edit': PERMISSIONS.MATERIAL_EDIT, // Edycja materiałów
  // '/api/materials/\\d+/delete': PERMISSIONS.MATERIAL_DELETE, // Usuwanie materiałów

  // Postępy i statystyki
  '/api/progress': PERMISSIONS.PROGRESS_VIEW,      // Lista postępów
  '/api/progress/summary': PERMISSIONS.PROGRESS_VIEW, // Podsumowanie postępów
  '/api/progress/\\d+/update': PERMISSIONS.PROGRESS_UPDATE, // Aktualizacja postępów
  '/api/statistics/personal': PERMISSIONS.STATISTICS_VIEW, // Osobiste statystyki
  '/api/statistics/global': PERMISSIONS.STATISTICS_VIEW_GLOBAL, // Globalne statystyki

  // Certyfikaty
  '/api/certificates': PERMISSIONS.CERTIFICATE_VIEW, // Lista certyfikatów
  '/api/certificates/\\d+': PERMISSIONS.CERTIFICATE_VIEW, // Szczegóły certyfikatu
  '/api/certificates/\\d+/download': PERMISSIONS.CERTIFICATE_DOWNLOAD, // Pobieranie certyfikatu

  // Powiadomienia
  '/api/notifications': PERMISSIONS.NOTIFICATION_VIEW, // Lista powiadomień
  '/api/notifications/\\d+/read': PERMISSIONS.NOTIFICATION_MANAGE, // Oznaczenie jako przeczytane
  '/api/notifications/read-all': PERMISSIONS.NOTIFICATION_MANAGE, // Oznaczenie wszystkich jako przeczytane

  // Raporty
  // '/api/reports': PERMISSIONS.REPORT_VIEW,        // Lista raportów
  // '/api/reports/create': PERMISSIONS.REPORT_CREATE, // Tworzenie raportów
  // '/api/reports/\\d+': PERMISSIONS.REPORT_VIEW,   // Szczegóły raportu

  // Ustawienia
  '/api/settings': PERMISSIONS.SETTINGS_VIEW,     // Przeglądanie ustawień
  '/api/settings/updated': PERMISSIONS.SETTINGS_EDIT, // Aktualizacja ustawień
  '/api/settings/updated/logo': PERMISSIONS.SETTINGS_LOGO, // Ustawienia logo
  '/api/settings/notifications': PERMISSIONS.SETTINGS_NOTIFICATIONS, // Ustawienia powiadomień


  // Wyszukiwanie
  '/api/search': PERMISSIONS.SEARCH,              // Wyszukiwanie
  '/api/search/users': PERMISSIONS.USER_VIEW,     // Wyszukiwanie użytkowników
  '/api/search/trainings': PERMISSIONS.TRAINING_VIEW, // Wyszukiwanie treningów
  '/api/search/content': PERMISSIONS.CONTENT_VIEW, // Wyszukiwanie treści
} as const;



/**
 * Funkcja pomocnicza do znajdowania uprawnień dla podanej ścieżki
 * Przydatne do debugowania
 */
export function findPermissionForPath(path: string): string | null {
  for (const [pattern, permission] of Object.entries(API_PERMISSION_MAP)) {
    const regex = new RegExp(`^${pattern}$`);
    if (regex.test(path)) {
      return permission;
    }
  }
  return null;
}

/**
 * Funkcja pomocnicza do znajdowania wszystkich ścieżek dla podanego uprawnienia
 * Przydatne do dokumentacji
 */
export function findPathsForPermission(permission: Permission): string[] {
  return Object.entries(API_PERMISSION_MAP)
    .filter(([_, perm]) => perm === permission)
    .map(([path]) => path);
}