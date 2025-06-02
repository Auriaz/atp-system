// /**
//  * Email Service for ATP System
//  * Using Gmail SMTP for email verification
//  * Implements lazy initialization to prevent NuxtHub deployment issues
//  */

// import * as nodemailer from 'nodemailer'
// import type { Transporter } from 'nodemailer'

// interface EmailConfig {
//     host: string
//     port: number
//     secure: boolean
//     auth: {
//         user: string
//         pass: string
//     }
// }

// interface SMTPProvider {
//     name: string
//     host: string
//     port: number
//     secure: boolean
//     description: string
// }

// interface EmailOptions {
//     to: string
//     subject: string
//     html: string
//     text?: string
// }

// interface VerificationEmailData {
//     username: string
//     verificationUrl: string
//     expiresIn: string
// }

// class EmailService {
//     private transporter: Transporter | null = null
//     private config: EmailConfig | null = null
//     private provider: string | null = null
//     private initialized: boolean = false

//     // Supported SMTP providers configuration
//     private static readonly SMTP_PROVIDERS: Record<string, SMTPProvider> = {
//         gmail: {
//             name: 'Gmail',
//             host: 'smtp.gmail.com',
//             port: 587,
//             secure: false,
//             description: 'Google Gmail SMTP'
//         },
//         outlook: {
//             name: 'Outlook/Hotmail',
//             host: 'smtp-mail.outlook.com',
//             port: 587,
//             secure: false,
//             description: 'Microsoft Outlook/Hotmail SMTP'
//         },
//         yahoo: {
//             name: 'Yahoo Mail',
//             host: 'smtp.mail.yahoo.com',
//             port: 587,
//             secure: false,
//             description: 'Yahoo Mail SMTP'
//         },
//         office365: {
//             name: 'Office 365',
//             host: 'smtp.office365.com',
//             port: 587,
//             secure: false,
//             description: 'Microsoft Office 365 SMTP'
//         },
//         zoho: {
//             name: 'Zoho Mail',
//             host: 'smtp.zoho.com',
//             port: 587,
//             secure: false,
//             description: 'Zoho Mail SMTP'
//         },
//         sendgrid: {
//             name: 'SendGrid',
//             host: 'smtp.sendgrid.net',
//             port: 587,
//             secure: false,
//             description: 'SendGrid SMTP (API Key as password)'
//         },
//         mailgun: {
//             name: 'Mailgun',
//             host: 'smtp.mailgun.org',
//             port: 587,
//             secure: false,
//             description: 'Mailgun SMTP'
//         },
//         ses: {
//             name: 'Amazon SES',
//             host: 'email-smtp.us-east-1.amazonaws.com',
//             port: 587,
//             secure: false,
//             description: 'Amazon Simple Email Service'
//         },
//         custom: {
//             name: 'Custom SMTP',
//             host: '',
//             port: 587,
//             secure: false,
//             description: 'Custom SMTP server'
//         }
//     }

//     constructor() {
//         // Delay initialization until first use to avoid build-time issues
//     }

//     /**
//      * Initialize the email service (lazy initialization)
//      */
//     private async ensureInitialized(): Promise<void> {
//         if (this.initialized) return

//         try {
//             // Determine which provider to use based on environment variables
//             this.provider = this.detectEmailProvider()
//             const providerConfig = EmailService.SMTP_PROVIDERS[this.provider]

//             this.config = {
//                 host: this.getConfigValue('SMTP_HOST', providerConfig.host),
//                 port: parseInt(this.getConfigValue('SMTP_PORT', providerConfig.port.toString())),
//                 secure: this.getConfigValue('SMTP_SECURE', providerConfig.secure.toString()) === 'true',
//                 auth: {
//                     user: this.getConfigValue('SMTP_USER', ''),
//                     pass: this.getConfigValue('SMTP_PASSWORD', '')
//                 }
//             }

