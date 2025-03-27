<script lang="ts" setup>
const { loggedIn, user } = useUserSession()

// Aktualny rok do stopki
const currentYear = new Date().getFullYear()

// Linki do mediów społecznościowych
const socialLinks = [
  { name: 'Facebook', icon: 'i-lucide-facebook', url: '#' },
  { name: 'Twitter', icon: 'i-lucide-twitter', url: '#' },
  { name: 'LinkedIn', icon: 'i-lucide-linkedin', url: '#' },
  { name: 'Instagram', icon: 'i-lucide-instagram', url: '#' },
  { name: 'YouTube', icon: 'i-lucide-youtube', url: '#' }
]

// Sekcje linków w stopce
const footerLinks = [
  {
    title: 'System',
    links: [
      { name: 'Funkcje', url: '/#features' },
      { name: 'Cennik', url: '/pricing' },
      { name: 'FAQ', url: '/faq' },
      { name: 'Przewodnik', url: '/guides' },
      { name: 'Blog', url: '/blog' }
    ]
  },
  {
    title: 'Firma',
    links: [
      { name: 'O nas', url: '/about' },
      { name: 'Zespół', url: '/about#team' },
      { name: 'Kariera', url: '/careers' },
      { name: 'Partnerzy', url: '/partners' },
      { name: 'Prasa', url: '/press' }
    ]
  },
  {
    title: 'Wsparcie',
    links: [
      { name: 'Kontakt', url: '/contact' },
      { name: 'Pomoc', url: '/help' },
      { name: 'Dokumentacja', url: '/docs' },
      { name: 'Status systemu', url: '/status' },
      { name: 'Szkolenia', url: '/training' }
    ]
  },
  {
    title: 'Prawne',
    links: [
      { name: 'Regulamin', url: '/terms' },
      { name: 'Prywatność', url: '/privacy' },
      { name: 'Cookies', url: '/cookies' },
      { name: 'Licencje', url: '/licenses' },
      { name: 'RODO', url: '/gdpr' }
    ]
  }
]
</script>

<template>
  <XLayout>
    <template #header>
      <UAlert
        title="Alpha version"
        description="The site is currently in alpha (early development) phase. Functionality may be limited and errors are possible. All data on the home page is false."
        color="warning"
        variant="subtle"
        :ui="{
          wrapper: 'mb-4 mx-auto container max-w-7xl'
        }"
        class="w-full"
      />

      <div class="w-full flex flex-col lg:flex-row gap-8">
        <x-navbar :container="true" :links="[
          { name: 'Home', to: '/' },
          { name: 'About', to: '/about' },
          { name: 'Contact', to: '/contact' },
        ]">
          <template #logo>
            <XLogo />
          </template>

          <template #action>
            <AuthState>
              <div v-if="!loggedIn" class="flex items-center space-x-4">
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

              <XDropdownManageAccount v-else :user="user" />
            </AuthState>
          </template>

        </x-navbar>
      </div>
    </template>

    <template #main>
      <slot />
    </template>

    <template #footer>
      <footer class="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <!-- Footer main -->
        <div class="container mx-auto px-4 py-12">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            <!-- Company info -->
            <div class="lg:col-span-2">
              <div class="mb-4">
                <XLogo />
              </div>
              <p class="text-gray-600 dark:text-gray-400 mb-4">
                ATP System - profesjonalne rozwiązanie do zarządzania treningiem i analityki sportowej, które pomaga trenerom i zawodnikom osiągać maksymalne wyniki.
              </p>
              <div class="flex space-x-3 mb-6">
                <a 
                  v-for="social in socialLinks" 
                  :key="social.name" 
                  :href="social.url" 
                  :aria-label="social.name"
                  class="bg-gray-100 dark:bg-gray-800 hover:bg-primary-100 dark:hover:bg-primary-900/30 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                >
                  <UIcon :name="social.icon" class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400" />
                </a>
              </div>
              <div class="flex items-center">
                <img src="/images/app-store.webp" alt="App Store" class="h-10 mr-2 grayscale hover:grayscale-0 transition-all opacity-80 hover:opacity-100">
                <img src="/images/google-play.webp" alt="Google Play" class="h-10 grayscale hover:grayscale-0 transition-all opacity-80 hover:opacity-100">
              </div>
            </div>
            
            <!-- Links -->
            <div v-for="section in footerLinks" :key="section.title" class="lg:col-span-1">
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                {{ section.title }}
              </h3>
              <ul class="space-y-2">
                <li v-for="link in section.links" :key="link.name">
                  <NuxtLink 
                    :to="link.url" 
                    class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {{ link.name }}
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <!-- Newsletter -->
        <div class="bg-gray-50 dark:bg-gray-800 py-8">
          <div class="container mx-auto px-4">
            <div class="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Bądź na bieżąco</h3>
                <p class="text-gray-600 dark:text-gray-400">Otrzymuj najnowsze wiadomości i aktualizacje od ATP System</p>
              </div>
              <div class="w-full md:w-auto">
                <form class="flex flex-col sm:flex-row gap-3">
                  <UInput 
                    placeholder="Twój adres email" 
                    type="email" 
                    class="min-w-[250px]"
                    trailing-icon="i-lucide-mail"
                    :ui="{ 
                      trailingIcon: 'text-gray-400'
                    }"
                  />
                  <UButton color="primary">Zapisz się</UButton>
                </form>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Bottom footer -->
        <div class="bg-white dark:bg-gray-900 py-6 border-t border-gray-200 dark:border-gray-800">
          <div class="container mx-auto px-4">
            <div class="flex flex-col md:flex-row justify-between items-center">
              <div class="text-gray-600 dark:text-gray-400 text-sm">
                &copy; {{ currentYear }} ATP System. Wszelkie prawa zastrzeżone.
              </div>
              <div class="mt-4 md:mt-0 flex flex-wrap gap-4">
                <NuxtLink 
                  v-for="link in footerLinks[3]?.links || []" 
                  :key="link.name" 
                  :to="link.url" 
                  class="text-xs text-gray-500 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  {{ link.name }}
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </template>
  </XLayout>
</template>

<style scoped>
/* Dodatkowe style dla stopki */
.footer-icon-link:hover {
  transform: translateY(-2px);
}
</style>