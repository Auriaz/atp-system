import { eq, and, desc } from 'drizzle-orm'
import { refreshTokens } from '../../database/models/refresh_tokens.model'
import { useDatabase } from '../database'
import { UAParser } from 'ua-parser-js'

export interface SessionInfo {
    id: number
    deviceId: string
    deviceName: string
    userAgent: string
    ipAddress: string
    location?: string
    isCurrent: boolean
    lastUsedAt: Date
    createdAt: Date
    isRevoked: boolean
}

export interface DeviceInfo {
    deviceId: string
    deviceName: string
    userAgent: string
    ipAddress: string
    location?: string
}

export class SessionManagementService {
    private _db: ReturnType<typeof useDatabase> | null = null

    private get db() {
        if (!this._db) {
            this._db = useDatabase()
        }
        return this._db
    }

    /**
     * Parsuje User-Agent i tworzy czytelną nazwę urządzenia
     */
    parseDeviceName(userAgent: string): string {
        const parser = new UAParser(userAgent)
        const result = parser.getResult()

        const browser = result.browser.name || 'Unknown Browser'
        const browserVersion = result.browser.version?.split('.')[0] || ''
        const os = result.os.name || 'Unknown OS'
        const osVersion = result.os.version || ''

        return `${browser}${browserVersion ? ' ' + browserVersion : ''} on ${os}${osVersion ? ' ' + osVersion : ''}`
    }

    /**
     * Generuje unikalny identyfikator urządzenia
     */
    generateDeviceId(userAgent: string, ipAddress: string): string {
        return generateDeviceId(userAgent, ipAddress)
    }

    /**
     * Pobiera wszystkie aktywne sesje użytkownika
     */
    async getUserSessions(userId: number): Promise<SessionInfo[]> {
        const sessions = await this.db
            .select()
            .from(refreshTokens)
            .where(
                and(
                    eq(refreshTokens.userId, userId),
                    eq(refreshTokens.isRevoked, false)
                )
            )
            .orderBy(desc(refreshTokens.lastUsedAt))

        return sessions.map(session => ({
            id: session.id,
            deviceId: session.deviceId || '',
            deviceName: session.deviceName || 'Unknown Device',
            userAgent: session.userAgent || '',
            ipAddress: session.ipAddress || '',
            location: session.location || undefined,
            isCurrent: session.isCurrent || false,
            lastUsedAt: new Date(session.lastUsedAt || session.createdAt),
            createdAt: new Date(session.createdAt),
            isRevoked: session.isRevoked || false
        }))
    }

    /**
     * Oznacza sesję jako aktualną (pozostałe jako nieaktualne)
     */
    async markSessionAsCurrent(userId: number, sessionId: number): Promise<void> {
        // Najpierw oznacz wszystkie sesje jako nieaktualne
        await this.db
            .update(refreshTokens)
            .set({ isCurrent: false })
            .where(eq(refreshTokens.userId, userId))

        // Następnie oznacz wybraną sesję jako aktualną
        await this.db
            .update(refreshTokens)
            .set({
                isCurrent: true,
                lastUsedAt: new Date()
            })
            .where(
                and(
                    eq(refreshTokens.id, sessionId),
                    eq(refreshTokens.userId, userId)
                )
            )
    }

    /**
     * Usuwa sesję (wylogowuje z wybranego urządzenia)
     */
    async revokeSession(userId: number, sessionId: number): Promise<boolean> {
        const result = await this.db
            .update(refreshTokens)
            .set({
                isRevoked: true,
                lastUsedAt: new Date()
            })
            .where(
                and(
                    eq(refreshTokens.id, sessionId),
                    eq(refreshTokens.userId, userId),
                    eq(refreshTokens.isRevoked, false)
                )
            )

        return result.changes > 0
    }

