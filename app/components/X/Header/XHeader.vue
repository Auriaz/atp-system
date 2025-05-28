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
    <!-- Header content wrapper -->
    <div class="h-full w-full flex items-center justify-between px-4 lg:px-6">
      <!-- Left section (logo, navigation) -->
      <div class="flex items-center space-x-6">
        <slot name="left" />
        <slot name="logo" />
        <slot name="navigation" />
      </div>

      <!-- Center section -->
      <div class="hidden lg:flex items-center justify-center flex-1">
        <slot name="center" />
      </div>

      <!-- Right section (actions, user menu) -->
      <div class="flex items-center space-x-4">
        <slot name="search" />
        <slot name="actions" />
        <slot name="user" />
        <slot name="right" />
      </div>
    </div>

    <!-- Mobile menu button -->
    <div class="lg:hidden absolute right-4 top-1/2 transform -translate-y-1/2">
      <slot name="mobile-toggle" />
    </div>

    <!-- Default slot for custom content -->
    <slot />
  </header>
</template>
