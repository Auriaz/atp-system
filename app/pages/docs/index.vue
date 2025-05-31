<script setup lang="ts">
definePageMeta({
  layout: 'docs',
});

const { userRoles } = usePermissions();

// Stan widoku i filtrowania
const viewMode = ref<'grid' | 'list'>('grid');
const selectedCategory = ref<string | null>(null);
const showAllDocs = ref(false);

// Referencja do komponentu wyszukiwania
const searchComponent = ref();

// Pobierz kategorie dokumentacji dostępne dla użytkownika
const { data: categories } = await useAsyncData('docs', async () => {
  // Pobierz wszystkie dokumenty z metadanymi
  const docs = await queryCollection('docs').all()

  // Filtruj według ról użytkownika
  const filteredDocs = docs.filter(doc => {
    if (!doc.requiredRole) return true;
    if (userRoles.value.includes('admin')) return true;
  
    const requiredRoles = Array.isArray(doc.requiredRole) 
      ? doc.requiredRole 
      : [doc.requiredRole];
  
    return userRoles.value.some((role: string) => requiredRoles.includes(role));
  });

  // Grupuj po kategoriach
  const categoriesMap: Record<string, any[]> = {};
  filteredDocs.forEach(doc => {
    const category = doc.category || 'Bez kategorii';
    if (!categoriesMap[category]) {
      categoriesMap[category] = [];
    }
    categoriesMap[category].push(doc);
  });

  return Object.entries(categoriesMap).map(([name, items]) => ({
    name,
    items,
    icon: getCategoryIcon(name),
    color: getCategoryColor(name)
  }));
});

// Funkcja do przypisania ikon kategorii
const getCategoryIcon = (categoryName: string) => {
  const iconMap: Record<string, string> = {
    'Wprowadzenie': 'i-lucide-rocket',
    'Użytkownicy': 'i-lucide-users',
    'Administracja': 'i-lucide-shield',
    'API': 'i-lucide-code',
    'Instrukcje': 'i-lucide-book-open',
    'FAQ': 'i-lucide-help-circle',
    'Bezpieczeństwo': 'i-lucide-lock',
    'Raporty': 'i-lucide-bar-chart',
    'Integracje': 'i-lucide-zap',
    'Trenowanie': 'i-lucide-dumbbell',
    'Zawodnicy': 'i-lucide-medal',
    'Trenerzy': 'i-lucide-whistle',
    'Zarządzanie': 'i-lucide-settings',
    'Bez kategorii': 'i-lucide-folder'
  };
  return iconMap[categoryName] || 'i-lucide-file-text';
};

// Funkcja do przypisania kolorów kategorii
const getCategoryColor = (categoryName: string) => {
  const colorMap: Record<string, string> = {
    'Wprowadzenie': 'from-blue-500 to-cyan-500',
    'Użytkownicy': 'from-green-500 to-emerald-500',
    'Administracja': 'from-red-500 to-pink-500',
    'API': 'from-purple-500 to-violet-500',
    'Instrukcje': 'from-orange-500 to-amber-500',
    'FAQ': 'from-indigo-500 to-blue-500',
    'Bezpieczeństwo': 'from-gray-600 to-gray-800',
    'Raporty': 'from-teal-500 to-cyan-500',
    'Integracje': 'from-yellow-500 to-orange-500',
    'Trenowanie': 'from-emerald-500 to-green-600',
    'Zawodnicy': 'from-amber-500 to-yellow-500',
    'Trenerzy': 'from-blue-600 to-indigo-600',
    'Zarządzanie': 'from-slate-500 to-gray-600',
    'Bez kategorii': 'from-gray-400 to-gray-500'
  };
  return colorMap[categoryName] || 'from-gray-400 to-gray-500';
};

