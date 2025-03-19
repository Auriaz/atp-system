import * as v from 'valibot'

export const registerSchema = v.object({
  username: v.pipe(v.string(), v.minLength(3, 'Must be at least 3 characters')),
  email: v.pipe(v.string(), v.email('Invalid email')),
  password: v.pipe(v.string(), v.minLength(8, 'Must be at least 8 characters')),
  firstName: v.optional(v.string()),
  lastName: v.optional(v.string()),
  isAgreedToTerms: v.pipe(v.boolean(), v.custom((value) => value === true, 'Must be true')),
})
