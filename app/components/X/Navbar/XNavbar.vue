<script setup lang="ts">
import type { NavigationMenuItem } from '#ui/types';
defineProps({
  isShowMenu: {
    type: Boolean,
    default: false,
  },
  container: {
    type: Boolean,
    default: false,
  },
  links: {
    type: Array as PropType<NavigationMenuItem[]>,
    default: () => [],
  },
});

const { navbar, toggleMobile, handleScroll, closeMobile } = useNavbar();
const route = useRoute();

// Funkcja do obsługi scrollowania navbar
function scrollNavbar() {
  handleScroll('main-nav');
}

// Zamknij menu mobilne przy zmianie strony
watch(() => route.path, () => {
  // Sprawdź czy menu jest otwarte, zanim je zamkniesz
  closeMobile(); // Jawnie przekaż false, aby zamknąć menu
  
}, { immediate: true });

// Zamknij menu mobilne przy zmianie rozmiaru ekranu
function checkScreenSize() {
  if (window.innerWidth >= 1024 && navbar.value.isMobile) {
    toggleMobile();
  }
}


onMounted(() => {
  scrollNavbar();
  window.addEventListener('resize', checkScreenSize);
  
  // Dodaj globalny listener dla kliknięć w linki nawigacyjne w menu mobilnym
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const navItem = target.closest('.mobile-nav-menu .u-navigation-menu-item');
  });
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScreenSize);
  document.removeEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const navItem = target.closest('.mobile-nav-menu .u-navigation-menu-item');
  });
});
</script>

<template>
  <nav id="main-nav" class="w-full box-border transition-all duration-300 shadow-sm shadow-primary-800"
    :class="[navbar.isScroll ? 'fixed h-20 top-0 left-0 backdrop-blur-lg z-50' : 'sticky h-20 lg:h-20 top-0 left-0 z-50']">
    <div class="h-full w-full flex items-center justify-center lg:justify-between"
      :class="[container ? 'container mx-auto' : '']">
      
      <!-- Desktop Logo & Left Items -->
      <div class="hidden lg:flex z-20">
        <div class="pl-5 pt-5">
          <slot name="logo" />
        </div>
        <slot name="left" />
      </div>

      <!-- Mobile Menu Toggle -->
      <div class="lg:hidden absolute z-40 top-6 left-3 px-3">
        <UTooltip text="Open menu">
          <XBtnCloseToOpen variant="outline" :switcher="navbar.isMobile" @click="toggleMobile()" />
        </UTooltip>
      </div>

      <!-- Desktop Navigation -->
      <div class="w-full hidden lg:block">
        <div class="relative w-full flex justify-between items-center" 
          :class="navbar.isMobile || navbar.isScroll ? 'show-content' : 'hidden-content'">
          <div class="flex w-full mx-auto container h-20 justify-center items-center space-x-10 pr-10">
            <UNavigationMenu :items="links" />
          </div>

          <!-- Desktop Right Items -->
          <div class="w-auto flex justify-end pr-3 space-x-3">
            <div class="flex justify-center items-center space-x-3">
              <slot name="search" />
            </div>

            <div class="flex justify-center items-center space-x-3">
              <XBtnColorMode />
            </div>

            <div class="flex justify-center items-center space-x-3 pr-3">
              <slot name="action" />
            </div>

            <div class="flex justify-center items-center space-x-3">
              <slot name="right" />
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Logo -->
      <div class="lg:hidden absolute top-3">
        <slot name="logo" />
      </div>

      <!-- Mobile Right Items -->
      <div class="w-auto h-full absolute top-0 right-0 lg:hidden flex justify-center items-center transition-all duration-300">
        <div class="h-full w-full mr-4 flex justify-center items-center">
          <XBtnColorMode />
        </div>

        <div class="flex justify-center items-center">
          <slot name="action" />
        </div>

        <div class="flex justify-center items-center">
          <slot name="right" />
        </div>
      </div>
    </div>

    <!-- Mobile Menu Overlay -->
    <div v-if="navbar.isMobile" 
      class="fixed inset-0 bg-black/30 dark:bg-black/50 lg:hidden z-40"
      @click="toggleMobile()">
    </div>

    <!-- Mobile Menu -->
    <transition 
      enter-active-class="transition ease-out duration-300" 
      enter-from-class="transform -translate-x-full" 
      enter-to-class="transform translate-x-0" 
      leave-active-class="transition ease-in duration-300" 
      leave-from-class="transform translate-x-0" 
      leave-to-class="transform -translate-x-full">
      <div v-if="navbar.isMobile" 
        class="h-screen w-[85%] max-w-sm fixed top-0 left-0 lg:hidden z-50 
              bg-white dark:bg-gray-900
              shadow-xl border-r border-gray-200 dark:border-gray-800
              transition-all duration-300 overflow-y-auto">
        
        <!-- Mobile Menu Header -->
        <div class="w-full py-4 px-5 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
          <!-- Logo in mobile menu -->
          <div>
            <slot name="logo" />
          </div>
          
          <!-- Close button -->
          <button 
            class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            @click="toggleMobile()"
          >
            <UIcon name="i-heroicons-x-mark" class="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>
        
        <!-- Mobile Menu Content -->
        <div class="w-full py-6 px-3">
          <!-- Navigation Links -->
          <div class="mb-6">
            <UNavigationMenu 
              :items="links" 
              orientation="vertical" 
              class="mobile-nav-menu w-full"
            />
          </div>
          
          <!-- Search -->
          <div class="mb-4 px-2">
            <slot name="search" />
          </div>
          
          <!-- Action Buttons -->
          <div class="flex flex-wrap justify-center items-center space-y-3 mt-8 border-t border-gray-200 dark:border-gray-800 pt-6">
            <div class="w-full"></div>
            <slot name="action" />
          </div>
        </div>
      </div>
    </transition>
  </nav>
</template>

<style scoped>
/* Styl dla mobilnych elementów menu */
:deep(.mobile-nav-menu .u-navigation-menu-item) {
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  margin-bottom: 0.25rem;
  border-radius: 0.5rem;
  color: rgb(31, 41, 55);
  font-weight: 500;
  transition: background-color 0.2s, color 0.2s;
  cursor: pointer;
}

:deep(.mobile-nav-menu .u-navigation-menu-item:hover) {
  background-color: rgb(243, 244, 246);
  color: rgb(37, 99, 235);
}

:deep(.mobile-nav-menu .u-navigation-menu-item.active) {
  background-color: rgb(239, 246, 255);
  color: rgb(29, 78, 216);
  font-weight: 600;
}

.dark :deep(.mobile-nav-menu .u-navigation-menu-item) {
  color: rgb(229, 231, 235);
}

.dark :deep(.mobile-nav-menu .u-navigation-menu-item:hover) {
  background-color: rgb(31, 41, 55);
  color: rgb(96, 165, 250);
}

.dark :deep(.mobile-nav-menu .u-navigation-menu-item.active) {
  background-color: rgba(30, 58, 138, 0.3);
  color: rgb(96, 165, 250);
}
</style>