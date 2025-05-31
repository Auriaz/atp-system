<script lang="ts" setup>
interface Props {
  variant?: 'default' | 'hero' | 'simple'
  background?: 'transparent' | 'white' | 'dark'
  blur?: boolean
  sticky?: boolean
  shadow?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  background: 'transparent',
  blur: false,
  sticky: true,
  shadow: false
})


const isAlertVisible = ref(true)
// Computed classes based on props
const headerClasses = computed(() => {
  const classes = ['relative', 'w-full', 'h-0', 'z-40', 'box-border', 'transition-all', 'duration-500']
  
  // Background variants
  if (props.background === 'white') {
    classes.push('bg-white', 'dark:bg-gray-900')
  } else if (props.background === 'dark') {
    classes.push('bg-gray-900', 'dark:bg-gray-800')
  }
  
  // Blur effect
  if (props.blur) {
    classes.push('backdrop-blur-lg', 'bg-white/80', 'dark:bg-gray-900/80')
  }
  
  // Sticky positioning
  if (props.sticky) {
    classes.push('sticky', 'top-0')
  }
  
  // Shadow
  if (props.shadow) {
    classes.push('shadow-md', 'shadow-gray-200/50', 'dark:shadow-gray-800/50')
  }
  
  return classes
})
</script>

<template>
  <header id="main-header" :class="headerClasses">
    <UAlert
      v-if="isAlertVisible"
      color="warning" 
      variant="outline"
      title="Alpha Version Notice" 
      description="This website is currently in alpha testing phase. All content, data, and information displayed on this site is fictional and for demonstration purposes only. Please do not consider any information as factual or official."
      icon="i-heroicons-exclamation-triangle"

      close
      :ui="{
        wrapper: 'container mx-auto max-w-7xl px-4 lg:px-8',
      }"
    >
      <template #close>
        <UButton color="primary" variant="solid" @click="isAlertVisible = !isAlertVisible">Got it!</UButton>
      </template>
    </UAlert>

    <!-- Mobile menu button -->
    <div class="lg:hidden absolute right-4 top-1/2 transform -translate-y-1/2">
      <slot name="mobile-toggle" />
    </div>

    <!-- Default slot for custom content -->
    <slot />
  </header>
</template>
