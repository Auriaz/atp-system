/**
 * HTTP Status codes with corresponding messages and categories
 * Used for consistent API responses across the application
 */

// HTTP Status codes with readable names
export const HTTP_STATUS = {
  // 2xx Success
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,

  // 3xx Redirection
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  SEE_OTHER: 303,
  NOT_MODIFIED: 304,
  TEMPORARY_REDIRECT: 307,
  PERMANENT_REDIRECT: 308,

  // 4xx Client Errors
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  CONFLICT: 409,
  GONE: 410,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,

  // 5xx Server Errors
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504
} as const

export type HttpStatusCode = typeof HTTP_STATUS[keyof typeof HTTP_STATUS]

// HTTP Response categories
export const RESPONSE_CATEGORY = {
  SUCCESS: 'success',
  REDIRECT: 'redirect',
  CLIENT_ERROR: 'clientError',
  SERVER_ERROR: 'serverError'
} as const

export type ResponseCategory = typeof RESPONSE_CATEGORY[keyof typeof RESPONSE_CATEGORY]

// Default messages for HTTP status codes
export const DEFAULT_STATUS_MESSAGES: Record<HttpStatusCode, string> = {
  // 2xx Success
  [HTTP_STATUS.OK]: 'Request completed successfully',
  [HTTP_STATUS.CREATED]: 'Resource created successfully',
  [HTTP_STATUS.ACCEPTED]: 'Request accepted for processing',
  [HTTP_STATUS.NO_CONTENT]: 'Request completed with no content to return',

  // 3xx Redirection
  [HTTP_STATUS.MOVED_PERMANENTLY]: 'Resource has been moved permanently',
  [HTTP_STATUS.FOUND]: 'Resource found at different location',
  [HTTP_STATUS.SEE_OTHER]: 'See other resource',
  [HTTP_STATUS.NOT_MODIFIED]: 'Resource not modified',
  [HTTP_STATUS.TEMPORARY_REDIRECT]: 'Resource temporarily moved',
  [HTTP_STATUS.PERMANENT_REDIRECT]: 'Resource permanently moved',

  // 4xx Client Errors
  [HTTP_STATUS.BAD_REQUEST]: 'Invalid request format or parameters',
  [HTTP_STATUS.UNAUTHORIZED]: 'Authentication required',
  [HTTP_STATUS.PAYMENT_REQUIRED]: 'Payment required to access this resource',
  [HTTP_STATUS.FORBIDDEN]: 'You do not have permission to access this resource',
  [HTTP_STATUS.NOT_FOUND]: 'The requested resource was not found',
  [HTTP_STATUS.METHOD_NOT_ALLOWED]: 'The request method is not allowed for this resource',
  [HTTP_STATUS.NOT_ACCEPTABLE]: 'The requested format is not acceptable',
  [HTTP_STATUS.CONFLICT]: 'The request conflicts with the current state of the resource',
  [HTTP_STATUS.GONE]: 'The requested resource is no longer available',
  [HTTP_STATUS.UNPROCESSABLE_ENTITY]: 'The request was well-formed but contains semantic errors',
  [HTTP_STATUS.TOO_MANY_REQUESTS]: 'Too many requests, please try again later',

  // 5xx Server Errors
  [HTTP_STATUS.INTERNAL_SERVER_ERROR]: 'An unexpected error occurred on the server',
  [HTTP_STATUS.NOT_IMPLEMENTED]: 'This functionality is not implemented yet',
  [HTTP_STATUS.BAD_GATEWAY]: 'Invalid response from upstream server',
  [HTTP_STATUS.SERVICE_UNAVAILABLE]: 'Service temporarily unavailable',
  [HTTP_STATUS.GATEWAY_TIMEOUT]: 'Gateway timeout, please try again later'
}

