<script lang="ts" setup>
definePageMeta({
  layout: 'authorization',
  middleware: ['auth'],
})

const { user } = useUserSession()

// Przykładowe dane dla dashboardu
const stats = [
  { 
    title: 'Aktywni zawodnicy', 
    value: 48, 
    change: '+12%', 
    trend: 'up', 
    icon: 'i-lucide-users', 
    color: 'primary' 
  },
  { 
    title: 'Zaplanowane treningi', 
    value: 24, 
    change: '+5%', 
    trend: 'up', 
    icon: 'i-lucide-calendar-check', 
    color: 'success' 
  },
  { 
    title: 'Średnia wydajność', 
    value: '87%', 
    change: '+3%', 
    trend: 'up', 
    icon: 'i-lucide-trending-up', 
    color: 'info' 
  },
  { 
    title: 'Zadania do wykonania', 
    value: 7, 
    change: '-2', 
    trend: 'down', 
    icon: 'i-lucide-check-square', 
    color: 'warning' 
  }
]

// Dane dla wykresu aktywności
const activityData = {
  labels: ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Ndz'],
  datasets: [
    {
      label: 'Treningi',
      data: [5, 8, 12, 7, 10, 3, 0],
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      borderColor: '#3B82F6',
      borderWidth: 2
    },
    {
      label: 'Testy wydajnościowe',
      data: [2, 1, 4, 0, 3, 1, 0],
      backgroundColor: 'rgba(139, 92, 246, 0.5)',
      borderColor: '#8B5CF6',
      borderWidth: 2
    }
  ]
}

// Dane dla wykresu postępu zawodników
const performanceData = {
  labels: ['Szybkość', 'Wytrzymałość', 'Siła', 'Koordynacja', 'Gibkość'],
  datasets: [
    {
      label: 'Miesiąc temu',
      data: [65, 70, 60, 75, 68],
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      borderColor: 'rgba(59, 130, 246, 0.8)',
      borderWidth: 2,
      fill: true
    },
    {
      label: 'Obecnie',
      data: [75, 82, 72, 80, 75],
      backgroundColor: 'rgba(16, 185, 129, 0.2)',
      borderColor: 'rgba(16, 185, 129, 0.8)',
      borderWidth: 2,
      fill: true
    }
  ]
}

// Przykładowe zadania
const tasks = [
  { 
    id: 1, 
    title: 'Przygotowanie planu treningowego na czerwiec', 
    dueDate: '2025-05-28', 
    priority: 'high', 
    status: 'in-progress' 
  },
  { 
    id: 2, 
    title: 'Analiza wyników testów wydajnościowych', 
    dueDate: '2025-05-26', 
    priority: 'medium', 
    status: 'pending' 
  },
  { 
    id: 3, 
    title: 'Spotkanie z lekarzem drużyny', 
    dueDate: '2025-05-30', 
    priority: 'medium', 
    status: 'pending' 
  },
  { 
    id: 4, 
    title: 'Aktualizacja danych zawodników', 
    dueDate: '2025-05-27', 
    priority: 'low', 
    status: 'completed' 
  }
]

// Aktywni zawodnicy
const topAthletes = [
  { 
    id: 1, 
    name: 'Adam Nowak', 
    position: 'Pomocnik', 
    performance: 94, 
    status: 'active' 
  },
  { 
    id: 2, 
    name: 'Marta Kowalska', 
    position: 'Napastnik', 
    performance: 92, 
    status: 'active' 
  },
  { 
    id: 3, 
    name: 'Piotr Wiśniewski', 
    position: 'Obrońca', 
    performance: 89, 
    status: 'injured' 
  },
  { 
    id: 4, 
    name: 'Anna Dąbrowska', 
    position: 'Bramkarz', 
    performance: 87, 
    status: 'active' 
  }
]

// Ostatnie wydarzenia
const recentEvents = [
  { 
    id: 1, 
    type: 'training', 
    title: 'Trening siłowy', 
    date: '2025-05-24 10:00', 
    description: 'Kompleksowy trening siłowy dla całej drużyny' 
  },
  { 
    id: 2, 
    type: 'test', 
    title: 'Test wydolnościowy', 
    date: '2025-05-23 14:30', 
    description: 'Pomiary wydolności tlenowej zawodników' 
  },
  { 
    id: 3, 
    type: 'meeting', 
    title: 'Analiza taktyki', 
    date: '2025-05-22 16:00', 
    description: 'Omówienie strategii na nadchodzące mecze' 
  }
]

