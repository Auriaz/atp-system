// export default defineEventHandler(async (event) => {
//   let id = event.context.params?.id

//   if (!id) {
//     return new Error('User ID is required')
//   }

//   // Convert string id to number
//   const numericId = parseInt(id, 10)

//   // Check if the conversion was successful
//   if (isNaN(numericId)) {
//     return new Error('Invalid user ID format')
//   }

//   const db = useDatabase()

//   const user = await db.query.users.findFirst({
//     where: eq(tables.users.id, numericId)
//   })

//   if (!user) throw createError({ status: 404, message: 'User not found' })

//   return user
// })
