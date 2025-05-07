import { z } from 'zod';

/**
 * Schemat walidacji formularza rejestracji
 */
export const ProfileFormSchema = z.object({
  username: z.string()
    .min(3, { message: 'Username must be at least 3 characters' })
    .max(30, { message: 'Username must not exceed 30 characters' })
    .regex(/^[a-zA-Z0-9._-]+$/, { message: 'Username can only contain letters, numbers, dots, underscores and dashes' }),

  email: z.string()
    .email({ message: 'Please provide a valid email address' }),


  firstName: z.string().min(1, { message: 'First name is required' }).max(50),
  lastName: z.string().min(1, { message: 'Last name is required' }).max(50),

  bio: z.string().max(500, { message: 'Bio must not exceed 500 characters' }).optional(),
})

/**
 * Typ danych formularza rejestracji
 */
export type ProfileForm = z.infer<typeof ProfileFormSchema>;