// Data i czas
const currentDate = new Date().toLocaleDateString('pl-PL', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})

// Powitanie zależne od pory dnia
const hours = new Date().getHours()
let greeting = ''

if (hours < 12) {
  greeting = 'Dzień dobry'
} else if (hours < 18) {
  greeting = 'Dzień dobry'
} else {
  greeting = 'Dobry wieczór'
}

// Funkcja do formatowania daty
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' })
}

// Zmiana statusu zadania
const toggleTaskStatus = (taskId: number) => {
  const task = tasks.find(t => t.id === taskId)
  if (task) {
    task.status = task.status === 'completed' ? 'pending' : 'completed'
  }
}

// Priorytet zadania na kolor
const priorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'danger'
    case 'medium': return 'warning'
    case 'low': return 'success'
    default: return 'gray'
  }
}

// Status zawodnika na kolor
const athleteStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'success'
    case 'injured': return 'danger'
    case 'resting': return 'warning'
    default: return 'gray'
  }
}

// Typ wydarzenia na ikonę
const eventTypeIcon = (type: string) => {
  switch (type) {
    case 'training': return 'i-lucide-dumbbell'
    case 'test': return 'i-lucide-clipboard-check'
    case 'meeting': return 'i-lucide-users'
    case 'match': return 'i-lucide-flag'
    default: return 'i-lucide-calendar'
  }
}

// Formatowanie czasu wydarzenia
const formatEventTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })
}

// Formatowanie daty wydarzenia
const formatEventDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' })
}
</script>

