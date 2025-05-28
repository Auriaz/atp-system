<script setup lang="ts">
interface Props {
  variant?: 'default' | 'full-height' | 'centered' | 'sidebar'
  headerFixed?: boolean
  footerSticky?: boolean
  padding?: boolean
  maxWidth?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  headerFixed: false,
  footerSticky: false,
  padding: true,
  maxWidth: 'full'
})

// Computed classes for the layout container
const layoutClasses = computed(() => {
  const classes = ['relative', 'w-full', 'box-border']
  
  if (props.variant === 'full-height') {
    classes.push('h-screen', 'overflow-hidden')
  } else {
    classes.push('min-h-screen')
  }
  
  return classes
})

// Computed classes for the main content
const mainClasses = computed(() => {
  const classes = ['w-full', 'box-border', 'relative', 'transition-all', 'duration-500']
  
  if (props.variant === 'full-height') {
    classes.push('flex-1', 'overflow-auto')
  } else if (props.variant === 'centered') {
    classes.push('flex', 'justify-center', 'items-center', 'min-h-[60vh]')
  } else {
    classes.push('flex-1')
  }
  
  if (props.padding) {
    if (props.variant === 'sidebar') {
      classes.push('p-4', 'lg:p-0')
    } else {
      classes.push('py-0', 'px-4', 'lg:px-0')
    }
  }
  
  // Max width constraints
  if (props.maxWidth !== 'none' && props.maxWidth !== 'full') {
    classes.push('mx-auto')
    switch (props.maxWidth) {
      case 'sm': classes.push('max-w-sm'); break
      case 'md': classes.push('max-w-md'); break
      case 'lg': classes.push('max-w-lg'); break
      case 'xl': classes.push('max-w-xl'); break
      case '2xl': classes.push('max-w-2xl'); break
      case '7xl': classes.push('max-w-7xl'); break
    }
  }
  
  return classes
})

// Computed classes for the wrapper
const wrapperClasses = computed(() => {
  const classes = ['w-full', 'h-full']
  
  if (props.variant === 'sidebar') {
    classes.push('flex', 'flex-row')
  } else {
    classes.push('flex', 'flex-col')
  }
  
  return classes
})
</script>

<template>
  <div :class="layoutClasses">
    <div :class="wrapperClasses">
      <!-- Sidebar (for sidebar variant) -->
      <aside v-if="variant === 'sidebar'" class="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex-shrink-0">
        <slot name="sidebar" />
      </aside>

      <!-- Main content area -->
      <div class="flex-1 flex flex-col">
        <!-- Header -->
        <XHeader 
          :sticky="headerFixed"
          :class="{ 'fixed top-0 left-0 right-0 z-50': headerFixed }"
        >
          <slot name="header" />
        </XHeader>

        <!-- Main content -->
        <main :class="mainClasses" :style="{ marginTop: headerFixed ? '5rem' : '0' }">
          <!-- Breadcrumbs -->
          <div v-if="$slots.breadcrumbs" class="mb-6">
            <slot name="breadcrumbs" />
          </div>

          <!-- Page title -->
          <div v-if="$slots.title" class="mb-8">
            <slot name="title" />
          </div>

          <!-- Main content slot -->
          <slot name="main" />
          
          <!-- Default slot -->
          <slot />
        </main>

        <!-- Footer -->
        <XFooter 
          :class="{ 'sticky bottom-0': footerSticky }"
        >
          <slot name="footer" />
        </XFooter>
      </div>
    </div>

    <!-- Floating elements/modals -->
    <slot name="floating" />
    
    <!-- Additional overlays -->
    <slot name="overlays" />
    
    <!-- Legacy addon slot -->
    <slot name="addons" />
  </div>
</template>