export default defineEventHandler(async (event) => {
  try {
    // Parse request body
    const body = await readBody(event)
    const { email, password, firstName, lastName, role } = body

    // Require authentication and check roles
    await requireUserRoles(event, ['admin', 'coach'])

    // Get current user ID for audit trail
    const currentUserId = await requireAuthenticatedUser(event)

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !role) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields: email, password, firstName, lastName, role'
      })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid email format'
      })
    }

    // Validate role permissions - coaches can only create players and other coaches
    const allowedRoles = ['player', 'coach']
    const hasCoachRole = await hasUserRoles(event, ['coach'])
    const hasAdminRole = await hasUserRoles(event, ['admin'])

    if (hasCoachRole && !hasAdminRole && !allowedRoles.includes(role)) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Coaches can only create players and other coaches'
      })
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email)
    if (existingUser) {
      throw createError({
        statusCode: 409,
        statusMessage: 'User with this email already exists'
      })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user object
    const newUser = {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role
    }

    // Save user to database
    const createdUser = await createUser(newUser)

    // // Remove password from response
    // const { password: _, ...userResponse } = createdUser

    return {
      success: true,
      message: 'User created successfully',
      // user: userResponse
    }

  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
