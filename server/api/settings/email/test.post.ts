import { PERMISSIONS, hasPermissionMultiRole } from '../../../../shared/utils/permissions.constants'
import { USER_ROLES } from '../../../../shared/utils/roles.constants'
import type { RoleSlugs } from '../../../../shared/utils/roles.constants'
import { getUserRoleSlugs } from '../../../utils/repositories/user_roles.repositories'
import nodemailer from 'nodemailer'

export default defineEventHandler(async (event) => {
    try {
        // Check permission
        const session = await getUserSession(event)

        if (!session?.user?.id) {
            if (!hasPermissionMultiRole([USER_ROLES.OBSERVER], PERMISSIONS.SETTINGS_EMAIL_TEST)) {
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

            const hasRequiredPermission = hasPermissionMultiRole(userRoles, PERMISSIONS.SETTINGS_EMAIL_TEST)

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
        if (!body.provider || !body.user || !body.password || !body.testEmail) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Provider, user, password, and test email are required'
            })
        }

        // SMTP providers configuration
        const smtpProviders = {
            gmail: {
                name: 'Gmail',
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
            },
            outlook: {
                name: 'Outlook/Hotmail',
                host: 'smtp-mail.outlook.com',
                port: 587,
                secure: false,
            },
            yahoo: {
                name: 'Yahoo Mail',
                host: 'smtp.mail.yahoo.com',
                port: 587,
                secure: false,
            },
            office365: {
                name: 'Office 365',
                host: 'smtp.office365.com',
                port: 587,
                secure: false,
            },
            zoho: {
                name: 'Zoho Mail',
                host: 'smtp.zoho.com',
                port: 587,
                secure: false,
            },
            sendgrid: {
                name: 'SendGrid',
                host: 'smtp.sendgrid.net',
                port: 587,
                secure: false,
            },
            mailgun: {
                name: 'Mailgun',
                host: 'smtp.mailgun.org',
                port: 587,
                secure: false,
            },
            ses: {
                name: 'Amazon SES',
                host: 'email-smtp.us-east-1.amazonaws.com',
                port: 587,
                secure: false,
            },
            custom: {
                name: 'Custom SMTP',
                host: '',
                port: 587,
                secure: false,
            }
        }

        // Get provider configuration
        const providerConfig = smtpProviders[body.provider as keyof typeof smtpProviders]
        if (!providerConfig) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Invalid email provider'
            })
        }

        // Create transporter configuration
        const transporterConfig = {
            host: body.provider === 'custom' ? body.host : providerConfig.host,
            port: body.provider === 'custom' ? body.port : providerConfig.port,
            secure: body.provider === 'custom' ? body.secure : providerConfig.secure,
            auth: {
                user: body.user,
                pass: body.password
            }
        }

        // Create transporter
        const transporter = nodemailer.createTransport(transporterConfig)

        // Verify connection
        await transporter.verify()

        // Send test email
        const testEmailOptions = {
            from: `${body.fromName || 'ATP System'} <${body.fromEmail || body.user}>`,
            to: body.testEmail,
            subject: 'ATP System - Email Configuration Test',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Email Configuration Test</h2>
          <p>Congratulations! Your email configuration is working correctly.</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Configuration Details:</h3>
            <ul>
              <li><strong>Provider:</strong> ${providerConfig.name}</li>
              <li><strong>Host:</strong> ${transporterConfig.host}</li>
              <li><strong>Port:</strong> ${transporterConfig.port}</li>
              <li><strong>Secure:</strong> ${transporterConfig.secure ? 'Yes' : 'No'}</li>
              <li><strong>From:</strong> ${body.fromEmail || body.user}</li>
            </ul>
          </div>
          <p>This test email was sent on ${new Date().toLocaleString()} to verify your ATP System email configuration.</p>
          <hr style="margin: 30px 0; border: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">
            ATP System - Athletic Training Platform<br>
            Email verification system test
          </p>
        </div>
      `,
            text: `
        ATP System - Email Configuration Test
        
        Congratulations! Your email configuration is working correctly.
        
        Configuration Details:
        - Provider: ${providerConfig.name}
        - Host: ${transporterConfig.host}
        - Port: ${transporterConfig.port}
        - Secure: ${transporterConfig.secure ? 'Yes' : 'No'}
        - From: ${body.fromEmail || body.user}
        
        This test email was sent on ${new Date().toLocaleString()} to verify your ATP System email configuration.
        
        ATP System - Athletic Training Platform
        Email verification system test
      `
        }

        await transporter.sendMail(testEmailOptions)

        console.log(`✅ Test email sent successfully to ${body.testEmail} using ${providerConfig.name}`)

        return {
            success: true,
            message: `Test email sent successfully to ${body.testEmail}`
        }
    } catch (error: any) {
        console.error('Error testing email settings:', error)

        // Provide more specific error messages
        let errorMessage = 'Failed to test email settings'

        if (error.code === 'EAUTH') {
            errorMessage = 'Authentication failed. Please check your username and password.'
        } else if (error.code === 'ECONNREFUSED') {
            errorMessage = 'Connection refused. Please check your SMTP host and port settings.'
        } else if (error.code === 'ETIMEDOUT') {
            errorMessage = 'Connection timeout. Please check your network connection and SMTP settings.'
        } else if (error.message) {
            errorMessage = error.message
        }

        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: errorMessage
        })
    }
})
