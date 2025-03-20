declare module '#auth-utils' {
  interface User {
    // id: number
    avatarUrl: string
    email: string
    // roles: string[]
    username: string
    // firstName?: string | null
    // lastName?: string | null
    // bio?: string | null
    // createdAtAgo?: string
    // updatedAt?: string | null
  }

  interface UserSession {
    user: User
    loggedInAt: Number
  }

  interface SecureSessionData {
    // Add your own fields

  }
}