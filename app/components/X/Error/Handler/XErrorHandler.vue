<!-- filepath: c:\Apache24\htdocs\NuxtHub\atp-system\app\components\ErrorHandler.vue -->
<script setup lang="ts">
const props = defineProps({
  error: {
    type: Object,
    required: true
  },
  resetError: {
    type: Function,
    required: true
  }
});

// Create a wrapper function with the correct type
const handleReset = (event: MouseEvent) => {
  props.resetError();
};
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
    <div class="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
      <div class="p-6">
        <div class="flex justify-center mb-6">
          <div class="bg-red-100 dark:bg-red-900/30 rounded-full p-3">
            <UIcon 
              name="i-lucide-alert-triangle" 
              class="text-red-600 dark:text-red-400 text-4xl"
            />
          </div>
        </div>
        
        <h1 class="text-xl font-bold text-center mb-2 text-gray-900 dark:text-white">
          {{ error.statusCode }} {{ error.statusMessage || 'Błąd' }}
        </h1>
        <div class="flex justify-center gap-3">
          <UButton @click="handleReset" color="primary">
            Spróbuj ponownie
          </UButton>
          
          <UButton @click="navigateTo('/')" variant="outline">
            Powrót do strony głównej
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>