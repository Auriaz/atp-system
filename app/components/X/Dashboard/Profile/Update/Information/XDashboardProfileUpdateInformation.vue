<script lang="ts" setup>
const props = defineProps({
  profile: {
    type: Object as PropType<UserResource>,
    required: true,
  },
})
</script>


<template>
  <div class="space-y-8">
    <div class="relative w-full pb-4 flex flex-col rounded-lg box-border">
      <XFormProfileUpdated :profile="profile" />
    </div>
    
    <div>

    </div>
  </div>
</template>