<script lang="ts" setup>
interface Props {
  document?: {
    title?: string;
    description?: string;
    category?: string;
  }
}

const props = defineProps<Props>()

// Reactive sidebar state
const sidebarOpen = ref(false)

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

// Close sidebar when route changes on mobile
const route = useRoute()
watch(() => route.path, () => {
  if (import.meta.client && window.innerWidth < 1024) {
    sidebarOpen.value = false
  }
})
</script>

<template>  
  <div class="min-h-screen w-full bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <x-header class="sticky h-full top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200/60 dark:border-gray-700/60 border shadow-sm">
      <slot name="header" />
    </x-header>

    <!-- Main Layout -->
    <div class="flex relative container mx-auto lg:px-4 lg:py-6">
      <!-- Mobile Sidebar Overlay -->
      <div 
        v-if="sidebarOpen" 
        class="fixed inset-0 z-40 lg:hidden bg-black/50 backdrop-blur-sm"
        @click="toggleSidebar"
      ></div>

      <!-- Sidebar -->
      <aside 
        :class="[
          'absolute top-[64px] left-0 z-50 h-[calc(100vh-64px)] w-64 bg-white/95 dark:bg-slate-900/95 border-r border-gray-200/60 dark:border-gray-700/60 transition-transform duration-300 backdrop-blur-md',
          'lg:translate-x-0 lg:sticky lg:z-30 lg:bg-white lg:dark:bg-gray-900',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        ]"
      >
        <div class="h-full overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          <slot name="sidebar" />
        </div>
      </aside>

      <!-- Main Content -->
      <main class="w-full lg:ml-0">
        <!-- Mobile Sidebar Toggle -->
        <div class="lg:hidden sticky top-[64px] z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200/60 dark:border-gray-700/60 p-4">
          <UButton
            @click="toggleSidebar"
            icon="i-heroicons-bars-3"
            variant="ghost"
            size="sm"
            :label="sidebarOpen ? 'Ukryj menu' : 'Pokaż menu'"
            class="shadow-sm"
          />
        </div>
              <!-- Content Area -->
        <div class="min-h-[calc(100vh-64px)] w-full">
          <div class=" p-6 lg:p-8">
            <slot />
          </div>
        </div>
      </main>
    </div>   
    
    <!-- Footer -->
    <x-footer class="border-t border-gray-200/60 dark:border-gray-700/60 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md">
      <slot name="footer" />
    </x-footer>
  </div>
</template>

<style scoped>
.prose {
  --tw-prose-body: #374151;
  --tw-prose-headings: #111827;
  --tw-prose-lead: #4b5563;
  --tw-prose-links: #2563eb;
  --tw-prose-bold: #111827;
  --tw-prose-counters: #6b7280;
  --tw-prose-bullets: #9ca3af;
  --tw-prose-hr: #d1d5db;
  --tw-prose-quotes: #111827;
  --tw-prose-quote-borders: #d1d5db;
  --tw-prose-captions: #374151;
  --tw-prose-code: #111827;
  --tw-prose-pre-code: #f3f4f6;
  --tw-prose-pre-bg: #111827;
  --tw-prose-th-borders: #d1d5db;
  --tw-prose-td-borders: #e5e7eb;
  line-height: 1.75;
}

.dark .prose {
  --tw-prose-body: #d1d5db;
  --tw-prose-headings: #ffffff;
  --tw-prose-lead: #9ca3af;
  --tw-prose-links: #60a5fa;
  --tw-prose-bold: #ffffff;
  --tw-prose-counters: #9ca3af;
  --tw-prose-bullets: #4b5563;
  --tw-prose-hr: #374151;
  --tw-prose-quotes: #f3f4f6;
  --tw-prose-quote-borders: #374151;
  --tw-prose-captions: #9ca3af;
  --tw-prose-code: #ffffff;
  --tw-prose-pre-code: #d1d5db;
  --tw-prose-pre-bg: #1f2937;
  --tw-prose-th-borders: #4b5563;
  --tw-prose-td-borders: #374151;
}

.prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
  font-weight: 700;
  letter-spacing: -0.025em;
}

.prose h1 {
  font-size: 2.25rem;
  line-height: 2.5rem;
}

.prose h2 {
  font-size: 1.875rem;
  line-height: 2.25rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.prose h3 {
  font-size: 1.5rem;
  line-height: 2rem;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.prose p {
  margin-bottom: 1.25rem;
}

.prose code {
  background-color: #f3f4f6;
  padding: 0.25rem 0.375rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.dark .prose code {
  background-color: #1f2937;
  color: #e5e7eb;
}

.prose pre {
  background-color: #111827;
  border-radius: 0.75rem;
  padding: 1.5rem;
  overflow-x: auto;
  border: 1px solid #374151;
}

.prose blockquote {
  border-left: 4px solid #3b82f6;
  background-color: #eff6ff;
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  margin: 1.5rem 0;
}

.dark .prose blockquote {
  background-color: rgba(30, 58, 138, 0.2);
  border-left-color: #60a5fa;
}
</style>