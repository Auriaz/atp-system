<!-- filepath: c:\Apache24\htdocs\NuxtHub\atp-system\app\error.vue -->
<script setup lang="ts">
// Zdefiniuj props dla błędu
const props = defineProps({
  error: Object
});

// Funkcja do resetowania błędu
const handleError = () => clearError({ redirect: '/' });
</script>

<template>
  <NuxtLayout name="guest">
    <div class="min-h-screen flex flex-col items-center justify-center p-4">
      <div class="max-w-lg w-full text-center">
        <div class="mb-8">
          <img 
            v-if="error?.statusCode === 404" 
            src="/images/404-illustration.svg" 
            alt="Page not found" 
            class="max-w-md mx-auto"
          >
          <img 
            v-else-if="error?.statusCode === 403" 
            src="/images/403-illustration.svg" 
            alt="Access forbidden" 
            class="max-w-md mx-auto"
          >
          <div 
            v-else 
            class="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <UIcon name="i-lucide-x-circle" class="text-red-600 dark:text-red-400 text-5xl" />
          </div>
        </div>
        
        <h1 class="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
          {{ error?.statusCode === 404 ? 'Strona nie znaleziona' : 
             error?.statusCode === 403 ? 'Brak dostępu' : 
             'Wystąpił błąd' }}
        </h1>
        
        <p class="text-xl text-gray-600 dark:text-gray-400 mb-8">
          {{ error?.message || 'Przepraszamy, wystąpił nieoczekiwany błąd.' }}
        </p>
        
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <UButton @click="handleError" color="primary" size="lg">
            Spróbuj ponownie
          </UButton>
          
          <UButton to="/" variant="outline" size="lg">
            Powrót do strony głównej
          </UButton>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>