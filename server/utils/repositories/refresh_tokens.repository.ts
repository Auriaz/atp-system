import { refreshTokens } from '../../database/schema'
import { eq, and, lt, gt } from 'drizzle-orm'
import { useDatabase } from '../database'
import { sessionManagementService } from '../services/session-management.service'

type RefreshToken = typeof refreshTokens.$inferSelect
type NewRefreshToken = typeof refreshTokens.$inferInsert

/**
 * Generuje bezpieczny refresh token używając Web Crypto API
 */
export function generateRefreshToken(): string {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Hash refresh token przed zapisem do bazy używając Web Crypto API
 */
export async function hashRefreshToken(token: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(token)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = new Uint8Array(hashBuffer)
    return Array.from(hashArray, byte => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Tworzy nowy refresh token z obsługą zarządzania sesjami
 */
export async function createRefreshToken(
    userId: number,
    deviceId?: string,
    userAgent?: string,
    ipAddress?: string
): Promise<{ token: string; hashedToken: string; id: number }> {
    if (!userId) {
        throw new Error('User ID is required')
    }

    const token = generateRefreshToken()
    const hashedToken = await hashRefreshToken(token)

    // Generuj device ID jeśli nie podano
    const finalDeviceId = deviceId || sessionManagementService.generateDeviceId(userAgent || '', ipAddress || '')

    // Parsuj nazwę urządzenia
    const deviceName = sessionManagementService.parseDeviceName(userAgent || '')

    // Ustawienie czasu wygaśnięcia na 30 dni
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)

    const db = useDatabase()

    const result = await db.insert(refreshTokens).values({
        userId,
        token: hashedToken,
        deviceId: finalDeviceId,
        deviceName,
        userAgent,
        ipAddress,
        isCurrent: false, // Zostanie zaktualizowane przez session management service
        expiresAt,
        createdAt: new Date(),
        lastUsedAt: new Date()
    }).returning({ id: refreshTokens.id })

    return { token, hashedToken, id: result[0].id }
}

/**
 * Weryfikuje refresh token
 */
export async function verifyRefreshToken(token: string): Promise<any | null> {
    if (!token) {
        throw new Error('Token is required')
    }

    const hashedToken = await hashRefreshToken(token)
    const db = useDatabase()
    const refreshToken = await db.query.refreshTokens.findFirst({
        where: and(
            eq(refreshTokens.token, hashedToken),
            eq(refreshTokens.isRevoked, false),
            // Token nie wygasł - data wygaśnięcia jest większa od teraz
            gt(refreshTokens.expiresAt, new Date())
        ),
        with: {
            user: {
                columns: {
                    id: true,
                    email: true,
                    username: true
                }
            }
        }
    })

    if (!refreshToken) {
        return null
    }

    // Aktualizuj ostatnie użycie
    await db
        .update(refreshTokens)
        .set({ lastUsedAt: new Date() })
        .where(eq(refreshTokens.id, refreshToken.id))

    return refreshToken
}

/**
 * Unieważnia refresh token
 */
export async function revokeRefreshToken(token: string): Promise<void> {
    if (!token) {
        throw new Error('Token is required')
    }

    const hashedToken = await hashRefreshToken(token)
    const db = useDatabase()

    await db
        .update(refreshTokens)
        .set({
            isRevoked: true,
            lastUsedAt: new Date()
        })
        .where(eq(refreshTokens.token, hashedToken))
}

/**
 * Unieważnia wszystkie refresh tokeny użytkownika
 */
export async function revokeAllUserRefreshTokens(userId: number): Promise<void> {
    if (!userId) {
        throw new Error('User ID is required')
    }

    const db = useDatabase()

    await db
        .update(refreshTokens)
        .set({
            isRevoked: true,
            lastUsedAt: new Date()
        })
        .where(eq(refreshTokens.userId, userId))
}

/**
 * Czyści wygasłe refresh tokeny
 */
export async function cleanupExpiredRefreshTokens(): Promise<void> {
    const db = useDatabase()

    await db
        .delete(refreshTokens)
        .where(lt(refreshTokens.expiresAt, new Date()))
}

/**
 * Pobiera aktywne refresh tokeny użytkownika
 */
export async function getUserRefreshTokens(userId: number): Promise<RefreshToken[]> {
    if (!userId) {
        throw new Error('User ID is required')
    }

    const db = useDatabase()

    return await db.query.refreshTokens.findMany({
        where: and(
            eq(refreshTokens.userId, userId),
            eq(refreshTokens.isRevoked, false),
            // Token nie wygasł - data wygaśnięcia jest większa od teraz
            gt(refreshTokens.expiresAt, new Date())
        ),
        orderBy: (refreshTokens, { desc }) => [desc(refreshTokens.lastUsedAt)]
    })
}

/**
 * Unieważnia refresh token na konkretnym urządzeniu
 */
export async function revokeDeviceRefreshToken(userId: number, deviceId: string): Promise<void> {
    if (!userId || !deviceId) {
        throw new Error('User ID and Device ID are required')
    }

    const db = useDatabase()

    await db
        .update(refreshTokens)
        .set({
            isRevoked: true,
            lastUsedAt: new Date()
        })
        .where(and(
            eq(refreshTokens.userId, userId),
            eq(refreshTokens.deviceId, deviceId)
        ))
}