//             console.log(`📧 Email service configured for: ${providerConfig.name} (${this.provider})`)
//             await this.initializeTransporter()
//             this.initialized = true
//         } catch (error) {
//             console.error('❌ Email service initialization failed:', error)
//             // Set defaults to prevent null errors
//             this.provider = 'gmail'
//             this.config = {
//                 host: 'smtp.gmail.com',
//                 port: 587,
//                 secure: false,
//                 auth: { user: '', pass: '' }
//             }
//             this.transporter = null
//             this.initialized = true
//         }
//     }

//     /**
//      * Detect email provider based on environment variables or host
//      */
//     private detectEmailProvider(): string {
//         // Skip during build/prerender
//         if (typeof process === 'undefined' || !process.env) {
//             return 'gmail'
//         }

//         // Check for explicit provider setting
//         const explicitProvider = process.env.SMTP_PROVIDER?.toLowerCase()
//         if (explicitProvider && EmailService.SMTP_PROVIDERS[explicitProvider]) {
//             return explicitProvider
//         }

//         // Check for legacy Gmail variables
//         if (process.env.GMAIL_USER || process.env.GMAIL_APP_PASSWORD) {
//             return 'gmail'
//         }

//         // Check for general SMTP variables
//         if (process.env.SMTP_HOST) {
//             const host = process.env.SMTP_HOST.toLowerCase()

//             // Auto-detect provider based on host
//             if (host.includes('gmail')) return 'gmail'
//             if (host.includes('outlook') || host.includes('hotmail')) return 'outlook'
//             if (host.includes('yahoo')) return 'yahoo'
//             if (host.includes('office365')) return 'office365'
//             if (host.includes('zoho')) return 'zoho'
//             if (host.includes('sendgrid')) return 'sendgrid'
//             if (host.includes('mailgun')) return 'mailgun'
//             if (host.includes('amazonses') || host.includes('amazonaws')) return 'ses'

//             return 'custom'
//         }

//         // Default to Gmail for backward compatibility
//         return 'gmail'
//     }

//     /**
//      * Get configuration value with fallback
//      */
//     private getConfigValue(envKey: string, defaultValue: string): string {
//         // Skip during build/prerender
//         if (typeof process === 'undefined' || !process.env) {
//             return defaultValue
//         }

//         // Check for general SMTP variables first
//         const value = process.env[envKey]
//         if (value) return value

//         // Check for provider-specific legacy variables
//         if (this.provider === 'gmail') {
//             if (envKey === 'SMTP_USER') return process.env.GMAIL_USER || defaultValue
//             if (envKey === 'SMTP_PASSWORD') return process.env.GMAIL_APP_PASSWORD || defaultValue
//         }

//         return defaultValue
//     }

//     private async initializeTransporter(): Promise<void> {
//         try {
//             // Skip real SMTP initialization during build/prerender
//             if (typeof process !== 'undefined' && process.env &&
//                 process.env.NODE_ENV === 'production' && process.env.NUXT_APP_BUILD_ASSETS_DIR) {
//                 console.log('📧 Email service skipped during build/prerender')
//                 return
//             }

//             // Ensure config is initialized
//             if (!this.config) {
//                 throw new Error('Email config not initialized')
//             }

//             // Check if we have valid SMTP credentials
//             if (!this.config?.auth.user || !this.config?.auth.pass ||
//                 this.config.auth.user === 'your-email@gmail.com' ||
//                 this.config.auth.pass === 'your-app-password' ||
//                 this.config.auth.user === 'your-email@example.com' ||
//                 this.config.auth.pass === 'your-password') {
//                 const providerName = this.provider && EmailService.SMTP_PROVIDERS[this.provider]
//                     ? EmailService.SMTP_PROVIDERS[this.provider].name
//                     : 'Unknown'
//                 console.log(`⚠️ Email service: No valid ${providerName} credentials configured, running in development mode`)
//                 this.transporter = null
//                 return
//             }

//             this.transporter = nodemailer.createTransport(this.config)

//             // Verify connection configuration
//             await this.transporter.verify()
//             console.log('✅ Email service connected successfully')
//         } catch (error) {
//             console.error('❌ Email service connection failed:', error)
//             // Don't throw error, just set transporter to null for graceful fallback
//             this.transporter = null
//         }
//     }

