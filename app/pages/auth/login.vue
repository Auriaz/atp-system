<script lang="ts" setup>
definePageMeta({
  layout: 'guest',
})
</script>

<template>
  <NuxtLayout >
    <div class="space-y-6">
      <div class="text-center mb-2">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Zaloguj się do systemu
        </h1>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Wprowadź swoje dane, aby uzyskać dostęp do konta
        </p>
      </div>
      
      <XFormAuthLogin />
      
      <div class="pt-4 text-center border-t border-gray-200 dark:border-gray-700">
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Nie masz jeszcze konta?
        </p>
        <UButton
          to="/auth/register"
          block
          color="neutral"
          variant="outline"
          icon="i-lucide-user-plus"
        >
          Utwórz nowe konto
        </UButton>
      </div>
      
      <div class="text-center">
        <NuxtLink 
          to="/auth/forgot-password" 
          class="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium"
        >
          Zapomniałeś hasła?
        </NuxtLink>
      </div>
    </div>
  </NuxtLayout>
</template>