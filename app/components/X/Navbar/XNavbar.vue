<script setup lang="ts">
defineProps({
  isShowMenu: {
    type: Boolean,
    default: false,
  },
  container: {
    type: Boolean,
    default: false,
  },
});
const { mainNavigationItems, userDropdownItems, mobileNavigationItems, userNavigationMobileItems } = useNavigationItems()
const { navbar, toggleMobile, handleScroll, closeMobile } = useNavbar();
const route = useRoute();
const { user, isAuthenticated } = useAuth();

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

<template>
  <!-- Modern Glassmorphism Navbar with UNavigationMenu -->
  <nav id="main-nav" class="w-full box-border transition-all duration-700 ease-out modern-navbar"
    :class="[
      navbar.isScroll 
        ? 'fixed h-14 sm:h-20 top-0 left-0 bg-white/90 dark:bg-slate-900/90 z-50 border-b border-gray-200/30 dark:border-white/10 shadow-lg backdrop-blur-xl' 
        : 'sticky h-16 sm:h-20 top-0 left-0 z-50 bg-white/90 dark:bg-slate-900/90  lg:bg-transparent lg:dark:bg-transparent',
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
      </div>
      
      <!-- Center Section: Desktop Navigation Menu (Hidden on mobile) -->
      <div class="hidden lg:flex items-center justify-center flex-1">
        <div class="nav-menu-container transition-all duration-500 rounded-full px-4 py-2">
            <!-- Main Navigation Menu -->
          <UNavigationMenu
            :items="mainNavigationItems"
            orientation="horizontal"
            arrow
            highlight
            highlight-color="primary"
            variant="pill"
            class="main-navigation-menu"
            :ui="{
              root: 'flex items-center justify-center gap-1',
              link: 'px-4 py-2 font-medium text-sm transition-all duration-300',
              linkLeadingIcon: 'w-4 h-4',
              content: 'min-w-80',
              childList: 'grid gap-1 p-2',
              childLink: 'px-3 py-2 rounded-md transition-colors',
              viewport: 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-gray-200/30 dark:border-white/10'
            }"
          />
        </div>
      </div>
      
      <!-- Right Section: Actions & User -->
      <div class="flex items-center space-x-2 sm:space-x-4 z-20">
        <!-- Search slot - hidden on very small screens -->
        <div class="hidden sm:flex">
          <slot name="search" />
        </div>
        
        <!-- Color mode toggle -->
        <div class="color-mode-wrapper hidden sm:block">
          <XBtnColorMode />
        </div>
        
        <!-- Action buttons -->
        <div class="actions-wrapper hidden sm:block">
          <slot name="action" />
        </div>        <!-- User Navigation Menu or auth buttons -->
        <div class="user-section flex items-center">
          <div v-if="!user" class="flex items-center space-x-4">
            <UTooltip text="Login">
              <UButton
                to="/auth/login"
                icon="i-line-md-person-filled"
                color="primary"
                variant="ghost"
                square
              />
            </UTooltip>

            <UTooltip text="Register">
              <UButton
                to="/auth/register"
                variant="ghost"
                color="primary"
                icon="i-line-md-person-add-filled"
                square
              />
            </UTooltip>
          </div>

          <div v-if="isAuthenticated" class="user-navigation hidden sm:block">
            <AuthState>
              <XDropdownManageAccount :user="user" :items="userDropdownItems" />
            </AuthState>
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
            class="backdrop-blur-sm bg-white/20 dark:bg-white/10 hover:bg-white/30 dark:hover:bg-white/20 border border-gray-300/30 dark:border-white/20"
          />
        </div>
      </div>
    </div>
    
    <!-- Mobile Menu Overlay -->
    <div v-if="navbar.isMobile" 
      class="fixed inset-0 bg-gray-100/60 dark:bg-gray-900/60 backdrop-blur-sm lg:hidden z-40"
      @click="toggleMobile()">
    </div>
    
    <!-- Mobile Menu with UNavigationMenu -->
    <transition 
      enter-active-class="transition ease-out duration-300" 
      enter-from-class="transform -translate-x-full opacity-0" 
      enter-to-class="transform translate-x-0 opacity-100" 
      leave-active-class="transition ease-in duration-300" 
      leave-from-class="transform translate-x-0 opacity-100" 
      leave-to-class="transform -translate-x-full opacity-0">
      
      <div v-if="navbar.isMobile" 
        class="h-screen w-[85%] xs:w-[90%] max-w-xs sm:max-w-sm fixed top-0 left-0 lg:hidden z-50 
               bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl
               border-r border-gray-200/30 dark:border-white/10
               transition-all duration-300 overflow-y-auto modern-mobile-menu"
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
        
        <!-- Mobile Menu Content with UNavigationMenu -->
        <div class="w-full py-3 xs:py-4 sm:py-6 px-2 xs:px-3 sm:px-4">
          
          <!-- Mobile Navigation Menu -->
          <div class="mb-6">            
            <UNavigationMenu
              :items="mobileNavigationItems"
              orientation="vertical"
              variant="pill"
              highlight
              highlight-color="primary"
              type="multiple"
              class="mobile-navigation-menu w-full"
              :ui="{
                root: 'w-full',
                list: 'w-full space-y-2',
                label: 'px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider',
                link: 'w-full px-3 py-3 rounded-xl font-medium text-sm transition-all duration-300 min-h-[48px] active:scale-[0.98]',
                linkLeadingIcon: 'w-5 h-5 flex-shrink-0',
                content: 'mt-2 space-y-1',
                childLink: 'w-full px-4 py-2 ml-8 rounded-lg text-sm transition-colors',
                childLinkIcon: 'w-4 h-4 flex-shrink-0'
              }"
              @click="toggleMobile()"
            />
          </div>
          
          <!-- Color mode toggle for mobile -->
          <div class="mb-4 px-1">
            <div class="bg-gray-200/30 dark:bg-white/10 backdrop-blur-sm rounded-xl border border-gray-300/30 dark:border-white/10 p-4 flex items-center justify-between min-h-[56px]">
              <span class="text-sm font-medium text-gray-700 dark:text-white/90">Tryb kolorów</span>
              <div class="flex-shrink-0">
                <XBtnColorMode />
              </div>
            </div>
          </div>
          
          <!-- User section for mobile -->
          <div v-if="isAuthenticated && user" class="mb-4">
            <div class="bg-gray-200/30 dark:bg-white/10 backdrop-blur-sm rounded-xl border border-gray-300/30 dark:border-white/10 p-4">
              
              <!-- User info -->
              <div class="flex items-center space-x-3 mb-4 p-3 rounded-xl bg-gray-300/30 dark:bg-white/10">
                <UAvatar
                  :src="user?.avatar || '/user-placeholder.png'"
                  :alt="user?.name || 'User'"
                  size="md"
                  class="ring-2 ring-gray-400/40 dark:ring-white/20 flex-shrink-0"
                />
                <div class="min-w-0 flex-1">
                  <div class="font-semibold text-gray-900 dark:text-white text-sm truncate">{{ user?.name || 'User' }}</div>
                  <div class="text-xs text-gray-600 dark:text-white/70 truncate">{{ user?.email || 'user@example.com' }}</div>
                </div>
              </div>
                <!-- User Navigation Menu for Mobile -->
              <UNavigationMenu
                :items="[
                  [
                    {
                      label: 'Opcje użytkownika',
                      type: 'label'
                    },
                    ...userNavigationMobileItems.flat()
                  ]
                ]"
                orientation="vertical"
                variant="link"
                class="user-mobile-menu w-full"
                :ui="{
                  root: 'w-full',
                  list: 'w-full space-y-1',
                  label: 'px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400',
                  link: 'w-full px-3 py-3 rounded-lg font-medium text-sm transition-all duration-300 min-h-[44px] active:scale-[0.98]',
                  linkLeadingIcon: 'w-4 h-4 flex-shrink-0'
                }"
                @click="toggleMobile()"
              />
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex flex-wrap justify-center items-center gap-2 mt-6 bg-gray-200/30 dark:bg-white/10 backdrop-blur-sm rounded-xl border border-gray-300/30 dark:border-white/10 p-4 min-h-[64px]">
            <div class="w-full flex flex-wrap justify-center gap-2">
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

