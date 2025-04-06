<script setup lang="ts">
const { sidebar } = useSidebar()

defineProps<{
  link: SidebarLink
}>()

</script>

<template>
  <li class="w-full">
    <ULink
      :to="link.to"
      :class="[sidebar.isRail ? 'justify-center w-10 h-10 px-2' : 'px-4 w-full']"
      class=" flex items-center py-2 rounded-lg transition-colors duration-200"
    >
      <span><Icon  :name="link.icon" class="text-centerw-5 h-5" /> <span v-if="!sidebar.isRail" class="ml-3"> {{ link.label }}</span></span>
    </ULink>
  </li>
</template>
