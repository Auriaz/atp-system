// Test endpoint to check and create test users
export default defineEventHandler(async (event) => {
    // Skip authentication for this test endpoint
    setHeader(event, 'x-test-endpoint', 'true')

    try {
        // Check if we have any users
        const db = useDatabase()

        const existingUsers = await db.select({
            id: tables.users.id,
            email: tables.users.email,
            username: tables.users.username,
            firstName: tables.users.firstName,
            lastName: tables.users.lastName,
        }).from(tables.users).limit(10)

        const existingRoles = await db.select({
            id: tables.roles.id,
            name: tables.roles.name,
            slug: tables.roles.slug,
        }).from(tables.roles).limit(10)

        return {
            success: true,
            data: {
                userCount: existingUsers.length,
                users: existingUsers,
                roleCount: existingRoles.length,
                roles: existingRoles,
                message: existingUsers.length > 0
                    ? `Found ${existingUsers.length} existing users`
                    : 'No users found in database'
            }
        }
    } catch (error) {
        console.error('Error checking test data:', error)
        return {
            success: false,
            error: error.message
        }
    }
})