/* Documentation Navigation Menu Styling */
.docs-nav-menu :deep(.relative) {
  display: contents;
}

.docs-nav-menu :deep([data-reka-navigation-menu-trigger]) {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: rgb(55 65 81);
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.dark .docs-nav-menu :deep([data-reka-navigation-menu-trigger]) {
  color: rgba(255, 255, 255, 0.9);
}

.docs-nav-menu :deep([data-reka-navigation-menu-trigger]:hover) {
  color: rgb(17 24 39);
  background-color: rgba(229, 231, 235, 0.3);
  transform: translateY(-1px);
}

.dark .docs-nav-menu :deep([data-reka-navigation-menu-trigger]:hover) {
  color: rgb(255, 255, 255);
  background-color: rgba(255, 255, 255, 0.1);
}

.docs-nav-menu :deep([data-reka-navigation-menu-trigger][data-state="open"]),
.docs-nav-menu :deep([data-reka-navigation-menu-trigger][data-active="true"]),
.docs-nav-menu.docs-active :deep([data-reka-navigation-menu-trigger]) {
  background-color: rgba(209, 213, 219, 0.4);
  color: rgb(17 24 39);
  box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05);
}

.dark .docs-nav-menu :deep([data-reka-navigation-menu-trigger][data-state="open"]),
.dark .docs-nav-menu :deep([data-reka-navigation-menu-trigger][data-active="true"]),
.dark .docs-nav-menu.docs-active :deep([data-reka-navigation-menu-trigger]) {
  background-color: rgba(255, 255, 255, 0.2);
  color: rgb(255, 255, 255);
}

