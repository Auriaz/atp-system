<script lang="ts" setup>
// SEO Meta
useSeoMeta({
  title: 'Analityka Sportowa - ATP System',
  description: 'Zaawansowana analityka sportowa z wizualizacjami danych, prognozami wydajności i insights opartymi na AI.',
  ogTitle: 'Analityka Sportowa - ATP System',
  ogDescription: 'Przekształć dane treningowe w wartościowe informacje dzięki zaawansowanej analityce.',
  ogImage: '/images/analytics-og.jpg',
  twitterCard: 'summary_large_image'
})

const analyticsFeatures = [
  {
    icon: 'i-lucide-trending-up',
    title: 'Analiza Wydajności',
    description: 'Szczegółowa analiza wydajności zawodników z trendami i prognozami.',
    features: [
      'Wykresy postępów w czasie',
      'Analiza trendów długoterminowych',
      'Prognozy wydajności AI',
      'Porównania z normami',
      'Wskaźniki wydajności KPI'
    ],
    color: 'from-blue-500 to-purple-600'
  },
  {
    icon: 'i-lucide-pie-chart',
    title: 'Wizualizacja Danych',
    description: 'Interaktywne wykresy i dashboardy dla lepszego zrozumienia danych.',
    features: [
      'Interaktywne dashboardy',
      'Wykresy 3D i animacje',
      'Mapy ciepła wydajności',
      'Diagramy porównawcze',
      'Eksport wysokiej jakości'
    ],
    color: 'from-green-500 to-blue-500'
  },
  {
    icon: 'i-lucide-brain',
    title: 'Analityka AI',
    description: 'Sztuczna inteligencja odkrywa ukryte wzorce w danych treningowych.',
    features: [
      'Automatyczne wykrywanie wzorców',
      'Predykcyjne modelowanie',
      'Rekomendacje treningowe',
      'Analiza ryzyka kontuzji',
      'Optymalizacja planów AI'
    ],
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: 'i-lucide-target',
    title: 'Śledzenie Celów',
    description: 'Monitoruj realizację celów sportowych i treningowych.',
    features: [
      'Definiowanie celów SMART',
      'Tracking postępów',
      'Milestones i kamienie milowe',
      'Analiza osiągnięć',
      'Adaptacja celów'
    ],
    color: 'from-orange-500 to-red-500'
  }
]

const visualizationTools = [
  {
    icon: 'i-lucide-bar-chart-3',
    title: 'Wykresy Słupkowe',
    description: 'Porównania wydajności między okresami i zawodnikami'
  },
  {
    icon: 'i-lucide-line-chart',
    title: 'Wykresy Liniowe',
    description: 'Śledzenie trendów i postępów w czasie'
  },
  {
    icon: 'i-lucide-activity',
    title: 'Mapy Ciepła',
    description: 'Wizualizacja intensywności treningów i wydajności'
  },
  {
    icon: 'i-lucide-gauge',
    title: 'Dashboardy',
    description: 'Kompleksowe panele kontrolne z kluczowymi wskaźnikami'
  },
  {
    icon: 'i-lucide-zap',
    title: 'Analiza Real-time',
    description: 'Monitoring wydajności w czasie rzeczywistym'
  },
  {
    icon: 'i-lucide-layers',
    title: 'Analiza Porównawcza',
    description: 'Porównania między zawodnikami, okresami i normami'
  }
]

const metrics = [
  {
    icon: 'i-lucide-heart',
    title: 'Parametry Fizjologiczne',
    description: 'Tętno, VO2 max, lactate threshold, recovery rate'
  },
  {
    icon: 'i-lucide-timer',
    title: 'Wydajność Czasowa',
    description: 'Czasy reakcji, tempa, interwały, czas regeneracji'
  },
  {
    icon: 'i-lucide-zap',
    title: 'Siła i Moc',
    description: 'Peak power, średnia moc, explosive strength, endurance'
  }
]
</script>

<template>
  <NuxtLayout>
    <div class="min-h-screen pt-40 bg-gradient-to-br from-slate-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <!-- Header Section -->
      <section class="relative py-20 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
          <div class="text-center">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl mb-6">
              <Icon name="i-lucide-bar-chart-4" class="w-8 h-8 text-white" />
            </div>
            <h1 class="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-6">
              Analityka Sportowa
            </h1>
            <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Przekształć dane treningowe w wartościowe informacje. 
              Wykorzystaj moc AI do odkrywania wzorców i optymalizacji wydajności.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <NuxtLink 
                to="/auth/register" 
                class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Icon name="i-lucide-sparkles" class="w-5 h-5 mr-2" />
                Odkryj insights
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
  
      <!-- Main Features Section -->
      <section class="py-20 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Zaawansowana Analityka AI
            </h2>
            <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Potężne narzędzia analityczne wykorzystujące sztuczną inteligencję
            </p>
          </div>
  
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div 
              v-for="(feature, index) in analyticsFeatures" 
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
  
      <!-- Visualization Tools Section -->
      <section class="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Narzędzia Wizualizacji
            </h2>
            <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Interaktywne wykresy i dashboardy do lepszego zrozumienia danych
            </p>
          </div>
  
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div 
              v-for="(tool, index) in visualizationTools" 
              :key="index"
              class="text-center p-6 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              <div class="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4">
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
  
      <!-- Metrics Section -->
      <section class="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Kluczowe Metryki
            </h2>
            <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Śledź najważniejsze wskaźniki wydajności sportowej
            </p>
          </div>
  
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div 
              v-for="(metric, index) in metrics" 
              :key="index"
              class="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg text-center"
            >
              <div class="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Icon :name="metric.icon" class="w-8 h-8 text-white" />
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {{ metric.title }}
              </h3>
              <p class="text-gray-600 dark:text-gray-300">
                {{ metric.description }}
              </p>
            </div>
          </div>
        </div>
      </section>
  
      <!-- CTA Section -->
      <section class="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600 to-pink-600">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">
            Gotowy na inteligentną analitykę?
          </h2>
          <p class="text-xl text-purple-100 mb-8">
            Odkryj ukryte wzorce w swoich danych treningowych i osiągnij lepsze wyniki.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink 
              to="/auth/register" 
              class="inline-flex items-center px-8 py-4 bg-white text-purple-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors duration-200 shadow-lg"
            >
              <Icon name="i-lucide-trending-up" class="w-5 h-5 mr-2" />
              Rozpocznij analizę
            </NuxtLink>
            <NuxtLink 
              to="/contact" 
              class="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-purple-600 transition-all duration-200"
            >
              <Icon name="i-lucide-users" class="w-5 h-5 mr-2" />
              Porozmawiaj z ekspertem
            </NuxtLink>
          </div>
        </div>
      </section>
    </div>
  </NuxtLayout>
</template>