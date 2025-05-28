<script setup lang="ts">
// SEO Meta
useSeoMeta({
  title: 'Funkcje - ATP System',
  description: 'Odkryj wszystkie funkcje systemu ATP - zarządzanie zawodnikami, treningami, analizy, raporty i wiele więcej.',
  ogTitle: 'Funkcje - ATP System',
  ogDescription: 'Kompleksowe rozwiązanie do zarządzania sportowcami z zaawansowanymi funkcjami analitycznymi.',
  ogImage: '/images/features-og.jpg',
  twitterCard: 'summary_large_image'
})

// Features data
const mainFeatures = [
  {
    icon: 'i-lucide-users',
    title: 'Zarządzanie Zawodnikami',
    description: 'Kompleksowa baza danych zawodników z profilemi, historią treningów i wynikami.',
    features: [
      'Profile zawodników z szczegółowymi danymi',
      'Historia treningów i postępów',
      'Śledzenie kontuzji i rehabilitacji',
      'System oceny i rankingu'
    ],
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: 'i-lucide-activity',
    title: 'Planowanie Treningów',
    description: 'Zaawansowane narzędzia do tworzenia i zarządzania planami treningowymi.',
    features: [
      'Kreator planów treningowych',
      'Kalendarz treningów',
      'Automatyczne przypomnienia',
      'Adaptacyjne dostosowanie intensywności'
    ],
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: 'i-lucide-bar-chart-3',
    title: 'Analityka i Raporty',
    description: 'Szczegółowe analizy wydajności i automatyczne generowanie raportów.',
    features: [
      'Wykresy postępów i trendów',
      'Analizy wydajności',
      'Raporty dla trenerów i zawodników',
      'Porównania między zawodnikami'
    ],
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: 'i-lucide-calendar',
    title: 'Zarządzanie Wydarzeniami',
    description: 'Organizacja zawodów, obozów treningowych i innych wydarzeń sportowych.',
    features: [
      'Kalendarz zawodów i wydarzeń',
      'Rejestracja uczestników',
      'Zarządzanie logistyką',
      'Integracja z calendarzami zewnętrznymi'
    ],
    color: 'from-orange-500 to-red-500'
  },
  {
    icon: 'i-lucide-heart-pulse',
    title: 'Monitoring Zdrowia',
    description: 'Śledzenie stanu zdrowia zawodników i wczesne wykrywanie problemów.',
    features: [
      'Monitoring parametrów życiowych',
      'Śledzenie kontuzji',
      'Plany rehabilitacji',
      'Integracja z urządzeniami medycznymi'
    ],
    color: 'from-red-500 to-rose-500'
  },
  {
    icon: 'i-lucide-shield-check',
    title: 'Bezpieczeństwo Danych',
    description: 'Najwyższy poziom bezpieczeństwa i ochrony danych osobowych.',
    features: [
      'Szyfrowanie end-to-end',
      'Zgodność z RODO',
      'Kopie zapasowe w chmurze',
      'Kontrola dostępu oparta na rolach'
    ],
    color: 'from-indigo-500 to-purple-500'
  }
]

const additionalFeatures = [
  {
    icon: 'i-lucide-smartphone',
    title: 'Aplikacja Mobilna',
    description: 'Pełny dostęp do systemu z urządzeń mobilnych'
  },
  {
    icon: 'i-lucide-cloud',
    title: 'Synchronizacja w Chmurze',
    description: 'Automatyczna synchronizacja danych między urządzeniami'
  },
  {
    icon: 'i-lucide-message-circle',
    title: 'Komunikacja',
    description: 'Wbudowany system komunikacji między trenerami a zawodnikami'
  },
  {
    icon: 'i-lucide-settings',
    title: 'Personalizacja',
    description: 'Dostosowanie interfejsu do indywidualnych potrzeb'
  },
  {
    icon: 'i-lucide-globe',
    title: 'Wielojęzyczność',
    description: 'Obsługa wielu języków dla międzynarodowych zespołów'
  },
  {
    icon: 'i-lucide-zap',
    title: 'Integracje API',
    description: 'Łatwa integracja z zewnętrznymi systemami i urządzeniami'
  }
]

// Animation refs
const heroRef = ref(null)
const featuresRef = ref(null)

// Scroll animations
onMounted(() => {
  // Add scroll-based animations here if needed
})
</script>

