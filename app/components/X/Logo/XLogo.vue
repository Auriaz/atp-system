<script setup lang="ts">
interface Props {
  size?: string | number
  alt?: string
  variant?: 'default' | 'text' | 'icon'
  showText?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'auto',
  alt: 'ATP System',
  variant: 'default',
  showText: true
})

const logoPath = '/images/logo/logo.png'
const logoExists = ref(true)

const logoClasses = computed(() => {
  const classes = ['flex', 'items-center', 'space-x-2', 'transition-all', 'duration-300']
  return classes
})

const imageClasses = computed(() => {
  const classes = ['transition-all', 'duration-300']
  
  if (typeof props.size === 'string' && props.size !== 'auto') {
    const numSize = parseInt(props.size)
    classes.push(`w-${numSize}`, `h-${numSize}`)
  } else if (typeof props.size === 'number') {
    classes.push(`w-${props.size}`, `h-${props.size}`)
  } else {
    classes.push('h-8', 'w-auto') // default size
  }
  
  return classes
})

// Fallback logo jako SVG
const fallbackLogo = `
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" fill="currentColor" rx="10"/>
  <text x="50" y="35" text-anchor="middle" fill="white" font-family="sans-serif" font-size="18" font-weight="bold">ATP</text>
  <text x="50" y="55" text-anchor="middle" fill="white" font-family="sans-serif" font-size="10">SYSTEM</text>
</svg>
`

// Obsługa błędu ładowania obrazu
const handleImageError = () => {
  logoExists.value = false
}

onMounted(() => {
  // Sprawdź czy logo istnieje
  const img = new Image()
  img.onload = () => { logoExists.value = true }
  img.onerror = () => { logoExists.value = false }
  img.src = logoPath
})
</script>

<template>
  <NuxtLink to="/" :class="[logoClasses, 'logo-hover']">
    <!-- Logo image -->
    <div class="relative">
      <img
        v-if="logoExists && variant !== 'text'"
        :src="logoPath"
        :alt="alt"
        :class="imageClasses"
        loading="lazy"
        @error="handleImageError"
      />
      
      <!-- Fallback SVG logo -->
      <div
        v-else-if="!logoExists && variant !== 'text'"
        :class="imageClasses"
        class="text-primary-600 dark:text-primary-400"
        v-html="fallbackLogo"
      />
    </div>
  </NuxtLink>
</template>

<style scoped>
.logo-hover {
  transition: transform 0.2s ease;
}

.logo-hover:hover {
  transform: scale(1.05);
}

/* SVG logo styling */
:deep(svg) {
  transition: all 0.3s ease;
}

:deep(svg:hover) {
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

/* Text logo styling */
.text-logo {
  background: linear-gradient(135deg, var(--color-primary-600), var(--color-primary-400));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.dark .text-logo {
  background: linear-gradient(135deg, var(--color-primary-400), var(--color-primary-300));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
