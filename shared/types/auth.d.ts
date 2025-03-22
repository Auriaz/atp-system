declare module '#auth-utils' {
  interface User {
    id: number
    avatarUrl: string
    email: string
    role: UserRole
    username: string
    firstName?: string | null
    lastName?: string | null
    bio?: string | null
    createdAtAgo?: string
    updatedAt?: string | null
  }

  interface UserSession {
    user: User
    expiresAt: Number
    loggedInAt: Number
    rememberMe: boolean
    // Add your own fields
  }

  interface SecureSessionData {
    // Add your own fields

  }
}