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

// Navigation links
const navigationLinks = [
  { label: 'Strona główna', to: '/', icon: 'i-lucide-home' },
  { label: 'Funkcje', to: '/features', icon: 'i-lucide-zap' },
  { label: 'Cennik', to: '/pricing', icon: 'i-lucide-credit-card' },
  { label: 'O nas', to: '/about', icon: 'i-lucide-users' },
  { label: 'Kontakt', to: '/contact', icon: 'i-lucide-mail' }
]

// User authentication state (checking if composable exists)
let user = ref<any>(null)
let signOut = () => {}

try {
  const auth = useAuth()
  user = auth.user
  // Check if logout method exists
  if (auth && typeof auth === 'object' && 'logout' in auth) {
    signOut = (auth as any).logout
  } else if (auth && typeof auth === 'object' && 'signOut' in auth) {
    signOut = (auth as any).signOut
  }
} catch (error) {
  // Auth composable not available
  console.log('Auth composable not available')
}

// Funkcja do obsługi scrollowania navbar
function scrollNavbar() {
  handleScroll('main-nav');
}

// Zamknij menu mobilne przy zmianie strony
watch(() => route.path, () => {
  closeMobile();
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
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScreenSize);
});
</script>

<template>  <!-- Modern Glassmorphism Navbar -->
  <nav id="main-nav" class="w-full box-border transition-all duration-700 ease-out subtle-navbar"
    :class="[
      navbar.isScroll 
        ? 'fixed h-14 sm:h-16 top-0 left-0 backdrop-blur-xl bg-gradient-to-r from-white/95 via-gray-50/90 to-gray-100/95 dark:from-gray-900/95 dark:via-primary-900/90 dark:to-gray-800/95 z-50 ' 
        : 'sticky h-16 sm:h-20 top-0 left-0 z-50 bg-transparent'
    ]">
      <!-- Main Navigation Container -->
    <div class="h-full w-full flex items-center justify-between px-3 xs:px-4 sm:px-6 lg:px-8"
      :class="[container ? 'container mx-auto max-w-7xl' : '']">
      
        <!-- Left Section: Logo -->
      <div class="flex items-center space-x-3 sm:space-x-6 z-20">
        <div class="logo-container">
          <slot name="logo" />
        </div>
        <div class="hidden sm:block">
          <slot name="left" />
        </div>
      </div><!-- Center Section: Desktop Navigation (Hidden on mobile) -->
      <div class="hidden lg:flex items-center justify-center flex-1">        
        <div class="nav-links-container flex items-center space-x-1 px-8 py-2 rounded-full transition-all duration-500"
        :class="[
          navbar.isScroll 
            ? 'bg-white/40 dark:bg-white/20 backdrop-blur-sm border border-gray-300/30 dark:border-white/10' 
            : 'bg-white/45 dark:bg-white/10 backdrop-blur-sm border border-gray-400/20 dark:border-white/20'
        ]">          
          <NuxtLink 
            v-for="link in navigationLinks" 
            :key="link.label"
            :to="link.to"
            class="nav-link group relative flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all duration-300 text-gray-700 dark:text-white/90 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/30 dark:hover:bg-white/10"
            :class="{ 
              'bg-gray-300/40 dark:bg-white/20 text-gray-900 dark:text-white shadow-inner': route.path === link.to 
            }"
          >            <!-- Subtle active indicator -->
            <div v-if="route.path === link.to" class="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30 dark:from-blue-500/20 dark:to-purple-500/20 rounded-full"></div>
            
            <!-- Icon -->
            <UIcon 
              :name="link.icon" 
              class="w-4 h-4 relative z-10 transition-all duration-300"
            />
            
            <!-- Link text -->
            <span class="relative z-10 text-sm font-medium">{{ link.label }}</span>
              <!-- Subtle hover effect -->
            <div class="absolute inset-0 bg-gray-200/20 dark:bg-white/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </NuxtLink>
        </div>
      </div>      <!-- Right Section: Actions & User -->
      <div class="flex items-center space-x-2 sm:space-x-4 z-20">
        <!-- Search slot - hidden on very small screens -->
        <div class="hidden sm:flex">
          <slot name="search" />
        </div>        <!-- Color mode toggle -->
        <div class="color-mode-wrapper hidden sm:block">
          <XBtnColorMode />
        </div>

        <!-- Action buttons -->
        <div class="actions-wrapper hidden sm:block">
          <slot name="action" />
        </div>

        <!-- User dropdown or auth buttons -->
        <div class="user-section flex items-center">
          <div v-if="user" class="user-dropdown hidden sm:block">
            <UDropdown
              :items="[
                [
                  { label: 'Profile', icon: 'i-lucide-user', to: '/profile' },
                  { label: 'Settings', icon: 'i-lucide-settings', to: '/settings' }
                ],
                [
                  { label: 'Sign out', icon: 'i-lucide-log-out', click: signOut }
                ]
              ]"
            >                  
              <UAvatar
                :src="user?.avatar || '/user-placeholder.png'"
                :alt="user?.name || 'User'"
                size="sm"
                class="cursor-pointer ring-2 ring-white/20 hover:ring-blue-400/40 transition-all duration-300"
              />
            </UDropdown>
          </div>
          
          <div class="hidden sm:block">
            <slot name="right" />
          </div>
        </div>

        <!-- Mobile Menu Toggle -->
        <div class="lg:hidden mobile-menu-toggle">          
          <UButton
            variant="ghost"
            size="md"
            color="neutral"
            :icon="navbar.isMobile ? 'i-lucide-x' : 'i-lucide-menu'"

            @click="toggleMobile()"
          />
        </div>
      </div>
    </div>    <!-- Mobile Menu Overlay -->
    <div v-if="navbar.isMobile" 
      class="fixed inset-0 bg-gray-100/60 dark:bg-gray-900/60 backdrop-blur-sm lg:hidden z-40"
      @click="toggleMobile()">
    </div>    <!-- Mobile Menu -->
    <transition 
      enter-active-class="transition ease-out duration-300" 
      enter-from-class="transform -translate-x-full opacity-0" 
      enter-to-class="transform translate-x-0 opacity-100" 
      leave-active-class="transition ease-in duration-300" 
      leave-from-class="transform translate-x-0 opacity-100" 
      leave-to-class="transform -translate-x-full opacity-0">
        <div v-if="navbar.isMobile" 
        class="h-screen w-[85%] xs:w-[90%] max-w-xs sm:max-w-sm fixed top-0 left-0 lg:hidden z-50 
              bg-white/95 dark:bg-slate-900 backdrop-blur-xl
              border-r border-gray-200/30 dark:border-white/10
              transition-all duration-300 overflow-y-auto subtle-mobile-menu
              pb-safe-area-inset-bottom"
        style="padding-top: env(safe-area-inset-top, 0); padding-bottom: env(safe-area-inset-bottom, 0);"
      >
            <!-- Mobile Menu Header -->
        <div class="w-full py-3 xs:py-4 sm:py-6 px-3 xs:px-4 sm:px-6 border-b border-gray-200/30 dark:border-white/10 flex justify-between items-center">
          <!-- Logo in mobile menu -->
          <div class="logo-mobile">
            <slot name="logo" />
          </div>
          
          <!-- Close button -->
          <button 
            class="p-2 rounded-full bg-gray-200/30 dark:bg-white/10 hover:bg-gray-300/40 dark:hover:bg-white/20 transition-all duration-300 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
            @click="toggleMobile()"
          >
            <UIcon name="i-lucide-x" class="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-white" />
          </button>
        </div>
          <!-- Mobile Menu Content -->
        <div class="w-full py-3 xs:py-4 sm:py-8 px-2 xs:px-3 sm:px-4 pb-6 sm:pb-8">
          <!-- Navigation Links -->
          <div class="mb-4 xs:mb-6 sm:mb-8 space-y-1 sm:space-y-2">
            <NuxtLink 
              v-for="link in navigationLinks" 
              :key="link.label"
              :to="link.to"
              class="group flex items-center space-x-3 sm:space-x-4 w-full px-3 xs:px-4 sm:px-5 py-3 sm:py-4 rounded-xl font-medium transition-all duration-300 text-gray-700 dark:text-white/90 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/30 dark:hover:bg-white/10 touch-manipulation min-h-[48px] active:scale-[0.98]"
              :class="{ 
                'bg-gray-300/40 dark:bg-white/20 text-gray-900 dark:text-white': route.path === link.to
              }"
              @click="toggleMobile()"
            >
              <!-- Icon -->
              <UIcon 
                :name="link.icon" 
                class="w-5 h-5 transition-all duration-300 flex-shrink-0"
              />
              <span class="text-sm sm:text-base font-medium">{{ link.label }}</span>
              <!-- Subtle hover effect -->
              <div class="absolute inset-0 bg-gray-200/20 dark:bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </NuxtLink>
          </div>          <!-- Color mode toggle for mobile -->
          <div class="mb-3 xs:mb-4 sm:mb-6 px-1 xs:px-2">
            <div class="bg-gray-200/30 dark:bg-white/10 backdrop-blur-sm rounded-xl border border-gray-300/30 dark:border-white/10 p-3 sm:p-4 flex items-center justify-between min-h-[56px]">
              <span class="text-sm font-medium text-gray-700 dark:text-white/90">Tryb kolorów</span>
              <div class="flex-shrink-0">
                <XBtnColorMode />
              </div>
            </div>
          </div>

          <!-- Search for mobile -
            <div class="mb-3 xs:mb-4 sm:mb-6 px-1 xs:px-2">
              <div class="bg-gray-200/30 dark:bg-white/10 backdrop-blur-sm rounded-xl border border-gray-300/30 dark:border-white/10 p-3 sm:p-4 min-h-[56px] flex items-center">
                <div class="w-full">
                  <slot name="search" />
                </div>
              </div>
            </div>
            ->

          <!-- Auth section for mobile -->
          <div v-if="user" class="bg-gray-200/30 dark:bg-white/10 backdrop-blur-sm rounded-xl border border-gray-300/30 dark:border-white/10 p-3 xs:p-4 sm:p-6 mt-3 xs:mt-4 sm:mt-6">
            <div v-if="user" class="space-y-3 sm:space-y-4">
              <!-- User info -->
              <div class="flex items-center space-x-3 sm:space-x-4 px-3 sm:px-4 py-3 sm:py-4 rounded-xl bg-gray-300/30 dark:bg-white/10">
                <UAvatar
                  :src="user?.avatar || '/user-placeholder.png'"
                  :alt="user?.name || 'User'"
                  size="md"
                  class="ring-2 ring-gray-400/40 dark:ring-white/20 flex-shrink-0"
                />
                <div class="min-w-0 flex-1">
                  <div class="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">{{ user?.name || 'User' }}</div>
                  <div class="text-xs sm:text-sm text-gray-600 dark:text-white/70 truncate">{{ user?.email || 'user@example.com' }}</div>
                </div>
              </div>              <!-- User actions -->
              <NuxtLink 
                to="/profile" 
                class="flex items-center space-x-3 w-full px-3 sm:px-4 py-3 sm:py-4 rounded-xl font-medium text-gray-700 dark:text-white/90 hover:text-gray-900 dark:hover:text-white transition-all duration-300 hover:bg-gray-200/30 dark:hover:bg-white/10 touch-manipulation min-h-[48px] active:scale-[0.98]"
                @click="toggleMobile()"
              >
                <UIcon name="i-lucide-user" class="w-5 h-5 flex-shrink-0" />
                <span class="text-sm sm:text-base font-medium">Profil</span>
              </NuxtLink>
              
              <button 
                class="flex items-center space-x-3 w-full px-3 sm:px-4 py-3 sm:py-4 rounded-xl font-medium text-red-600 dark:text-red-300 hover:text-red-700 dark:hover:text-red-200 transition-all duration-300 hover:bg-red-100/50 dark:hover:bg-red-500/20 touch-manipulation min-h-[48px] active:scale-[0.98]"
                @click="signOut(); toggleMobile()"
              >
                <UIcon name="i-lucide-log-out" class="w-5 h-5 flex-shrink-0" />
                <span class="text-sm sm:text-base font-medium">Wyloguj się</span>
              </button>
            </div>
          </div>          <!-- Action Buttons -->
          <div class="flex flex-wrap justify-center items-center gap-2 sm:gap-3 mt-3 xs:mt-4 sm:mt-8 bg-gray-200/30 dark:bg-white/10 backdrop-blur-sm rounded-xl border border-gray-300/30 dark:border-white/10 p-3 xs:p-4 sm:p-6 min-h-[64px]">
            <div class="w-full flex flex-wrap justify-center gap-2 sm:gap-3">
              <slot name="action" />
              <slot name="right" />
            </div>
          </div>
        </div>
      </div>
    </transition>
  </nav>
