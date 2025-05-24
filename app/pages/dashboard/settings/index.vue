<script lang="ts" setup>
definePageMeta({
  layout: 'authorization',
  middleware: 'auth',
})

// Zdefiniowanie wymaganych uprawnień
const requiredPermission = 'settings:logo:update';
</script>

<template>
  <NuxtLayout>
    <XDashboardPage :loading="false">
      <template #header-panel>
        <h1 class="text-2xl font-bold mb-4">Dashboard CMS</h1>
      </template>
  
      <template #main>
        <div class="p-6 space-y-6">
          <!-- Dodanie dyrektywy v-can -->
          <XPermission permission="settings:logo:update">
            <XDashboardSettingsLogo />
          </XPermission>
        </div>
      </template>
    </XDashboardPage>
  </NuxtLayout>
</template>