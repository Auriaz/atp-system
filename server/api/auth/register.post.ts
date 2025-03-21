import { useValidatedBody } from 'h3-valibot'

export default defineEventHandler(async (event) => {
  try {
    // Validate request body
    const body = await useValidatedBody(event, registerSchema)

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
      .returning({ id: tables.users.id, email: tables.users.email, username: tables.users.username })
      .execute()

    if (newUser.length !== 1) {
      throw createError({
        statusCode: 500,
        message: 'Failed to create user'
      })
    }

    return createApiResponse(
      null,
      {
        title: 'Registration successful',
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
