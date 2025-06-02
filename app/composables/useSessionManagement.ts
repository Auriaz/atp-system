export const useSessionManagement = () => {
    const sessions = ref<SessionInfo[]>([])
    const stats = ref<SessionStats | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)
    const toast = useToast()

    // Get auth composables safely
    let authComposable: ReturnType<typeof useAuth> | null = null
    let jwtComposable: ReturnType<typeof useJWTAuth> | null = null

    try {
        authComposable = useAuth()
        jwtComposable = useJWTAuth()
    } catch (err) {
        console.error('Failed to initialize auth composables:', err)
    }

    // Helper function for authenticated requests
    const authenticatedFetch = async (url: string, options: any = {}) => {
        if (!authComposable?.isAuthenticated.value) {
            throw new Error('User not authenticated')
        }

        if (!jwtComposable?.accessToken.value) {
            // Try to refresh token or wait
            if (jwtComposable?.refreshToken) {
                const refreshed = await jwtComposable.refreshToken()
                if (!refreshed) {
                    throw new Error('Failed to refresh authentication token')
                }
            } else {
                throw new Error('No authentication token available')
            }
        }

        return $fetch(url, {
            ...options,
            headers: {
                'Authorization': `Bearer ${jwtComposable.accessToken.value}`,
                ...options.headers
            }
        })
    }

    // Fetch all user sessions
    const fetchSessions = async () => {
        try {
            loading.value = true
            error.value = null

            // Check authentication first
            if (!authComposable?.isAuthenticated.value) {
                throw new Error('User not authenticated')
            }

            const response = await authenticatedFetch('/api/auth/sessions', {
                method: 'GET'
            }) as any

            if (response.success) {
                sessions.value = response.data.sessions.map((session: any) => ({
                    ...session,
                    lastUsedAt: new Date(session.lastUsedAt),
                    createdAt: new Date(session.createdAt)
                }))
                stats.value = {
                    ...response.data.stats,
                    lastActivity: response.data.stats.lastActivity ? new Date(response.data.stats.lastActivity) : null
                }
            } else {
                throw new Error('Failed to fetch sessions')
            }
        } catch (err: any) {
            error.value = err.message || 'Nie udało się pobrać sesji'
            console.error('Fetch sessions error:', err)
        } finally {
            loading.value = false
        }
    }

    // Revoke specific session
    const revokeSession = async (sessionId: number) => {
        try {
            loading.value = true

            const response = await authenticatedFetch(`/api/auth/sessions/${sessionId}`, {
                method: 'DELETE'
            }) as any

            if (response.success) {
                toast.add({
                    title: 'Sukces',
                    description: 'Sesja została zakończona',
                    color: 'success'
                })
                await fetchSessions() // Refresh list
            } else {
                throw new Error(response.message || 'Failed to revoke session')
            }
        } catch (err: any) {
            toast.add({
                title: 'Błąd',
                description: err.message || 'Nie udało się zakończyć sesji',
                color: 'error'
            })
            console.error('Revoke session error:', err)
        } finally {
            loading.value = false
        }
    }

    // Revoke all other sessions
    const revokeAllOtherSessions = async (currentSessionId: number) => {
        try {
            loading.value = true

            const response = await authenticatedFetch('/api/auth/sessions/revoke', {
                method: 'POST',
                body: {
                    currentSessionId,
                    revokeAll: false
                }
            }) as any

            if (response.success) {
                toast.add({
                    title: 'Sukces',
                    description: `Zakończono ${response.revokedCount} sesji`,
                    color: 'success'
                })
                await fetchSessions() // Refresh list
            } else {
                throw new Error(response.message || 'Failed to revoke sessions')
            }
        } catch (err: any) {
            toast.add({
                title: 'Błąd',
                description: err.message || 'Nie udało się zakończyć sesji',
                color: 'error'
            })
            console.error('Revoke other sessions error:', err)
        } finally {
            loading.value = false
        }
    }

    // Revoke all sessions
    const revokeAllSessions = async () => {
        try {
            loading.value = true

            const response = await authenticatedFetch('/api/auth/sessions/revoke', {
                method: 'POST',
                body: {
                    revokeAll: true
                }
            }) as any

            if (response.success) {
                toast.add({
                    title: 'Sukces',
                    description: 'Wszystkie sesje zostały zakończone',
                    color: 'success'
                })

                // Force logout and redirect
                await navigateTo('/auth/login')
            } else {
                throw new Error(response.message || 'Failed to revoke all sessions')
            }
        } catch (err: any) {
            toast.add({
                title: 'Błąd',
                description: err.message || 'Nie udało się zakończyć wszystkich sesji',
                color: 'error'
            })
            console.error('Revoke all sessions error:', err)
        } finally {
            loading.value = false
        }
    }

    // Format last activity time
    const formatLastActivity = (date: Date | string) => {
        const now = new Date()
        const lastActivity = new Date(date)
        const diffInMinutes = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60))

        if (diffInMinutes < 1) return 'Teraz'
        if (diffInMinutes < 60) return `${diffInMinutes} min temu`
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} godz. temu`
        return `${Math.floor(diffInMinutes / 1440)} dni temu`
    }

    // Check if session is current
    const isCurrentSession = (session: SessionInfo) => {
        return session.isCurrent
    }

    // Get device icon based on device name
    const getDeviceIcon = (deviceName: string) => {
        const name = deviceName.toLowerCase()

        if (name.includes('mobile') || name.includes('android') || name.includes('iphone')) {
            return 'i-heroicons-device-phone-mobile'
        }
        if (name.includes('tablet') || name.includes('ipad')) {
            return 'i-heroicons-device-tablet'
        }
        if (name.includes('mac') || name.includes('windows') || name.includes('linux')) {
            return 'i-heroicons-computer-desktop'
        }
        return 'i-heroicons-globe-alt'
    }

    return {
        sessions: readonly(sessions),
        stats: readonly(stats),
        loading: readonly(loading),
        error: readonly(error),
        fetchSessions,
        revokeSession,
        revokeAllOtherSessions,
        revokeAllSessions,
        formatLastActivity,
        isCurrentSession,
        getDeviceIcon
    }
}
