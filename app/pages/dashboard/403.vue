<script setup>
definePageMeta({
  layout: 'guest',
})

// Opcjonalne losowe komunikaty odmowy dostępu
const accessDeniedMessages = [
  "Wygląda na to, że próbujesz wejść na teren zastrzeżony.",
  "Twoje uprawnienia nie pozwalają na dostęp do tej strefy.",
  "Ta część systemu jest dostępna tylko dla uprawnionych użytkowników.",
  "Potrzebujesz wyższych uprawnień, aby zobaczyć tę zawartość."
]

const randomMessage = accessDeniedMessages[Math.floor(Math.random() * accessDeniedMessages.length)]
</script>

<template>
  <NuxtLayout>
    <XDashboardPage :loading="false">
      <template #main>
        <NuxtError :statusCode="403" />
        <div class="flex flex-col items-center justify-center min-h-[60vh] max-w-2xl mx-auto text-center px-4">
          <!-- Status code z animacją -->
          <div class="relative mb-6">
            <div class="text-9xl font-black text-primary-600/10 dark:text-primary-500/10">
              403
            </div>
            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center">
              <UIcon 
                name="i-lucide-shield-alert" 
                class="text-primary-600 dark:text-primary-400 text-5xl mr-3 animate-pulse"
              />
              <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Brak dostępu
              </h1>
            </div>
          </div>
      
          <!-- Wiadomość -->
          <p class="text-lg text-gray-600 dark:text-gray-300 mb-8">
            {{ randomMessage }}
          </p>
      
          <!-- Graficzna reprezentacja -->
          <div class="mb-10 relative w-full max-w-md">
            <div class="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-primary-700/20 blur-xl rounded-full"></div>
            <div class="relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
              <div class="flex justify-center mb-6">
                <div class="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <UIcon name="i-lucide-lock" class="text-red-600 dark:text-red-400 text-4xl" />
                </div>
              </div>
              
              <div class="space-y-4">
                <div class="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div class="w-5/6 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div class="w-4/6 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
              
              <div class="absolute top-0 left-0 w-full h-full flex justify-center items-center pointer-events-none">
                <div class="border-8 border-red-500/30 dark:border-red-800/30 rounded-lg w-full h-full"></div>
              </div>
            </div>
          </div>
      
          <!-- Przyciski akcji -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <UButton
              to="/"
              color="primary"
              size="lg"
              icon="i-lucide-home"
            >
              Strona główna
            </UButton>
            
            <UButton
              to="/dashboard"
              variant="soft"
              color="gray"
              size="lg"
              icon="i-lucide-layout-dashboard"
            >
              Mój dashboard
            </UButton>
            
            <UButton
              variant="ghost"
              color="gray"
              size="lg"
              icon="i-lucide-help-circle"
              @click="() => window.history.back()"
            >
              Wróć
            </UButton>
          </div>
          
          <!-- Dodatkowe informacje -->
          <div class="mt-8 text-sm text-gray-500 dark:text-gray-400 max-w-lg">
            <p>Jeśli uważasz, że powinieneś mieć dostęp do tej strony, skontaktuj się z administratorem systemu lub swoim przełożonym, aby uzyskać odpowiednie uprawnienia.</p>
          </div>
        </div>

      </template>
    </XDashboardPage>
  </NuxtLayout>
</template>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>