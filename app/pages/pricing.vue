<script setup lang="ts">
// SEO Meta
useSeoMeta({
  title: 'Cennik - ATP System',
  description: 'Poznaj nasze plany cenowe. Wybierz rozwiązanie idealne dla Twojej organizacji sportowej - od planu startowego po enterprise.',
  ogTitle: 'Cennik - ATP System',
  ogDescription: 'Przejrzyste plany cenowe dla każdej organizacji sportowej. Rozpocznij z bezpłatnym trialem.',
  ogImage: '/images/pricing-og.jpg',
  twitterCard: 'summary_large_image'
})

// Pricing data
const pricingPlans = [
  {
    name: 'Starter',
    description: 'Idealny dla małych klubów i indywidualnych trenerów',
    price: 99,
    currency: 'PLN',
    period: 'miesięcznie',
    featured: false,
    features: [
      'Do 25 zawodników',
      'Podstawowe zarządzanie treningami',
      'Raporty miesięczne',
      'Wsparcie email',
      'Mobilna aplikacja',
      '5GB przestrzeni dyskowej'
    ],
    limitations: [
      'Brak zaawansowanych analiz',
      'Ograniczone integracje'
    ],
    color: 'from-blue-500 to-cyan-500',
    buttonText: 'Rozpocznij trial',
    popular: false
  },
  {
    name: 'Professional',
    description: 'Dla średnich klubów i akademii sportowych',
    price: 299,
    currency: 'PLN',
    period: 'miesięcznie',
    featured: true,
    features: [
      'Do 100 zawodników',
      'Zaawansowane planowanie treningów',
      'Szczegółowe analizy wydajności',
      'Raporty w czasie rzeczywistym',
      'Wsparcie priorytetowe',
      'Mobilna aplikacja',
      '50GB przestrzeni dyskowej',
      'Integracje z urządzeniami fitness',
      'Kalendarz zawodów',
      'System powiadomień'
    ],
    limitations: [],
    color: 'from-purple-500 to-pink-500',
    buttonText: 'Najpopularniejszy',
    popular: true
  },
  {
    name: 'Enterprise',
    description: 'Dla dużych organizacji i federacji sportowych',
    price: 'Custom',
    currency: '',
    period: 'miesięcznie',
    featured: false,
    features: [
      'Nieograniczona liczba zawodników',
      'Pełne zarządzanie wieloma lokalizacjami',
      'Zaawansowane API i integracje',
      'Dedykowany menedżer konta',
      'Wsparcie 24/7',
      'Niestandardowe raporty',
      'Nieograniczona przestrzeń dyskowa',
      'Białe etykiety (white-label)',
      'SSO i zaawansowane bezpieczeństwo',
      'Szkolenia zespołu'
    ],
    limitations: [],
    color: 'from-green-500 to-emerald-500',
    buttonText: 'Skontaktuj się',
    popular: false
  }
]

// Additional features
const additionalFeatures = [
  {
    icon: 'i-lucide-shield-check',
    title: 'Bezpieczeństwo danych',
    description: 'Pełne szyfrowanie i compliance z RODO'
  },
  {
    icon: 'i-lucide-cloud',
    title: 'Backup w chmurze',
    description: 'Automatyczne kopie zapasowe co 24 godziny'
  },
  {
    icon: 'i-lucide-smartphone',
    title: 'Aplikacja mobilna',
    description: 'Dostęp do systemu z każdego urządzenia'
  },
  {
    icon: 'i-lucide-headphones',
    title: 'Wsparcie techniczne',
    description: 'Pomoc w języku polskim i angielskim'
  }
]

// FAQ data
const faqItems = [
  {
    question: 'Czy mogę zmienić plan w trakcie trwania subskrypcji?',
    answer: 'Tak, możesz zmienić plan w dowolnym momencie. Przy przejściu na wyższy plan dopłacisz różnicę proporcjonalnie do pozostałego czasu subskrypcji.'
  },
  {
    question: 'Czy jest dostępny bezpłatny trial?',
    answer: 'Tak, oferujemy 14-dniowy bezpłatny trial dla wszystkich planów. Nie wymagamy karty kredytowej do rozpoczęcia.'
  },
  {
    question: 'Czy dane są bezpieczne?',
    answer: 'Absolutnie. Używamy najwyższych standardów bezpieczeństwa, wszystkie dane są szyfrowane, a nasze serwery znajdują się w UE.'
  },
  {
    question: 'Czy mogę anulować subskrypcję w dowolnym momencie?',
    answer: 'Tak, możesz anulować subskrypcję w dowolnym momencie. Nie ma umów długoterminowych ani kar za rezygnację.'
  },
  {
    question: 'Czy oferujecie rabaty dla organizacji non-profit?',
    answer: 'Tak, oferujemy specjalne rabaty dla organizacji non-profit i szkół. Skontaktuj się z nami aby poznać szczegóły.'
  }
]

