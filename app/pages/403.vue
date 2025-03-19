<template>
  <NuxtLayout class="flex items-center justify-center min-h-screen">
    <div class="text-center">
      <h1 class="text-4xl font-bold mb-4">403 - Brak dostępu</h1>
      <p class="mb-4">Nie masz uprawnień do wyświetlenia tej strony.</p>
      <XBtn color="primary" @click="$router.push('/')">
        Wróć do strony głównej
      </XBtn>
    </div>
  </NuxtLayout>
</template> 