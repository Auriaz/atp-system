<script lang="ts" setup>
// SEO Meta
useSeoMeta({
  title: 'Zarządzanie Zawodnikami - ATP System',
  description: 'Kompleksowe zarządzanie zawodnikami - profile, historie treningów, monitoring postępów i wiele więcej.',
  ogTitle: 'Zarządzanie Zawodnikami - ATP System',
  ogDescription: 'Profesjonalne narzędzia do zarządzania zespołem sportowym i indywidualnych zawodników.',
  ogImage: '/images/athletes-og.jpg',
  twitterCard: 'summary_large_image'
})

const athleteFeatures = [
  {
    icon: 'i-lucide-user-circle',
    title: 'Profile Zawodników',
    description: 'Szczegółowe profile z pełną historią sportową i danymi osobowymi.',
    features: [
      'Dane osobowe i kontaktowe',
      'Historia sportowa',
      'Osiągnięcia i nagrody',
      'Zdjęcia i dokumenty',
      'Informacje medyczne'
    ],
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: 'i-lucide-activity',
    title: 'Monitoring Postępów',
    description: 'Śledzenie rozwoju zawodników w czasie rzeczywistym.',
    features: [
      'Wykresy postępów',
      'Porównania okresowe',
      'Cele i kamienie milowe',
      'Oceny wydajności',
      'Prognozy rozwoju'
    ],
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: 'i-lucide-heart-pulse',
    title: 'Stan Zdrowia',
    description: 'Kompleksowe monitorowanie stanu zdrowia i form fizycznej.',
    features: [
      'Parametry życiowe',
      'Historia kontuzji',
      'Plany rehabilitacji',
      'Badania medyczne',
      'Alerty zdrowotne'
    ],
    color: 'from-red-500 to-pink-500'
  },
  {
    icon: 'i-lucide-dumbbell',
    title: 'Plany Treningowe',
    description: 'Indywidualne plany treningowe dostosowane do każdego zawodnika.',
    features: [
      'Spersonalizowane treningi',
      'Harmonogramy ćwiczeń',
      'Progresja obciążeń',
      'Adaptacja do formy',
      'Automatyczne dostosowania'
    ],
    color: 'from-purple-500 to-indigo-500'
  }
]

const managementTools = [
  {
    icon: 'i-lucide-search',
    title: 'Zaawansowane Wyszukiwanie',
    description: 'Szybko znajdź zawodników według różnych kryteriów'
  },
  {
    icon: 'i-lucide-filter',
    title: 'Filtry i Grupowanie',
    description: 'Organizuj zawodników według zespołów, pozycji, wieku'
  },
  {
    icon: 'i-lucide-star',
    title: 'System Ocen',
    description: 'Oceniaj wydajność i postępy zawodników'
  },
  {
    icon: 'i-lucide-trophy',
    title: 'Rankingi Wewnętrzne',
    description: 'Twórz rankingi i porównuj zawodników'
  },
  {
    icon: 'i-lucide-calendar-check',
    title: 'Harmonogramy',
    description: 'Zarządzaj harmonogramami treningów i zawodów'
  },
  {
    icon: 'i-lucide-message-circle',
    title: 'Komunikacja',
    description: 'Wbudowany system komunikacji z zawodnikami'
  }
]

const integrations = [
  {
    icon: 'i-lucide-smartphone',
    title: 'Aplikacja Mobilna',
    description: 'Zawodnicy mają dostęp do swoich danych przez aplikację mobilną'
  },
  {
    icon: 'i-lucide-watch',
    title: 'Urządzenia Fitness',
    description: 'Integracja z popularnymi urządzeniami fitness i smartwatch'
  },
  {
    icon: 'i-lucide-stethoscope',
    title: 'Sprzęt Medyczny',
    description: 'Połączenie z urządzeniami do monitorowania zdrowia'
  }
]
</script>

