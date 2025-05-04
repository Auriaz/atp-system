export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);

  if (session?.user?.id) {
    // Invaliduj cache uprawnień przy wylogowaniu
    clearCachedPermissions(session.user.id);
    // clearCachedPermissions(session.user.id);
  }

  // Wyczyść przeterminowane dane z cache'a
  cleanupServerCache();

  // Usuń sesję
  await clearUserSession(event);

  return { success: true };
});
