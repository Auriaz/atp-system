// Override nuxt-auth-utils server imports to prevent conflicts
// This file ensures our custom implementations take precedence

// Re-export our custom password utilities
export { hashPassword, verifyPassword } from './auth/password'

// Re-export our custom device utilities  
export { getClientIp, getPlatformFromUserAgent, getBrowserFromUserAgent, generateDeviceId } from './auth/device'