// Funkcja odświeżania danych
const { refresh } = await useAsyncData('docs', async () => {
  // Pobierz wszystkie dokumenty z metadanymi
  const docs = await queryCollection('docs').all()

  // Filtruj według ról użytkownika
  const filteredDocs = docs.filter(doc => {
    if (!doc.requiredRole) return true;
    if (userRoles.value.includes('admin')) return true;
  
    const requiredRoles = Array.isArray(doc.requiredRole) 
      ? doc.requiredRole 
      : [doc.requiredRole];
  
    return userRoles.value.some((role: string) => requiredRoles.includes(role));
  });

  // Grupuj po kategoriach
  const categoriesMap: Record<string, any[]> = {};
  filteredDocs.forEach(doc => {
    const category = doc.category || 'Bez kategorii';
    if (!categoriesMap[category]) {
      categoriesMap[category] = [];
    }
    categoriesMap[category].push(doc);
  });

  return Object.entries(categoriesMap).map(([name, items]) => ({
    name,
    items,
    icon: getCategoryIcon(name),
    color: getCategoryColor(name)
  }));
});

// Funkcje interaktywne
const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid';
};

const showCategoryDetails = (categoryName: string) => {
  selectedCategory.value = categoryName;
  showAllDocs.value = true;
};

const closeCategoryDetails = () => {
  selectedCategory.value = null;
  showAllDocs.value = false;
};

// Funkcja otwierania wyszukiwania
const openSearch = () => {
  if (searchComponent.value) {
    searchComponent.value.openSearch();
  }
};

// Computed properties
const currentCategory = computed(() => {
  if (!selectedCategory.value || !categories.value) {
    return null;
  }
  
  return categories.value.find(cat => cat.name === selectedCategory.value) || null;
});

const gridColumns = computed(() => {
  return viewMode.value === 'grid' 
    ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
    : 'grid-cols-1';
});

</script>

