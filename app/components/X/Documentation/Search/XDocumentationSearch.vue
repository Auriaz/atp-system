<script lang="ts" setup>
import Fuse from 'fuse.js';
import type {ContentNavigationItem} from '@nuxt/content';
// Definicja typu dla wyników wyszukiwania
interface SearchResult {
  item: any;
  matches?: ReadonlyArray<{
    key?: string;
    indices: ReadonlyArray<[number, number]>;
  }>;
}

// Props dla parametrów wyszukiwania
const props = defineProps({
  // Pliki/sekcje do przeszukiwania (pobrane przez queryCollectionSearchSections)
  files: {
    type: Array,
    required: true
  },
  // Struktura nawigacji do wyświetlania (pobrana przez queryCollectionNavigation)
  navigation: {
    type: Array as PropType<ContentNavigationItem[] | undefined>,
    required: true
  },
  // Konfiguracja Fuse.js
  fuse: {
    type: Object,
    default: () => ({ resultLimit: 10 })
  },
  // Teksty UI
  placeholder: {
    type: String,
    default: 'Wyszukaj w dokumentacji...'
  }
});

// Event emitters
const emit = defineEmits(['update:searchTerm']);

// Stan wyszukiwania
const searchTerm = ref('');
const isSearching = ref(false);
const searchResults = ref<SearchResult[]>([]);
const searchInput = ref<HTMLInputElement | null>(null);

// Modal state
const isOpen = ref(false);

// Tryb kolorów
const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === 'dark');

// Obserwuj searchTerm i emituj zdarzenia aktualizacji
watch(searchTerm, (newTerm) => {
  emit('update:searchTerm', newTerm);
  if (newTerm.length >= 2) {
    performSearch();
  } else {
    searchResults.value = [];
  }
});

// Inicjalizacja instancji Fuse dla wyszukiwania
const fuseInstance = computed(() => {
  if (!props.files || props.files.length === 0) return null;
  
  return new Fuse(props.files, {
    keys: ['title', 'description', 'body', 'path', 'category', 'tags'],
    threshold: 0.3,
    distance: 100,
    includeMatches: true,
    ...props.fuse,
  });
});

// Formatowanie wyników wyszukiwania
const formattedResults = computed(() => {
  if (!searchResults.value.length) return [];
  
  return searchResults.value.map(result => {
    // Wyciągnij informacje z wyniku Fuse
    const { item, matches } = result;
    // Znajdź dopasowania dla podświetlenia
    let highlightedText = '';
    
    // Spróbuj znaleźć dopasowania w treści i dodaj fragment
    if (matches && matches.length > 0) {
      const bodyMatches = matches.filter(match => match.key === 'body');
      
      if (bodyMatches[0] ) {
        if(bodyMatches[0].indices.length > 0) {

          const match = bodyMatches[0];
          const indices = match.indices[0];
          const bodyText = item.body || '';
          
          // Weź fragment tekstu wokół dopasowania (do 100 znaków)
          if(indices) {
            const start = Math.max(0, indices[0] - 50);
            const end = Math.min(bodyText.length, indices[1] + 50);
            highlightedText = bodyText.substring(start, end);
            // Dodaj "..." jeśli nie zaczynamy od początku
            if (start > 0) highlightedText = '...' + highlightedText;
            if (end < bodyText.length) highlightedText += '...';
          }
        }
      }
    }
    
    return {
      title: item.title || 'Bez tytułu',
      path: item.id,
      description: item.description || highlightedText || '',
      category: item.category || 'Ogólne',
      icon: item.icon || 'i-heroicons-document'
    };
  });
});

// Grupowanie wyników według kategorii
const groupedResults = computed(() => {
  const groups: Record<string, any[]> = {};
  
  formattedResults.value.forEach(result => {
    if (!groups[result.category]) {
      groups[result.category] = [];
    }
    // Now we can safely access the array since it's guaranteed to exist
    groups[result.category]?.push(result);
  });
  
  return groups;
});

// Wykonaj wyszukiwanie
async function performSearch() {
  if (!fuseInstance.value || searchTerm.value.length < 2) {
    searchResults.value = [];
    return;
  }
  
  isSearching.value = true;
  
  try {
    // Wykonaj wyszukiwanie przez Fuse
    const results = fuseInstance.value.search(searchTerm.value);
    
    // Ogranicz wyniki
    searchResults.value = results.slice(0, props.fuse.resultLimit || 10);
  } catch (error) {
    console.error('Search error:', error);
    searchResults.value = [];
  } finally {
    isSearching.value = false;
  }
}

