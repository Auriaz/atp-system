// TODO: Authenticate with GitHub OAuth and create a user if it doesn't exist is not working
export default defineOAuthGitHubEventHandler({
  config: {
    emailRequired: true,
    scope: ['user:email']
  },
  async onSuccess(event: any, { user, tokens }: { user: any, tokens: any }) {

    if (!user.email) {
      throw createError({
        status: 400,
        message: 'Email is required to authenticate with GitHub',
      })
    }

    const existingUserOAoth = await useDatabase()
      .select()
      .from(tables.oAuthAccounts)
      .where(eq(tables.oAuthAccounts.email, user.email))
      .get()

    if (existingUserOAoth) {
      await setUserSession(event, {
        user: {
          id: existingUserOAoth.id,
          email: existingUserOAoth.email || user.email,
          username: existingUserOAoth.username || user.login,
          avatarUrl: existingUserOAoth.avatarUrl || user.avatar_url,
          status: 'active',
        },
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        loggedInAt: Date.now(),
        rememberMe: false,
        roles: [], // TODO: Get user roles from database
        // roles: await getUserRoleSlugs(existingUserOAoth.userId),
      })

      return sendRedirect(event, '/dashboard')
    }

    const existingUser = await useDatabase()
      .select()
      .from(tables.users)
      .where(eq(tables.users.email, user.email))
      .get()

    if (existingUser) {
      await useDatabase()
        .insert(tables.oAuthAccounts)
        .values({
          userId: existingUser.id,
          provider: 'github',
          providerUserId: user.id,
          accessToken: tokens.access_token,
          email: user.email,
          username: user.login,
          avatarUrl: user.avatar_url,
          expiresAt: Date.now() + 24 * 60 * 60 * 1000,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .execute()

      await setUserSession(event, {
        user: {
          id: existingUser.id,
          email: user.email,
          username: user.login,
          avatarUrl: user.avatar_url,
          status: 'active',
        },
        roles: [],
        // roles: await getUserRoleSlugs(existingUser.id),
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        loggedInAt: Date.now(),
        rememberMe: false,
      })

      return sendRedirect(event, '/dashboard')
    }

    const newUser = await useDatabase()
      .insert(tables.users)
      .values({
        email: user.email,
        username: user.login,
        avatarUrl: user.avatar_url,
        password: '', // Add empty password for GitHub OAuth users
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning({ id: tables.users.id, email: tables.users.email, username: tables.users.username })
      .execute()

    if (newUser.length !== 1) {
      throw createError({
        status: 500,
        message: 'Failed to create user',
      })
    }

    await useDatabase()
      .insert(tables.oAuthAccounts)
      .values({
        userId: newUser[0].id,
        provider: 'github',
        providerUserId: user.id,
        accessToken: tokens.access_token,
        email: user.email,
        username: user.login,
        avatarUrl: user.avatar_url,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .execute()

    await setUserSession(event, {
      user: {
        id: user.id,
        email: user.email,
        username: user.login,
        avatarUrl: user.avatar_url,
        status: 'active',
      },
      // roles: await getUserRoleSlugs(newUser[0].id),
      roles: [],
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      loggedInAt: Date.now(),
      rememberMe: false
    })

    return sendRedirect(event, '/dashboard')
  },

  onError(event: any, _error: any) {
    throw createError({
      status: 500,
      message: 'Failed to authenticate with GitHub',
    })
  },
})
