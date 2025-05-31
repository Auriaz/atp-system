<script lang="ts" setup>
// SEO Meta
useSeoMeta({
  title: 'Demo - ATP System',
  description: 'Wypróbuj ATP System za darmo. Interaktywne demo pokazujące wszystkie funkcjonalności systemu zarządzania treningami sportowymi.',
  ogTitle: 'Demo ATP System - Wypróbuj za darmo',
  ogDescription: 'Interaktywne demo systemu zarządzania treningami. Zobacz jak ATP System może pomóc w rozwoju sportowym.',
  ogImage: '/images/demo-og.jpg',
  twitterCard: 'summary_large_image'
})

// Demo state management
const activeDemo = ref('dashboard')
const isPlaying = ref(false)
const currentStep = ref(1)
const totalSteps = 4

const demoSections = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Centralny panel kontrolny z najważniejszymi informacjami',
    icon: 'i-lucide-layout-dashboard',
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'training',
    title: 'Planowanie Treningów',
    description: 'Tworzenie i zarządzanie planami treningowymi',
    icon: 'i-lucide-calendar-plus',
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'athletes',
    title: 'Zarządzanie Zawodnikami',
    description: 'Profile zawodników i monitoring postępów',
    icon: 'i-lucide-users',
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'analytics',
    title: 'Analityka i Raporty',
    description: 'Szczegółowe analizy i raporty wydajności',
    icon: 'i-lucide-bar-chart-3',
    color: 'from-orange-500 to-orange-600'
  }
]

const dashboardStats = [
  { label: 'Aktywni zawodnicy', value: '127', icon: 'i-lucide-users', trend: '+12%' },
  { label: 'Treningi w tym tygodniu', value: '89', icon: 'i-lucide-calendar', trend: '+8%' },
  { label: 'Średnia wydajność', value: '94%', icon: 'i-lucide-trending-up', trend: '+5%' },
  { label: 'Ukończone cele', value: '76', icon: 'i-lucide-target', trend: '+15%' }
]

const recentActivities = [
  { athlete: 'Jan Kowalski', activity: 'Ukończył trening siłowy', time: '2 min temu', type: 'success' },
  { athlete: 'Anna Nowak', activity: 'Rozpoczęła plan kondycyjny', time: '15 min temu', type: 'info' },
  { athlete: 'Michał Wiśniewski', activity: 'Osiągnął nowy rekord', time: '1 godz. temu', type: 'achievement' },
  { athlete: 'Katarzyna Lewandowska', activity: 'Zaplanowała treningi na tydzień', time: '2 godz. temu', type: 'planning' }
]

// Demo functions
const startDemo = () => {
  isPlaying.value = true
  currentStep.value = 1
  // Simulate demo progression
  const interval = setInterval(() => {
    if (currentStep.value < totalSteps) {
      currentStep.value++
    } else {
      isPlaying.value = false
      currentStep.value = 1
      clearInterval(interval)
    }
  }, 3000)
}

const setActiveDemo = (demoId: string) => {
  activeDemo.value = demoId
  isPlaying.value = false
  currentStep.value = 1
}
</script>

