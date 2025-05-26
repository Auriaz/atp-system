import {
    createRefreshToken,
    verifyRefreshToken,
    revokeRefreshToken
} from '../repositories/refresh_tokens.repository'
import { getUserRoleSlugs } from '../repositories/user_roles.repositories'
import { sessionManagementService } from './session-management.service'
import { createHash } from 'crypto'
import jwt from 'jsonwebtoken'

/**
 * Service dla zarządzania JWT tokenami (access tokeny)
 */

interface JWTPayload {
    userId: number
    email: string
    roles: string[]
    iat?: number
    exp?: number
}

interface TokenPair {
    accessToken: string
    refreshToken: string
    sessionId?: number
}

/**
 * Generuje access token (JWT)
 */
export function generateAccessToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    const secretKey = process.env.NUXT_JWT_SECRET || 'your-secret-key-change-in-production'

    // Access token wygasa po 15 minutach
    return jwt.sign(payload, secretKey, {
        expiresIn: '15m',
        issuer: 'atp-system',
        audience: 'atp-users'
    })
}

/**
 * Weryfikuje access token
 */
export function verifyAccessToken(token: string): JWTPayload | null {
    try {
        const secretKey = process.env.NUXT_JWT_SECRET || 'your-secret-key-change-in-production'

        const decoded = jwt.verify(token, secretKey, {
            issuer: 'atp-system',
            audience: 'atp-users'
        }) as JWTPayload

        return decoded
    } catch (error) {
        console.error('JWT verification failed:', error)
        return null
    }
}

/**
 * Generuje parę tokenów (access + refresh) z obsługą zarządzania sesjami
 */
export async function generateTokenPair(
    userId: number,
    email: string,
    roles: string[],
    deviceId?: string,
    userAgent?: string,
    ipAddress?: string
): Promise<TokenPair & { sessionId: number }> {
    // Generuj device ID jeśli nie podano
    const finalDeviceId = deviceId || sessionManagementService.generateDeviceId(userAgent || '', ipAddress || '')

    // Sprawdź czy już istnieje sesja dla tego urządzenia
    const existingSessionId = await sessionManagementService.findExistingSession(userId, finalDeviceId)

    // Generuj access token
    const accessToken = generateAccessToken({
        userId,
        email,
        roles
    })

    // Generuj refresh token
    const { token: refreshToken, id: sessionId } = await createRefreshToken(
        userId,
        finalDeviceId,
        userAgent,
        ipAddress
    )

    // Jeśli istnieje sesja, zaktualizuj informacje o urządzeniu
    if (existingSessionId) {
        await sessionManagementService.updateDeviceInfo(existingSessionId, {
            deviceId: finalDeviceId,
            deviceName: sessionManagementService.parseDeviceName(userAgent || ''),
            userAgent: userAgent || '',
            ipAddress: ipAddress || ''
        })
    }

    // Oznacz tę sesję jako aktualną
    await sessionManagementService.markSessionAsCurrent(userId, sessionId)

    return {
        accessToken,
        refreshToken,
        sessionId
    }
}

/**
 * Odświeża access token używając refresh token
 */
export async function refreshAccessToken(refreshTokenValue: string): Promise<TokenPair | null> {
    try {
        // Weryfikuj refresh token
        const refreshTokenData = await verifyRefreshToken(refreshTokenValue)

        if (!refreshTokenData?.user) {
            return null
        }

        // Pobierz aktualne role użytkownika
        const userRoles = await getUserRoleSlugs(refreshTokenData.userId)

        // Generuj nowy access token
        const accessToken = generateAccessToken({
            userId: refreshTokenData.user.id,
            email: refreshTokenData.user.email,
            roles: userRoles
        })

        // Opcjonalnie: generuj nowy refresh token (token rotation)
        const { token: newRefreshToken } = await createRefreshToken(
            refreshTokenData.userId,
            refreshTokenData.deviceId,
            refreshTokenData.userAgent,
            refreshTokenData.ipAddress
        )

        // Unieważnij stary refresh token
        await revokeRefreshToken(refreshTokenValue)

        return {
            accessToken,
            refreshToken: newRefreshToken
        }

    } catch (error) {
        console.error('Token refresh failed:', error)
        return null
    }
}

/**
 * Ekstraktuje token z headera Authorization
 */
export function extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null
    }

    return authHeader.slice(7) // Usuń "Bearer "
}

/**
 * Generuje device ID na podstawie User-Agent i IP
 */
export function generateDeviceId(userAgent?: string, ipAddress?: string): string {
    const data = `${userAgent || 'unknown'}-${ipAddress || 'unknown'}-${Date.now()}`
    return createHash('md5').update(data).digest('hex')
}
