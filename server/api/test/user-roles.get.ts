// Test endpoint to check user roles and create admin if needed
export default defineEventHandler(async (event) => {
    try {
        const db = useDatabase()

        // Get users with their roles
        const usersWithRoles = await db.select({
            userId: tables.users.id,
            email: tables.users.email,
            username: tables.users.username,
            firstName: tables.users.firstName,
            lastName: tables.users.lastName,
            roleId: tables.roles.id,
            roleName: tables.roles.name,
            roleSlug: tables.roles.slug,
        })
            .from(tables.users)
            .leftJoin(tables.userRoles, eq(tables.users.id, tables.userRoles.userId))
            .leftJoin(tables.roles, eq(tables.userRoles.roleId, tables.roles.id))
            .limit(20)

        // Group users by ID to collect their roles
        const userRoleMap: Record<number, any> = {}

        usersWithRoles.forEach(row => {
            if (!userRoleMap[row.userId]) {
                userRoleMap[row.userId] = {
                    id: row.userId,
                    email: row.email,
                    username: row.username,
                    firstName: row.firstName,
                    lastName: row.lastName,
                    roles: []
                }
            }

            if (row.roleSlug) {
                userRoleMap[row.userId].roles.push({
                    id: row.roleId,
                    name: row.roleName,
                    slug: row.roleSlug
                })
            }
        })

        const users = Object.values(userRoleMap)
        const adminUsers = users.filter(user =>
            user.roles.some((role: any) => role.slug === 'admin')
        )

        return {
            success: true,
            data: {
                totalUsers: users.length,
                adminUsers: adminUsers.length,
                users: users,
                adminDetails: adminUsers,
                message: adminUsers.length > 0
                    ? `Found ${adminUsers.length} admin users`
                    : 'No admin users found'
            }
        }
    } catch (error) {
        console.error('Error checking user roles:', error)
        return {
            success: false,
            error: error.message
        }
    }
})