// Specific error messages for common API scenarios
export const API_ERROR_MESSAGES = {
  // Authentication errors
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    SESSION_EXPIRED: 'Your session has expired, please log in again',
    ACCOUNT_LOCKED: 'Your account has been locked due to too many failed login attempts',
    INSUFFICIENT_PERMISSIONS: 'You do not have sufficient permissions to perform this action',
    INVALID_TOKEN: 'Invalid or expired authentication token',
    MISSING_TOKEN: 'Authentication token is required'
  },

  // User-related errors
  USER: {
    NOT_FOUND: 'User not found',
    ALREADY_EXISTS: 'User with this email already exists',
    USERNAME_TAKEN: 'This username is already taken',
    INVALID_EMAIL: 'Please provide a valid email address',
    INVALID_PASSWORD: 'Password must be at least 8 characters long and include a number',
    ACCOUNT_INACTIVE: 'Your account is currently inactive',
    EMAIL_VERIFICATION_REQUIRED: 'Please verify your email address before proceeding'
  },

  // Validation errors
  VALIDATION: {
    MISSING_REQUIRED_FIELDS: 'Required fields are missing',
    INVALID_FORMAT: 'One or more fields have an invalid format',
    TOO_SHORT: 'Value is too short',
    TOO_LONG: 'Value is too long',
    INVALID_DATE: 'Invalid date format',
    INVALID_ENUM: 'Value not allowed for this field'
  },

  // Resource errors
  RESOURCE: {
    NOT_FOUND: 'The requested resource was not found',
    ALREADY_EXISTS: 'Resource already exists',
    LOCKED: 'This resource is locked and cannot be modified',
    DELETED: 'This resource has been deleted',
    QUOTA_EXCEEDED: 'You have reached the maximum number of resources allowed',
    UPLOAD_FAILED: 'File upload failed'
  },

  // Data errors
  DATA: {
    INVALID_JSON: 'Invalid JSON format',
    PARSING_ERROR: 'Error parsing request data',
    INTEGRITY_VIOLATION: 'Operation would violate data integrity'
  },

  // Server errors
  SERVER: {
    INTERNAL_ERROR: 'An unexpected error occurred on the server',
    MAINTENANCE: 'Server is undergoing maintenance, please try again later',
    THIRD_PARTY_ERROR: 'Error communicating with external service',
    DATABASE_ERROR: 'Database error occurred'
  }
}

// Success messages for common API scenarios
export const API_SUCCESS_MESSAGES = {
  // Authentication successes
  AUTH: {
    LOGIN_SUCCESS: 'Successfully logged in',
    LOGOUT_SUCCESS: 'Successfully logged out',
    PASSWORD_CHANGED: 'Your password has been changed successfully',
    PASSWORD_RESET: 'Password reset email has been sent',
    EMAIL_VERIFIED: 'Your email has been verified successfully'
  },

  // User-related successes
  USER: {
    CREATED: 'User created successfully',
    UPDATED: 'User updated successfully',
    PROFILE_UPDATED: 'Profile updated successfully',
    DELETED: 'User deleted successfully',
    PASSWORD_UPDATED: 'Password updated successfully',
    AVATAR_UPDATED: 'Avatar updated successfully'
  },

  // Resource successes
  RESOURCE: {
    CREATED: 'Resource created successfully',
    UPDATED: 'Resource updated successfully',
    DELETED: 'Resource deleted successfully',
    UPLOADED: 'File uploaded successfully',
    SHARED: 'Resource shared successfully'
  }
}

// Get response category based on status code
export function getResponseCategory(statusCode: number): ResponseCategory {
  if (statusCode >= 200 && statusCode < 300) {
    return RESPONSE_CATEGORY.SUCCESS
  } else if (statusCode >= 300 && statusCode < 400) {
    return RESPONSE_CATEGORY.REDIRECT
  } else if (statusCode >= 400 && statusCode < 500) {
    return RESPONSE_CATEGORY.CLIENT_ERROR
  } else {
    return RESPONSE_CATEGORY.SERVER_ERROR
  }
}

// Get appropriate toast color based on status code
export function getResponseColor(statusCode: number): string {
  const category = getResponseCategory(statusCode)

  switch (category) {
    case RESPONSE_CATEGORY.SUCCESS:
      return 'success'
    case RESPONSE_CATEGORY.REDIRECT:
      return 'info'
    case RESPONSE_CATEGORY.CLIENT_ERROR:
      return 'warning'
    case RESPONSE_CATEGORY.SERVER_ERROR:
      return 'error'
    default:
      return 'info'
  }
}

export default {
  HTTP_STATUS,
  RESPONSE_CATEGORY,
  DEFAULT_STATUS_MESSAGES,
  API_ERROR_MESSAGES,
  API_SUCCESS_MESSAGES,
  getResponseCategory,
  getResponseColor,
  createApiMessage,
  createApiResponse
}