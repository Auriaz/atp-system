<script lang="ts" setup>
definePageMeta({
  layout: 'guest',
})
</script>

<template>
   <NuxtLayout>
     <div class="space-y-6">
       <div class="text-center mb-2">
         <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
           Utwórz nowe konto
         </h1>
         <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
           Wypełnij formularz, aby dołączyć do naszego systemu
         </p>
       </div>
       
       <XFormAuthRegister />
       
       <div class="pt-4 text-center border-t border-gray-200 dark:border-gray-700">
         <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
           Masz już konto?
         </p>
         <UButton
           to="/auth/login"
           block
           color="neutral"
           variant="outline"
           icon="i-lucide-log-in"
         >
           Zaloguj się do systemu
         </UButton>
       </div>
       
       <div class="text-center text-xs text-gray-500 dark:text-gray-400">
         Rejestrując się, akceptujesz 
         <NuxtLink to="/legal/terms" class="text-primary-600 dark:text-primary-400 hover:underline">
           Regulamin
         </NuxtLink>
         oraz
         <NuxtLink to="/legal/privacy" class="text-primary-600 dark:text-primary-400 hover:underline">
           Politykę prywatności
         </NuxtLink>
       </div>
     </div>
   </NuxtLayout>
</template>