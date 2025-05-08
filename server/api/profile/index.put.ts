import { useValidatedBody } from 'h3-zod'

export default defineEventHandler(async (event) => {
  try {
    // Pobierz i zweryfikuj sesję użytkownika
    const session = await getUserSession(event)

    if (!session?.user) {
      throw createError({
        statusCode: HTTP_STATUS.UNAUTHORIZED,
        message: API_ERROR_MESSAGES.AUTH.MISSING_TOKEN,
      })
    }

    // Pobierz i zwaliduj dane z body żądania
    const updateData = await useValidatedBody(event, ProfileFormSchema)

    // Zaktualizuj profil użytkownika
    const updatedProfile = await updateUserProfile(session.user.id, updateData)

    // Zaloguj zmianę profilu 
    await logUserActivityFromEvent(
      event,
      session.user.id,
      USER_ACTIVITY_TYPES.PROFILE_UPDATED,
      { updatedFields: Object.keys(updateData) }
    )

    // Zwróć zaktualizowany profil
    return createApiResponse(
      { data: updatedProfile },
      {
        statusCode: HTTP_STATUS.OK,
        description: API_SUCCESS_MESSAGES.USER.PROFILE_UPDATED,
      }
    )
  } catch (error) {
    if (error) {
      // Obsługa błędów
      console.error('Błąd podczas aktualizacji profilu:', error)

      // Obsługa błędów z użyciem standardowych komunikatów
      if (error instanceof Error && 'statusCode' in error && error.statusCode === HTTP_STATUS.NOT_FOUND) {
        throw createError({
          statusCode: HTTP_STATUS.NOT_FOUND,
          message: API_ERROR_MESSAGES.USER.NOT_FOUND,
        })
      }

      throw createError({
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        message: API_ERROR_MESSAGES.SERVER.INTERNAL_ERROR,
      })
    }
  }
})
