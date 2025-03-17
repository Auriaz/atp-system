<script setup lang="ts">
interface MenuItem {
  label?: string
  name: string
  icon?: string
  to: string
  items?: MenuItem[]
}

defineProps<{
  links: MenuItem[]
}>()
</script>

<template>
  <div class="flex flex-col lg:flex-row justify-center items-center space-y-3 lg:space-y-0 lg:space-x-3">
    <div v-for="(link, index) in links" :key="index">
      <XNavbarMenuItem v-if="link" :link="link" />
    </div>
  </div>
</template>
