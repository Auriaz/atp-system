import type { Toast } from '@nuxt/ui/runtime/composables/useToast.js'

export function createApiMessage(title: string, description: string, color?: string) {
  return {
    title,
    description,
    color
  } as Toast
}