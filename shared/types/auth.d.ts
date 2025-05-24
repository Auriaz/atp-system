declare module '#auth-utils' {
  interface User {
    id: number
    avatarUrl?: Blob | null
    email: string
    status: string
    username: string
    firstName?: string | null
    lastName?: string | null
    bio?: string | null
    createdAtAgo?: string
  }

  interface UserSession {
    user: User
    roles: RoleSlugs
    expiresAt: Number
    loggedInAt: Number
    rememberMe: boolean
    preferences?: {
      theme?: 'light' | 'dark' | 'system';
      notifications?: boolean;
    };
  }

  interface SecureSessionData {
    // Add your own fields

  }
}





