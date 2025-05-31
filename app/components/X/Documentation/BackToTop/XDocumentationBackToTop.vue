<script lang="ts" setup>
const isVisible = ref(false);
const scrollThreshold = 300; // Show button after scrolling 300px

// Function to scroll to top
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// Function to handle scroll events
function handleScroll() {
  isVisible.value = window.scrollY > scrollThreshold;
}

// Set up scroll listener
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

// Clean up scroll listener
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 scale-75 translate-y-4"
    enter-to-class="opacity-100 scale-100 translate-y-0"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 scale-100 translate-y-0"
    leave-to-class="opacity-0 scale-75 translate-y-4"
  >
    <button
      v-if="isVisible"
      @click="scrollToTop"
      class="fixed bottom-8 right-8 z-50 p-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 group"
      aria-label="Scroll to top"
    >
      <UIcon 
        name="i-heroicons-arrow-up" 
        class="w-5 h-5 group-hover:scale-110 transition-transform duration-200" 
      />
    </button>
  </Transition>
</template>