<template>
  <NuxtLayout>
    <XDashboardPage :loading="false">
      <template #header-panel>
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p class="text-gray-600 dark:text-gray-400 mt-1">{{ currentDate }}</p>
          </div>

          <div class="flex items-center gap-3">
            <UButton 
              to="/dashboard/training/new" 
              icon="i-lucide-plus" 
              color="primary"
              class="whitespace-nowrap"
            >
              Nowy trening
            </UButton>
            <UButton 
              to="/dashboard/athlete/new" 
              icon="i-lucide-user-plus" 
              color="primary" 
              variant="soft"
              class="whitespace-nowrap"
            >
              Nowy zawodnik
            </UButton>
          </div>
        </div>
      </template>
  
      <template #main>
        <div class="p-6 space-y-8">
          <!-- Powitanie -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div class="flex items-start justify-between">
              <div>
                <h2 class="text-xl font-bold text-gray-900 dark:text-white">{{ greeting }}, {{ user?.name || 'Trenerze' }}!</h2>
                <p class="text-gray-600 dark:text-gray-400 mt-1">Oto przegląd Twojej aktywności i postępów drużyny.</p>
              </div>
              <UBadge color="primary" variant="soft" size="lg" class="hidden sm:flex">
                <span class="flex items-center gap-1">
                  <UIcon name="i-lucide-zap" class="text-primary-500"/>
                  <span>Premium</span>
                </span>
              </UBadge>
            </div>
          </div>
          
          <!-- Statystyki -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div v-for="(stat, index) in stats" :key="index" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <div class="flex justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ stat.title }}</p>
                  <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ stat.value }}</p>
                </div>
                <div :class="`w-12 h-12 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/30 flex items-center justify-center`">
                  <UIcon :name="stat.icon" :class="`text-${stat.color}-600 dark:text-${stat.color}-400 text-xl`" />
                </div>
              </div>
              <div class="mt-4 flex items-center">
                <UIcon 
                  :name="stat.trend === 'up' ? 'i-lucide-trending-up' : 'i-lucide-trending-down'" 
                  :class="`text-${stat.trend === 'up' ? 'success' : 'danger'}-500 mr-1.5 h-4 w-4`" 
                />
                <p :class="`text-sm text-${stat.trend === 'up' ? 'success' : 'danger'}-500`">
                  {{ stat.change }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400 ml-1.5">od ostatniego okresu</p>
              </div>
            </div>
          </div>
          
          <!-- Wykresy i aktywność -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Wykres aktywności -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <div class="flex justify-between items-start mb-6">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Aktywność tygodniowa</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Treningi i testy w ostatnim tygodniu</p>
                </div>
                <UDropdown :items="[
                  { label: 'Ostatni tydzień', icon: 'i-lucide-calendar-days', click: () => {} },
                  { label: 'Ostatni miesiąc', icon: 'i-lucide-calendar', click: () => {} },
                  { label: 'Ostatni kwartał', icon: 'i-lucide-calendar-range', click: () => {} },
                ]">
                  <UButton color="primary" variant="ghost" icon="i-lucide-more-horizontal" />
                </UDropdown>
              </div>
              <div class="h-64">
                <!-- Tutaj należy wstawić komponent wykresu słupkowego -->
                <!-- Przykładowy placeholder -->
                <div class="flex h-full items-end justify-between gap-2 py-4">
                  <div v-for="(day, i) in activityData.labels" :key="i" class="flex flex-col items-center gap-2 w-full">
                    <div class="relative w-full flex justify-center">
                      <div 
                        class="w-4/5 bg-primary-500/50 dark:bg-primary-400/50 rounded-t"
                        :style="{ height: `${activityData.datasets?.[0]?.data && i < activityData.datasets[0].data.length ? activityData.datasets[0].data[i] * 5 : 0}px` }"
                      ></div>
                      <div 
                        class="w-4/5 absolute bottom-0 bg-primary-500 dark:bg-primary-400 rounded-t"
                        :style="{ height: `${activityData.datasets?.[1]?.data && i < activityData.datasets[1].data.length ? activityData.datasets[1].data[i] * 5 : 0}px` }"
                      ></div>
                    </div>
                    <span class="text-xs text-gray-500 dark:text-gray-400">{{ day }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Postęp zawodników -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <div class="flex justify-between items-start mb-6">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Postęp zawodników</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Porównanie wydajności</p>
                </div>
                <UButton color="primary" variant="soft" size="sm" to="/dashboard/performance">
                  Szczegóły
                </UButton>
              </div>
              <div class="h-64">
                <!-- Tutaj należy wstawić komponent wykresu radarowego -->
                <!-- Przykładowy placeholder -->
                <div class="h-full w-full flex items-center justify-center relative">
                  <div class="absolute top-0 left-0 right-0 bottom-0 rounded-full border-2 border-gray-200 dark:border-gray-700/50 opacity-20"></div>
                  <div class="absolute top-1/6 left-1/6 right-1/6 bottom-1/6 rounded-full border-2 border-gray-200 dark:border-gray-700/50 opacity-30"></div>
                  <div class="absolute top-1/3 left-1/3 right-1/3 bottom-1/3 rounded-full border-2 border-gray-200 dark:border-gray-700/50 opacity-40"></div>
                  <div class="absolute top-[45%] left-[45%] right-[45%] bottom-[45%] rounded-full border-2 border-gray-200 dark:border-gray-700/50 opacity-50"></div>
                  
                  <div class="w-full h-full relative">
                    <div class="absolute top-0 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">Szybkość</div>
                    <div class="absolute top-1/3 right-0 text-xs text-gray-500">Wytrzymałość</div>
                    <div class="absolute bottom-0 right-1/4 text-xs text-gray-500">Siła</div>
                    <div class="absolute bottom-0 left-1/4 text-xs text-gray-500">Koordynacja</div>
                    <div class="absolute top-1/3 left-0 text-xs text-gray-500">Gibkość</div>
                    
                    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48">
                      <div class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full h-24 w-px bg-primary-500/50"></div>
                      <div class="absolute top-1/2 right-0 transform translate-y-1/2 h-px w-24 bg-primary-500/50"></div>
                      <div class="absolute bottom-0 right-1/4 transform translate-y-full h-24 w-px bg-primary-500/50"></div>
                      <div class="absolute bottom-0 left-1/4 transform translate-y-full h-24 w-px bg-primary-500/50"></div>
                      <div class="absolute top-1/2 left-0 transform -translate-x-full h-px w-24 bg-primary-500/50"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Zadania i zawodnicy -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Zadania do wykonania -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Zadania do wykonania</h3>
                <UButton color="primary" variant="ghost" size="sm" icon="i-lucide-plus" to="/dashboard/tasks">
                  Nowe zadanie
                </UButton>
              </div>
              <div class="space-y-4">
                <div v-for="task in tasks" :key="task.id" class="flex items-center justify-between p-3 border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div class="flex items-center">
                    <UCheckbox 
                      :model-value="task.status === 'completed'" 
                      @update:model-value="toggleTaskStatus(task.id)" 
                      color="primary" 
                      class="mr-3"
                    />
                    <div>
                      <p class="text-sm font-medium text-gray-900 dark:text-white" :class="{'line-through opacity-70': task.status === 'completed'}">
                        {{ task.title }}
                      </p>
                      <div class="flex items-center mt-1">
                        <UIcon name="i-lucide-calendar" class="text-gray-400 h-3.5 w-3.5 mr-1" />
                        <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(task.dueDate) }}</p>
                      </div>
                    </div>
                  </div>
                  <UBadge :color="priorityColor(task.priority)" class="uppercase text-xs">
                    {{ task.priority }}
                  </UBadge>
                </div>
              </div>
              <div class="mt-4 text-center">
                <UButton variant="link" color="primary" to="/dashboard/tasks" size="sm">
                  Zobacz wszystkie zadania
                </UButton>
              </div>
            </div>
            
            <!-- Top zawodnicy -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Najlepsi zawodnicy</h3>
                <UButton color="primary" variant="ghost" size="sm" to="/dashboard/athletes">
                  Wszyscy zawodnicy
                </UButton>
              </div>
              <div class="space-y-4">
                <div v-for="athlete in topAthletes" :key="athlete.id" class="flex items-center justify-between p-3 border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div class="flex items-center">
                    <UAvatar 
                      :text="athlete.name.split(' ').map(n => n[0]).join('')"
                      :ui="{ fallback: 'bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-300' }"
                      size="sm"
                      class="mr-3"
                    />
                    <div>
                      <p class="text-sm font-medium text-gray-900 dark:text-white">{{ athlete.name }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">{{ athlete.position }}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="bg-primary-50 dark:bg-primary-900/30 px-2 py-1 rounded">
                      <span class="text-xs font-medium text-primary-700 dark:text-primary-300">{{ athlete.performance }}%</span>
                    </div>
                    <UBadge :color="athleteStatusColor(athlete.status)" size="xs" class="uppercase">
                      {{ athlete.status }}
                    </UBadge>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Ostatnie wydarzenia -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Ostatnie wydarzenia</h3>
              <UButton color="primary" variant="ghost" size="sm" to="/dashboard/calendar">
                Pełny kalendarz
              </UButton>
            </div>
            <div class="space-y-4">
              <div v-for="event in recentEvents" :key="event.id" class="flex gap-4 p-4 border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div :class="`w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0`">
                  <UIcon :name="eventTypeIcon(event.type)" class="text-primary-600 dark:text-primary-400 text-xl" />
                </div>
                <div class="flex-grow">
                  <div class="flex justify-between items-start">
                    <div>
                      <h4 class="text-sm font-medium text-gray-900 dark:text-white">{{ event.title }}</h4>
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ event.description }}</p>
                    </div>
                    <div class="text-right">
                      <p class="text-sm font-medium text-gray-900 dark:text-white">{{ formatEventTime(event.date) }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ formatEventDate(event.date) }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Szybkie akcje -->
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <UButton 
              block 
              color="primary" 
              to="/dashboard/training/new" 
              class="h-24 flex flex-col items-center justify-center"
            >
              <UIcon name="i-lucide-dumbbell" class="h-6 w-6 mb-2" />
              <span>Nowy trening</span>
            </UButton>
            
            <UButton 
              block 
              color="info" 
              to="/dashboard/performance/test/new" 
              class="h-24 flex flex-col items-center justify-center"
            >
              <UIcon name="i-lucide-clipboard-list" class="h-6 w-6 mb-2" />
              <span>Nowy test</span>
            </UButton>
            
            <UButton 
              block 
              color="success" 
              to="/dashboard/athlete/new" 
              class="h-24 flex flex-col items-center justify-center"
            >
              <UIcon name="i-lucide-user-plus" class="h-6 w-6 mb-2" />
              <span>Nowy zawodnik</span>
            </UButton>
            
            <UButton 
              block 
              color="warning" 
              to="/dashboard/reports" 
              class="h-24 flex flex-col items-center justify-center"
            >
              <UIcon name="i-lucide-file-bar-chart" class="h-6 w-6 mb-2" />
              <span>Generuj raport</span>
            </UButton>
          </div>
        </div>
      </template>
    </XDashboardPage>
  </NuxtLayout>
</template>

<style scoped>
/* Dodatkowe style dla dashboardu */
.shimmer {
  position: relative;
  overflow: hidden;
}

.shimmer::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: linear-gradient(90deg, 
    rgba(255,255,255,0) 0%, 
    rgba(255,255,255,0.2) 50%, 
    rgba(255,255,255,0) 100%);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.dark .shimmer::after {
  background: linear-gradient(90deg, 
    rgba(255,255,255,0) 0%, 
    rgba(255,255,255,0.05) 50%, 
    rgba(255,255,255,0) 100%);
}
</style>