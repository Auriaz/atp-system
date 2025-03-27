import { asc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    // Sprawdź sesję użytkownika (dodatkowe zabezpieczenie)
    const session = await getUserSession(event);
    if (!session?.user) {
      return createError({
        statusCode: 401,
        message: 'Unauthorized access'
      });
    }

    const query = getQuery(event)
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 10
    const offset = (page - 1) * limit

    let users = await useDatabase()
      .select()
      .from(tables.users)
      .orderBy(asc(tables.users.id))
      .limit(limit)
      .offset(offset)

    const total = users.length

    return createApiResponse({
      data: [...usersResource(users)],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      loading: false
    })
  } catch (error) {
    // Obsługa błędów, w tym błędów z middleware
    console.error('Error in users API:', error);

    // Przekazanie błędu dalej
    throw createError({
      statusCode: 500,
      message: 'An unexpected error occurred'
    });
  }
})
