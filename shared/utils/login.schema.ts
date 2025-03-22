import * as v from 'valibot'

export const loginSchema = v.object({
  email: v.pipe(v.string(), v.email('Invalid email')),
  password: v.pipe(v.string(), v.minLength(8, 'Must be at least 8 characters')),
  rememberMe: v.optional(v.boolean())
})

export type LoginFormData = v.InferOutput<typeof loginSchema>