<script lang="ts" setup>
// Aktualny rok do stopki
const currentYear = new Date().getFullYear()

// Social media links
const socialLinks = [
  {
    name: 'Facebook',
    url: 'https://facebook.com/atpsystem',
    icon: 'i-lucide-facebook'
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com/atpsystem',
    icon: 'i-lucide-twitter'
  },
  {
    name: 'Instagram',
    url: 'https://instagram.com/atpsystem',
    icon: 'i-lucide-instagram'
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/company/atpsystem',
    icon: 'i-lucide-linkedin'
  },
  {
    name: 'YouTube',
    url: 'https://youtube.com/@atpsystem',
    icon: 'i-lucide-youtube'
  }
]

// Footer navigation links
const footerLinks = [
  {
    title: 'Produkt',
    links: [
      { name: 'Funkcje', url: '/features' },
      { name: 'Cennik', url: '/pricing' },
      { name: 'Demo', url: '/demo' },
      { name: 'Integracje', url: '/integrations' },
      { name: 'Aktualizacje', url: '/updates' }
    ]
  },
  {
    title: 'Rozwiązania',
    links: [
      { name: 'Dla trenerów', url: '/coaches' },
      { name: 'Dla klubów', url: '/clubs' },
      { name: 'Dla zawodników', url: '/athletes' },
      { name: 'Dla szkół', url: '/schools' },
      { name: 'Enterprise', url: '/enterprise' }
    ]
  },
  {
    title: 'Wsparcie',
    links: [
      { name: 'Centrum pomocy', url: '/help' },
      { name: 'Dokumentacja', url: '/docs' },
      { name: 'FAQ', url: '/faq' },
      { name: 'Kontakt', url: '/contact' },
      { name: 'Status systemu', url: '/status' }
    ]
  },
  {
    title: 'Firma',
    links: [
      { name: 'O nas', url: '/about' },
      { name: 'Blog', url: '/blog' },
      { name: 'Kariera', url: '/careers' },
      { name: 'Partnerzy', url: '/partners' },
      { name: 'Media', url: '/media' }
    ]
  }
]

// Legal links for bottom footer
const legalLinks = [
  { name: 'Polityka prywatności', url: '/legal/privacy' },
  { name: 'Regulamin', url: '/legal/terms' },
  { name: 'Cookies', url: '/legal/cookies' },
  { name: 'GDPR', url: '/legal/gdpr' }
]
</script>

<template>
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
          </p>          <div class="flex space-x-3 mb-6">
            <a 
              v-for="social in socialLinks" 
              :key="social.name" 
              :href="social.url" 
              :aria-label="social.name"
              class="social-icon bg-gray-100 dark:bg-gray-800 hover:bg-primary-100 dark:hover:bg-primary-900/30 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
            >
              <UIcon :name="social.icon" class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 social-icon" />
            </a>
          </div>
        </div>
        
        <!-- Links -->
        <div v-for="section in footerLinks" :key="section.title" class="lg:col-span-1">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4 section-header">
            {{ section.title }}
          </h3>
          <ul class="space-y-2">
            <li v-for="link in section.links" :key="link.name">
              <NuxtLink 
                :to="link.url" 
                class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors footer-link"
              >
                {{ link.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
    
    <!-- Newsletter -->
    <div class="newsletter-section py-8">
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
              <UButton color="primary" class="btn-gradient">Zapisz się</UButton>
            </form>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Bottom footer -->
    <div class="bg-white dark:bg-gray-900 py-6 border-t border-gray-200 dark:border-gray-800 footer-gradient">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="text-gray-600 dark:text-gray-400 text-sm">
            &copy; {{ currentYear }} ATP System. Wszelkie prawa zastrzeżone.
          </div>          <div class="mt-4 md:mt-0 flex flex-wrap gap-4">
            <NuxtLink 
              v-for="link in legalLinks" 
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

<style scoped>
/* Enhanced footer styles */
.footer-link:hover {
  transform: translateX(2px);
  transition: transform 0.2s ease;
}

.social-icon:hover {
  transform: translateY(-2px) scale(1.1);
  transition: all 0.3s ease;
}

.newsletter-section {
  background: linear-gradient(135deg, var(--color-gray-50) 0%, var(--color-gray-100) 100%);
}

.dark .newsletter-section {
  background: linear-gradient(135deg, var(--color-gray-800) 0%, var(--color-gray-900) 100%);
}

.footer-gradient {
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.05) 100%);
}

.dark .footer-gradient {
  background: linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.05) 100%);
}

/* Improved hover effects */
.hover-scale:hover {
  transform: scale(1.02);
  transition: transform 0.2s ease;
}

.btn-gradient {
  background: linear-gradient(135deg, var(--color-primary-600), var(--color-primary-500));
  transition: all 0.3s ease;
}

.btn-gradient:hover {
  background: linear-gradient(135deg, var(--color-primary-700), var(--color-primary-600));
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Responsive text adjustments */
@media (max-width: 768px) {
  .footer-text-responsive {
    font-size: 0.875rem;
    line-height: 1.25rem;
  }
}

/* Animation for section headers */
.section-header {
  position: relative;
}

.section-header::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 30px;
  height: 2px;
  background: linear-gradient(90deg, var(--color-primary-500), var(--color-primary-600));
  border-radius: 1px;
}
</style>
