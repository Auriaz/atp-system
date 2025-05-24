export default defineEventHandler(async (event) => {
  // Pobierz zalogowanego użytkownika
  const user = await requireUserSession(event)
  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  // Pobierz instancję hubBlob
  const blobInstance = hubBlob()
  const folderPath = `avatars/${user.user.id}`
  // Pobierz wszystkie pliki z prefiksem 'avatars' + user.id

  const { blobs } = await blobInstance.list({
    prefix: folderPath,
  })

  return blobs
})