//     /**
//      * Send verification email to user
//      */
//     async sendVerificationEmail(
//         email: string,
//         username: string,
//         verificationToken: string
//     ): Promise<boolean> {
//         // Ensure service is initialized
//         await this.ensureInitialized()

//         if (!this.transporter) {
//             console.log(`📧 Email service not configured - would send verification email to ${email}`)
//             console.log(`🔗 Verification URL: /auth/verify-email?token=${verificationToken}`)
//             return true // Return success for development mode
//         }

//         const verificationUrl = `/auth/verify-email?token=${verificationToken}`

//         const emailData: VerificationEmailData = {
//             username,
//             verificationUrl,
//             expiresIn: '24 hours'
//         }

//         const htmlContent = this.generateVerificationEmailHTML(emailData)
//         const textContent = this.generateVerificationEmailText(emailData)

//         const mailOptions: EmailOptions = {
//             to: email,
//             subject: 'Verify your ATP System account',
//             html: htmlContent,
//             text: textContent
//         }

//         try {
//             const result = await this.transporter.sendMail({
//                 from: `"ATP System" <${this.config?.auth.user || 'noreply@atpsystem.com'}>`,
//                 ...mailOptions
//             })

//             console.log(`✅ Verification email sent to ${email}:`, result.messageId)
//             return true
//         } catch (error) {
//             console.error(`❌ Failed to send verification email to ${email}:`, error)
//             return false
//         }
//     }

//     /**
//      * Send password reset email
//      */
//     async sendPasswordResetEmail(
//         email: string,
//         username: string,
//         resetToken: string
//     ): Promise<boolean> {
//         // Ensure service is initialized
//         await this.ensureInitialized()

//         if (!this.transporter) {
//             console.log(`📧 Email service not configured - would send password reset email to ${email}`)
//             console.log(`🔗 Reset URL: /auth/reset-password?token=${resetToken}`)
//             return true // Return success for development mode
//         }

//         const resetUrl = `/auth/reset-password?token=${resetToken}`

//         const htmlContent = this.generatePasswordResetEmailHTML({
//             username,
//             resetUrl,
//             expiresIn: '1 hour'
//         })

//         try {
//             const result = await this.transporter.sendMail({
//                 from: `"ATP System" <${this.config?.auth.user || 'noreply@atpsystem.com'}>`,
//                 to: email,
//                 subject: 'Reset your ATP System password',
//                 html: htmlContent
//             })

//             console.log(`✅ Password reset email sent to ${email}:`, result.messageId)
//             return true
//         } catch (error) {
//             console.error(`❌ Failed to send password reset email to ${email}:`, error)
//             return false
//         }
//     }

//     /**
//      * Generate HTML template for verification email
//      */
//     private generateVerificationEmailHTML(data: VerificationEmailData): string {
//         return `
// <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Verify Your Account</title>
//     <style>
//         body { 
//             font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
//             line-height: 1.6;
//             color: #333;
//             max-width: 600px;
//             margin: 0 auto;
//             padding: 20px;
//         }
//         .header {
//             background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//             color: white;
//             padding: 30px;
//             border-radius: 10px 10px 0 0;
//             text-align: center;
//         }
//         .content {
//             background: #f8f9fa;
//             padding: 30px;
//             border-radius: 0 0 10px 10px;
//         }
//         .button {
//             display: inline-block;
//             background: #28a745;
//             color: white;
//             padding: 12px 30px;
//             text-decoration: none;
//             border-radius: 5px;
//             font-weight: bold;
//             margin: 20px 0;
//         }
//         .footer {
//             text-align: center;
//             margin-top: 30px;
//             padding-top: 20px;
//             border-top: 1px solid #eee;
//             color: #666;
//             font-size: 14px;
//         }
//         .warning {
//             background: #fff3cd;
//             border: 1px solid #ffeaa7;
//             padding: 15px;
//             border-radius: 5px;
//             margin: 20px 0;
//         }
//     </style>
// </head>
// <body>
//     <div class="header">
//         <h1>🏀 ATP System</h1>
//         <p>Welcome to the Athletic Training Platform</p>
//     </div>
    
