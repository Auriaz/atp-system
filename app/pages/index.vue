<script setup lang="ts">
const isSwitch = ref(false)

function toggle() {
  isSwitch.value = !isSwitch.value
}
</script>

<template>
  <NuxtLayout>
    <UModal
    title="Modal with close button"
    :close="{
      color: 'primary',
      variant: 'outline',
      class: 'rounded-full'
    }"
  >
    <UButton label="Open" color="neutral" variant="subtle" />

    <template #body>
      <Placeholder class="h-48" />
    </template>
  </UModal>
  </NuxtLayout>
</template>