    /**
     * Usuwa wszystkie sesje oprócz aktualnej
     */
    async revokeAllOtherSessions(userId: number, currentSessionId: number): Promise<number> {
        const result = await this.db
            .update(refreshTokens)
            .set({
                isRevoked: true,
                lastUsedAt: new Date()
            })
            .where(
                and(
                    eq(refreshTokens.userId, userId),
                    eq(refreshTokens.isRevoked, false),
                    // Nie usuwaj aktualnej sesji
                    // Note: SQLite nie ma operatora NOT, więc użyjemy innego podejścia
                )
            )

        // Przywróć aktualną sesję
        await this.db
            .update(refreshTokens)
            .set({ isRevoked: false })
            .where(
                and(
                    eq(refreshTokens.id, currentSessionId),
                    eq(refreshTokens.userId, userId)
                )
            )

        return result.changes - 1 // Odejmij przywróconą sesję
    }

    /**
     * Usuwa wszystkie sesje użytkownika (globalne wylogowanie)
     */
    async revokeAllSessions(userId: number): Promise<number> {
        const result = await this.db
            .update(refreshTokens)
            .set({
                isRevoked: true,
                lastUsedAt: new Date()
            })
            .where(
                and(
                    eq(refreshTokens.userId, userId),
                    eq(refreshTokens.isRevoked, false)
                )
            )

        return result.changes
    }

    /**
     * Sprawdza czy sesja istnieje dla danego urządzenia
     */
    async findExistingSession(userId: number, deviceId: string): Promise<number | null> {
        const session = await this.db
            .select({ id: refreshTokens.id })
            .from(refreshTokens)
            .where(
                and(
                    eq(refreshTokens.userId, userId),
                    eq(refreshTokens.deviceId, deviceId),
                    eq(refreshTokens.isRevoked, false)
                )
            )
            .limit(1)

        return session.length > 0 ? session[0].id : null
    }

    /**
     * Aktualizuje informacje o urządzeniu dla istniejącej sesji
     */
    async updateDeviceInfo(sessionId: number, deviceInfo: Partial<DeviceInfo>): Promise<void> {
        await this.db
            .update(refreshTokens)
            .set({
                deviceName: deviceInfo.deviceName,
                userAgent: deviceInfo.userAgent,
                ipAddress: deviceInfo.ipAddress,
                location: deviceInfo.location,
                lastUsedAt: new Date()
            })
            .where(eq(refreshTokens.id, sessionId))
    }

    /**
     * Czyści wygasłe i unieważnione sesje
     */
    async cleanupExpiredSessions(): Promise<number> {
        const now = new Date()

        const result = await this.db
            .delete(refreshTokens)
            .where(
                and(
                    // Wygasłe lub unieważnione sesje
                    // TODO: Dodać warunek dla wygasłych tokenów
                    eq(refreshTokens.isRevoked, true)
                )
            )

        return result.changes
    }    /**
     * Tworzy nową sesję dla użytkownika
     */
    async createSession(userId: number, deviceInfo: DeviceInfo, token: string, expiresAt: Date): Promise<number> {
        const result = await this.db
            .insert(refreshTokens)
            .values({
                userId: userId,
                token: token,
                deviceId: deviceInfo.deviceId,
                deviceName: deviceInfo.deviceName,
                userAgent: deviceInfo.userAgent,
                ipAddress: deviceInfo.ipAddress,
                location: deviceInfo.location,
                isCurrent: true,
                expiresAt: expiresAt,
                createdAt: new Date(),
                lastUsedAt: new Date(),
                isRevoked: false
            })
            .returning({ id: refreshTokens.id })

        return result[0].id
    }

    /**
     * Pobiera statystyki sesji użytkownika
     */
    async getSessionStats(userId: number): Promise<{
        totalSessions: number
        activeSessions: number
        devicesCount: number
        lastActivity: Date | null
    }> {
        const sessions = await this.db
            .select()
            .from(refreshTokens)
            .where(eq(refreshTokens.userId, userId))

        const activeSessions = sessions.filter(s => !s.isRevoked)
        const uniqueDevices = new Set(sessions.map(s => s.deviceId).filter(Boolean))
        const lastActivity = sessions
            .map(s => s.lastUsedAt || s.createdAt)
            .sort()
            .reverse()[0]

        return {
            totalSessions: sessions.length,
            activeSessions: activeSessions.length,
            devicesCount: uniqueDevices.size,
            lastActivity: lastActivity ? new Date(lastActivity) : null
        }
    }
}

export const sessionManagementService = new SessionManagementService()
