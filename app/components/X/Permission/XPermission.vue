<!-- app/components/X/Utils/XPermission.vue -->
<script setup lang="ts">
const props = defineProps({
  permission: {
    type: String,
    required: true
  }
});

const { session } = useAuth();

const hasAccess = computed(() => {
  if (!session.value.roles ) return false;
  
  return hasPermission(session.value.roles, props.permission as Permission);
});

</script>

<template>
  <div v-if="hasAccess">
    <slot />
  </div>
</template>