<script setup lang="ts">
const { sidebar } = useSidebar()

defineProps({
  container: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: true,
  },
  breadcrumb: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: '',
  },
  subtitle: {
    type: String,
    default: '',
  }
})

const isShowSettingsSidebar = ref(false)

function openSettingsSidebar() {
  isShowSettingsSidebar.value = true
}

function closeSettingsSidebar() {
  isShowSettingsSidebar.value = false
}

// Expose methods for parent components
defineExpose({
  openSettingsSidebar,
  closeSettingsSidebar
})
</script>

<template>
  <section
    class="relative w-full h-full transition-all duration-500 box-border "
    :class="[
      sidebar.isShow ?
        sidebar.isRail ? 'lg:w-[calc(100%-110px)]' : 'lg:w-[calc(100%-280px)]'
        : '',
      container ? 'container mx-auto max-w-7xl' : ''
    ]"
  >
    <!-- Header -->
    <XDashboardPageHeader :breadcrumb="breadcrumb">
      <template #panel>
        <slot name="header-panel" />
      </template>
      
      <template #left>
        <slot name="header-left">
          <div v-if="title" class="flex flex-col">
            <h1 class="text-xl font-semibold text-gray-900 dark:text-white">{{ title }}</h1>
            <p v-if="subtitle" class="text-sm text-gray-500 dark:text-gray-400">{{ subtitle }}</p>
          </div>
        </slot>
      </template>

      <template #right>
        <div class="flex items-center">
          <div class="flex justify-end space-x-3">
            <slot name="header-right" />

            <UTooltip text="Settings">
              <UButton
                color="primary"
                variant="ghost"
                square
                @click="openSettingsSidebar()"
                icon="i-lucide-settings"
              />
            </UTooltip>
          </div>
        </div>
      </template>
    </XDashboardPageHeader>

    <!-- Main Content -->
    <main class="w-full z-20 px-2 lg:px-2 box-border transition-all duration-500 " :class="sidebar.isShowHelperBar ? 'mt-6' : 'mt-0'">
      <transition
        enter-active-class="transition ease-out duration-600"
        enter-from-class="transform opacity-0"
        enter-to-class="transform opacity-100"
        leave-active-class="transition ease-in duration-300"
        leave-from-class="transform opacity-100"
        leave-to-class="transform opacity-0"
      >
        <div v-if="!loading" class="">
          <slot name="main" />
        </div>

        <XLoadingPage v-else :loading="loading" />
      </transition>
    </main>

    <!-- Settings Sidebar Overlay -->
    <div
      v-if="isShowSettingsSidebar"
      class="w-screen h-screen fixed top-0 right-0 z-40 bg-gray-900/40 dark:bg-gray-900/60 cursor-pointer backdrop-blur-sm"
      @click="closeSettingsSidebar()"
    />

    <!-- Settings Sidebar -->
    <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="transform translate-x-full"
      enter-to-class="transform translate-x-0"
      leave-active-class="transition ease-in duration-300"
      leave-from-class="transform translate-x-0"
      leave-to-class="transform translate-x-full"
    >
      <div 
        v-if="isShowSettingsSidebar" 
        class="fixed top-0 right-0 w-full sm:w-96 h-screen shadow-xl bg-white dark:bg-slate-950 z-50 overflow-y-auto"
      >
        <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Settings</h2>
          <UButton
            color="primary"
            variant="ghost"
            icon="i-lucide-x"
            @click="closeSettingsSidebar"
            square
          />
        </div>
        
        <div class="p-4">
          <slot name="sidebar">
            <div class="text-center py-8 text-gray-500 dark:text-gray-400">
              <UIcon name="i-lucide-settings" class="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No settings available for this section.</p>
            </div>
          </slot>
        </div>
      </div>
    </transition>
  </section>
</template>