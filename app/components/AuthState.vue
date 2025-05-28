<script setup lang="ts">
// Komponent do zarządzania stanem autoryzacji
// Automatycznie ukrywa/pokazuje zawartość na podstawie stanu uwierzytelnienia
interface Props {
  requireAuth?: boolean
  hideWhenAuth?: boolean
  fallback?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  requireAuth: false,
  hideWhenAuth: false,
  fallback: false
})

// Sprawdzanie stanu uwierzytelnienia
let isAuthenticated = ref(false)
let user = ref(null)

try {
  const auth = useAuth()
  isAuthenticated = auth.isAuthenticated || ref(false)
  user = auth.user || ref(null)
} catch (error) {
  // Auth composable not available
  console.log('Auth composable not available in AuthState')
}

// Computed property to determine if content should be shown
const shouldShow = computed(() => {
  if (props.requireAuth && !isAuthenticated.value) {
    return false
  }
  
  if (props.hideWhenAuth && isAuthenticated.value) {
    return false
  }
  
  return true
})
</script>

<template>
  <div v-if="shouldShow">
    <slot :isAuthenticated="isAuthenticated" :user="user" />
  </div>
  
  <!-- Fallback content when conditions are not met -->
  <div v-else-if="$slots.fallback">
    <slot name="fallback" :isAuthenticated="isAuthenticated" :user="user" />
  </div>
</template>
