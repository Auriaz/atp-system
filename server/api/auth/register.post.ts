export default defineEventHandler(async (event) => {
  // await useDatabase().update(tables.users)
  //   .set({ password: hashPasword })
  //   .where(eq(tables.users.email, body.email))
  //   .execute()
  return 'Hello Nitro'
})