// Wyczyść wyszukiwanie
function clearSearch() {
  searchTerm.value = '';
  searchResults.value = [];
}

// Wybierz wynik wyszukiwania
function selectResult(path: string) {
  navigateTo(path);
  isOpen.value = false;
  clearSearch();
}

// Obsługa klawisza Escape i innych skrótów
function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    isOpen.value = false;
  }
}

// Obsługa globalnych skrótów klawiszowych
function handleGlobalKeydown(e: KeyboardEvent) {
  // Ctrl+K lub Cmd+K
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    isOpen.value = true;
    nextTick(() => {
      if (searchInput.value) {
        searchInput.value.focus();
      }
    });
  }
}

// Rejestruj globalny skrót klawiszowy (K)
onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown);
});

// Usuń nasłuchiwanie po zniszczeniu komponentu
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleGlobalKeydown);
});

// Sprawdź, czy wyszukiwarka ma wyniki
const hasResults = computed(() => searchResults.value.length > 0);
</script>

<template>
  <div class="search-container">
    <!-- Modal wyszukiwania -->
    <UModal 
      v-model="isOpen"
      :class="{ width: 'md:max-w-2xl', padding: 'p-0', overlay: 'bg-gray-950/75 dark:bg-gray-950/90 backdrop-blur-sm' }"
    >
      <!-- Przycisk wyszukiwania - prosty, bez dodatkowych opcji -->
      <UButton
        icon="i-heroicons-magnifying-glass"
        color="primary"
        variant="soft"
        class="search-button"
        @click="isOpen = true"
      >
        {{ placeholder }}
        <template #trailing>
          <span class="hidden sm:inline-flex items-center gap-1 opacity-70 text-xs">
            <kbd class="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800">⌘</kbd>
            <kbd class="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800">K</kbd>
          </span>
        </template>
      </UButton>
      <template #content>
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
              class="w-full py-3 px-12 bg-white dark:bg-gray-900 focus:outline-none text-lg"
              @keydown="handleKeydown"
            />
            <div v-if="searchTerm" class="absolute right-4 top-1/2 transform -translate-y-1/2">
              <UButton
                color="primary" 
                variant="ghost" 
                icon="i-heroicons-x-mark" 
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
                      <UIcon :name="result.icon" class="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div class="ml-3">
                        <div class="font-medium text-gray-900 dark:text-gray-100">{{ result.title }}</div>
                        <div 
                          v-if="result.description" 
                          class="text-sm text-gray-500 mt-0.5 line-clamp-2"
                          v-html="result.description.replace(
                            new RegExp(searchTerm, 'gi'), 
  (                            match: any) => `<mark class='bg-primary-100 dark:bg-primary-900 text-primary-900 dark:text-primary-100 px-0.5 rounded'>${match}</mark>`
                          )"
                        ></div>
                        <div class="text-xs text-gray-400 mt-1">{{ result.path }}</div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            
            <!-- Brak zapytania -->
            <div v-else-if="searchTerm.length < 2" class="p-4">
              <p class="text-sm text-center text-gray-500">
                Wpisz co najmniej 2 znaki, aby rozpocząć wyszukiwanie
              </p>
              
              <!-- Nawigacja jeśli nie ma wyszukiwania -->
              <div v-if="navigation && navigation.length" class="mt-4">
                <h3 class="text-xs font-medium text-gray-500 uppercase tracking-wider px-3 mb-2">
                  Szybka nawigacja
                </h3>
                
                <div class="space-y-3">
                  <div 
                    v-for="section in navigation.slice(0, 5)" 
                    :key="section.path"
                    class="px-3"
                  >
                    <div class="font-medium text-primary-600 dark:text-primary-400 mb-1">
                      {{ section.title }}
                    </div>
                    <ul class="space-y-1 ml-4">
                      <li v-for="item in section.children?.slice(0, 3)" :key="item.path">
                        <NuxtLink 
                          :to="item.path"
                          class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 text-sm"
                          @click="isOpen = false"
                        >
                          {{ item.title }}
                        </NuxtLink>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
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
      </template>
    </UModal>
  </div>
</template>

<style scoped>
.search-container {
  position: relative;
}

.search-button {
  width: 100%;
  justify-content: flex-start;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  border: 1px solid transparent;
}

/* Style dla trybu jasnego */
:root {
  .search-button {
    border-color: #e5e7eb;
    background-color: white;
  }
}

/* Style dla trybu ciemnego */
.dark .search-button {
  border-color: rgba(75, 85, 99, 0.5);
  background-color: rgba(31, 41, 55, 0.5);
}

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