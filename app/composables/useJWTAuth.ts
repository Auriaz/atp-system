/**
 * JWT Authentication Composable
 * Handles automatic token refresh and JWT-based authentication
 */

interface JWTAuth {
    accessToken: Ref<string | null>
    isAuthenticated: ComputedRef<boolean>
    tokenExpiresAt: Ref<number | null>
    timeUntilExpiry: ComputedRef<number>
    refreshToken: () => Promise<boolean>
    setAccessToken: (token: string, expiresIn?: number) => void
    clearTokens: () => void
    startAutoRefresh: () => void
    stopAutoRefresh: () => void
    onRefreshError: (callback: (error: any) => void) => void
}

type RefreshErrorCallback = (error: any) => void

let refreshTimer: NodeJS.Timeout | null = null
let refreshPromise: Promise<boolean> | null = null
let refreshErrorCallbacks: Set<RefreshErrorCallback> = new Set()

export function useJWTAuth(): JWTAuth {
    // Store access token in session storage (survives page refresh but not browser close)
    const accessToken = ref<string | null>(null)
    const tokenExpiresAt = ref<number | null>(null)

    // Initialize from session storage on client side
    if (import.meta.client) {
        const savedToken = sessionStorage.getItem('accessToken')
        const savedExpiry = sessionStorage.getItem('tokenExpiresAt')

        if (savedToken && savedExpiry) {
            const expiryTime = parseInt(savedExpiry)
            if (expiryTime > Date.now()) {
                accessToken.value = savedToken
                tokenExpiresAt.value = expiryTime
            } else {
                // Token expired, clear storage
                sessionStorage.removeItem('accessToken')
                sessionStorage.removeItem('tokenExpiresAt')
            }
        }
    }

    const isAuthenticated = computed(() => {
        return !!accessToken.value && (tokenExpiresAt.value ? tokenExpiresAt.value > Date.now() : true)
    })

    const timeUntilExpiry = computed(() => {
        if (!tokenExpiresAt.value) return 0
        return Math.max(0, tokenExpiresAt.value - Date.now())
    })

    const setAccessToken = (token: string, expiresIn = 900) => {
        accessToken.value = token
        tokenExpiresAt.value = Date.now() + (expiresIn * 1000) // Convert seconds to milliseconds

        if (import.meta.client) {
            sessionStorage.setItem('accessToken', token)
            sessionStorage.setItem('tokenExpiresAt', tokenExpiresAt.value.toString())
        }
    }

    const clearTokens = () => {
        accessToken.value = null
        tokenExpiresAt.value = null

        if (import.meta.client) {
            sessionStorage.removeItem('accessToken')
            sessionStorage.removeItem('tokenExpiresAt')
        } stopAutoRefresh()
    }

    const onRefreshError = (callback: RefreshErrorCallback) => {
        refreshErrorCallbacks.add(callback)

        // Return cleanup function
        return () => {
            refreshErrorCallbacks.delete(callback)
        }
    }

    const refreshToken = async (): Promise<boolean> => {
        // Prevent multiple simultaneous refresh requests
        if (refreshPromise) {
            return refreshPromise
        }

        refreshPromise = (async () => {
            try {
                const response = await $fetch<{
                    status: string
                    payload: {
                        accessToken: string
                        expiresIn: number
                    }
                }>('/api/auth/refresh', {
                    method: 'POST',
                    credentials: 'include', // Include HTTPOnly cookies
                })

                if (response.status === 'success' && response.payload?.accessToken) {
                    setAccessToken(response.payload.accessToken, response.payload.expiresIn)
                    console.log('🔄 JWT token refreshed successfully')
                    return true
                }

                console.warn('⚠️ Refresh token response invalid:', response)
                clearTokens()

                // Notify callbacks about refresh failure
                refreshErrorCallbacks.forEach(callback => {
                    try {
                        callback(new Error('Invalid refresh response'))
                    } catch (err) {
                        console.error('Error in refresh error callback:', err)
                    }
                })

                return false
            } catch (error: any) {
                console.error('❌ Failed to refresh JWT token:', error)

                // Check if this is a 401 (invalid/expired refresh token) or other auth error
                const isAuthError = error?.status === 401 || error?.statusCode === 401 ||
                    error?.data?.statusCode === 401 || error?.response?.status === 401

                clearTokens()

                // Notify callbacks about refresh error
                refreshErrorCallbacks.forEach(callback => {
                    try {
                        callback(error)
                    } catch (err) {
                        console.error('Error in refresh error callback:', err)
                    }
                })

                return false
            } finally {
                refreshPromise = null
            }
        })()

        return refreshPromise
    }

    const startAutoRefresh = () => {
        stopAutoRefresh() // Clear existing timer

        if (!import.meta.client) return

        const scheduleRefresh = () => {
            if (!tokenExpiresAt.value) return

            const timeLeft = tokenExpiresAt.value - Date.now()
            const refreshTime = Math.max(30000, timeLeft - 120000) // Refresh 2 minutes before expiry, minimum 30 seconds

            refreshTimer = setTimeout(async () => {
                console.log('🔄 Auto-refreshing JWT token...')
                const success = await refreshToken()

                if (success) {
                    scheduleRefresh() // Schedule next refresh
                } else {
                    console.warn('⚠️ Auto-refresh failed, stopping auto-refresh')
                }
            }, refreshTime)

            console.log(`⏰ Next JWT refresh scheduled in ${Math.round(refreshTime / 1000)} seconds`)
        }

        scheduleRefresh()
    }

    const stopAutoRefresh = () => {
        if (refreshTimer) {
            clearTimeout(refreshTimer)
            refreshTimer = null
        }
    }

    // Auto-start refresh when token is set
    watch(tokenExpiresAt, (newExpiry) => {
        if (newExpiry && import.meta.client) {
            startAutoRefresh()
        }
    }, { immediate: true })

    // Cleanup on unmount
    if (import.meta.client) {
        onBeforeUnmount(() => {
            stopAutoRefresh()
        })
    } return {
        accessToken: readonly(accessToken),
        isAuthenticated,
        tokenExpiresAt: readonly(tokenExpiresAt),
        timeUntilExpiry,
        refreshToken,
        setAccessToken,
        clearTokens,
        startAutoRefresh,
        stopAutoRefresh,
        onRefreshError
    }
}
