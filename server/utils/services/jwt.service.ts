import {
    createRefreshToken,
    verifyRefreshToken,
    revokeRefreshToken
} from '../repositories/refresh_tokens.repository'
import { getUserRoleSlugs } from '../repositories/user_roles.repositories'
import { sessionManagementService } from './session-management.service'

/**
 * Service dla zarządzania JWT tokenami (access tokeny) - Web Crypto API version
 */

interface JWTPayload {
    userId: number
    email: string
    roles: string[]
    iat?: number
    exp?: number
    iss?: string
    aud?: string
}

interface TokenPair {
    accessToken: string
    refreshToken: string
    sessionId?: number
}

// Pomocnicze funkcje dla Web Crypto API
function base64UrlEncode(str: string): string {
    return btoa(str)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '')
}

function base64UrlDecode(str: string): string {
    str += '='.repeat((4 - str.length % 4) % 4)
    return atob(str.replace(/-/g, '+').replace(/_/g, '/'))
}

async function createSignature(header: string, payload: string, secret: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(`${header}.${payload}`)
    const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    )
    const signature = await crypto.subtle.sign('HMAC', key, data)
    return base64UrlEncode(String.fromCharCode(...new Uint8Array(signature)))
}

async function verifySignature(header: string, payload: string, signature: string, secret: string): Promise<boolean> {
    const expectedSignature = await createSignature(header, payload, secret)
    return signature === expectedSignature
}

/**
 * Generuje access token (JWT) używając Web Crypto API
 */
export async function generateAccessToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): Promise<string> {
    const secretKey = process.env.NUXT_JWT_SECRET || 'your-secret-key-change-in-production'

    const now = Math.floor(Date.now() / 1000)
    const exp = now + (15 * 60) // 15 minut

    const header = {
        alg: 'HS256',
        typ: 'JWT'
    }

    const jwtPayload = {
        ...payload,
        iat: now,
        exp: exp,
        iss: 'atp-system',
        aud: 'atp-users'
    }

    const encodedHeader = base64UrlEncode(JSON.stringify(header))
    const encodedPayload = base64UrlEncode(JSON.stringify(jwtPayload))

    const signature = await createSignature(encodedHeader, encodedPayload, secretKey)

    return `${encodedHeader}.${encodedPayload}.${signature}`
}

/**
 * Weryfikuje access token używając Web Crypto API
 */
export async function verifyAccessToken(token: string): Promise<JWTPayload | null> {
    try {
        const secretKey = process.env.NUXT_JWT_SECRET || 'your-secret-key-change-in-production'

        const parts = token.split('.')
        if (parts.length !== 3) {
            return null
        }

        const [encodedHeader, encodedPayload, signature] = parts

        // Weryfikuj sygnaturę
        const isValid = await verifySignature(encodedHeader, encodedPayload, signature, secretKey)
        if (!isValid) {
            return null
        }

        // Dekoduj payload
        const payload = JSON.parse(base64UrlDecode(encodedPayload)) as JWTPayload

        // Sprawdź wygaśnięcie
        const now = Math.floor(Date.now() / 1000)
        if (payload.exp && payload.exp < now) {
            return null
        }

        // Sprawdź issuer i audience
        if (payload.iss !== 'atp-system' || payload.aud !== 'atp-users') {
            return null
        }

        return payload
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
    const accessToken = await generateAccessToken({
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
        const accessToken = await generateAccessToken({
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
    return btoa(data).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32)
}

