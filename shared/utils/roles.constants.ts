/**
 * Role użytkowników w systemie ATP
 */
export enum UserRoleEnum {
  /**
   * Administrator systemu - pełen dostęp do wszystkich funkcji
   */
  ADMIN = 'admin',

  /**
   * Trener - może zarządzać programami treningowymi i podopiecznymi
   */
  COACH = 'coach',

  /**
   * Sportowiec - może przeglądać swoje programy treningowe i wyniki
   */
  ATHLETE = 'athlete',


  /**
   * Manager - zarządza aspektami organizacyjnymi, ale nie treningowymi
   */
  MANAGER = 'manager',

  /**
   * Editor - osoba mogąca dodawać i zarządzać treściami w systemie CMS (Content Management System) 
   */
  EDITOR = 'editor',
  /**
   * Użytkownik - osoba posiadająca konto w systemie z podstawowymi uprawnieniami do interakcji,
   * ale ograniczonym dostępem do funkcji premium. Wymaga logowania.
   */
  USER = 'user',

  /**
 * Obserwator - osoba mogąca jedynie przeglądać publicznie dostępne treści bez możliwości 
 * interakcji z systemem. Nie wymaga logowania.
 */
  OBSERVER = 'observer',
};

/**
 * Stałe dla ról systemowych
 */
export const USER_ROLES = {
  ADMIN: UserRoleEnum.ADMIN,
  USER: UserRoleEnum.USER,
  COACH: UserRoleEnum.COACH,
  ATHLETE: UserRoleEnum.ATHLETE,
  MANAGER: UserRoleEnum.MANAGER,
  EDITOR: UserRoleEnum.EDITOR,
  OBSERVER: UserRoleEnum.OBSERVER
} as const;

export type RoleSlug = typeof USER_ROLES[keyof typeof USER_ROLES];
export type RoleSlugs = RoleSlug[];


/**
 * Kolory dla poszczególnych ról (do użycia w UI)
 * 
 */
export const USER_ROLE_COLORS: Record<RoleSlug, string> = {
  [USER_ROLES.ADMIN]: 'admin',      // niebieski
  [USER_ROLES.COACH]: 'coach',        // zielony
  [USER_ROLES.ATHLETE]: 'athlete',     // pomarańczowy
  [USER_ROLES.OBSERVER]: 'observer',      // szary
  [USER_ROLES.MANAGER]: 'manager',     // indygo
  [USER_ROLES.USER]: 'user',          // niebieski
  [USER_ROLES.EDITOR]: 'editor'       // fioletowy
};

/**
 * Ikony dla poszczególnych ról (do użycia w UI)
 */
export const USER_ROLE_ICONS: Record<RoleSlug, string> = {
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
export const ROLE_HIERARCHY: Record<RoleSlug, RoleSlugs> = {
  [USER_ROLES.ADMIN]: [USER_ROLES.MANAGER, USER_ROLES.COACH, USER_ROLES.ATHLETE, USER_ROLES.USER, USER_ROLES.OBSERVER, USER_ROLES.EDITOR],
  [USER_ROLES.MANAGER]: [USER_ROLES.COACH, USER_ROLES.ATHLETE, USER_ROLES.USER, USER_ROLES.OBSERVER],
  [USER_ROLES.COACH]: [USER_ROLES.ATHLETE, USER_ROLES.USER, USER_ROLES.OBSERVER],
  [USER_ROLES.EDITOR]: [USER_ROLES.USER, USER_ROLES.OBSERVER],
  [USER_ROLES.ATHLETE]: [USER_ROLES.USER, USER_ROLES.OBSERVER],
  [USER_ROLES.USER]: [USER_ROLES.OBSERVER],
  [USER_ROLES.OBSERVER]: []
};


/**
 * Mapy pomocnicze dla ról
 */
export const ROLE_NAMES: Record<UserRoleEnum, string> = {
  [UserRoleEnum.ADMIN]: 'Administrator',
  [UserRoleEnum.USER]: 'User',
  [UserRoleEnum.COACH]: 'Coach',
  [UserRoleEnum.ATHLETE]: 'Athlete',
  [UserRoleEnum.MANAGER]: 'Manager',
  [UserRoleEnum.EDITOR]: 'Editor',
  [UserRoleEnum.OBSERVER]: 'Guest'
};

export const ROLE_DESCRIPTIONS: Record<UserRoleEnum, string> = {
  [UserRoleEnum.ADMIN]: 'Full access to all system features',
  [UserRoleEnum.USER]: 'Basic access to system features',
  [UserRoleEnum.COACH]: 'Management of athletes and training programs',
  [UserRoleEnum.ATHLETE]: 'Access to personal training programs and progress',
  [UserRoleEnum.MANAGER]: 'Management of user accounts and access',
  [UserRoleEnum.EDITOR]: 'Management of content in the system',
  [UserRoleEnum.OBSERVER]: 'Limited access to basic features'
};

/**
* Informacje o roli do wyświetlenia w UI
*/
export const ROLE_INFO = Object.entries(USER_ROLES).reduce(
  (acc, [key, value]) => {
    acc[value as UserRoleEnum] = {
      slug: value,
      name: ROLE_NAMES[value as UserRoleEnum],
      description: ROLE_DESCRIPTIONS[value as UserRoleEnum]
    };
    return acc;
  },
  {} as Record<UserRoleEnum, { slug: string; name: string; description: string }>
);