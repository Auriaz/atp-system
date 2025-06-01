import { PERMISSIONS, hasPermissionMultiRole } from '../../../shared/utils/permissions.constants'
import { USER_ROLES } from '../../../shared/utils/roles.constants'
import type { RoleSlugs } from '../../../shared/utils/roles.constants'
import { getUserRoleSlugs } from '../../utils/repositories/user_roles.repositories'

export default defineEventHandler(async (event) => {
    try {
        // Check permission
        const session = await getUserSession(event)

        if (!session?.user?.id) {
            if (!hasPermissionMultiRole([USER_ROLES.OBSERVER], PERMISSIONS.SETTINGS_EMAIL)) {
                throw createError({
                    statusCode: 401,
                    statusMessage: 'Authentication required'
                })
            }
        } else {
            const userRoles: RoleSlugs = await getUserRoleSlugs(session.user.id)

            if (!userRoles?.length) {
                userRoles.push(USER_ROLES.USER)
            }

            const hasRequiredPermission = hasPermissionMultiRole(userRoles, PERMISSIONS.SETTINGS_EMAIL)

            if (!hasRequiredPermission) {
                throw createError({
                    statusCode: 403,
                    statusMessage: 'Insufficient permissions'
                })
            }
        }

        // Get current email configuration from environment
        const emailSettings = {
            provider: process.env.SMTP_PROVIDER || 'gmail',
            host: process.env.SMTP_HOST || '',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true',
            user: process.env.SMTP_USER || '',
            password: '', // Never return the actual password
            fromName: process.env.SMTP_FROM_NAME || 'ATP System',
            fromEmail: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || ''
        }

        return {
            success: true,
            data: emailSettings
        }
    } catch (error: any) {
        console.error('Error getting email settings:', error)

        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.message || 'Failed to get email settings'
        })
    }
})
