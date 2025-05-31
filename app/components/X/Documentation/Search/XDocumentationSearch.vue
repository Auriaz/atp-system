<script lang="ts" setup>
// Import composables
import { useDebounceFn } from '@vueuse/core';

// Props dla parametrów wyszukiwania
const props = defineProps({
  // Kategorie dokumentów do przeszukiwania
  categories: {
    type: Array,
    required: true
  },
  // Teksty UI
  placeholder: {
    type: String,
    default: 'Przeszukaj dokumentację...'
  },
  // Konfiguracja wyszukiwania
  searchConfig: {
    type: Object,
    default: () => ({ 
      resultLimit: 10,
      threshold: 0.3 
    })
  },
  size: {
    type: String as PropType<'xs' | 'sm' | 'md' | 'lg' | 'xl'>,
    default: 'md'
  },
  color: {
    type: String as PropType<'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error' | 'neutral'>,
    default: 'primary'
  },
  variant: {
    type: String as PropType<'soft' | 'link' | 'solid' | 'outline' | 'subtle' | 'ghost'>,
    default: 'soft'
  },
  icon: {
    type: String,
    default: 'i-heroicons-magnifying-glass'
  }
});

// Event emitters
const emit = defineEmits(['close']);

// Stan wyszukiwania
const searchTerm = ref('');
const isSearching = ref(false);
const searchResults = ref<any[]>([]);
const searchInput = ref<HTMLInputElement | null>(null);

// Modal state
const isOpen = ref(false);

// Funkcja do otwierania modala (eksportowana)
const openSearch = () => {
  isOpen.value = true;
  nextTick(() => {
    if (searchInput.value) {
      searchInput.value.focus();
    }
  });
};

// Funkcja do zamykania modala
const closeSearch = () => {
  isOpen.value = false;
  searchTerm.value = '';
  searchResults.value = [];
  emit('close');
};

// Funkcja do czyszczenia wyszukiwania
const clearSearch = () => {
  searchTerm.value = '';
  searchResults.value = [];
};

// Funkcja do wyboru wyniku
const selectResult = (path: string) => {
  closeSearch();
  navigateTo(path);
};

// Obsługa klawiatury
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeSearch();
  }
};

// Funkcja wyszukiwania
const performSearch = (query: string) => {
  if (!query || query.length < 2) {
    searchResults.value = [];
    return;
  }

  isSearching.value = true;
  
  try {
    const results: any[] = [];
    const searchLower = query.toLowerCase();

    // Przeszukaj wszystkie kategorie i dokumenty
    props.categories.forEach((category: any) => {
      category.items.forEach((doc: any) => {
        let matchType = '';
        let isMatch = false;

        // Sprawdź tytuł
        if (doc.title && doc.title.toLowerCase().includes(searchLower)) {
          isMatch = true;
          matchType = 'title';
        }
        // Sprawdź opis
        else if (doc.description && doc.description.toLowerCase().includes(searchLower)) {
          isMatch = true;
          matchType = 'description';
        }
        // Sprawdź kategorię
        else if (category.name && category.name.toLowerCase().includes(searchLower)) {
          isMatch = true;
          matchType = 'category';
        }

        if (isMatch) {
          results.push({
            ...doc,
            category: category.name,
            categoryIcon: category.icon,
            categoryColor: category.color,
            matchType
          });
        }
      });
    });

    // Ograniczenie wyników
    searchResults.value = results.slice(0, props.searchConfig.resultLimit);
  } catch (error) {
    console.error('Search error:', error);
    searchResults.value = [];
  } finally {
    isSearching.value = false;
  }
};

// Obserwuj zmiany w terminie wyszukiwania z debounce
const debouncedSearch = useDebounceFn((query: string) => {
  performSearch(query);
}, 300);

watch(searchTerm, (newTerm) => {
  debouncedSearch(newTerm);
});

// Obsługa skrótów klawiszowych (global)
onMounted(() => {
  const handleGlobalKeydown = (event: KeyboardEvent) => {
    // Ctrl+K lub Cmd+K - otwórz wyszukiwanie
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault();
      openSearch();
    }
    // ESC - zamknij wyszukiwanie
    if (event.key === 'Escape' && isOpen.value) {
      closeSearch();
    }
  };

  document.addEventListener('keydown', handleGlobalKeydown);

  onUnmounted(() => {
    document.removeEventListener('keydown', handleGlobalKeydown);
  });
});

// Grupowanie wyników według kategorii
const groupedResults = computed(() => {
  const grouped: Record<string, any[]> = {};
  
  searchResults.value.forEach(result => {
    const category = result.category || 'Bez kategorii';
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(result);
  });
  
  return grouped;
});

// Sprawdź, czy wyszukiwarka ma wyniki
const hasResults = computed(() => searchResults.value.length > 0);

// Eksportuj funkcję otwierania dla komponentu rodzica
defineExpose({
  openSearch
});
</script>

