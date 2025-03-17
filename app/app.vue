<script lang="ts" setup>
  const colorMode = useColorMode()

  const isDark = computed({
    get() {
      return colorMode.value === 'dark'
    },
    set() {
      colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
    }
  })
</script>


<template>
  <UApp>
    <ClientOnly v-if="!colorMode?.forced">
      <UButton :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'" color="neutral" variant="ghost"
        @click="isDark = !isDark" />

      <template #fallback>
        <div class="size-8" />
      </template>
    </ClientOnly>
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator />
    <NuxtPage />
  </UApp>
</template>
