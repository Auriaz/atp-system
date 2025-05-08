<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'

const toast = useToast()
const { changePassword } = useProfileApi()

// Stan formularza
const passwordForm = reactive({
  data: {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  },
  loading: false
})

// Flagi dla pokazywania/ukrywania haseł
const canSeeCurrentPassword = ref(false)
const canSeeNewPassword = ref(false)
const canSeeConfirmPassword = ref(false)

// Obsługa wysłania formularza
async function onSubmitPasswordChange(event: FormSubmitEvent<PasswordChangeForm>) {
  passwordForm.loading = true
  
  try {
    const result = await changePassword(event.data)
    
    if (result) {
      resetPasswordForm()
    }
  } catch (error) {
    console.error('Error changing password:', error)
  } finally {
    passwordForm.loading = false
  }
}

// Reset formularza
const resetPasswordForm = () => {
  passwordForm.data.currentPassword = ''
  passwordForm.data.newPassword = ''
  passwordForm.data.confirmPassword = ''
}

// Funkcje pomocnicze do walidacji na bieżąco
const passwordStrength = computed(() => {
  const password = passwordForm.data.newPassword
  if (!password) return 0
  
  let score = 0
  // Długość
  if (password.length >= 8) score += 25
  // Duże litery
  if (/[A-Z]/.test(password)) score += 25
  // Małe litery
  if (/[a-z]/.test(password)) score += 25
  // Liczby i znaki specjalne
  if (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) score += 25
  
  return score
})

const passwordStrengthLabel = computed(() => {
  const score = passwordStrength.value
  if (score < 25) return 'Weak'
  if (score < 50) return 'Fair'
  if (score < 75) return 'Good'
  return 'Strong'
})

const passwordStrengthColor = computed(() => {
  const score = passwordStrength.value
  if (score < 25) return 'error'
  if (score < 50) return 'warning'
  if (score < 75) return 'info'
  return 'success'
})
</script>

<template>
  <div class="w-full">
    <UForm 
      :schema="PasswordChangeSchema" 
      :state="passwordForm.data" 
      class="w-full space-y-6" 
      @submit="onSubmitPasswordChange"
    >
      <!-- Aktualne hasło -->
      <UFormField 
        name="currentPassword" 
        label="Current Password" 
        class="w-full" 
        required
      >
        <UInput 
          v-model="passwordForm.data.currentPassword" 
          :type="canSeeCurrentPassword ? 'text' : 'password'"
          autocomplete="current-password"
          placeholder="Enter your current password"
          class="w-full" 
        >
          <template #trailing>
            <UButton
              @click="canSeeCurrentPassword = !canSeeCurrentPassword"
              color="neutral"
              size="sm"
              variant="link"
              :icon="canSeeCurrentPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              :aria-label="canSeeCurrentPassword ? 'Hide password' : 'Show password'"
              :aria-pressed="canSeeCurrentPassword"
            />
          </template>
        </UInput>
      </UFormField>

      <!-- Nowe hasło -->
      <UFormField 
        name="newPassword" 
        label="New Password"
        class="w-full" 
        required
      >
        <UInput 
          v-model="passwordForm.data.newPassword" 
          :type="canSeeNewPassword ? 'text' : 'password'"
          autocomplete="new-password"
          placeholder="Enter new password"
          class="w-full" 
        >
          <template #trailing>
            <UButton
              @click="canSeeNewPassword = !canSeeNewPassword"
              color="neutral"
              size="sm"
              variant="link"
              :icon="canSeeNewPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              :aria-label="canSeeNewPassword ? 'Hide password' : 'Show password'"
              :aria-pressed="canSeeNewPassword"
            />
          </template>
        </UInput>
        
        <!-- Wskaźnik siły hasła -->
        <div v-if="passwordForm.data.newPassword" class="mt-2 ">
          <div class="flex items-center space-x-2">
            <UProgress
              :value="passwordStrength"
              :color="passwordStrengthColor"
              size="xs"
              class="flex-grow w-full"
            />
            <span class="text-xs text-gray-500 dark:text-gray-400">
              {{ passwordStrengthLabel }}
            </span>
          </div>
          <ul class="mt-2 text-xs text-gray-500 dark:text-gray-400 space-y-1 pl-5 list-disc">
            <li :class="{ 'text-green-500': passwordForm.data.newPassword.length >= 8 }">
              At least 8 characters
            </li>
            <li :class="{ 'text-green-500': /[A-Z]/.test(passwordForm.data.newPassword) }">
              At least one uppercase letter
            </li>
            <li :class="{ 'text-green-500': /[a-z]/.test(passwordForm.data.newPassword) }">
              At least one lowercase letter
            </li>
            <li :class="{ 'text-green-500': /[0-9]/.test(passwordForm.data.newPassword) }">
              At least one number
            </li>
            <li :class="{ 'text-green-500': /[^A-Za-z0-9]/.test(passwordForm.data.newPassword) }">
              At least one special character
            </li>
          </ul>
        </div>
      </UFormField>

      <!-- Potwierdzenie nowego hasła -->
      <UFormField 
        name="confirmPassword" 
        label="Confirm New Password" 
        required
        class="w-full" 
      >
        <UInput 
          v-model="passwordForm.data.confirmPassword" 
          :type="canSeeConfirmPassword ? 'text' : 'password'"
          autocomplete="new-password"
          placeholder="Confirm your new password"
          class="w-full"
        >
          <template #trailing>
            <UButton
              @click="canSeeConfirmPassword = !canSeeConfirmPassword"
              color="neutral"
              size="sm"
              variant="link"
              :icon="canSeeConfirmPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              :aria-label="canSeeConfirmPassword ? 'Hide password' : 'Show password'"
              :aria-pressed="canSeeConfirmPassword"
            />
          </template>
        </UInput>
        
        <!-- Potwierdzenie zgodności haseł -->
        <div 
          v-if="passwordForm.data.newPassword && 
                passwordForm.data.confirmPassword && 
                passwordForm.data.newPassword === passwordForm.data.confirmPassword" 
          class="mt-1"
        >
          <UBadge color="success" size="xs" class="flex items-center gap-1">
            <UIcon name="i-heroicons-check-circle" />
            <span>Passwords match</span>
          </UBadge>
        </div>
      </UFormField>

      <!-- Przyciski akcji -->
      <div class="flex justify-end space-x-3 pt-2">
        <UButton
          type="button"
          color="neutral"
          variant="outline"
          @click="resetPasswordForm"
          :disabled="passwordForm.loading"
        >
          Cancel
        </UButton>
        
        <UButton
          type="submit"
          color="primary"
          :loading="passwordForm.loading"
        >
          Change Password
        </UButton>
      </div>
    </UForm>
  </div>
</template>