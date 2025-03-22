<script setup>
definePageMeta({
  layout: 'guest'
})

const isLoading = ref(false)
const email = ref('')
const resetSent = ref(false)

const sendResetLink = async () => {
  if (!email.value) {
    return
  }
  
  isLoading.value = true
  
  try {
    // Tutaj kod wysyłania linku resetującego hasło
    await new Promise(resolve => setTimeout(resolve, 1000)) // Symulacja opóźnienia
    resetSent.value = true
  } catch (error) {
    console.error('Błąd wysyłania linku resetującego:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <NuxtLayout>
    <p v-if="!resetSent" class="mb-4 text-sm text-gray-600 dark:text-gray-400">
      Podaj adres email, na który wyślemy link umożliwiający zresetowanie hasła.
    </p>
    
    <div v-if="resetSent" class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30 rounded-lg p-4 mb-6">
      <div class="flex">
        <UIcon name="i-lucide-check-circle" class="h-5 w-5 text-green-500 dark:text-green-400" />
        <div class="ml-3">
          <h3 class="text-sm font-medium text-green-800 dark:text-green-300">Link resetujący wysłany</h3>
          <div class="mt-2 text-sm text-green-700 dark:text-green-400">
            <p>Sprawdź swoją skrzynkę email i kliknij w link, aby zresetować hasło.</p>
          </div>
        </div>
      </div>
    </div>
    
    <form v-if="!resetSent" @submit.prevent="sendResetLink" class="space-y-4">
      <UFormGroup label="Email" name="email">
        <UInput
          v-model="email"
          type="email"
          placeholder="twoj@email.com"
          autocomplete="email"
          required
        />
      </UFormGroup>
      
      <UButton
        type="submit"
        block
        color="primary"
        :loading="isLoading"
        :disabled="isLoading"
      >
        Wyślij link resetujący hasło
      </UButton>
    </form>
    
    <div v-if="resetSent" class="text-center">
      <UButton
        to="/login"
        variant="outline"
        color="gray"
      >
        Wróć do strony logowania
      </UButton>
    </div>
  </NuxtLayout>
</template>