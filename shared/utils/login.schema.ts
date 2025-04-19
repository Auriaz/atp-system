import { z } from 'zod';

/**
 * Schemat walidacji formularza logowania
 */
export const LoginFormSchema = z.object({
  email: z.string()
    .email({ message: 'Please enter a valid email address' }),

  password: z.string()
    .min(1, { message: 'Password is required' }),

  rememberMe: z.boolean().optional().default(false),
});

/**
 * Typ danych formularza logowania
 */
export type LoginForm = z.infer<typeof LoginFormSchema>;