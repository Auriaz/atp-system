/**
 * Email Verification Endpoint
 * Verifies user email address using verification token
 */

import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { useValidatedBody } from 'h3-zod'
import { verificationTokenService } from '../../utils/services/verification-token.service'

// Validation schema for email verification request
const VerifyEmailSchema = z.object({
    token: z.string().min(1, 'Verification token is required')
})

export default defineEventHandler(async (event) => {
    try {
        // Validate request body
        const { token } = await useValidatedBody(event, VerifyEmailSchema)

        // Verify the token
        const tokenData = await verificationTokenService.verifyEmailToken(token)

        if (!tokenData) {
            throw createError({
                statusCode: 400,
                message: 'Invalid or expired verification token'
            })
        }

        // Update user's email verification status
        const updatedUser = await useDatabase()
            .update(tables.users)
            .set({
                isEmailVerified: true,
                emailVerifiedAt: new Date(),
                updatedAt: new Date()
            })
            .where(eq(tables.users.id, tokenData.userId))
            .returning({
                id: tables.users.id,
                email: tables.users.email,
                username: tables.users.username,
                isEmailVerified: tables.users.isEmailVerified,
                emailVerifiedAt: tables.users.emailVerifiedAt
            })
            .execute()

        if (updatedUser.length === 0) {
            throw createError({
                statusCode: 404,
                message: 'User not found'
            })
        }

        const user = updatedUser[0]

        // Log verification activity
        await useDatabase()
            .insert(tables.userActivities)
            .values({
                userId: user.id,
                action: 'email_verified',
                ip: getClientIp(event),
                userAgent: event.node.req.headers['user-agent'] || 'unknown',
                details: JSON.stringify({
                    verifiedAt: user.emailVerifiedAt,
                    tokenType: tokenData.type
                }),
                createdAt: new Date()
            })
            .execute()
            .catch(error => console.error('Failed to log verification activity:', error))

        console.log(`✅ Email verified for user ${user.username} (${user.email})`)

        return createApiResponse(
            {
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    isEmailVerified: user.isEmailVerified,
                    emailVerifiedAt: user.emailVerifiedAt
                }
            },
            {
                statusCode: 200,
                description: 'Email verified successfully! You can now access all features.'
            }
        )

    } catch (error: any) {
        console.error('Email verification error:', error)

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
