<script lang="ts" setup>
const progress = ref(0);

// Function to calculate reading progress
function updateProgress() {
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight - windowHeight;
  const scrollTop = window.scrollY;
  
  if (documentHeight > 0) {
    progress.value = Math.min(100, Math.max(0, (scrollTop / documentHeight) * 100));
  }
}

// Set up scroll listener
onMounted(() => {
  updateProgress();
  window.addEventListener('scroll', updateProgress);
  window.addEventListener('resize', updateProgress);
});

// Clean up listeners
onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateProgress);
  window.removeEventListener('resize', updateProgress);
});
</script>

<template>
  <div class="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200 dark:bg-gray-800">
    <div 
      class="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-150 ease-out"
      :style="{ width: `${progress}%` }"
    ></div>
  </div>
</template>
