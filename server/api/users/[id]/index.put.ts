import { eq } from 'drizzle-orm'
import { getUserById, findUserByEmail, findUserByUsername } from '../../../utils/repositories/users.repositories'
import { requireUserRoles, requireAuthenticatedUser } from '../../../utils/auth/jwt-user'
import { logUserActivityFromEvent } from '../../../utils/repositories/user_activities.repositories'
import { USER_ACTIVITY_TYPES } from '../../../../shared/utils/user_activities.constants'

export default defineEventHandler(async (event) => {
    try {
        // Get user ID from params
        const userId = getRouterParam(event, 'id')

        if (!userId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'User ID is required'
            })
        }

        // Require authentication and check roles
        await requireUserRoles(event, ['admin', 'coach'])

        // Parse request body
        const body = await readBody(event)
        const { firstName, lastName, email, username, bio, status, roles } = body

        // Validate required fields
        if (!firstName || !lastName || !email || !username) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Missing required fields: firstName, lastName, email, username'
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

        // Check if user exists
        const existingUser = await getUserById(parseInt(userId))
        if (!existingUser) {
            throw createError({
                statusCode: 404,
                statusMessage: 'User not found'
            })
        }

        // Check if email is already taken by another user
        const emailTaken = await findUserByEmail(email)
        if (emailTaken && emailTaken.id !== parseInt(userId)) {
            throw createError({
                statusCode: 409,
                statusMessage: 'Email is already taken by another user'
            })
        }

        // Check if username is already taken by another user
        const usernameTaken = await findUserByUsername(username)
        if (usernameTaken && usernameTaken.id !== parseInt(userId)) {
            throw createError({
                statusCode: 409,
                statusMessage: 'Username is already taken by another user'
            })
        }

        // Update user basic information
        const db = useDatabase()
        const updatedUser = await db
            .update(tables.users)
            .set({
                firstName,
                lastName,
                email,
                username,
                bio: bio || null,
                status: status || 'active',
                updatedAt: new Date()
            })
            .where(eq(tables.users.id, parseInt(userId)))
            .returning()

        if (!updatedUser[0]) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to update user'
            })
        }

        // Update user roles if provided
        if (roles && Array.isArray(roles)) {
            // Remove existing roles
            await db
                .delete(tables.userRoles)
                .where(eq(tables.userRoles.userId, parseInt(userId)))

            // Add new roles
            for (const roleSlug of roles) {
                const role = await db.query.roles.findFirst({
                    where: eq(tables.roles.slug, roleSlug)
                })

                if (role) {
                    await db.insert(tables.userRoles).values({
                        userId: parseInt(userId),
                        roleId: role.id,
                        assignedAt: new Date()
                    })
                }
            }
        }

        // Get updated user with roles
        const finalUser = await getUserById(parseInt(userId))

        // Log user activity
        const currentUserId = await requireAuthenticatedUser(event)
        await logUserActivityFromEvent(
            event,
            currentUserId,
            USER_ACTIVITY_TYPES.USER_UPDATED,
            {
                updatedUserId: parseInt(userId),
                updatedFields: Object.keys(body),
                newStatus: status
            }
        )

        return createApiResponse(
            {
                data: finalUser,
                message: 'User updated successfully'
            },
            {
                statusCode: 200,
                description: 'User updated successfully'
            }
        )

    } catch (error: any) {
        console.error('Error updating user:', error)

        // Handle specific error types
        if (error.statusCode) {
            throw error
        }

        throw createError({
            statusCode: 500,
            statusMessage: 'Internal server error'
        })
    }
})
