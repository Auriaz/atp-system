import { z } from 'zod';

/**
 * Schemat bazowy dla zapytań filtrujących
 * Zawiera wspólne pola wykorzystywane przez różne listy
 */
export const BaseQuerySchema = z.object({
  // Paginacja
  page: z.number().optional().default(1),
  limit: z.number().optional().default(10),

  // Sortowanie
  sortBy: z.string().optional().default('id'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),

  // Filtrowanie
  search: z.string().optional(),
  status: z.string().optional().default('all'),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),

  // Filtry zaawansowane
  filters: z.array(
    z.object({
      field: z.string(),
      operator: z.enum(['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'contains', 'startsWith', 'endsWith']),
      value: z.union([z.string(), z.number(), z.boolean(), z.null()])
    })
  ).optional(),
});

/**
 * Typ bazowego zapytania filtrującego
 */
export type BaseQuery = z.infer<typeof BaseQuerySchema>;

/**
 * Schemat dla zaawansowanych filtrów
 */
export const AdvancedFilterSchema = z.object({
  field: z.string(),
  operator: z.enum(['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'contains', 'startsWith', 'endsWith']),
  value: z.union([z.string(), z.number(), z.boolean(), z.null()])
});

/**
 * Typ pojedynczego zaawansowanego filtru
 */
export type AdvancedFilter = z.infer<typeof AdvancedFilterSchema>;