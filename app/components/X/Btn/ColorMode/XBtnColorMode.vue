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
  <ClientOnly v-if="!colorMode?.forced">
    <UButton :icon="isDark ? 'i-line-md-moon-filled-loop' : 'i-line-md-moon-filled-to-sunny-filled-loop-transition'"
      color="primary" variant="ghost" @click="isDark = !isDark" />

    <template #fallback>
      <div class="size-8" />
    </template>
  </ClientOnly>
</template>