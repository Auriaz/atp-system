/**
 * Role użytkowników w systemie ATP
 */
export const USER_ROLES = {
  /**
   * Administrator systemu - pełen dostęp do wszystkich funkcji
   */
  ADMIN: 'admin',

  /**
   * Trener - może zarządzać programami treningowymi i podopiecznymi
   */
  COACH: 'coach',

  /**
   * Sportowiec - może przeglądać swoje programy treningowe i wyniki
   */
  ATHLETE: 'athlete',


  /**
   * Manager - zarządza aspektami organizacyjnymi, ale nie treningowymi
   */
  MANAGER: 'manager',

  /**
   * Editor - osoba mogąca dodawać i zarządzać treściami w systemie CMS (Content Management System) 
   */
  EDITOR: 'editor',
  /**
   * Użytkownik - osoba posiadająca konto w systemie z podstawowymi uprawnieniami do interakcji,
   * ale ograniczonym dostępem do funkcji premium. Wymaga logowania.
   */
  USER: 'user',

  /**
 * Obserwator - osoba mogąca jedynie przeglądać publicznie dostępne treści bez możliwości 
 * interakcji z systemem. Nie wymaga logowania.
 */
  OBSERVER: 'observer',
} as const;

/**
 * Typ reprezentujący rolę użytkownika
 */
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

/**
 * Kolory dla poszczególnych ról (do użycia w UI)
 */
export const USER_ROLE_COLORS: Record<UserRole, string> = {
  [USER_ROLES.ADMIN]: 'primary',    // niebieski
  [USER_ROLES.COACH]: 'green',      // zielony
  [USER_ROLES.ATHLETE]: 'orange',   // pomarańczowy
  [USER_ROLES.OBSERVER]: 'gray',    // szary
  [USER_ROLES.MANAGER]: 'indigo',   // indygo
  [USER_ROLES.USER]: 'blue',        // niebieski
  [USER_ROLES.EDITOR]: 'violet'   // fioletowy
};

/**
 * Ikony dla poszczególnych ról (do użycia w UI)
 */
export const USER_ROLE_ICONS: Record<UserRole, string> = {
  [USER_ROLES.ADMIN]: 'i-lucide-shield',
  [USER_ROLES.COACH]: 'i-lucide-dumbbell',
  [USER_ROLES.ATHLETE]: 'i-lucide-running',
  [USER_ROLES.OBSERVER]: 'i-lucide-eye',
  [USER_ROLES.MANAGER]: 'i-lucide-briefcase',
  [USER_ROLES.USER]: 'i-lucide-user',
  [USER_ROLES.EDITOR]: 'i-lucide-edit-3'
};

/**
 * Hierarchia ról - określa, które role mają dostęp do funkcji innych ról
 * Każda rola ma dostęp do funkcji ról znajdujących się w jej tablicy
 *  Jest to implementacja tzw. Role-Based Access Control (RBAC) z dziedziczeniem uprawnień.
 */
export const ROLE_HIERARCHY: Record<UserRole, UserRole[]> = {
  [USER_ROLES.ADMIN]: [USER_ROLES.MANAGER, USER_ROLES.COACH, USER_ROLES.ATHLETE, USER_ROLES.USER, USER_ROLES.OBSERVER, USER_ROLES.EDITOR],
  [USER_ROLES.MANAGER]: [USER_ROLES.COACH, USER_ROLES.ATHLETE, USER_ROLES.USER, USER_ROLES.OBSERVER],
  [USER_ROLES.COACH]: [USER_ROLES.ATHLETE, USER_ROLES.USER, USER_ROLES.OBSERVER],
  [USER_ROLES.EDITOR]: [USER_ROLES.USER, USER_ROLES.OBSERVER],
  [USER_ROLES.ATHLETE]: [USER_ROLES.USER, USER_ROLES.OBSERVER],
  [USER_ROLES.USER]: [USER_ROLES.OBSERVER],
  [USER_ROLES.OBSERVER]: []
};
