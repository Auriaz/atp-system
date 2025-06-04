/**
 * Statusy użytkowników w systemie ATP
 * @description Definicje wszystkich możliwych statusów konta użytkownika
 */
export const USER_STATUSES = {
    /**
     * Konto aktywne z pełnym dostępem do funkcji
     */
    ACTIVE: 'active',

    /**
     * Konto oczekujące na weryfikację email
     */
    PENDING: 'pending',

    /**
     * Konto tymczasowo zawieszone (np. za naruszenie regulaminu)
     */
    SUSPENDED: 'suspended',

    /**
     * Konto trwale zablokowane za poważne naruszenia
     */
    BANNED: 'banned',

    /**
     * Konto nieaktywne z powodu długiego braku logowania
     */
    INACTIVE: 'inactive',

    /**
     * Konto usunięte przez użytkownika, ale dane zachowane
     */
    DELETED: 'deleted',

    /**
     * Konto zablokowane ze względów bezpieczeństwa
     */
    LOCKED: 'locked',

    /**
     * Konto z niezweryfikowanym adresem email
     */
    UNVERIFIED: 'unverified'
} as const;

/**
 * Typ reprezentujący status użytkownika
 */
export type UserStatus = typeof USER_STATUSES[keyof typeof USER_STATUSES];

/**
 * Kolory statusów użytkowników
 */

export const USER_STATUS_COLORS = {
    [USER_STATUSES.ACTIVE]: 'success',
    [USER_STATUSES.PENDING]: 'warning',
    [USER_STATUSES.SUSPENDED]: 'error',
    [USER_STATUSES.BANNED]: 'error',
    [USER_STATUSES.INACTIVE]: 'warning',
    [USER_STATUSES.DELETED]: 'error',
    [USER_STATUSES.LOCKED]: 'error',
    [USER_STATUSES.UNVERIFIED]: 'warning'
} as const;

export const USER_STATUS_NAMES = {
    active: 'Active',
    inactive: 'Inactive',
    pending: 'Pending',
    suspended: 'Suspended',
    banned: 'Banned',
    deleted: 'Deleted',
    locked: 'Locked',
    unverified: 'Unverified'
} as const