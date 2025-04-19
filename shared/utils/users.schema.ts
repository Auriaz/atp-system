import { z } from 'zod';
import { BaseQuerySchema } from './query.schema';

/**
 * Schemat dla zapytań filtrujących użytkowników
 * Rozszerza bazowy schemat o specyficzne dla użytkowników pola
 */
export const UserQuerySchema = BaseQuerySchema.extend({
  // Dodatkowe filtry specyficzne dla użytkowników
  role: z.string().optional().default('all'),
  team: z.string().optional(),
  registeredBefore: z.string().optional(),
  registeredAfter: z.string().optional(),
  lastLoginBefore: z.string().optional(),
  lastLoginAfter: z.string().optional(),
});

/**
 * Typ zapytania filtrującego użytkowników
 */
export type UserQuery = z.infer<typeof UserQuerySchema>;