// Reactive FAQ state
const openFaqItems = ref<Set<number>>(new Set())

const toggleFaq = (index: number) => {
  const newSet = new Set(openFaqItems.value)
  if (newSet.has(index)) {
    newSet.delete(index)
  } else {
    newSet.add(index)
  }
  openFaqItems.value = newSet
}
</script>

<template>
  <NuxtLayout name="default">
    <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      
      <!-- Hero Section -->
      <section class="relative pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-42 lg:pb-24 overflow-hidden">
        <!-- Background Elements -->
        <div class="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-pink-600/5 dark:from-blue-400/10 dark:via-purple-400/10 dark:to-pink-400/10"></div>
        
        <!-- Animated Background Shapes -->
        <div class="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div class="absolute top-0 right-0 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-delayed"></div>
        
        <div class="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div class="max-w-4xl mx-auto">
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Przejrzyste 
              <span class="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Cenniki
              </span>
            </h1>
            
            <p class="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Wybierz plan idealny dla Twojej organizacji sportowej. 
              Wszystkie plany zawierają 14-dniowy bezpłatny trial.
            </p>
            
            <!-- Trial Info -->
            <div class="inline-flex items-center bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-6 py-3 rounded-full text-sm font-medium mb-12">
              <UIcon name="i-lucide-check-circle" class="w-5 h-5 mr-2" />
              14 dni za darmo • Bez karty kredytowej • Anuluj w dowolnym momencie
            </div>
          </div>
        </div>
      </section>

      <!-- Pricing Plans -->
      <section class="relative py-16 sm:py-20 lg:py-24">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
          
          <!-- Plans Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <div 
              v-for="(plan, index) in pricingPlans" 
              :key="plan.name"
              class="relative group"
              :class="[
                plan.popular ? 'lg:scale-105 lg:-mt-8' : '',
                'transition-all duration-500 hover:scale-105'
              ]"
            >
              <!-- Popular Badge -->
              <div 
                v-if="plan.popular" 
                class="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10"
              >
                <div class="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                  🔥 Najpopularniejszy
                </div>
              </div>

              <!-- Plan Card -->
              <div 
                class="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50 h-full transition-all duration-500 group-hover:shadow-2xl"
                :class="[
                  plan.popular 
                    ? 'ring-2 ring-purple-500/50 dark:ring-purple-400/50' 
                    : 'hover:ring-2 hover:ring-blue-500/30'
                ]"
              >
                <!-- Plan Header -->
                <div class="text-center mb-8">
                  <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {{ plan.name }}
                  </h3>
                  <p class="text-gray-600 dark:text-gray-300 mb-6">
                    {{ plan.description }}
                  </p>
                  
                  <!-- Price -->
                  <div class="mb-6">
                    <div v-if="plan.price === 'Custom'" class="text-4xl font-bold text-gray-900 dark:text-white">
                      Wycena indywidualna
                    </div>
                    <div v-else class="flex items-baseline justify-center">
                      <span class="text-5xl font-bold text-gray-900 dark:text-white">{{ plan.price }}</span>
                      <span class="text-xl text-gray-600 dark:text-gray-300 ml-2">{{ plan.currency }}</span>
                      <span class="text-gray-500 dark:text-gray-400 ml-1">/{{ plan.period }}</span>
                    </div>
                  </div>
                </div>

                <!-- Features List -->
                <div class="mb-8">
                  <ul class="space-y-4">
                    <li 
                      v-for="feature in plan.features" 
                      :key="feature"
                      class="flex items-start"
                    >
                      <UIcon 
                        name="i-lucide-check" 
                        class="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" 
                      />
                      <span class="text-gray-700 dark:text-gray-300">{{ feature }}</span>
                    </li>
                  </ul>
                  
                  <!-- Limitations -->
                  <ul v-if="plan.limitations.length > 0" class="space-y-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <li 
                      v-for="limitation in plan.limitations" 
                      :key="limitation"
                      class="flex items-start"
                    >
                      <UIcon 
                        name="i-lucide-x" 
                        class="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" 
                      />
                      <span class="text-gray-500 dark:text-gray-400 text-sm">{{ limitation }}</span>
                    </li>
                  </ul>
                </div>

                <!-- CTA Button -->
                <div class="mt-auto">
                  <UButton
                    :to="plan.name === 'Enterprise' ? '/contact' : '/auth/register'"
                    size="xl"
                    block
                    :class="[
                      plan.popular 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0' 
                        : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0'
                    ]"
                    class="font-bold py-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <UIcon 
                      :name="plan.name === 'Enterprise' ? 'i-lucide-mail' : 'i-lucide-rocket'" 
                      class="w-5 h-5 mr-2" 
                    />
                    {{ plan.buttonText }}
                  </UButton>
                  
                  <p v-if="plan.name !== 'Enterprise'" class="text-center text-sm text-gray-500 dark:text-gray-400 mt-3">
                    Bez zobowiązań • Anuluj w dowolnym momencie
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Money Back Guarantee -->
          <div class="text-center mt-16">
            <div class="inline-flex items-center bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-8 py-4 rounded-2xl border border-blue-200 dark:border-blue-700">
              <UIcon name="i-lucide-shield-check" class="w-6 h-6 mr-3" />
              <span class="font-semibold">30-dniowa gwarancja zwrotu pieniędzy</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Additional Features -->
      <section class="relative py-16 sm:py-20 bg-gray-50/50 dark:bg-gray-800/50">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Dlaczego wybrać ATP System?
            </h2>
            <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Wszystkie plany zawierają standardowe funkcje zapewniające bezpieczeństwo i niezawodność
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div 
              v-for="feature in additionalFeatures" 
              :key="feature.title"
              class="text-center group"
            >
              <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <UIcon :name="feature.icon" class="w-8 h-8 text-white" />
                </div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {{ feature.title }}
                </h3>
                <p class="text-gray-600 dark:text-gray-300">
                  {{ feature.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ Section -->
      <section class="relative py-16 sm:py-20 lg:py-24">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Najczęściej zadawane pytania
            </h2>
            <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Znajdź odpowiedzi na pytania dotyczące cenników i funkcjonalności
            </p>
          </div>

          <div class="max-w-4xl mx-auto">
            <div class="space-y-4">
              <div 
                v-for="(item, index) in faqItems" 
                :key="index"
                class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <button
                  @click="toggleFaq(index)"
                  class="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <span class="font-semibold text-gray-900 dark:text-white text-lg">
                    {{ item.question }}
                  </span>
                  <UIcon 
                    name="i-lucide-chevron-down" 
                    class="w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-200"
                    :class="{ 'transform rotate-180': openFaqItems.has(index) }"
                  />
                </button>
                
                <transition
                  enter-active-class="transition-all duration-300 ease-out"
                  enter-from-class="opacity-0 max-h-0"
                  enter-to-class="opacity-100 max-h-96"
                  leave-active-class="transition-all duration-300 ease-in"
                  leave-from-class="opacity-100 max-h-96"
                  leave-to-class="opacity-0 max-h-0"
                >
                  <div v-if="openFaqItems.has(index)" class="px-6 pb-6">
                    <div class="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {{ item.answer }}
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="relative py-16 sm:py-20 lg:py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
        <!-- Background Elements -->
        <div class="absolute inset-0 bg-black/20"></div>
        <div class="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full mix-blend-overlay filter blur-xl animate-float"></div>
        <div class="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full mix-blend-overlay filter blur-xl animate-float-delayed"></div>
        
        <div class="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div class="max-w-4xl mx-auto">
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Gotowy na rozpoczęcie?
            </h2>
            
            <p class="text-xl sm:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Dołącz do tysięcy zadowolonych użytkowników ATP System. 
              Rozpocznij bezpłatny trial już dziś.
            </p>
            
            <div class="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <UButton
                to="/auth/register"
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
  .backdrop-blur-xl {
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
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

/* Enhanced card hover effects */
.group:hover .shadow-lg {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Gradient text enhancements */
.bg-gradient-to-r {
  background-size: 200% 200%;
  animation: gradient 8s ease infinite;
}

@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* FAQ smooth transitions */
.max-h-0 {
  max-height: 0;
}

.max-h-96 {
  max-height: 24rem;
}

/* Button scaling effects */
.hover\:scale-105:hover {
  transform: scale(1.05);
}

/* Ring effects for popular plan */
.ring-2 {
  box-shadow: 0 0 0 2px var(--tw-ring-color);
}

/* Popular badge pulse effect */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>