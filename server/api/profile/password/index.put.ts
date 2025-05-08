import { useValidatedBody } from 'h3-zod'

export default defineEventHandler(async (event) => {
  try {
    // Pobierz i zweryfikuj sesję użytkownika
    const session = await getUserSession(event);

    if (!session?.user) {
      throw createError({
        statusCode: HTTP_STATUS.UNAUTHORIZED,
        message: API_ERROR_MESSAGES.AUTH.MISSING_TOKEN,
      });
    }

    // Pobierz i zwaliduj dane z body żądania
    const passwordData = await useValidatedBody(event, PasswordChangeSchema);

    // Pobierz dane użytkownika z bazy danych (w tym aktualne hasło)
    const user = await getUserById(session.user.id);

    if (!user) {
      throw createError({
        statusCode: HTTP_STATUS.NOT_FOUND,
        message: API_ERROR_MESSAGES.USER.NOT_FOUND,
      });
    }

    // Pobierz aktualne hasło użytkownika z bazy danych
    const userWithPassword = await useDatabase()
      .select({ password: tables.users.password })
      .from(tables.users)
      .where(eq(tables.users.id, session.user.id))
      .execute();

    if (!userWithPassword || userWithPassword.length === 0) {
      throw createError({
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        message: API_ERROR_MESSAGES.SERVER.DATABASE_ERROR,
      });
    }

    const currentPasswordHash = userWithPassword[0].password;

    // Sprawdź czy aktualne hasło jest poprawne
    const isCurrentPasswordValid = await verifyPassword(
      currentPasswordHash,
      passwordData.currentPassword
    );

    if (!isCurrentPasswordValid) {
      throw createError({
        statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
        message: 'Current password is incorrect',
      });
    }

    // Sprawdź czy nowe hasło jest różne od starego
    if (passwordData.currentPassword === passwordData.newPassword) {
      throw createError({
        statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
        message: 'New password must be different than current password',
      });
    }

    // Zaktualizuj hasło
    const newPasswordHash = await hashPassword(passwordData.newPassword);

    await useDatabase()
      .update(tables.users)
      .set({
        password: newPasswordHash,
        updatedAt: new Date()
      })
      .where(eq(tables.users.id, session.user.id))
      .execute();

    // Zaloguj zmianę hasła
    await logUserActivityFromEvent(
      event,
      session.user.id,
      USER_ACTIVITY_TYPES.PASSWORD_CHANGED,
      {
        // Zapisz tylko informację o zmianie, bez szczegółów hasła
        timestamp: new Date().toISOString()
      }
    );

    // Zwróć sukces
    return createApiResponse(
      null,
      {
        statusCode: HTTP_STATUS.OK,
        description: API_SUCCESS_MESSAGES.USER.PASSWORD_UPDATED,
      }
    );
  } catch (error: any) {
    // Obsługa błędów walidacji
    if (error?.data?.issues) {
      throw createError({
        statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
        data: error.data.issues,
        message: 'Validation error',
      });
    }

    // Przekazanie błędów HTTP dalej
    if (error.statusCode) {
      throw error;
    }

    // Logowanie nieoczekiwanych błędów
    console.error('Error while changing password:', error);

    // Zwrócenie ogólnego błędu serwera
    throw createError({
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: API_ERROR_MESSAGES.SERVER.INTERNAL_ERROR,
    });
  }
});