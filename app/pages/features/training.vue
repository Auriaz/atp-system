<script lang="ts" setup>
useSeoMeta({
  title: 'Planowanie Treningów - ATP System',
  description: 'Zaawansowane narzędzia do planowania i zarządzania treningami. Twórz spersonalizowane plany, śledź postępy i optymalizuj wydajność.',
  ogTitle: 'Planowanie Treningów - ATP System',
  ogDescription: 'Profesjonalne planowanie treningów z AI, kalendarzami i automatyczną adaptacją.',
  ogImage: '/images/training-og.jpg',
  twitterCard: 'summary_large_image'
})

const trainingFeatures = [
  {
    icon: 'i-lucide-calendar-plus',
    title: 'Kreator Planów Treningowych',
    description: 'Intuicyjne narzędzie do tworzenia spersonalizowanych planów treningowych.',
    features: [
      'Szablony treningów dla różnych sportów',
      'Drag & drop interface',
      'Automatyczne dopasowanie do celów',
      'Biblioteka ćwiczeń',
      'Personalizacja intensywności'
    ],
    color: 'from-orange-500 to-red-500'
  },
  {
    icon: 'i-lucide-zap',
    title: 'Adaptacyjne Treningi',
    description: 'System automatycznie dostosowuje treningi do postępów zawodnika.',
    features: [
      'AI-powered adaptacja',
      'Monitoring zmęczenia',
      'Automatyczna progresja',
      'Personalizowane zalecenia',
      'Optymalizacja obciążeń'
    ],
    color: 'from-blue-500 to-purple-500'
  }
]

const planningTools = [
  {
    icon: 'i-lucide-calendar',
    title: 'Kalendarz Treningów',
    description: 'Wizualny kalendarz z pełnym przeglądem planów treningowych'
  },
  {
    icon: 'i-lucide-clock',
    title: 'Harmonogramy',
    description: 'Elastyczne planowanie sesji z uwzględnieniem dostępności'
  },
  {
    icon: 'i-lucide-users',
    title: 'Treningi Grupowe',
    description: 'Planowanie i zarządzanie treningami zespołowymi'
  }
]
</script>

<template>
  <NuxtLayout>
    <div class="min-h-screen pt-40 bg-gradient-to-br from-slate-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      <!-- Header Section -->
      <section class="relative py-20 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
          <div class="text-center">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl mb-6">
              <Icon name="i-lucide-calendar-days" class="w-8 h-8 text-white" />
            </div>
            <h1 class="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-6">
              Planowanie Treningów
            </h1>
            <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Twórz inteligentne plany treningowe z pomocą AI. 
              Dostosowuj treningi do celów, monitoruj postępy i osiągaj lepsze wyniki.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <NuxtLink 
                to="/auth/register" 
                class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Icon name="i-lucide-plus" class="w-5 h-5 mr-2" />
                Stwórz pierwszy plan
              </NuxtLink>
              <NuxtLink 
                to="/demo" 
                class="inline-flex items-center px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
              >
                <Icon name="i-lucide-play-circle" class="w-5 h-5 mr-2" />
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
              Inteligentne Planowanie
            </h2>
            <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Zaawansowane narzędzia do tworzenia efektywnych planów treningowych
            </p>
          </div>
  
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div 
              v-for="(feature, index) in trainingFeatures" 
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
  
      <!-- Planning Tools Section -->
      <section class="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Narzędzia Planowania
            </h2>
            <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Wszystko czego potrzebujesz do efektywnego planowania treningów
            </p>
          </div>
  
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div 
              v-for="(tool, index) in planningTools" 
              :key="index"
              class="text-center p-6 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              <div class="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
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
  
      <!-- CTA Section -->
      <section class="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-orange-600 to-red-600">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">
            Gotowy na lepsze planowanie treningów?
          </h2>
          <p class="text-xl text-orange-100 mb-8">
            Stwórz swój pierwszy inteligentny plan treningowy już dziś i zobacz różnicę.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink 
              to="/auth/register" 
              class="inline-flex items-center px-8 py-4 bg-white text-orange-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors duration-200 shadow-lg"
            >
              <Icon name="i-lucide-calendar-plus" class="w-5 h-5 mr-2" />
              Zacznij planować
            </NuxtLink>
            <NuxtLink 
              to="/pricing" 
              class="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-orange-600 transition-all duration-200"
            >
              <Icon name="i-lucide-tag" class="w-5 h-5 mr-2" />
              Zobacz cennik
            </NuxtLink>
          </div>
        </div>
      </section>
    </div>
  </NuxtLayout>
</template>