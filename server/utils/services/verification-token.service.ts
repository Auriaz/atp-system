/**
 * Verification Token Service
 * Manages email verification and password reset tokens
 */

import { eq, and, gt, lt } from 'drizzle-orm'
import { verificationTokens } from '../../database/schema'
import crypto from 'crypto'

export interface CreateVerificationTokenOptions {
    userId: number
    type: 'email_verification' | 'password_reset'
    expiresInHours?: number
}

export interface VerificationTokenData {
    id: number
    userId: number
    token: string
    type: string
    expiresAt: Date
    isUsed: boolean
    createdAt: Date
}

class VerificationTokenService {
    /**
     * Generate a secure random token
     */
    private generateSecureToken(): string {
        return crypto.randomBytes(32).toString('hex')
    }    /**
     * Create a new verification token
     */
    async createToken(options: CreateVerificationTokenOptions): Promise<string> {
        const { userId, type, expiresInHours = 24 } = options

        // Invalidate any existing unused tokens of the same type for this user
        await this.invalidateUserTokens(userId, type)

        const token = this.generateSecureToken()
        const expiresAt = new Date()
        expiresAt.setHours(expiresAt.getHours() + expiresInHours)

        try {
            await useDatabase()
                .insert(verificationTokens)
                .values({
                    userId,
                    token,
                    type,
                    expiresAt,
                    isUsed: false,
                    createdAt: new Date()
                })
                .execute()

            console.log(`✅ Created ${type} token for user ${userId}`)
            return token
        } catch (error) {
            console.error('Failed to create verification token:', error)
            throw new Error('Failed to create verification token')
        }
    }    /**
     * Verify and consume a token
     */
    async verifyToken(token: string, expectedType: string): Promise<VerificationTokenData | null> {
        try {
            const tokenData = await useDatabase()
                .select()
                .from(verificationTokens)
                .where(
                    and(
                        eq(verificationTokens.token, token),
                        eq(verificationTokens.type, expectedType),
                        eq(verificationTokens.isUsed, false),
                        gt(verificationTokens.expiresAt, new Date())
                    )
                )
                .get()

            if (!tokenData) {
                return null
            }

            // Mark token as used
            await useDatabase()
                .update(verificationTokens)
                .set({
                    isUsed: true,
                    usedAt: new Date()
                })
                .where(eq(verificationTokens.id, tokenData.id))
                .execute()

            console.log(`✅ Token verified and consumed for user ${tokenData.userId}`)
            return tokenData as VerificationTokenData
        } catch (error) {
            console.error('Failed to verify token:', error)
            return null
        }
    }

    /**
     * Check if token exists and is valid (without consuming it)
     */
    async checkToken(token: string, expectedType: string): Promise<VerificationTokenData | null> {
        try {
            const tokenData = await useDatabase()
                .select()
                .from(verificationTokens)
                .where(
                    and(
                        eq(verificationTokens.token, token),
                        eq(verificationTokens.type, expectedType),
                        eq(verificationTokens.isUsed, false),
                        gt(verificationTokens.expiresAt, new Date())
                    )
                )
                .get()

            return tokenData as VerificationTokenData || null
        } catch (error) {
            console.error('Failed to check token:', error)
            return null
        }
    }

    /**
     * Invalidate all unused tokens of a specific type for a user
     */
    async invalidateUserTokens(userId: number, type: string): Promise<void> {
        try {
            await useDatabase()
                .update(verificationTokens)
                .set({
                    isUsed: true,
                    usedAt: new Date()
                })
                .where(
                    and(
                        eq(verificationTokens.userId, userId),
                        eq(verificationTokens.type, type),
                        eq(verificationTokens.isUsed, false)
                    )
                )
                .execute()

            console.log(`✅ Invalidated existing ${type} tokens for user ${userId}`)
        } catch (error) {
            console.error('Failed to invalidate user tokens:', error)
        }
    }    /**
     * Clean up expired tokens (should be run periodically)
     */
    async cleanupExpiredTokens(): Promise<number> {
        try {
            const result = await useDatabase()
                .delete(verificationTokens).where(
                    and(
                        lt(verificationTokens.expiresAt, new Date()),
                        eq(verificationTokens.isUsed, true)
                    )
                )
                .execute()

            const deletedCount = result.changes || 0
            if (deletedCount > 0) {
                console.log(`✅ Cleaned up ${deletedCount} expired tokens`)
            }

            return deletedCount
        } catch (error) {
            console.error('Failed to cleanup expired tokens:', error)
            return 0
        }
    }

    /**
     * Get user's verification tokens (for admin/debugging)
     */
    async getUserTokens(userId: number): Promise<VerificationTokenData[]> {
        try {
            const tokens = await useDatabase()
                .select()
                .from(verificationTokens)
                .where(eq(verificationTokens.userId, userId))
                .execute()

            return tokens as VerificationTokenData[]
        } catch (error) {
            console.error('Failed to get user tokens:', error)
            return []
        }
    }

    /**
     * Create email verification token
     */
    async createEmailVerificationToken(userId: number): Promise<string> {
        return this.createToken({
            userId,
            type: 'email_verification',
            expiresInHours: 24 // 24 hours for email verification
        })
    }

    /**
     * Create password reset token
     */
    async createPasswordResetToken(userId: number): Promise<string> {
        return this.createToken({
            userId,
            type: 'password_reset',
            expiresInHours: 1 // 1 hour for password reset
        })
    }

    /**
     * Verify email verification token
     */
    async verifyEmailToken(token: string): Promise<VerificationTokenData | null> {
        return this.verifyToken(token, 'email_verification')
    }

    /**
     * Verify password reset token
     */
    async verifyPasswordResetToken(token: string): Promise<VerificationTokenData | null> {
        return this.verifyToken(token, 'password_reset')
    }
}

// Export singleton instance
export const verificationTokenService = new VerificationTokenService()
