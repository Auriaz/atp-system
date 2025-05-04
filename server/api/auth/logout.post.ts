// export default defineEventHandler(async (event) => {
//   const session = await getUserSession(event);

//   if (session?.user?.id) {
//     // Invaliduj cache uprawnień przy wylogowaniu
//     invalidateCache(session.user.id);
//     clearCachedPermissions(session.user.id);
//   }

//   // Usuń sesję
//   await clearUserSession(event);

//   return { success: true };
// });
