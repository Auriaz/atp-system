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

export interface SessionStats {
    totalSessions: number
    activeSessions: number
    devicesCount: number
    lastActivity: Date | null
}