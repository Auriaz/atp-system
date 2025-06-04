export default defineEventHandler(async (event) => {
  try {
    // Set CORS headers
    setHeader(event, 'Access-Control-Allow-Origin', '*')
    setHeader(event, 'Access-Control-Allow-Methods', 'DELETE, OPTIONS')
    setHeader(event, 'Access-Control-Allow-Headers', 'Content-Type, Authorization')

    // Handle preflight request
    if (event.method === 'OPTIONS') {
      return null
    }

    // Get user ID from route parameters
    const userId = getRouterParam(event, 'id')

    if (!userId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User ID is required'
      })
    }

    // Validate that userId is a valid number
    const userIdNumber = parseInt(userId, 10)
    if (isNaN(userIdNumber) || userIdNumber <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid user ID format'
      })
    }

    // Use repository function to delete user
    const result = await deleteUser(userIdNumber)

    // Log successful deletion
    console.log(`User deleted successfully: ID ${userIdNumber} (${result.deletedUser.firstName} ${result.deletedUser.lastName})`)

    // Return success response
    return {
      success: true,
      message: 'User deleted successfully',
      data: result
    }

  } catch (error: any) {
    console.error('Error deleting user:', error)

    // Re-throw HTTP errors as-is
    if (error.statusCode) {
      throw error
    }

    // Handle specific database errors
    if (error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
      throw createError({
        statusCode: 409,
        statusMessage: 'Cannot delete user due to existing dependencies'
      })
    }

    if (error.code === 'SQLITE_BUSY') {
      throw createError({
        statusCode: 503,
        statusMessage: 'Database is busy, please try again'
      })
    }

    // Generic server error for unexpected issues
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error during user deletion',
      data: {
        error: error.message || 'Unknown error occurred'
      }
    })
  }
})