.docs-nav-menu :deep([data-reka-navigation-menu-trigger][data-active="true"])::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, 
    rgba(59, 130, 246, 0.3) 0%, 
    rgba(147, 51, 234, 0.3) 100%);
  border-radius: inherit;
  z-index: -1;
}

.dark .docs-nav-menu :deep([data-reka-navigation-menu-trigger][data-active="true"])::before {
  background: linear-gradient(to right, 
    rgba(59, 130, 246, 0.2) 0%, 
    rgba(147, 51, 234, 0.2) 100%);
}

.docs-nav-menu :deep([data-reka-navigation-menu-trigger]) .group:hover::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(156, 163, 175, 0.2);
  border-radius: inherit;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.dark .docs-nav-menu :deep([data-reka-navigation-menu-trigger]) .group:hover::after {
  background: rgba(255, 255, 255, 0.05);
}

.docs-nav-menu :deep([data-reka-navigation-menu-trigger]:hover) .group::after {
  opacity: 1;
}

.docs-nav-menu :deep([data-reka-navigation-menu-icon]) {
  width: 1rem;
  height: 1rem;
  position: relative;
  z-index: 10;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.docs-nav-menu :deep([data-reka-navigation-menu-label]) {
  position: relative;
  z-index: 10;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
}

.docs-nav-menu :deep([data-reka-navigation-menu-trailing-icon]) {
  width: 0.75rem;
  height: 0.75rem;
  position: relative;
  z-index: 10;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.docs-nav-menu :deep([data-reka-navigation-menu-content]) {
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  background-color: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(229, 231, 235, 0.3);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border-radius: 0.75rem;
  padding: 0.5rem;
}

.dark .docs-nav-menu :deep([data-reka-navigation-menu-content]) {
  background-color: rgba(15, 23, 42, 0.95);
  border-color: rgba(255, 255, 255, 0.1);
}

.docs-nav-menu :deep([data-reka-navigation-menu-child-link]) {
  padding: 0.75rem;
  border-radius: 0.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.docs-nav-menu :deep([data-reka-navigation-menu-child-link]:hover) {
  background-color: rgba(243, 244, 246, 0.5);
}

.dark .docs-nav-menu :deep([data-reka-navigation-menu-child-link]:hover) {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Mobile Navigation Menu Styling */
.docs-nav-menu-mobile :deep([data-reka-navigation-menu-trigger]) {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: rgb(55 65 81);
  min-height: 3rem;
  -webkit-tap-highlight-color: transparent;
}

@media (min-width: 640px) {
  .docs-nav-menu-mobile :deep([data-reka-navigation-menu-trigger]) {
    gap: 1rem;
    padding: 0.75rem 1.25rem;
  }
}

.dark .docs-nav-menu-mobile :deep([data-reka-navigation-menu-trigger]) {
  color: rgba(255, 255, 255, 0.9);
}

.docs-nav-menu-mobile :deep([data-reka-navigation-menu-trigger]:hover) {
  color: rgb(17 24 39);
  background-color: rgba(229, 231, 235, 0.3);
}

.dark .docs-nav-menu-mobile :deep([data-reka-navigation-menu-trigger]:hover) {
  color: rgb(255, 255, 255);
  background-color: rgba(255, 255, 255, 0.1);
}

.docs-nav-menu-mobile :deep([data-reka-navigation-menu-trigger]:active) {
  transform: scale(0.98);
}

.docs-nav-menu-mobile :deep([data-reka-navigation-menu-trigger][data-state="open"]),
.docs-nav-menu-mobile :deep([data-reka-navigation-menu-trigger][data-active="true"]) {
  background-color: rgba(209, 213, 219, 0.4);
  color: rgb(17 24 39);
}

.dark .docs-nav-menu-mobile :deep([data-reka-navigation-menu-trigger][data-state="open"]),
.dark .docs-nav-menu-mobile :deep([data-reka-navigation-menu-trigger][data-active="true"]) {
  background-color: rgba(255, 255, 255, 0.2);
  color: rgb(255, 255, 255);
}

.docs-nav-menu-mobile :deep([data-reka-navigation-menu-icon]) {
  width: 1.25rem;
  height: 1.25rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}

.docs-nav-menu-mobile :deep([data-reka-navigation-menu-label]) {
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  flex: 1;
  text-align: left;
}

@media (min-width: 640px) {
  .docs-nav-menu-mobile :deep([data-reka-navigation-menu-label]) {
    font-size: 1rem;
    line-height: 1.5rem;
  }
}

.docs-nav-menu-mobile :deep([data-reka-navigation-menu-trailing-icon]) {
  width: 1rem;
  height: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}

.docs-nav-menu-mobile :deep([data-reka-navigation-menu-child-link]) {
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-left: 2rem;
}

.docs-nav-menu-mobile :deep([data-reka-navigation-menu-child-link]:hover) {
  background-color: rgba(243, 244, 246, 0.5);
}

.dark .docs-nav-menu-mobile :deep([data-reka-navigation-menu-child-link]:hover) {
  background-color: rgba(255, 255, 255, 0.1);
}
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