//     <div class="content">
//         <h2>Hi ${data.username}! 👋</h2>
        
//         <p>Thank you for joining ATP System! To complete your registration and start using the platform, please verify your email address.</p>
        
//         <div style="text-align: center;">
//             <a href="${data.verificationUrl}" class="button">
//                 ✉️ Verify Email Address
//             </a>
//         </div>
        
//         <div class="warning">
//             <strong>⏰ Important:</strong> This verification link will expire in ${data.expiresIn}. If you don't verify your account within this time, you'll need to register again.
//         </div>
        
//         <p>If the button doesn't work, copy and paste this link into your browser:</p>
//         <p style="word-break: break-all; background: #e9ecef; padding: 10px; border-radius: 5px;">
//             ${data.verificationUrl}
//         </p>
        
//         <p>If you didn't create an account with ATP System, you can safely ignore this email.</p>
//     </div>
    
//     <div class="footer">
//         <p>© 2025 ATP System - Athletic Training Platform</p>
//         <p>This is an automated email, please do not reply.</p>
//     </div>
// </body>
// </html>`
//     }

//     /**
//      * Generate plain text version for verification email
//      */
//     private generateVerificationEmailText(data: VerificationEmailData): string {
//         return `
// ATP System - Verify Your Account

// Hi ${data.username}!

// Thank you for joining ATP System! To complete your registration, please verify your email address by visiting:

// ${data.verificationUrl}

// This verification link will expire in ${data.expiresIn}.

// If you didn't create an account with ATP System, you can safely ignore this email.

// © 2025 ATP System - Athletic Training Platform
// `
//     }

//     /**
//      * Generate HTML template for password reset email
//      */
//     private generatePasswordResetEmailHTML(data: { username: string; resetUrl: string; expiresIn: string }): string {
//         return `
// <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Reset Your Password</title>
//     <style>
//         body { 
//             font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
//             line-height: 1.6;
//             color: #333;
//             max-width: 600px;
//             margin: 0 auto;
//             padding: 20px;
//         }
//         .header {
//             background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//             color: white;
//             padding: 30px;
//             border-radius: 10px 10px 0 0;
//             text-align: center;
//         }
//         .content {
//             background: #f8f9fa;
//             padding: 30px;
//             border-radius: 0 0 10px 10px;
//         }
//         .button {
//             display: inline-block;
//             background: #dc3545;
//             color: white;
//             padding: 12px 30px;
//             text-decoration: none;
//             border-radius: 5px;
//             font-weight: bold;
//             margin: 20px 0;
//         }
//         .footer {
//             text-align: center;
//             margin-top: 30px;
//             padding-top: 20px;
//             border-top: 1px solid #eee;
//             color: #666;
//             font-size: 14px;
//         }
//     </style>
// </head>
// <body>
//     <div class="header">
//         <h1>🏀 ATP System</h1>
//         <p>Password Reset Request</p>
//     </div>
    
//     <div class="content">
//         <h2>Hi ${data.username}!</h2>
        
//         <p>We received a request to reset your ATP System password. Click the button below to create a new password:</p>
        
//         <div style="text-align: center;">
//             <a href="${data.resetUrl}" class="button">
//                 🔑 Reset Password
//             </a>
//         </div>
        
//         <p><strong>This link will expire in ${data.expiresIn}.</strong></p>
        
//         <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
//     </div>
    
//     <div class="footer">
//         <p>© 2025 ATP System - Athletic Training Platform</p>
//         <p>This is an automated email, please do not reply.</p>
//     </div>
// </body>
// </html>`
//     }

//     /**
//      * Test email configuration
//      */
//     async testConnection(): Promise<boolean> {
//         try {
//             await this.ensureInitialized()

//             if (!this.transporter) {
//                 return false
//             }

//             await this.transporter.verify()
//             return true
//         } catch (error) {
//             console.error('Email service test failed:', error)
//             return false
//         }
//     }
// }

// // Export singleton instance
// export const emailService = new EmailService()

// // Export types
// export type { EmailOptions, VerificationEmailData, SMTPProvider }
