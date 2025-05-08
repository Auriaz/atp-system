import type { Toast } from '@nuxt/ui/runtime/composables/useToast.js'


// Generate standardized API response
export function createApiMessage(
  statusCode: HttpStatusCode,
  customMessage?: string,
): Partial<Toast> {
  const defaultMessage = DEFAULT_STATUS_MESSAGES[statusCode]
  const category = getResponseCategory(statusCode)
  const color = getResponseColor(statusCode) as "success" | "primary" | "secondary" | "info" | "warning" | "error" | "neutral"

  return {
    title: category.charAt(0).toUpperCase() + category.slice(1),
    description: customMessage || defaultMessage,
    color
  }
}