<template>
  <NuxtLayout>
    <!-- Hero Section -->
    <div class="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 dark:from-gray-900 dark:via-gray-800 dark:to-primary-900 py-16 md:py-24 mb-12">
      <div class="absolute inset-0 bg-black/10"></div>
      <div class="relative container mx-auto px-4">
        <div class="text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full mb-6">
            <UIcon name="i-lucide-book-open" class="h-8 w-8 text-white" />
          </div>
          
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Dokumentacja
            <span class="bg-gradient-to-r from-primary-200 to-white bg-clip-text text-transparent">ATP</span>
          </h1>
          
          <p class="text-xl md:text-2xl text-primary-100 dark:text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed">
            Kompleksowy przewodnik po platformie ATP. Znajdź wszystko, czego potrzebujesz, 
            aby w pełni wykorzystać możliwości naszego systemu.
          </p>          <div class="flex flex-col sm:flex-row gap-4 justify-center">
         
                    <!-- Search Component -->
            <XDocumentationSearch 
              ref="searchComponent"
              :categories="categories || []"
              size="xl" color="neutral" variant="solid" icon="i-lucide-search"
            />
            
            <UButton size="xl" variant="outline" color="neutral" icon="i-lucide-download">
              Pobierz PDF
            </UButton>
          </div>
        </div>
      </div>
      
      <!-- Wave separator -->
      <div class="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg class="relative block w-full h-16 sm:h-24" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.11,141.39,111.56,219.35,94.19Z" class="fill-white dark:fill-gray-900"></path>
        </svg>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 pb-20">
      <!-- Statistics Section -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        <div class="text-center">
          <div class="bg-gradient-to-br from-blue-500 to-cyan-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
            <UIcon name="i-lucide-file-text" class="h-6 w-6 text-white" />
          </div>
          <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ categories?.reduce((acc, cat) => acc + cat.items.length, 0) || 0 }}</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">Dokumentów</div>
        </div>
        
        <div class="text-center">
          <div class="bg-gradient-to-br from-green-500 to-emerald-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
            <UIcon name="i-lucide-folder" class="h-6 w-6 text-white" />
          </div>
          <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ categories?.length || 0 }}</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">Kategorii</div>
        </div>
        
        <div class="text-center">
          <div class="bg-gradient-to-br from-purple-500 to-violet-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
            <UIcon name="i-lucide-clock" class="h-6 w-6 text-white" />
          </div>
          <div class="text-2xl font-bold text-gray-900 dark:text-white">24/7</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">Dostępność</div>
        </div>
        
        <div class="text-center">
          <div class="bg-gradient-to-br from-orange-500 to-amber-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
            <UIcon name="i-lucide-update" class="h-6 w-6 text-white" />
          </div>
          <div class="text-2xl font-bold text-gray-900 dark:text-white">Live</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">Aktualizacje</div>
        </div>
      </div>      <!-- Categories Grid -->
      <div v-if="categories && categories.length > 0">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Kategorie dokumentacji</h2>
          <div class="flex gap-2">
            <UButton 
              variant="ghost" 
              :icon="viewMode === 'grid' ? 'i-lucide-grid-3x3' : 'i-lucide-list'" 
              size="sm"
              @click="toggleViewMode"
            >
              {{ viewMode === 'grid' ? 'Widok siatki' : 'Widok listy' }}
            </UButton>
          </div>
        </div>
          <div :class="`grid ${gridColumns} gap-6`">
          <div
            v-for="(category, index) in categories"
            :key="category.name"
            class="group relative"
          >            <!-- Category Card -->            <div :class="[
              'relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 overflow-hidden category-card backdrop-blur-sm',
              viewMode === 'list' ? 'flex items-stretch min-h-[180px] max-h-[220px]' : 'flex flex-col min-h-[320px]'
            ]">
              <!-- Gradient Background -->
              <div :class="`absolute inset-0 bg-gradient-to-br ${category.color} opacity-3 group-hover:opacity-8 transition-opacity duration-300`"></div>
              
              <!-- Decorative Elements -->
              <div class="absolute top-0 right-0 w-32 h-32 opacity-5 transform rotate-12 translate-x-8 -translate-y-8">
                <div :class="`w-full h-full rounded-full bg-gradient-to-br ${category.color}`"></div>
              </div>
                <!-- Header with Icon -->
              <div :class="[
                'relative flex-shrink-0 bg-gray-50/50 dark:bg-gray-900/50',
                viewMode === 'list' ? 'w-80 p-6 flex flex-col justify-center border-r border-gray-200 dark:border-gray-700' : 'p-6 pb-4 border-b border-gray-200/30 dark:border-gray-700/30'
              ]">
                <div :class="[
                  'flex',
                  viewMode === 'list' ? 'flex-col space-y-3' : 'items-start justify-between'
                ]">
                  <div class="flex items-center space-x-4">
                    <div :class="`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg flex-shrink-0 ring-1 ring-black/5`">
                      <UIcon :name="category.icon" class="h-6 w-6 text-white" />
                    </div>
                    <div :class="viewMode === 'list' ? 'min-w-0 flex-1' : 'flex-1 min-w-0'">
                      <h3 class="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-tight mb-1">
                        {{ category.name }}
                      </h3>
                      <div class="text-sm text-gray-600 dark:text-gray-400 font-medium">
                        {{ category.items.length }} {{ category.items.length === 1 ? 'dokument' : category.items.length < 5 ? 'dokumenty' : 'dokumentów' }}
                      </div>
                    </div>
                  </div>
                  
                  <div v-if="viewMode === 'grid'" class="text-right flex-shrink-0 mt-2">
                    <div class="flex items-center space-x-2">
                      <span class="text-2xl font-bold text-gray-900 dark:text-white">{{ category.items.length }}</span>
                      <div class="w-2 h-2 rounded-full bg-gradient-to-r from-primary-400 to-primary-600"></div>
                    </div>
                  </div>
                </div>
              </div>              <!-- Documents List -->
              <div :class="[
                'relative flex-1 bg-white dark:bg-gray-800',
                viewMode === 'list' ? 'p-6 overflow-hidden' : 'p-6'
              ]">
                <div v-if="viewMode === 'grid'" class="mb-4">
                  <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                    <UIcon name="i-lucide-file-text" class="h-4 w-4 mr-2" />
                    Dostępne dokumenty
                  </h4>
                </div>
                
                <div :class="[
                  viewMode === 'list' ? 'space-y-3 max-h-32 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent' : 'space-y-2.5'
                ]">
                  <div
                    v-for="(doc, docIndex) in viewMode === 'list' ? category.items : category.items.slice(0, 4)"
                    :key="doc.path"
                    :class="[
                      'group/item transition-all duration-200',
                      viewMode === 'list' ? 'p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-gray-50 dark:hover:bg-gray-700/50' : 'p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    ]"
                  >
                    <div class="flex items-start space-x-3">
                      <div :class="[
                        'rounded-full flex-shrink-0 mt-1 transition-colors',
                        viewMode === 'list' ? 'w-2 h-2 bg-primary-400 group-hover/item:bg-primary-600' : 'w-1.5 h-1.5 bg-gray-400 group-hover/item:bg-primary-500'
                      ]"></div>
                      <div class="min-w-0 flex-1">
                        <NuxtLink 
                          :to="doc.path" 
                          :class="[
                            'hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium leading-relaxed block',
                            viewMode === 'list' ? 'text-base text-gray-800 dark:text-gray-200' : 'text-sm text-gray-700 dark:text-gray-300'
                          ]"
                        >
                          {{ doc.title }}
                        </NuxtLink>
                        <p v-if="doc.description && viewMode === 'list'" class="text-sm text-gray-600 dark:text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">
                          {{ doc.description }}
                        </p>
                        <div v-if="viewMode === 'list'" class="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-500">
                          <UIcon name="i-lucide-clock" class="h-3 w-3 mr-1" />
                          <span>Ostatnio zaktualizowano</span>
                        </div>
                      </div>
                      <div v-if="viewMode === 'list'" class="flex-shrink-0">
                        <UIcon name="i-lucide-arrow-right" class="h-4 w-4 text-gray-400 group-hover/item:text-primary-500 transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>                <!-- More Items Indicator -->
                <div v-if="category.items.length > 4 && viewMode === 'grid'" class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div class="flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-3">
                    <div class="flex items-center space-x-2">
                      <UIcon name="i-lucide-plus-circle" class="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <span class="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {{ category.items.length - 4 }} więcej dokumentów
                      </span>
                    </div>
                    <UButton 
                      variant="ghost" 
                      size="xs" 
                      icon="i-lucide-arrow-right"
                      @click="showCategoryDetails(category.name)"
                      class="text-xs font-medium"
                    >
                      Zobacz więcej
                    </UButton>
                  </div>
                </div>                <!-- Show All Button for List View -->
                <div v-if="category.items.length > 6 && viewMode === 'list'" class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <UButton 
                    variant="ghost" 
                    size="sm" 
                    icon="i-lucide-external-link"
                    @click="showCategoryDetails(category.name)"
                    class="w-full justify-center"
                  >
                    Zobacz wszystkie dokumenty ({{ category.items.length }})
                  </UButton>
                </div>
              </div>
                <!-- Hover Overlay -->
              <div class="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              
              <!-- Subtle Border Glow -->
              <div class="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" 
                   style="box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 -1px 0 rgba(0, 0, 0, 0.1);">
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-else-if="!categories" class="text-center py-20">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-6">
          <UIcon name="i-lucide-loader-2" class="h-8 w-8 text-primary-600 dark:text-primary-400 animate-spin" />
        </div>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Ładowanie dokumentacji...</h3>
        <p class="text-gray-600 dark:text-gray-400">Pobieramy najnowsze informacje dla Ciebie</p>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-20">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-6">
          <UIcon name="i-lucide-file-x" class="h-8 w-8 text-gray-400" />
        </div>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Brak dostępnej dokumentacji</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">Nie znaleziono dokumentów dla Twojego poziomu dostępu</p>
        <UButton icon="i-lucide-refresh-cw" @click="refresh()">
          Odśwież
        </UButton>
      </div>

      <!-- Quick Actions -->
      <div class="mt-20 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-8">
        <div class="text-center mb-8">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Potrzebujesz pomocy?</h3>
          <p class="text-gray-600 dark:text-gray-400">Skorzystaj z dodatkowych zasobów i wsparcia</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <UButton 
            to="/contact" 
            variant="outline" 
            size="lg" 
            icon="i-lucide-mail" 
            class="justify-center py-4"
          >
            Skontaktuj się z nami
          </UButton>
          
          <UButton 
            to="/faq" 
            variant="outline" 
            size="lg" 
            icon="i-lucide-help-circle" 
            class="justify-center py-4"
          >
            Sprawdź FAQ
          </UButton>
          
          <UButton 
            href="#" 
            variant="outline" 
            size="lg" 
            icon="i-lucide-video" 
            class="justify-center py-4"
          >
            Obejrzyj tutoriale
          </UButton>
        </div>
      </div>      <!-- Category Details Modal -->
      <UModal v-model:open="showAllDocs" >
        <template #content>
          <UCard v-if="currentCategory">
            <!-- Modal Header -->
            <template #header>
              <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div class="flex items-center space-x-3">
                  <div :class="`w-10 h-10 rounded-lg bg-gradient-to-br ${currentCategory.color} flex items-center justify-center shadow-lg`">
                    <UIcon :name="currentCategory.icon" class="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ currentCategory.name }}</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ currentCategory.items.length }} dokumentów</p>
                  </div>
                </div>
                <UButton color="neutral" variant="ghost" icon="i-lucide-x" @click="closeCategoryDetails" />
              </div>
            </template>
  
            <!-- Modal Body -->
            <div class="space-y-4 max-h-96 overflow-y-auto p-6">
              <div
                v-for="(doc, index) in currentCategory.items"
                :key="doc.path"
                class="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
              >
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                    <UIcon name="i-lucide-file-text" class="h-4 w-4 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h4 class="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {{ doc.title }}
                    </h4>
                    <p v-if="doc.description" class="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                      {{ doc.description }}
                    </p>
                  </div>
                </div>
                <NuxtLink :to="doc.path">
                  <UButton size="sm" variant="outline" icon="i-lucide-arrow-right" @click="closeCategoryDetails">
                    Otwórz
                  </UButton>
                </NuxtLink>
              </div>
            </div>
  
            <!-- Modal Footer -->
            <template #footer>
              <div class="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
                <UButton color="neutral" variant="outline" @click="closeCategoryDetails">
                  Zamknij
                </UButton>
              </div>
            </template>
          </UCard>
        </template>      
      </UModal>      
    </div>
  </NuxtLayout>
