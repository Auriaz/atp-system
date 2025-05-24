<script setup lang="ts">
const props = defineProps({
  size: {
    type: [String, Number],
    default: '24'
  },
  alt: {
    type: String,
    default: 'Logo'
  }
})

const logoPath = '/images/logo/logo.png'

const logoExists = ref(true)

const sizeClass = computed(() => {
  const numSize = typeof props.size === 'string' ? parseInt(props.size) : props.size
  return `w-${numSize} h-${numSize}`
})

// Funkcja sprawdzająca czy logo istnieje
const checkLogoExists = async () => {
  try {
    await $fetch(logoPath)
    logoExists.value = true
  } catch (error) {
    console.error('Nie można sprawdzić logo:', error)
    logoExists.value = false
  }
}

// Obsługa błędu ładowania obrazu
const handleImageError = () => {
  logoExists.value = false
}

onMounted(() => {
  checkLogoExists()
})
</script>

<template>
  <div :class="[`flex justify-center items-center rounded-full duration-500`, sizeClass]">
    <img
      v-if="logoExists"
      :src="logoPath"
      :alt="alt"
      :class="[`flex justify-center items-center rounded-full duration-500`, sizeClass]"
      loading="lazy"
      @error="handleImageError"
    />

    <div
      v-else
      :class="sizeClass"
      class="flex justify-center items-center bg-primary-600 text-primary-200 rounded-full"
      >
      <p>Logo</p>
    </div>
  </div>
</template>
