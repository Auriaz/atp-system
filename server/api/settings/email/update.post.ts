import { PERMISSIONS, hasPermissionMultiRole } from '../../../../shared/utils/permissions.constants'
import { USER_ROLES } from '../../../../shared/utils/roles.constants'
import type { RoleSlugs } from '../../../../shared/utils/roles.constants'
import { getUserRoleSlugs } from '../../../utils/repositories/user_roles.repositories'
import fs from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
    try {
        // Check permission
        const session = await getUserSession(event)

        if (!session?.user?.id) {
            if (!hasPermissionMultiRole([USER_ROLES.OBSERVER], PERMISSIONS.SETTINGS_EMAIL_UPDATE)) {
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

            const hasRequiredPermission = hasPermissionMultiRole(userRoles, PERMISSIONS.SETTINGS_EMAIL_UPDATE)

            if (!hasRequiredPermission) {
                throw createError({
                    statusCode: 403,
                    statusMessage: 'Insufficient permissions'
                })
            }
        }

        // Get request body
        const body = await readBody(event)

        // Validate required fields
        if (!body.provider || !body.user || !body.password) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Provider, user, and password are required'
            })
        }

        // Update environment variables
        const envPath = path.resolve(process.cwd(), '.env')
        let envContent = ''

        try {
            envContent = fs.readFileSync(envPath, 'utf8')
        } catch (error) {
            // If .env doesn't exist, create it
            envContent = ''
        }

        // Helper function to update or add environment variable
        const updateEnvVar = (content: string, key: string, value: string) => {
            const regex = new RegExp(`^${key}=.*$`, 'm')
            const line = `${key}=${value}`

            if (regex.test(content)) {
                return content.replace(regex, line)
            } else {
                return content + (content.endsWith('\n') ? '' : '\n') + line + '\n'
            }
        }

        // Update environment variables
        envContent = updateEnvVar(envContent, 'SMTP_PROVIDER', body.provider)
        envContent = updateEnvVar(envContent, 'SMTP_HOST', body.host || '')
        envContent = updateEnvVar(envContent, 'SMTP_PORT', body.port?.toString() || '587')
        envContent = updateEnvVar(envContent, 'SMTP_SECURE', body.secure?.toString() || 'false')
        envContent = updateEnvVar(envContent, 'SMTP_USER', body.user)
        envContent = updateEnvVar(envContent, 'SMTP_PASSWORD', body.password)
        envContent = updateEnvVar(envContent, 'SMTP_FROM_NAME', body.fromName || 'ATP System')
        envContent = updateEnvVar(envContent, 'SMTP_FROM_EMAIL', body.fromEmail || body.user)

        // Write updated .env file
        fs.writeFileSync(envPath, envContent)

        // Update process.env for immediate effect
        process.env.SMTP_PROVIDER = body.provider
        process.env.SMTP_HOST = body.host || ''
        process.env.SMTP_PORT = body.port?.toString() || '587'
        process.env.SMTP_SECURE = body.secure?.toString() || 'false'
        process.env.SMTP_USER = body.user
        process.env.SMTP_PASSWORD = body.password
        process.env.SMTP_FROM_NAME = body.fromName || 'ATP System'
        process.env.SMTP_FROM_EMAIL = body.fromEmail || body.user

        console.log(`✅ Email settings updated for provider: ${body.provider}`)

        return {
            success: true,
            message: 'Email settings updated successfully'
        }
    } catch (error: any) {
        console.error('Error updating email settings:', error)

        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.message || 'Failed to update email settings'
        })
    }
})
