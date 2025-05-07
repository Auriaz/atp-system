export default defineEventHandler(async (event) => {
  // Sprawdź, czy użytkownik jest zalogowany
  const session = await getUserSession(event);
  const user = session?.user;
  const roles = session?.roles;

  if (!user) {
    // Jeśli nie, zwróć błąd 401 Unauthorized
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'User not authenticated',
    });
  }
  // Sprawdź, czy użytkownik ma odpowiednie uprawnienia
  if (!roles) {
    // Jeśli nie, zwróć błąd 403 Forbidden
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
      message: 'User does not have permission to access this resource',
    });
  }
  // Pobierz dane użytkownika z bazy danych
  const userData = await useDatabase()
    .select()
    .from(tables.users)
    .where(eq(tables.users.id, user.id))
    .get();

  // Sprawdź, czy użytkownik istnieje
  if (!userData) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
      message: 'User not found',
    });
  }


  return createApiResponse({
    data: userData,
  });
})
