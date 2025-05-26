import type { SessionInfo } from '~/server/utils/services/session-management.service'

interface SessionStats {
    totalSessions: number
    activeSessions: number
    devicesCount: number
    lastActivity: Date | null
}

interface SessionsResponse {
    sessions: SessionInfo[]
    stats: SessionStats
}

export const useSessionManagement = () => {
    const { accessToken } = useJWTAuth()
    const toast = useToast()

    // Reactive data
    const sessions = ref<SessionInfo[]>([])
    const stats = ref<SessionStats | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    /**
     * Pobiera listę wszystkich sesji użytkownika
     */
    const fetchSessions = async (): Promise<void> => {
        if (!accessToken.value) {
            error.value = 'No access token available'
            return
        }

        loading.value = true
        error.value = null

        try {
            const response = await $fetch<{ success: boolean; data: SessionsResponse }>('/api/auth/sessions', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken.value}`
                }
            })

            if (response.success) {
                sessions.value = response.data.sessions
                stats.value = response.data.stats
            } else {
                throw new Error('Failed to fetch sessions')
            }
        } catch (err: any) {
            error.value = err.message || 'Failed to fetch sessions'
            console.error('Fetch sessions error:', err)
        } finally {
            loading.value = false
        }
    }

    /**
     * Usuwa wybraną sesję (wylogowuje z urządzenia)
     */
    const revokeSession = async (sessionId: number): Promise<boolean> => {
        if (!accessToken.value) {
            error.value = 'No access token available'
            return false
        }

        loading.value = true
        error.value = null

        try {
            const response = await $fetch<{ success: boolean; message: string }>(`/api/auth/sessions/${sessionId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken.value}`
                }
            })

            if (response.success) {
                toast.add({
                    title: 'Sesja usunięta',
                    description: 'Urządzenie zostało wylogowane pomyślnie',
                    color: 'green'
                })

                // Odśwież listę sesji
                await fetchSessions()
                return true
            } else {
                throw new Error(response.message || 'Failed to revoke session')
            }
        } catch (err: any) {
            error.value = err.message || 'Failed to revoke session'
            toast.add({
                title: 'Błąd',
                description: error.value,
                color: 'red'
            })
            console.error('Revoke session error:', err)
            return false
        } finally {
            loading.value = false
        }
    }

    /**
     * Usuwa wszystkie sesje oprócz aktualnej
     */
    const revokeAllOtherSessions = async (currentSessionId: number): Promise<boolean> => {
        if (!accessToken.value) {
            error.value = 'No access token available'
            return false
        }

        loading.value = true
        error.value = null

        try {
            const response = await $fetch<{ success: boolean; message: string; revokedCount: number }>('/api/auth/sessions/revoke', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken.value}`
                },
                body: {
                    currentSessionId,
                    revokeAll: false
                }
            })

            if (response.success) {
                toast.add({
                    title: 'Sesje usunięte',
                    description: `Wylogowano z ${response.revokedCount} urządzeń`,
                    color: 'green'
                })

                // Odśwież listę sesji
                await fetchSessions()
                return true
            } else {
                throw new Error(response.message || 'Failed to revoke sessions')
            }
        } catch (err: any) {
            error.value = err.message || 'Failed to revoke sessions'
            toast.add({
                title: 'Błąd',
                description: error.value,
                color: 'red'
            })
            console.error('Revoke all other sessions error:', err)
            return false
        } finally {
            loading.value = false
        }
    }

    /**
     * Usuwa wszystkie sesje (globalne wylogowanie)
     */
    const revokeAllSessions = async (): Promise<boolean> => {
        if (!accessToken.value) {
            error.value = 'No access token available'
            return false
        }

        loading.value = true
        error.value = null

        try {
            const response = await $fetch<{ success: boolean; message: string; revokedCount: number }>('/api/auth/sessions/revoke', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken.value}`
                },
                body: {
                    revokeAll: true
                }
            })

            if (response.success) {
                toast.add({
                    title: 'Wszystkie sesje usunięte',
                    description: `Wylogowano ze wszystkich ${response.revokedCount} urządzeń`,
                    color: 'green'
                })

                // Po globalnym wylogowaniu, przekieruj do strony logowania
                // ponieważ aktualna sesja też została unieważniona
                await navigateTo('/auth/login')
                return true
            } else {
                throw new Error(response.message || 'Failed to revoke all sessions')
            }
        } catch (err: any) {
            error.value = err.message || 'Failed to revoke all sessions'
            toast.add({
                title: 'Błąd',
                description: error.value,
                color: 'red'
            })
            console.error('Revoke all sessions error:', err)
            return false
        } finally {
            loading.value = false
        }
    }

    /**
     * Formatuje datę ostatniej aktywności
     */
    const formatLastActivity = (date: Date): string => {
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffMins = Math.floor(diffMs / (1000 * 60))
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

        if (diffMins < 1) return 'Teraz'
        if (diffMins < 60) return `${diffMins} min temu`
        if (diffHours < 24) return `${diffHours} godz. temu`
        if (diffDays < 7) return `${diffDays} dni temu`

        return date.toLocaleDateString('pl-PL')
    }

    /**
     * Sprawdza czy sesja jest aktualna
     */
    const isCurrentSession = (session: SessionInfo): boolean => {
        return session.isCurrent
    }

    /**
     * Pobiera ikonę dla typu urządzenia
     */
    const getDeviceIcon = (deviceName: string): string => {
        const name = deviceName.toLowerCase()

        if (name.includes('mobile') || name.includes('android') || name.includes('ios')) {
            return 'i-heroicons-device-phone-mobile'
        }
        if (name.includes('tablet') || name.includes('ipad')) {
            return 'i-heroicons-device-tablet'
        }
        if (name.includes('chrome') || name.includes('firefox') || name.includes('safari') || name.includes('edge')) {
            return 'i-heroicons-computer-desktop'
        }

        return 'i-heroicons-globe-alt'
    }

    // Automatycznie pobierz sesje przy inicjalizacji
    onMounted(() => {
        if (accessToken.value) {
            fetchSessions()
        }
    })

    // Obserwuj zmiany access tokenu
    watch(accessToken, (newToken) => {
        if (newToken) {
            fetchSessions()
        } else {
            sessions.value = []
            stats.value = null
        }
    })

    return {
        // State
        sessions: readonly(sessions),
        stats: readonly(stats),
        loading: readonly(loading),
        error: readonly(error),

        // Actions
        fetchSessions,
        revokeSession,
        revokeAllOtherSessions,
        revokeAllSessions,

        // Utilities
        formatLastActivity,
        isCurrentSession,
        getDeviceIcon
    }
}
