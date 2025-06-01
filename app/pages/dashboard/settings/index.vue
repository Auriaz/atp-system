<script lang="ts" setup>
definePageMeta({
  layout: 'authorization',
  middleware: 'auth',
})

// Define required permissions for different sections
const logoPermission = 'settings:logo:update'
const emailPermission = 'settings:email'
</script>

<template>
  <NuxtLayout>
    <XDashboardPage :loading="false">
      <template #header-panel>
        <h1 class="text-2xl font-bold mb-4">Dashboard CMS</h1>
      </template>
  
      <template #main>
        <div class="p-6 space-y-6">
          <!-- Logo Settings Section -->
          <XPermission :permission="logoPermission">
            <XDashboardSettingsLogo />
          </XPermission>

          <!-- Email Settings Section -->
          <XPermission :permission="emailPermission">
            <XDashboardSettingsEmail />
          </XPermission>
        </div>
      </template>
    </XDashboardPage>
  </NuxtLayout>
</template>