</template>

<style scoped>
/* Animacje wejścia */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Klasy animacji */
.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}

.animate-slide-in-left {
  animation: slideInLeft 0.6s ease-out forwards;
}

.animate-pulse-hover:hover {
  animation: pulse 1s ease-in-out infinite;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

/* Efekty hover dla kart */
.category-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
}

.dark .category-card {
  background: linear-gradient(145deg, #1e293b 0%, #0f172a 100%);
}

.category-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
}

.dark .category-card:hover {
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
}

/* Grid view specific styles */
.grid-cols-1:not(.md\:grid-cols-2) .category-card {
  /* List view - horizontal layout */
  min-height: 180px;
  max-height: 220px;
}

.grid-cols-1.md\:grid-cols-2 .category-card,
.grid-cols-1.md\:grid-cols-2.xl\:grid-cols-3 .category-card {
  /* Grid view - vertical layout */
  min-height: 320px;
  display: flex;
  flex-direction: column;
}

/* Ensure proper spacing in list view */
.grid-cols-1:not(.md\:grid-cols-2) .category-card .relative {
  flex-shrink: 0;
}

/* Enhanced document item hover */
.group\/item:hover {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%);
}

.dark .group\/item:hover {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%);
}

/* Better text wrapping */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Gradient text */
.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Glass morphism effect */
.glass-morphism {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.dark .glass-morphism {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Staggered animations */
.stagger-1 { animation-delay: 0.1s; }
.stagger-2 { animation-delay: 0.2s; }
.stagger-3 { animation-delay: 0.3s; }
.stagger-4 { animation-delay: 0.4s; }
.stagger-5 { animation-delay: 0.5s; }
.stagger-6 { animation-delay: 0.6s; }

/* Hover effects */
.hover-glow:hover {
  box-shadow: 0 0 30px rgba(99, 102, 241, 0.3);
}

.dark .hover-glow:hover {
  box-shadow: 0 0 30px rgba(99, 102, 241, 0.2);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.dark ::-webkit-scrollbar-track {
  background: #1e293b;
}

.dark ::-webkit-scrollbar-thumb {
  background: #475569;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}

/* Niestandardowy scrollbar dla widoku listy */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.dark ::-webkit-scrollbar-track {
  background: #1e293b;
}

.dark ::-webkit-scrollbar-thumb {
  background: #475569;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}

/* Klasy Tailwind dla scrollbara */
.scrollbar-thin {
  scrollbar-width: thin;
}

.scrollbar-thumb-gray-300 {
  --scrollbar-thumb: #d1d5db;
}

.dark .scrollbar-thumb-gray-600 {
  --scrollbar-thumb: #4b5563;
}

.scrollbar-track-transparent {
  --scrollbar-track: transparent;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .category-card:hover {
    transform: translateY(-4px) scale(1.01);
  }
}
</style>