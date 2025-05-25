import { useValidatedBody } from 'h3-zod'
import { eq } from 'drizzle-orm'


export default defineEventHandler(async (event) => {
  try {
    // Validate request body
    const body = await useValidatedBody(event, RegisterFormSchema) as RegisterForm

    // Check if user already exists
    const existingUser = await useDatabase()
      .select()
      .from(tables.users)
      .where(eq(tables.users.email, body.email))
      .get()

    if (existingUser) {
      throw createError({
        statusCode: 409,
        message: 'User with this email already exists'
      })
    }

    // Check if username already exists
    const existingUsername = await useDatabase()
      .select()
      .from(tables.users)
      .where(eq(tables.users.username, body.username))
      .get()

    if (existingUsername) {
      throw createError({
        statusCode: 409,
        message: 'User with this username already exists'
      })
    }

    // Hash the password
    const hashedPassword = await hashPassword(body.password)

    // Create new user
    const newUser = await useDatabase()
      .insert(tables.users)
      .values({
        email: body.email,
        password: hashedPassword,
        username: body.username,
        firstName: body.firstName || null,
        lastName: body.lastName || null,
        isAgreedToTerms: body.isAgreedToTerms ? 1 : 0,

        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning({
        id: tables.users.id,
        password: tables.users.password,
        username: tables.users.username,
        email: tables.users.email,
        firstName: tables.users.firstName,
        lastName: tables.users.lastName,
        bio: tables.users.bio,
        avatarUrl: tables.users.avatarUrl,
        status: tables.users.status,
        createdAt: tables.users.createdAt,
      })
      .execute()

    if (newUser.length !== 1) {
      throw createError({
        statusCode: 500,
        message: 'Failed to create user'
      })
    }

    const user = {
      ...newUser[0],
      status: newUser[0].status || 'active' // Provide a default value when status is null
    }
    // Assign default user role
    await assignDefaultUserRole(user.id)

    // Get user roles for JWT payload
    const userRoles = await getUserRoleSlugs(user.id)    // Generate device ID for tracking
    const userAgent = event.node.req.headers['user-agent'] || 'unknown'
    const ipAddress = getClientIp(event) || undefined
    const deviceId = generateDeviceId(userAgent, ipAddress)    // Generate JWT token pair
    const { accessToken, refreshToken } = await generateTokenPair(
      user.id,
      user.email,
      userRoles,
      deviceId,
      userAgent,
      ipAddress)

    // Set refresh token as HTTPOnly cookie
    setCookie(event, 'refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: '/'
    })    // Set security headers
    setHeader(event, 'Cache-Control', 'no-cache, no-store, must-revalidate')
    setHeader(event, 'Pragma', 'no-cache')

    // Log user registration activity
    await useDatabase()
      .insert(tables.userActivities)
      .values({
        userId: newUser[0].id,
        action: 'register',
        ip: ipAddress,
        userAgent,
        details: JSON.stringify({
          deviceId,
          platform: getPlatformFromUserAgent(userAgent)
        }),
        createdAt: new Date()
      })
      .execute()
      .catch(error => console.error('Failed to log user activity:', error))

    return createApiResponse(
      {
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          bio: user.bio,
          avatarUrl: user.avatarUrl,
          status: user.status,
          createdAt: user.createdAt
        },
        roles: userRoles
      },
      {
        description: 'Your account has been created successfully.'
      }
    )
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002') {
      throw createError({
        statusCode: 409,
        message: 'User with this email already exists'
      })
    }
    // Handle validation errors from h3-valibot
    if (error && typeof error === 'object' && 'issues' in error) {
      throw createError({
        statusCode: 400,
        message: 'Validation error',
        data: error.issues
      })
    }

    // Handle database constraint errors for Drizzle
    if (error && typeof error === 'object' && 'message' in error &&
      typeof error.message === 'string' && error.message.includes('UNIQUE constraint failed')) {
      throw createError({
        statusCode: 409,
        message: 'User with this email or username already exists'
      })
    }
    throw error
  }
})
