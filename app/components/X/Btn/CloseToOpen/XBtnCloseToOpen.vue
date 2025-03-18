<script lang="ts" setup>
  defineProps({
    switcher: {
      type: Boolean,
      default: false,
    },
  })
</script>

<template>
  <UButton
    variant="outline"
    :icon="switcher ? 'i-line-md-menu-to-close-transition' : 'i-line-md-close-to-menu-transition'"
    color="secondary"
  />
</template>