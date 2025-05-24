export default eventHandler(async (event) => {
  // Pobierz zalogowanego użytkownika
  const user = await requireUserSession(event)
  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  try {
    // Parsowanie formularza
    const formData = await readFormData(event)
    const file = formData.get('file') as File
    const blobInstance = hubBlob()

    // Walidacja pliku
    if (!file || !file.size) {
      throw createError({ statusCode: 400, message: 'No file provided' })
    }

    ensureBlob(file, {
      maxSize: '1MB',
      types: ['image'],
    })

    // Stała nazwa pliku dla każdego użytkownika
    const folderPath = `avatars/${user.user.id}`
    const timestamp = new Date().getTime();
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `avatar_${user.id}_${timestamp}.${fileExtension}`;



    // Wstaw nowy plik, nadpisując poprzedni (jeśli istniał)
    const blob = await blobInstance.put(fileName, file, {
      prefix: folderPath,
      height: formData.get('height') || '',
      width: formData.get('width') || '',
      left: formData.get('left') || '',
      top: formData.get('top') || '',
      metadata: {
        author: user.user.username,
        createdAt: new Date().toISOString(),
      }
    })

    // Sprawdź, czy plik został poprawnie zapisany
    if (!blob) {
      throw createError({ statusCode: 500, message: 'Failed to save avatar' })
    }
    // Sprawdź czy plik istnieje i jest zapisany w user.avatarUrl
    const existingAvatarUrl = await checkExistingAvatarUrl(user.user.id)
    // Usuń istniejący plik, jeśli istnieje
    if (existingAvatarUrl) {
      // Usuń istniejący plik
      const existingBlob = await blobInstance.get(existingAvatarUrl)
      if (existingBlob) {
        await blobInstance.del(existingAvatarUrl)
      }
    }
    // Generuj URL do avatara
    const avatarUrl = `${folderPath}/${fileName}`

    // Aktualizuj URL avatara w profilu użytkownika
    const updatedUser = await updateUserAvatarUrl(user.user.id, avatarUrl)

    // Get current session and update only the user property
    const session = await getUserSession(event)
    if (session) {
      await replaceUserSession(event, {
        ...session,
        user: {
          ...updatedUser,
          status: updatedUser.status || '' // Ensure status is never null
        }
      })
    }
    // Zwróć URL nowego avatara
    return createApiResponse(
      {
        data: updatedUser,
      },
      {
        description: 'Avatar uploaded successfully',
      }
    )
  } catch (error: any) {
    console.error('Avatar upload error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to upload avatar'
    })
  }
})