<template>
  <NuxtLayout>
    <div class="min-h-screen pt-40 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <!-- Header Section -->
      <section class="relative py-20 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
          <div class="text-center">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6">
              <Icon name="i-lucide-play-circle" class="w-8 h-8 text-white" />
            </div>
            <h1 class="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-6">
              Wypróbuj ATP System
            </h1>
            <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Interaktywne demo pokazujące wszystkie funkcjonalności systemu zarządzania treningami sportowymi. 
              Bez rejestracji, bez zobowiązań.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                @click="startDemo"
                :disabled="isPlaying"
                class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icon :name="isPlaying ? 'i-lucide-loader-2' : 'i-lucide-play'" :class="isPlaying ? 'animate-spin' : ''" class="w-5 h-5 mr-2" />
                {{ isPlaying ? 'Demo w toku...' : 'Rozpocznij demo' }}
              </button>
              <NuxtLink 
                to="/auth/register" 
                class="inline-flex items-center px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
              >
                <Icon name="i-lucide-user-plus" class="w-5 h-5 mr-2" />
                Utwórz darmowe konto
              </NuxtLink>
            </div>
          </div>
        </div>
      </section>

      <!-- Demo Navigation -->
      <section class="py-8 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
          <div class="flex flex-wrap justify-center gap-4 mb-8">
            <button
              v-for="section in demoSections"
              :key="section.id"
              @click="setActiveDemo(section.id)"
              :class="[
                'flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200',
                activeDemo === section.id
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg border-2 border-blue-500 dark:border-blue-400'
                  : 'bg-white/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700'
              ]"
            >
              <Icon :name="section.icon" class="w-5 h-5 mr-2" />
              {{ section.title }}
            </button>
          </div>

          <!-- Progress Bar -->
          <div v-if="isPlaying" class="max-w-md mx-auto mb-8">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Krok {{ currentStep }} z {{ totalSteps }}</span>
              <span class="text-sm text-gray-500 dark:text-gray-400">{{ Math.round((currentStep / totalSteps) * 100) }}%</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                class="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
                :style="{ width: `${(currentStep / totalSteps) * 100}%` }"
              ></div>
            </div>
          </div>
        </div>
      </section>

      <!-- Demo Content -->
      <section class="py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
          <!-- Dashboard Demo -->
          <div v-if="activeDemo === 'dashboard'" class="space-y-8">
            <div class="text-center mb-8">
              <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Dashboard - Centrum Kontroli
              </h2>
              <p class="text-gray-600 dark:text-gray-300">
                Przegląd najważniejszych informacji w jednym miejscu
              </p>
            </div>

            <!-- Stats Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div 
                v-for="(stat, index) in dashboardStats" 
                :key="index"
                class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 transform hover:scale-105 transition-all duration-200"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ stat.label }}</p>
                    <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stat.value }}</p>
                  </div>
                  <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Icon :name="stat.icon" class="w-6 h-6 text-white" />
                  </div>
                </div>
                <div class="mt-2 flex items-center text-sm">
                  <span class="text-green-600 dark:text-green-400 font-medium">{{ stat.trend }}</span>
                  <span class="text-gray-500 dark:text-gray-400 ml-1">vs. poprzedni miesiąc</span>
                </div>
              </div>
            </div>

            <!-- Recent Activities -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div class="p-6 border-b border-gray-100 dark:border-gray-700">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Ostatnie aktywności</h3>
              </div>
              <div class="divide-y divide-gray-100 dark:divide-gray-700">
                <div 
                  v-for="(activity, index) in recentActivities" 
                  :key="index"
                  class="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                >
                  <div class="flex items-center space-x-4">
                    <div class="flex-shrink-0">
                      <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span class="text-white font-medium text-sm">{{ activity.athlete.charAt(0) }}</span>
                      </div>
                    </div>
                    <div class="flex-1">
                      <p class="text-sm font-medium text-gray-900 dark:text-white">{{ activity.athlete }}</p>
                      <p class="text-sm text-gray-600 dark:text-gray-300">{{ activity.activity }}</p>
                    </div>
                    <div class="flex-shrink-0">
                      <p class="text-xs text-gray-500 dark:text-gray-400">{{ activity.time }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Training Demo -->
          <div v-else-if="activeDemo === 'training'" class="space-y-8">
            <div class="text-center mb-8">
              <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Planowanie Treningów
              </h2>
              <p class="text-gray-600 dark:text-gray-300">
                Twórz inteligentne plany treningowe dostosowane do celów zawodników
              </p>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div class="p-6">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">Kreator Planu Treningowego</h3>
                
                <!-- Training Form Demo -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div class="space-y-6">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Zawodnik</label>
                      <div class="relative">
                        <select class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                          <option>Jan Kowalski - Piłka nożna</option>
                          <option>Anna Nowak - Lekkoatletyka</option>
                          <option>Michał Wiśniewski - Koszykówka</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Typ treningu</label>
                      <div class="grid grid-cols-2 gap-3">
                        <button class="p-3 border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg font-medium">
                          Siłowy
                        </button>
                        <button class="p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:border-gray-400 dark:hover:border-gray-500">
                          Kondycyjny
                        </button>
                      </div>
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Intensywność</label>
                      <div class="relative">
                        <input type="range" min="1" max="10" value="7" class="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer">
                        <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <span>Niska</span>
                          <span>Średnia</span>
                          <span>Wysoka</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h4 class="font-semibold text-gray-900 dark:text-white mb-4">Podgląd planu</h4>
                    <div class="space-y-3">
                      <div class="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Rozgrzewka</span>
                        <span class="text-xs text-gray-500 dark:text-gray-400">10 min</span>
                      </div>
                      <div class="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Trening główny</span>
                        <span class="text-xs text-gray-500 dark:text-gray-400">45 min</span>
                      </div>
                      <div class="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Stretching</span>
                        <span class="text-xs text-gray-500 dark:text-gray-400">15 min</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Athletes Demo -->
          <div v-else-if="activeDemo === 'athletes'" class="space-y-8">
            <div class="text-center mb-8">
              <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Zarządzanie Zawodnikami
              </h2>
              <p class="text-gray-600 dark:text-gray-300">
                Kompleksowe profile zawodników z monitoringiem postępów
              </p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                <div class="p-6">
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">Lista zawodników</h3>
                  <div class="space-y-4">
                    <div v-for="i in 5" :key="i" class="flex items-center space-x-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <div class="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                        <span class="text-white font-medium">{{ String.fromCharCode(64 + i) }}{{ String.fromCharCode(78 + i) }}</span>
                      </div>
                      <div class="flex-1">
                        <h4 class="font-medium text-gray-900 dark:text-white">Zawodnik {{ i }}</h4>
                        <p class="text-sm text-gray-600 dark:text-gray-300">{{ ['Piłka nożna', 'Lekkoatletyka', 'Koszykówka', 'Tenis', 'Siatkówka'][i-1] }}</p>
                      </div>
                      <div class="text-right">
                        <div class="w-16 h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
                          <div class="h-2 bg-green-500 rounded-full" :style="{ width: `${60 + i * 8}%` }"></div>
                        </div>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ 60 + i * 8 }}% celu</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                <div class="p-6">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profil zawodnika</h3>
                  <div class="text-center mb-6">
                    <div class="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span class="text-white font-bold text-lg">JK</span>
                    </div>
                    <h4 class="font-semibold text-gray-900 dark:text-white">Jan Kowalski</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-300">Piłka nożna • Napastnik</p>
                  </div>
                  <div class="space-y-4">
                    <div>
                      <div class="flex justify-between text-sm mb-1">
                        <span class="text-gray-600 dark:text-gray-300">Kondycja</span>
                        <span class="font-medium text-gray-900 dark:text-white">85%</span>
                      </div>
                      <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div class="bg-green-500 h-2 rounded-full" style="width: 85%"></div>
                      </div>
                    </div>
                    <div>
                      <div class="flex justify-between text-sm mb-1">
                        <span class="text-gray-600 dark:text-gray-300">Technika</span>
                        <span class="font-medium text-gray-900 dark:text-white">92%</span>
                      </div>
                      <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div class="bg-blue-500 h-2 rounded-full" style="width: 92%"></div>
                      </div>
                    </div>
                    <div>
                      <div class="flex justify-between text-sm mb-1">
                        <span class="text-gray-600 dark:text-gray-300">Siła</span>
                        <span class="font-medium text-gray-900 dark:text-white">78%</span>
                      </div>
                      <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div class="bg-orange-500 h-2 rounded-full" style="width: 78%"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Analytics Demo -->
          <div v-else-if="activeDemo === 'analytics'" class="space-y-8">
            <div class="text-center mb-8">
              <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Analityka i Raporty
              </h2>
              <p class="text-gray-600 dark:text-gray-300">
                Szczegółowe analizy wydajności i postępów zawodników
              </p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Wykres wydajności</h3>
                <div class="h-64 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center">
                  <div class="text-center">
                    <Icon name="i-lucide-trending-up" class="w-12 h-12 text-blue-500 mx-auto mb-2" />
                    <p class="text-gray-600 dark:text-gray-300">Interaktywny wykres wydajności</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Trend wzrostowy +15%</p>
                  </div>
                </div>
              </div>

              <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Porównanie zawodników</h3>
                <div class="space-y-4">
                  <div v-for="i in 4" :key="i" class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <div class="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                        <span class="text-white text-xs font-medium">{{ i }}</span>
                      </div>
                      <span class="text-sm font-medium text-gray-900 dark:text-white">Zawodnik {{ i }}</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <div class="w-20 h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
                        <div class="h-2 bg-gradient-to-r from-green-500 to-blue-600 rounded-full" :style="{ width: `${90 - i * 5}%` }"></div>
                      </div>
                      <span class="text-sm font-medium text-gray-900 dark:text-white">{{ 90 - i * 5 }}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">
            Gotowy na pełną wersję?
          </h2>
          <p class="text-xl text-blue-100 mb-8">
            To dopiero początek możliwości ATP System. Utwórz darmowe konto i odkryj wszystkie funkcjonalności.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink 
              to="/auth/register" 
              class="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors duration-200 shadow-lg"
            >
              <Icon name="i-lucide-rocket" class="w-5 h-5 mr-2" />
              Rozpocznij za darmo
            </NuxtLink>
            <NuxtLink 
              to="/pricing" 
              class="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-200"
            >
              <Icon name="i-lucide-credit-card" class="w-5 h-5 mr-2" />
              Zobacz plany
            </NuxtLink>
          </div>
        </div>
      </section>
    </div>
  </NuxtLayout>
</template>