</template>

<style scoped>
/* Subtle Navbar Styles - Harmonized with Hero Section */
.subtle-navbar {
  will-change: transform, opacity, background-color;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.subtle-navbar.fixed {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* Subtle Navigation Links Container */
.nav-links-container {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

/* Clean Navigation Links */
.nav-link {
  position: relative;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: background-color, color;
}

.nav-link:hover {
  transform: translateY(-1px);
}

.nav-link.router-link-active {
  font-weight: 500;
}

/* Mobile Menu Glassmorphism */
.modern-mobile-menu {
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  will-change: transform, opacity;
  box-shadow: 
    20px 0 60px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.1);
}

.dark .modern-mobile-menu {
  box-shadow: 
    20px 0 60px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.05);
}

/* Mobile Menu Header Gradient */
.logo-mobile {
  filter: brightness(1.1) saturate(1.1);
}

/* Mobile Navigation Links Enhancement */
.modern-mobile-menu .group {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  position: relative;
  will-change: transform, background-color;
}

.modern-mobile-menu .group:hover {
  transform: translateX(4px);
}

.modern-mobile-menu .group::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, 
    rgba(59, 130, 246, 0.05) 0%, 
    rgba(147, 51, 234, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: inherit;
}

.modern-mobile-menu .group:hover::before {
  opacity: 1;
}

/* Performance Optimizations */
.nav-link,
.modern-mobile-menu .group,
.mobile-menu-toggle button,
.logo-container,
.user-dropdown {
  transform: translateZ(0);
  backface-visibility: hidden;
}

/* Smooth Transitions */
* {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Enhanced Button Styles */
.mobile-menu-toggle button {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.1),
    0 1px 4px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  will-change: transform, box-shadow;
}

.dark .mobile-menu-toggle button {
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.2),
    0 1px 4px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.mobile-menu-toggle button:hover {
  transform: translateY(-1px);
  box-shadow: 
    0 6px 24px rgba(0, 0, 0, 0.15),
    0 2px 8px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.dark .mobile-menu-toggle button:hover {
  box-shadow: 
    0 6px 24px rgba(0, 0, 0, 0.3),
    0 2px 8px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

/* User Avatar Enhancement */
.user-dropdown .cursor-pointer {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform, filter;
}

.user-dropdown .cursor-pointer:hover {
  transform: scale(1.05);
  filter: brightness(1.1);
}

/* Color Mode Toggle Enhancement */
.color-mode-wrapper {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* Mobile Overlay Enhancement */
.mobile-menu-overlay {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  background: rgba(0, 0, 0, 0.2);
}

.dark .mobile-menu-overlay {
  background: rgba(0, 0, 0, 0.4);
}

/* Enhanced Gradients */
.bg-gradient-to-r {
  background-image: linear-gradient(
    to right,
    var(--tw-gradient-stops)
  );
}

.bg-gradient-to-br {
  background-image: linear-gradient(
    to bottom right,
    var(--tw-gradient-stops)
  );
}

/* Focus States for Accessibility */
.nav-link:focus-visible,
.modern-mobile-menu .group:focus-visible {
  outline: 2px solid rgb(59, 130, 246);
  outline-offset: 2px;
}

/* Scroll Performance */
@media (prefers-reduced-motion: no-preference) {
  .modern-navbar {
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
    animation: none !important;
  }
}

/* High DPI Display Optimization */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .nav-links-container,
  .modern-mobile-menu {
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }
}

/* Print Styles */
@media print {
  .modern-navbar {
    position: static !important;
    background: white !important;
    backdrop-filter: none !important;
    box-shadow: none !important;
  }
}

/* Very Small Screen Optimizations */
@media (max-width: 320px) {
  .mobile-menu-toggle button {
    width: 36px;
    height: 36px;
  }
  
  .subtle-mobile-menu {
    width: 90% !important;
    max-width: 280px !important;
  }
  
  .subtle-mobile-menu .space-x-3 {
    gap: 0.5rem !important;
  }
  
  .subtle-mobile-menu .px-3 {
    padding-left: 0.5rem !important;
    padding-right: 0.5rem !important;
  }
}

/* Safe Area Support for Modern Mobile Devices */
@supports (padding: env(safe-area-inset-top)) {
  .subtle-mobile-menu {
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
  }
}

/* Enhanced Touch Interactions */
@media (hover: none) and (pointer: coarse) {
  .nav-link:hover,
  .modern-mobile-menu .group:hover {
    transform: none;
  }
  
  .nav-link:active,
  .modern-mobile-menu .group:active {
    transform: scale(0.98);
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  .mobile-menu-toggle button:active {
    transform: scale(0.95);
  }
}

/* Improved Scroll Behavior for Mobile Menu */
.subtle-mobile-menu {
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
}

/* Better Focus Indicators for Mobile */
@media (max-width: 1024px) {
  .nav-link:focus-visible,
  .modern-mobile-menu .group:focus-visible,
  .mobile-menu-toggle button:focus-visible {
    outline: 3px solid rgb(59, 130, 246);
    outline-offset: 2px;
  }
}
</style>