export default defineEventHandler(async (event) => {
  // Pobierz zalogowanego użytkownika
  const user = await requireUserSession(event)
  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  // Parsowanie formularza
  const formData = await readFormData(event)
  const file = formData.get('file') as File
  const blobInstance = hubBlob()

  // Walidacja pliku
  if (!file || !file.size) {
    throw createError({ statusCode: 400, message: 'No file provided' })
  }

  ensureBlob(file, {
    maxSize: '4MB',
    types: ['image/png'],
  })

  // Stała nazwa pliku 
  const folderPath = `logo`
  const fileName = `logo.png`;

  // Wstaw nowy plik, nadpisując poprzedni (jeśli istniał)
  const blob = await blobInstance.put(fileName, file, {
    prefix: folderPath,
  })

  // Sprawdź, czy plik został poprawnie zapisany
  if (!blob) {
    throw createError({ statusCode: 500, message: 'Failed to save avatar' })
  }

  return createApiResponse({
    statusCode: 200,
    message: 'Logo updated successfully',
  })
})
