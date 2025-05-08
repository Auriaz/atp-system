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

// Schemat walidacji danych zmiany hasła
export const PasswordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string().min(1, 'Password confirmation is required')
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
});


/**
 * Typ danych formularza rejestracji
 */
export type ProfileForm = z.infer<typeof ProfileFormSchema>;

export type PasswordChangeForm = z.infer<typeof PasswordChangeSchema>;