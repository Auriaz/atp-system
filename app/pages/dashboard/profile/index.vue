<script lang="ts" setup>
definePageMeta({
  layout: 'authorization',
  middleware: 'auth',
})
</script>

<template>
  <NuxtLayout>

    <XDashboardPage :loading="false">
      <template #header-panel>
        <h1 class="text-2xl font-bold mb-4">Dashboard CMS</h1>
      </template>
  
      <template #main>
        <div class="p-6 space-y-6">
          <!-- Szybkie akcje -->
          <h1>Profile</h1>
        </div>
      </template>
    </XDashboardPage>
  </NuxtLayout>
</template>