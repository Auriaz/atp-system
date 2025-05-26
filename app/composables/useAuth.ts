/**
 * Integrated Authentication Composable
 * Combines JWT-based authentication with session management
 * Provides automatic token refresh and seamless integration with existing auth system
 */

interface AuthComposable {
    // Authentication state
    isAuthenticated: ComputedRef<boolean>
    user: ComputedRef<any>
    session: ComputedRef<any>
    // JWT-specific
    accessToken: ComputedRef<string | null>
    tokenExpiresAt: ComputedRef<number | null>
    timeUntilExpiry: ComputedRef<number>
    // Authentication methods
    login: (credentials: { email: string; password: string; rememberMe?: boolean }) => Promise<boolean>
    register: (data: RegisterForm) => Promise<boolean>
    logout: () => Promise<void>
    refreshToken: () => Promise<boolean>

    // Token management
    setAccessToken: (token: string, expiresIn?: number) => void
    clearTokens: () => void

    // Auto-refresh control
    startAutoRefresh: () => void
    stopAutoRefresh: () => void

    // Session management
    fetchSession: () => Promise<void>
    clearSession: () => void
}

export function useAuth(): AuthComposable {
    // Use existing session composables
    const { session: userSession, loggedIn, user: sessionUser, fetch: fetchUserSession, clear: clearUserSession } = useUserSession()    // Use JWT composable for token management
    const jwtAuth = useJWTAuth()

    // Toast for notifications
    const toast = useToast()

    // Setup automatic logout on refresh token errors
    jwtAuth.onRefreshError((error: any) => {
        console.warn('🚪 Refresh token failed, triggering automatic logout:', error)

        // Clear all tokens and session
        jwtAuth.clearTokens()
        clearUserSession()

        // Show user-friendly message
        toast.add({
            title: 'Session Expired',
            description: 'Your session has expired. Please log in again.',
            color: 'warning'
        })

        // Redirect to login page if we're on a protected route
        if (import.meta.client) {
            const router = useRouter()
            const route = useRoute()

            // Check if current route requires authentication
            if (route.meta?.requiresAuth !== false && route.path.startsWith('/dashboard')) {
                router.push('/auth/login')
            }
        }
    })

    // Combined authentication state
    const isAuthenticated = computed(() => {
        return loggedIn.value || jwtAuth.isAuthenticated.value
    })

    const user = computed(() => {
        return sessionUser.value || null
    })

    const session = computed(() => {
        return userSession.value || null
    })

    /**
     * Login function that handles both JWT and session authentication
     */
    const login = async (credentials: { email: string; password: string; rememberMe?: boolean }): Promise<boolean> => {
        try {
            const response = await $fetch<{
                status: string
                payload: {
                    accessToken: string
                    expiresIn: number
                    user: any
                    roles: string[]
                }
                message: {
                    title: string
                    description: string
                }
            }>('/api/auth/login', {
                method: 'POST',
                body: credentials
            })

            if (response.status === 'success' && response.payload?.accessToken) {
                // Set JWT token
                jwtAuth.setAccessToken(response.payload.accessToken, response.payload.expiresIn)

                // Refresh session to sync with JWT
                await fetchUserSession()

                // Show success message
                if (response.message) {
                    toast.add({
                        title: response.message.title || 'Login Successful',
                        description: response.message.description || 'You have been successfully logged in',
                        color: 'success'
                    })
                }

                return true
            }

            return false
        } catch (error: any) {
            console.error('❌ Login failed:', error)

            // Show error message
            toast.add({
                title: 'Login Failed',
                description: error.data?.message || error.message || 'Authentication failed',
                color: 'error'
            })
            return false
        }
    }

    /**
     * Register function that handles user registration with JWT integration
     */
    const register = async (data: RegisterForm): Promise<boolean> => {
        try {
            const response = await $fetch<{
                status: string
                payload?: {
                    accessToken?: string
                    expiresIn?: number
                    user: any
                    roles?: string[]
                }
                message: {
                    title: string
                    description: string
                }
            }>('/api/auth/register', {
                method: 'POST',
                body: data
            })

            if (response.status === 'success') {
                // If registration includes automatic login (JWT token provided)
                if (response.payload?.accessToken) {
                    // Set JWT token
                    jwtAuth.setAccessToken(response.payload.accessToken, response.payload.expiresIn)

                    // Refresh session to sync with JWT
                    await fetchUserSession()
                }

                // Show success message
                if (response.message) {
                    toast.add({
                        title: response.message.title || 'Registration Successful',
                        description: response.message.description || 'Your account has been created successfully',
                        color: 'success'
                    })
                }

                return true
            }

            return false
        } catch (error: any) {
            console.error('❌ Registration failed:', error)

            // Show error message
            toast.add({
                title: 'Registration Failed',
                description: error.data?.message || error.message || 'Registration failed',
                color: 'error'
            })

            return false
        }
    }

    /**
     * Logout function that clears both JWT tokens and session
     */
    const logout = async (): Promise<void> => {
        try {
            // Call logout endpoint
            await $fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            // Clear JWT tokens
            jwtAuth.clearTokens()

            // Clear session
            clearUserSession()

            // Show success message
            toast.add({
                title: 'Logged Out',
                description: 'You have been successfully logged out',
                color: 'success'
            })

        } catch (error: any) {
            console.error('❌ Logout failed:', error)

            // Even if logout request fails, clear local tokens and session
            jwtAuth.clearTokens()
            clearUserSession()

            toast.add({
                title: 'Logout Error',
                description: 'There was an error during logout, but you have been logged out locally',
                color: 'warning'
            })
        }
    }

    /**
     * Enhanced refresh token function that syncs session
     */
    const refreshToken = async (): Promise<boolean> => {
        const success = await jwtAuth.refreshToken()

        if (success) {
            // Refresh session to stay in sync
            await fetchUserSession()
            console.log('🔄 Session synced with refreshed JWT token')
        } else {
            // If JWT refresh fails, clear session too
            console.warn('⚠️ JWT refresh failed, clearing session')
            clearUserSession()
        }

        return success
    }

    /**
     * Fetch and sync session data
     */
    const fetchSession = async (): Promise<void> => {
        await fetchUserSession()
    }

    /**
     * Clear all authentication data
     */
    const clearSession = (): void => {
        jwtAuth.clearTokens()
        clearUserSession()
    }

    // Auto-start JWT refresh when user is authenticated
    watch(isAuthenticated, (authenticated) => {
        if (authenticated && jwtAuth.tokenExpiresAt.value) {
            jwtAuth.startAutoRefresh()
        } else {
            jwtAuth.stopAutoRefresh()
        }
    }, { immediate: true })

    // Cleanup on unmount
    if (import.meta.client) {
        onBeforeUnmount(() => {
            jwtAuth.stopAutoRefresh()
        })
    }

    return {
        // Authentication state
        isAuthenticated,
        user,
        session,
        // JWT-specific
        accessToken: computed(() => jwtAuth.accessToken.value),
        tokenExpiresAt: computed(() => jwtAuth.tokenExpiresAt.value),
        timeUntilExpiry: jwtAuth.timeUntilExpiry,
        // Authentication methods
        login,
        register,
        logout,
        refreshToken,

        // Token management
        setAccessToken: jwtAuth.setAccessToken,
        clearTokens: jwtAuth.clearTokens,

        // Auto-refresh control
        startAutoRefresh: jwtAuth.startAutoRefresh,
        stopAutoRefresh: jwtAuth.stopAutoRefresh,

        // Session management
        fetchSession,
        clearSession
    }
}
