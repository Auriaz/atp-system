<script lang="ts" setup>
// SEO Meta
useSeoMeta({
  title: 'Raporty i Analityka - ATP System',
  description: 'Zaawansowane raporty i analityka dla trenerów i zawodników. Śledź postępy, analizuj wydajność i generuj szczegółowe raporty.',
  ogTitle: 'Raporty i Analityka - ATP System',
  ogDescription: 'Kompleksowe narzędzia raportowania i analizy danych sportowych.',
  ogImage: '/images/reports-og.jpg',
  twitterCard: 'summary_large_image'
})

const reportTypes = [
  {
    icon: 'i-lucide-bar-chart-4',
    title: 'Raporty Wydajności',
    description: 'Szczegółowe analizy wydajności zawodników z wykresami i trendami.',
    features: [
      'Wykresy postępów w czasie',
      'Porównania między okresami',
      'Analiza trendów wydajności',
      'Wskaźniki KPI'
    ]
  },
  {
    icon: 'i-lucide-users',
    title: 'Raporty Zawodników',
    description: 'Indywidualne raporty dla każdego zawodnika z pełną historią.',
    features: [
      'Profile zawodników',
      'Historia treningów',
      'Wyniki testów sprawności',
      'Plan rozwoju'
    ]
  },
  {
    icon: 'i-lucide-calendar-days',
    title: 'Raporty Treningowe',
    description: 'Analizy efektywności treningów i planów treningowych.',
    features: [
      'Analiza obciążeń treningowych',
      'Efektywność ćwiczeń',
      'Compliance z planem',
      'Rekomendacje optymalizacji'
    ]
  },
  {
    icon: 'i-lucide-trophy',
    title: 'Raporty Zawodów',
    description: 'Szczegółowe analizy wyników zawodów i konkurencji.',
    features: [
      'Wyniki zawodów',
      'Statystyki zespołowe',
      'Porównania z konkurencją',
      'Analiza słabych punktów'
    ]
  }
]

const reportFeatures = [
  {
    icon: 'i-lucide-download',
    title: 'Eksport do PDF/Excel',
    description: 'Eksportuj raporty w popularnych formatach'
  },
  {
    icon: 'i-lucide-clock',
    title: 'Automatyczne Generowanie',
    description: 'Zaplanuj automatyczne generowanie raportów'
  },
  {
    icon: 'i-lucide-share-2',
    title: 'Udostępnianie',
    description: 'Łatwe udostępnianie raportów zespołowi'
  },
  {
    icon: 'i-lucide-palette',
    title: 'Personalizacja',
    description: 'Dostosuj wygląd i zawartość raportów'
  },
  {
    icon: 'i-lucide-filter',
    title: 'Zaawansowane Filtry',
    description: 'Filtruj dane według różnych kryteriów'
  },
  {
    icon: 'i-lucide-bell',
    title: 'Powiadomienia',
    description: 'Otrzymuj powiadomienia o nowych raportach'
  }
]
</script>

<template>
  <NuxtLayout>
    <div class="min-h-screen pt-40 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <!-- Header Section -->
      <section class="relative py-20 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
          <div class="text-center">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6">
              <Icon name="i-lucide-file-text" class="w-8 h-8 text-white" />
            </div>
            <h1 class="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-6">
              Raporty i Analityka
            </h1>
            <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Przekształć dane w wartościowe informacje. Generuj szczegółowe raporty, 
              analizuj wydajność i podejmuj lepsze decyzje treningowe.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <NuxtLink 
                to="/auth/register" 
                class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Icon name="i-lucide-rocket" class="w-5 h-5 mr-2" />
                Rozpocznij za darmo
              </NuxtLink>
              <NuxtLink 
                to="/demo" 
                class="inline-flex items-center px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
              >
                <Icon name="i-lucide-play" class="w-5 h-5 mr-2" />
                Zobacz demo
              </NuxtLink>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Report Types Section -->
      <section class="py-20 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Typy Raportów
            </h2>
            <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Kompleksowy zestaw raportów dopasowanych do potrzeb każdego trenera i zawodnika
            </p>
          </div>
  
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div 
              v-for="(report, index) in reportTypes" 
              :key="index"
              class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
            >
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0">
                  <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Icon :name="report.icon" class="w-6 h-6 text-white" />
                  </div>
                </div>
                <div class="flex-1">
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {{ report.title }}
                  </h3>
                  <p class="text-gray-600 dark:text-gray-300 mb-4">
                    {{ report.description }}
                  </p>
                  <ul class="space-y-2">
                    <li 
                      v-for="feature in report.features" 
                      :key="feature"
                      class="flex items-center text-sm text-gray-600 dark:text-gray-300"
                    >
                      <Icon name="i-lucide-check" class="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      {{ feature }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Features Section -->
      <section class="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Zaawansowane Funkcje
            </h2>
            <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Wszystko czego potrzebujesz do profesjonalnego raportowania
            </p>
          </div>
  
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div 
              v-for="(feature, index) in reportFeatures" 
              :key="index"
              class="text-center p-6 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Icon :name="feature.icon" class="w-6 h-6 text-white" />
              </div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {{ feature.title }}
              </h3>
              <p class="text-gray-600 dark:text-gray-300">
                {{ feature.description }}
              </p>
            </div>
          </div>
        </div>
      </section>
  
      <!-- CTA Section -->
      <section class="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">
            Gotowy na inteligentne raportowanie?
          </h2>
          <p class="text-xl text-blue-100 mb-8">
            Zacznij generować profesjonalne raporty już dziś i podejmuj lepsze decyzje treningowe.
          </p>
          <NuxtLink 
            to="/auth/register" 
            class="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors duration-200 shadow-lg"
          >
            <Icon name="i-lucide-arrow-right" class="w-5 h-5 mr-2" />
            Rozpocznij teraz
          </NuxtLink>
        </div>
      </section>
    </div>
  </NuxtLayout>
</template>