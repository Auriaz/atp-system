/**
 * Resend Email Verification Endpoint
 * Sends a new verification email to the user
 */

import { z } from 'zod'
import { eq, and } from 'drizzle-orm'
import { useValidatedBody } from 'h3-zod'

// Validation schema for resend verification email request
const ResendVerificationSchema = z.object({
    email: z.string().email('Invalid email format')
})

export default defineEventHandler(async (event) => {
    try {
        // Validate request body
        const { email } = await useValidatedBody(event, ResendVerificationSchema)

        // Find user by email
        const user = await useDatabase()
            .select({
                id: tables.users.id,
                email: tables.users.email,
                username: tables.users.username,
                isEmailVerified: tables.users.isEmailVerified
            })
            .from(tables.users)
            .where(eq(tables.users.email, email))
            .get()

        if (!user) {
            // Don't reveal if email exists for security reasons
            return createApiResponse(
                { message: 'If the email exists, a verification link has been sent.' },
                {
                    statusCode: 200,
                    description: 'Verification email sent (if email exists)'
                }
            )
        }

        // Check if email is already verified
        if (user.isEmailVerified) {
            throw createError({
                statusCode: 400,
                message: 'Email is already verified'
            })
        }

        // Rate limiting - check if user recently requested verification
        const recentTokens = await useDatabase()
            .select()
            .from(tables.verificationTokens)
            .where(
                and(
                    eq(tables.verificationTokens.userId, user.id),
                    eq(tables.verificationTokens.type, 'email_verification'),
                    eq(tables.verificationTokens.isUsed, false)
                )
            )
            .execute()

        // If there's a recent token (less than 5 minutes old), don't send new one
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
        const recentToken = recentTokens.find(token =>
            new Date(token.createdAt) > fiveMinutesAgo
        )

        if (recentToken) {
            throw createError({
                statusCode: 429,
                message: 'Please wait before requesting another verification email'
            })
        }

        // Create new verification token
        const verificationToken = await verificationTokenService.createEmailVerificationToken(user.id)

        // Send verification email
        const emailSent = await emailService.sendVerificationEmail(
            user.email,
            user.username,
            verificationToken
        )

        if (!emailSent) {
            throw createError({
                statusCode: 500,
                message: 'Failed to send verification email'
            })
        }

        // Log resend activity
        await useDatabase()
            .insert(tables.userActivities)
            .values({
                userId: user.id,
                action: 'verification_email_resent',
                ip: getClientIp(event),
                userAgent: event.node.req.headers['user-agent'] || 'unknown',
                details: JSON.stringify({
                    email: user.email,
                    timestamp: new Date().toISOString()
                }),
                createdAt: new Date()
            })
            .execute()
            .catch(error => console.error('Failed to log resend activity:', error))

        console.log(`✅ Verification email resent to ${user.email}`)

        return createApiResponse(
            {
                message: 'Verification email sent successfully',
                email: user.email
            },
            {
                statusCode: 200,
                description: 'A new verification link has been sent to your email address.'
            }
        )

    } catch (error: any) {
        console.error('Resend verification email error:', error)

        // Handle validation errors
        if (error && typeof error === 'object' && 'issues' in error) {
            throw createError({
                statusCode: 400,
                message: 'Validation error',
                data: error.issues
            })
        }

        throw error
    }
})
