/**
 * Typy aktywności użytkownika
 */
export const USER_ACTIVITY_TYPES = {
  // Aktywności związane z profilem
  PROFILE_UPDATED: 'profile_updated',
  AVATAR_UPDATED: 'avatar_updated',
  PASSWORD_CHANGED: 'password_changed',
  EMAIL_CHANGED: 'email_changed',

  // Aktywności związane z uwierzytelnianiem
  LOGIN_SUCCESS: 'login_success',
  LOGIN_FAILED: 'login_failed',
  LOGOUT: 'logout',
  PASSWORD_RESET_REQUESTED: 'password_reset_requested',
  PASSWORD_RESET_COMPLETED: 'password_reset_completed',

  // Aktywności związane z zarządzaniem kontem
  ACCOUNT_CREATED: 'account_created',
  ACCOUNT_DELETED: 'account_deleted',
  ACCOUNT_SUSPENDED: 'account_suspended',
  ACCOUNT_REACTIVATED: 'account_reactivated',
  USER_UPDATED: 'user_updated',

  // Aktywności związane z uprawnieniami
  ROLE_ASSIGNED: 'role_assigned',
  ROLE_REMOVED: 'role_removed',
  PERMISSION_GRANTED: 'permission_granted',
  PERMISSION_REVOKED: 'permission_revoked',

  // Inne aktywności
  SETTINGS_CHANGED: 'settings_changed',
  API_ACCESS: 'api_access'
} as const

export type UserActivityType = typeof USER_ACTIVITY_TYPES[keyof typeof USER_ACTIVITY_TYPES]


