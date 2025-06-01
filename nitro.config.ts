// Nitro imports configuration to resolve duplicated imports
// This file prioritizes our custom implementations over nuxt-auth-utils

import type { NitroConfig } from 'nitropack'

export default {
    imports: {
        // Prevent auto-import of conflicting functions from nuxt-auth-utils
        presets: [
            {
                from: 'nuxt-auth-utils/server',
                ignore: ['hashPassword', 'verifyPassword', 'getClientIp', 'getPlatformFromUserAgent', 'generateDeviceId']
            }
        ]
    }
} as NitroConfig