<template>
    <NuxtLayout>
        <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <!-- Hero Section -->
          <section ref="heroRef" class="relative pt-20 sm:pt-24 lg:pt-32 pb-16 sm:pb-20 lg:pb-24 overflow-hidden">
            <!-- Background Elements -->
            <div class="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 dark:from-blue-900/20 dark:via-transparent dark:to-purple-900/20"></div>
            <div class="absolute top-0 left-0 w-full h-full">
              <div class="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 dark:bg-blue-600/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl animate-pulse"></div>
              <div class="absolute top-40 right-10 w-96 h-96 bg-purple-200/30 dark:bg-purple-600/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl animate-pulse delay-1000"></div>
            </div>
            
            <div class="relative container mx-auto px-4 sm:px-6 lg:px-8">
              <div class="text-center max-w-4xl mx-auto">
                <!-- Badge -->
                <div class="inline-flex items-center space-x-2 bg-blue-100/80 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50">
                  <UIcon name="i-lucide-zap" class="w-4 h-4" />
                  <span>Zaawansowane Funkcje ATP</span>
                </div>
                
                <!-- Main Title -->
                <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-6 leading-tight">
                  Wszystko Czego Potrzebujesz
                  <br class="hidden sm:block">
                  <span class="text-blue-600 dark:text-blue-400">w Jednym Systemie</span>
                </h1>
                
                <!-- Description -->
                <p class="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                  Odkryj kompleksowy zestaw narzędzi do zarządzania sportowcami, analiz wydajności i optymalizacji treningów. 
                  ATP System łączy w sobie wszystkie niezbędne funkcje w jednej, intuicyjnej platformie.
                </p>
                
                <!-- CTA Buttons -->
                <div class="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <UButton
                    to="/pricing"
                    size="lg"
                    class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <UIcon name="i-lucide-arrow-right" class="w-5 h-5 mr-2" />
                    Rozpocznij Teraz
                  </UButton>
                  <UButton
                    to="/contact"
                    variant="outline"
                    size="lg"
                    class="border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 px-8 py-3 text-lg font-semibold transition-all duration-300"
                  >
                    <UIcon name="i-lucide-phone" class="w-5 h-5 mr-2" />
                    Skontaktuj się
                  </UButton>
                </div>
              </div>
            </div>
          </section>
      
          <!-- Main Features Section -->
          <section ref="featuresRef" class="py-16 sm:py-20 lg:py-24 relative">
            <div class="container mx-auto px-4 sm:px-6 lg:px-8">
              <!-- Section Header -->
              <div class="text-center mb-16">
                <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                  Główne <span class="text-blue-600 dark:text-blue-400">Funkcje</span>
                </h2>
                <p class="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Poznaj szczegółowo wszystkie funkcje, które czynią ATP System najlepszym wyborem dla profesjonalnych zespołów sportowych.
                </p>
              </div>
      
              <!-- Features Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-10">
                <div
                  v-for="(feature, index) in mainFeatures"
                  :key="feature.title"
                  class="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 lg:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300/50 dark:hover:border-blue-600/50 transform hover:scale-105"
                >
                  <!-- Gradient Background -->
                  <div class="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl"
                    :class="feature.color">
                  </div>
                  
                  <!-- Icon -->
                  <div class="relative mb-6">
                    <div class="w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-4 shadow-lg"
                      :class="feature.color">
                      <UIcon :name="feature.icon" class="w-8 h-8 text-white" />
                    </div>
                  </div>
                  
                  <!-- Content -->
                  <div class="relative">
                    <h3 class="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      {{ feature.title }}
                    </h3>
                    <p class="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                      {{ feature.description }}
                    </p>
                    
                    <!-- Feature List -->
                    <ul class="space-y-3">
                      <li 
                        v-for="item in feature.features"
                        :key="item"
                        class="flex items-start space-x-3 text-sm text-gray-600 dark:text-gray-300"
                      >
                        <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{{ item }}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
      
          <!-- Additional Features Section -->
          <section class="py-16 sm:py-20 bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm">
            <div class="container mx-auto px-4 sm:px-6 lg:px-8">
              <!-- Section Header -->
              <div class="text-center mb-16">
                <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Dodatkowe <span class="text-purple-600 dark:text-purple-400">Możliwości</span>
                </h2>
                <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Oprócz głównych funkcji, ATP System oferuje szereg dodatkowych narzędzi i integracji.
                </p>
              </div>
      
              <!-- Additional Features Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                <div
                  v-for="feature in additionalFeatures"
                  :key="feature.title"
                  class="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 hover:border-purple-300/50 dark:hover:border-purple-600/50"
                >
                  <!-- Icon -->
                  <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <UIcon :name="feature.icon" class="w-6 h-6 text-white" />
                  </div>
                  
                  <!-- Content -->
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {{ feature.title }}
                  </h3>
                  <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {{ feature.description }}
                  </p>
                </div>
              </div>
            </div>
          </section>
      
          <!-- CTA Section -->
          <section class="py-16 sm:py-20 lg:py-24 relative overflow-hidden">
            <!-- Background -->
            <div class="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-800 dark:via-purple-800 dark:to-blue-900"></div>
            <div class="absolute inset-0 bg-black/20"></div>
            
            <!-- Animated Background Elements -->
            <div class="absolute top-0 left-0 w-full h-full overflow-hidden">
              <div class="absolute -top-40 -left-40 w-80 h-80 bg-white/10 rounded-full animate-pulse"></div>
              <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-white/5 rounded-full animate-pulse delay-1000"></div>
            </div>
            
            <div class="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                Gotowy na Następny Poziom?
              </h2>
              <p class="text-lg sm:text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                Dołącz do tysięcy trenerów i sportowców, którzy już korzystają z ATP System. 
                Rozpocznij swoją podróż w kierunku lepszych wyników już dziś.
              </p>
              
              <div class="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <UButton
                  to="/pricing"
                  size="xl"
                  class="bg-white text-blue-600 hover:bg-gray-100 px-10 py-4 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <UIcon name="i-lucide-rocket" class="w-6 h-6 mr-2" />
                  Rozpocznij Bezpłatny Trial
                </UButton>
                <UButton
                  to="/contact"
                  variant="outline"
                  size="xl"
                  class="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-10 py-4 text-lg font-bold transition-all duration-300"
                >
                  <UIcon name="i-lucide-calendar" class="w-6 h-6 mr-2" />
                  Umów Demo
                </UButton>
              </div>
            </div>
          </section>
        </div>
    </NuxtLayout>
</template>

<style scoped>
/* Custom animations */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float 6s ease-in-out infinite;
  animation-delay: 3s;
}

/* Smooth scroll behavior */
html {
  scroll-behavior: smooth;
}

/* Enhanced hover effects */
.group:hover .transform {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Backdrop blur support */
@supports (backdrop-filter: blur(10px)) {
  .backdrop-blur-sm {
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
}

/* Focus states for accessibility */
.focus\:outline-blue:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

/* Performance optimizations */
.transform {
  will-change: transform;
}

.transition-all {
  will-change: transform, opacity, box-shadow;
}
</style>
