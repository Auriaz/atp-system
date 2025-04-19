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

    // Pobierz parametry zapytania
    const query = getQuery(event);
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 10;
    const search = query.search as string || '';
    const role = query.role as string || 'all';
    const status = query.status as string || 'all';
    const sortBy = query.sortBy as string || 'id';
    const sortOrder = (query.sortOrder as 'asc' | 'desc') || 'asc';

    // Użyj repozytorium do pobrania użytkowników
    const { users, total } = await getUsers({
      page,
      limit,
      search,
      role,
      status,
      sortBy,
      sortOrder
    });

    return createApiResponse({
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      loading: false
    });
  } catch (error) {
    // Obsługa błędów, w tym błędów z middleware
    console.error('Error in users API:', error);

    // Przekazanie błędu dalej
    throw createError({
      statusCode: 500,
      message: 'An unexpected error occurred'
    });
  }
});