<template>  <!-- Modal wyszukiwania -->
  <UModal 
    v-model:open="isOpen"
    :ui="{ wrapper: 'md:max-w-2xl' }"
  >
      <!-- Trigger Button -->
    <UButton
     :label="placeholder"
      :color="color"
      :variant="variant"
      :icon="icon"
      :size="size"
    />

    <template #content>
      <UCard>
        <div class="search-modal">
          <!-- Pole wyszukiwania -->
          <div class="relative border-b border-gray-200 dark:border-gray-700">
            <UIcon 
              name="i-heroicons-magnifying-glass" 
              class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
            />
            <input
              ref="searchInput"
              v-model="searchTerm"
              type="search"
              :placeholder="placeholder"
              class="w-full py-3 px-12 bg-white dark:bg-gray-900 focus:outline-none text-lg border-0"
              @keydown="handleKeydown"
            />
            <div v-if="searchTerm" class="absolute right-4 top-1/2 transform -translate-y-1/2">
              <UButton
                color="neutral" 
                variant="ghost" 
                icon="i-heroicons-x-mark" 
                size="xs"
                @click="clearSearch"
              />
            </div>
          </div>
          
          <!-- Wyniki wyszukiwania -->
          <div class="search-results max-h-[60vh] overflow-y-auto p-2">
            <!-- Stan ładowania -->
            <div v-if="isSearching" class="p-4 text-center">
              <UIcon name="i-heroicons-arrow-path" class="animate-spin h-6 w-6 mx-auto mb-2 text-gray-400" />
              <p class="text-sm text-gray-500">Wyszukiwanie...</p>
            </div>
            
            <!-- Brak wyników -->
            <div v-else-if="searchTerm.length >= 2 && !hasResults" class="p-6 text-center">
              <UIcon name="i-heroicons-face-frown" class="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
              <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">Brak wyników</h3>
              <p class="text-sm text-gray-500">
                Nie znaleziono dokumentów zawierających "{{ searchTerm }}"
              </p>
              <div class="mt-4">
                <UButton
                  color="primary"
                  variant="soft"
                  @click="clearSearch"
                >
                  Wyczyść wyszukiwanie
                </UButton>
              </div>
            </div>
            
            <!-- Wyniki pogrupowane według kategorii -->
            <div v-else-if="hasResults" class="divide-y divide-gray-200 dark:divide-gray-800">
              <div v-for="(results, category) in groupedResults" :key="category" class="py-3">
                <h3 class="text-xs font-medium text-gray-500 uppercase tracking-wider px-3 mb-2">
                  {{ category }}
                </h3>
    
                <ul class="space-y-1">
                  <li 
                    v-for="result in results" 
                    :key="result.path"
                    @click="selectResult(result.path)"
                    class="px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition"
                  >
                    <div class="flex items-start">
                      <UIcon :name="result.categoryIcon || 'i-heroicons-document-text'" class="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div class="ml-3 flex-1">
                        <div class="font-medium text-gray-900 dark:text-gray-100">{{ result.title }}</div>
                        <div 
                          v-if="result.description" 
                          class="text-sm text-gray-500 mt-0.5 line-clamp-2"
                          v-html="result.description.replace(
                            new RegExp(searchTerm, 'gi'), 
                            (match: string) => `<mark class='bg-primary-100 dark:bg-primary-900 text-primary-900 dark:text-primary-100 px-0.5 rounded'>${match}</mark>`
                          )"
                        ></div>
                        <div class="text-xs text-gray-400 mt-1">{{ result.path }}</div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            
            <!-- Brak zapytania - wskazówki -->
            <div v-else-if="searchTerm.length < 2" class="p-4">
              <p class="text-sm text-center text-gray-500 mb-4">
                Wpisz co najmniej 2 znaki, aby rozpocząć wyszukiwanie
              </p>
              
              <!-- Kategorie jako podpowiedzi -->
              <div v-if="categories && categories.length" class="mt-4">
                <h3 class="text-xs font-medium text-gray-500 uppercase tracking-wider px-3 mb-2">
                  Kategorie dokumentacji
                </h3>
                <div class="grid grid-cols-1 gap-2">
                  <div 
                    v-for="category in (categories as any[]).slice(0, 5)" 
                    :key="(category as any).name"
                    class="px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition"
                    @click="searchTerm = (category as any).name"
                  >
                    <div class="flex items-center">
                      <UIcon :name="(category as any).icon" class="h-4 w-4 text-gray-400 mr-2" />
                      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ (category as any).name }}</span>
                      <span class="ml-auto text-xs text-gray-400">({{ (category as any).items.length }})</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>        </div>
          
          <!-- Stopka -->
          <div class="border-t border-gray-200 dark:border-gray-700 p-2 flex justify-between items-center bg-gray-50 dark:bg-gray-850 text-xs">
            <div class="text-gray-500 px-2">
              <template v-if="searchResults.length">
                {{ searchResults.length }} {{ searchResults.length === 1 ? 'wynik' : 'wyników' }}
              </template>
              <template v-else-if="searchTerm.length >= 2">
                Brak wyników
              </template>
              <template v-else>
                &nbsp;
              </template>
            </div>
            
            <div class="flex items-center space-x-2 text-gray-400">
              <span>ESC</span>
              <span>aby zamknąć</span>
            </div>
          </div>
        </div>
      </UCard>
    </template>
  </UModal>
</template>

<style scoped>
/* Stylizacja scrolla */
.search-results {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.search-results::-webkit-scrollbar {
  width: 6px;
}

.search-results::-webkit-scrollbar-track {
  background: transparent;
}

.search-results::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

.dark .search-results::-webkit-scrollbar-thumb {
  background-color: rgba(75, 85, 99, 0.5);
}

/* Zapewnia płynne animacje */
.search-modal {
  transition: all 0.2s ease;
}
</style>