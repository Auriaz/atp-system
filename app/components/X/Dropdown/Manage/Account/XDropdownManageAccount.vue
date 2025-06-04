<script setup lang="ts">
import type { DropdownMenuItem } from '#ui/types'

interface Props {
  user: {
    firstName: string
    lastName: string
    email: string
    avatarUrl?: string
  }
  items?: DropdownMenuItem[][]
}

const props = defineProps<Props>()

// Transform items into the correct format for UNavigationMenu
const userNavigationItems = computed(() => {
  if (!props.items?.length) return []
  
  return props.items.map(group => 
    group.map(item => ({
      ...item,
      slot: item.slot || 'item'
    }))
  )
})
</script>

<template>
  <UDropdownMenu
    :items="userNavigationItems"
    :ui="{
      content: 'w-80 account-dropdown',
    }"
  >
    <!-- Custom trigger with enhanced avatar styling -->
      <UButton 
        color="neutral" 
        variant="ghost" 
      >
        <XAvatar 
          v-if="user" 
          :src="user.avatarUrl" 
          :alt="`${user.firstName} ${user.lastName}`"    
          :firstName="user.firstName" 
          :lastName="user.lastName" 
          :size="32" 
          class="ring-2 ring-white dark:ring-gray-900 shadow-sm"
        />
      </UButton>
    
    <!-- Enhanced account info section -->
    <template #account>
      <div class="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-600">
        <XAvatar 
          v-if="user" 
          :src="user.avatarUrl" 
          :alt="`${user.firstName} ${user.lastName}`"    
          :firstName="user.firstName" 
          :lastName="user.lastName" 
          :size="56" 
          class="ring-3 ring-white dark:ring-gray-800 shadow-lg"
        />
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-600 dark:text-gray-300">
            Signed in as
          </p>
          <p class="text-base font-semibold text-gray-900 dark:text-white truncate">
            {{ user.firstName }} {{ user.lastName }}
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
            {{ user.email }}
          </p>
        </div>
      </div>
    </template>

    <!-- Enhanced item styling -->
    <template #item="{ item }">
      <div class="flex items-center justify-between w-full px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
        <div class="flex items-center space-x-3">
          <UIcon 
            v-if="item.icon" 
            :name="item.icon" 
            class="w-4 h-4 text-gray-500 dark:text-gray-400" 
          />
          <span class="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
            {{ item.label }}
          </span>
        </div>        <UIcon 
          v-if="item.icon" 
          :name="item.icon" 
          class="w-4 h-4 text-gray-400 dark:text-gray-500 ml-auto" 
        />
      </div>
    </template>

    <!-- Enhanced signout section -->
    <template #signout>
      <div class="p-3 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
        <XBtnAuthLogout class="w-full justify-center bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800" />
      </div>
    </template>
  </UDropdownMenu>
</template>

<style scoped>
.account-dropdown {
  min-width: 280px;
  max-width: 320px;
}

/* Enhanced dropdown styling */
:deep(.ui-navigation-menu-content) {
  background-color: white;
  border: 1px solid rgb(229 231 235);
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  border-radius: 0.75rem;
  backdrop-filter: blur(4px);
}

:deep(.dark .ui-navigation-menu-content) {
  background-color: rgb(17 24 39);
  border-color: rgb(55 65 81);
}

:deep(.ui-navigation-menu-viewport) {
  border-radius: 0.75rem;
  overflow: hidden;
}

/* Glassmorphism effect */
:deep(.ui-navigation-menu-content::before) {
  content: '';
  position: absolute;
  inset: 0;
  background-color: rgb(255 255 255 / 0.8);
  backdrop-filter: blur(12px);
  border-radius: 0.75rem;
  z-index: -1;
}

:deep(.dark .ui-navigation-menu-content::before) {
  background-color: rgb(17 24 39 / 0.8);
}

/* Smooth animations */
:deep(.ui-navigation-menu-content) {
  animation: slideDownAndFade 200ms cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideDownAndFade {
  from {
    opacity: 0;
    transform: translateY(-4px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Enhanced focus states */
:deep(.ui-navigation-menu-trigger:focus-visible) {
  outline: 2px solid rgb(59 130 246);
  outline-offset: 2px;
}

:deep(.dark .ui-navigation-menu-trigger:focus-visible) {
  outline-offset: 2px;
}

/* Custom scrollbar for overflow content */
:deep(.ui-navigation-menu-content) {
  scrollbar-width: thin;
  scrollbar-color: rgb(156 163 175) transparent;
}

:deep(.ui-navigation-menu-content::-webkit-scrollbar) {
  width: 6px;
}

:deep(.ui-navigation-menu-content::-webkit-scrollbar-track) {
  background: transparent;
}

:deep(.ui-navigation-menu-content::-webkit-scrollbar-thumb) {
  background-color: rgb(156 163 175);
  border-radius: 9999px;
}

:deep(.dark .ui-navigation-menu-content::-webkit-scrollbar-thumb) {
  background-color: rgb(75 85 99);
}

:deep(.ui-navigation-menu-content::-webkit-scrollbar-thumb:hover) {
  background-color: rgb(107 114 128);
}

:deep(.dark .ui-navigation-menu-content::-webkit-scrollbar-thumb:hover) {
  background-color: rgb(107 114 128);
}
</style>