<template>
  <NuxtLayout>
    <div class="min-h-screen pt-40 bg-gradient-to-br from-slate-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
      <!-- Header Section -->
      <section class="relative py-20 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
          <div class="text-center">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl mb-6">
              <Icon name="i-lucide-users" class="w-8 h-8 text-white" />
            </div>
            <h1 class="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-6">
              Zarządzanie Zawodnikami
            </h1>
            <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Kompletne rozwiązanie do zarządzania zespołem sportowym. 
              Śledź postępy, monitoruj zdrowie i rozwijaj talenty swoich zawodników.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <NuxtLink 
                to="/auth/register" 
                class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Icon name="i-lucide-user-plus" class="w-5 h-5 mr-2" />
                Dodaj pierwszego zawodnika
              </NuxtLink>
              <NuxtLink 
                to="/demo" 
                class="inline-flex items-center px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
              >
                <Icon name="i-lucide-eye" class="w-5 h-5 mr-2" />
                Zobacz demo
              </NuxtLink>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Main Features Section -->
      <section class="py-20 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Kompleksowe Zarządzanie
            </h2>
            <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Wszystko czego potrzebujesz do profesjonalnego zarządzania zawodnikami w jednym miejscu
            </p>
          </div>
  
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div 
              v-for="(feature, index) in athleteFeatures" 
              :key="index"
              class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
            >
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0">
                  <div :class="`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center`">
                    <Icon :name="feature.icon" class="w-6 h-6 text-white" />
                  </div>
                </div>
                <div class="flex-1">
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {{ feature.title }}
                  </h3>
                  <p class="text-gray-600 dark:text-gray-300 mb-4">
                    {{ feature.description }}
                  </p>
                  <ul class="space-y-2">
                    <li 
                      v-for="item in feature.features" 
                      :key="item"
                      class="flex items-center text-sm text-gray-600 dark:text-gray-300"
                    >
                      <Icon name="i-lucide-check" class="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      {{ item }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Management Tools Section -->
      <section class="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Narzędzia Zarządzania
            </h2>
            <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Profesjonalne narzędzia ułatwiające codzienną pracę z zespołem
            </p>
          </div>
  
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div 
              v-for="(tool, index) in managementTools" 
              :key="index"
              class="text-center p-6 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              <div class="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Icon :name="tool.icon" class="w-6 h-6 text-white" />
              </div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {{ tool.title }}
              </h3>
              <p class="text-gray-600 dark:text-gray-300">
                {{ tool.description }}
              </p>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Integrations Section -->
      <section class="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Integracje
            </h2>
            <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Połącz ATP System z popularnymi urządzeniami i aplikacjami
            </p>
          </div>
  
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div 
              v-for="(integration, index) in integrations" 
              :key="index"
              class="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg text-center"
            >
              <div class="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Icon :name="integration.icon" class="w-8 h-8 text-white" />
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {{ integration.title }}
              </h3>
              <p class="text-gray-600 dark:text-gray-300">
                {{ integration.description }}
              </p>
            </div>
          </div>
        </div>
      </section>
  
      <!-- CTA Section -->
      <section class="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-600 to-blue-600">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">
            Gotowy na lepsze zarządzanie zespołem?
          </h2>
          <p class="text-xl text-green-100 mb-8">
            Dołącz do tysięcy trenerów, którzy już wykorzystują ATP System do rozwijania swoich zawodników.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink 
              to="/auth/register" 
              class="inline-flex items-center px-8 py-4 bg-white text-green-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors duration-200 shadow-lg"
            >
              <Icon name="i-lucide-rocket" class="w-5 h-5 mr-2" />
              Rozpocznij za darmo
            </NuxtLink>
            <NuxtLink 
              to="/contact" 
              class="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-green-600 transition-all duration-200"
            >
              <Icon name="i-lucide-phone" class="w-5 h-5 mr-2" />
              Skontaktuj się z nami
            </NuxtLink>
          </div>
        </div>
      </section>
    </div>
  </NuxtLayout>
</template>