<script lang="ts" setup>
import type { ContentNavigationItem } from '@nuxt/content';

// Props
const props = defineProps({
  // Struktura nawigacji do wyświetlenia
  navigation: {
    type: Array as PropType<ContentNavigationItem[]>,
    default: () => []
  },
  // Opcjonalna ścieżka bieżącego dokumentu
  currentPath: {
    type: String,
    default: ''
  }
});

// Stan lokalny - które sekcje są rozwinięte
const expandedSections = ref<{[key: string]: boolean}>({});

// Ustal aktualną ścieżkę
const route = useRoute();
const activePath = computed(() => props.currentPath || route.path);

// Funkcja do sprawdzania, czy element jest aktywny
const isActive = (path: string) => {
  return activePath.value === path;
};

// Funkcja do sprawdzania, czy element ma aktywne dzieci (rekurencyjne sprawdzanie)
const hasActiveChild = (item: any): boolean => {
  if (!item.children) return false;
  
  return item.children.some((child: any) => 
    isActive(child.path) || hasActiveChild(child)
  );
};

// Inicjalizuj rozwinięte sekcje na podstawie aktualnej ścieżki
onMounted(() => {
  if (props.navigation && props.navigation.length > 0) {
    // Pobieramy pierwszy element, który powinien być głównym "Docs"
    const mainNav = props.navigation[0];
    if (mainNav && mainNav.children) {
      initExpandedSections(mainNav.children);
    }
  }
});

// Funkcja rekurencyjna do inicjalizacji rozwiniętych sekcji
function initExpandedSections(items: any[]) {
  items.forEach(item => {
    if (item.children) {
      // Rozwiń sekcję jeśli zawiera aktywny element
      if (hasActiveChild(item) || isActive(item.path)) {
        expandedSections.value[item.path] = true;
      }
      // Rekurencyjnie inicjalizuj dzieci
      initExpandedSections(item.children);
    }
  });
}

// Przełączanie stanu rozwinięcia sekcji
function toggleSection(path: string) {
  expandedSections.value[path] = !expandedSections.value[path];
}

// Pobranie głównej nawigacji (zazwyczaj jest to pierwszy element z children)
const mainNavigation = computed(() => {
  if (props.navigation && props.navigation.length > 0 && props.navigation[0]) {
    const { checkDocumentAccess } = useDocumentation();
    
    // Pobierz dzieci pierwszego elementu
    const children = props.navigation[0].children || [];

    // Rekurencyjne filtrowanie elementów nawigacji
    const filterByPermissions = (items: ContentNavigationItem[]): ContentNavigationItem[] => {
      return items.filter(item => {
        // Sprawdź, czy użytkownik ma dostęp do tego elementu
        // Przekazujemy wymagane role z własności niestandardowej lub domyślnie zwracamy true
        const hasAccess = checkDocumentAccess({
          requiredRole: (item as any).requiredRole || undefined
        });
        
        // Jeśli ma dzieci, rekurencyjnie je filtruj
        if (hasAccess && item.children && item.children.length > 0) {
          item.children = filterByPermissions(item.children);
        }
        
        return hasAccess;
      });
    };
    
    // Zwróć przefiltrowaną nawigację
    return filterByPermissions(children);
  }
  return [] as ContentNavigationItem[];
});



// Scroll behaviour dla sidebar gdy zbliża się do footera
const sidebar = ref<HTMLElement | null>(null);
const footer = ref<HTMLElement | null>(null);
const sidebarHeight = ref(0);

// Funkcja do scrollowania sidebara gdy zbliża się do footera
function scrollSidebar(): void {
  if (!sidebar.value || !footer.value) return;
  
  // Pobierz pozycje elementów
  const sidebarRect = sidebar.value.getBoundingClientRect();
  const footerRect = footer.value.getBoundingClientRect();
  
  // Zapisz wysokość sidebara jeśli nie jest jeszcze zapisana
  if (sidebarHeight.value === 0) {
    sidebarHeight.value = sidebarRect.height;
  }
  
  // Oblicz odległość między sidebarem a footerem
  const distanceToFooter = footerRect.top - (sidebarRect.top + sidebarHeight.value);
  
  // Gdy footer zbliża się, przesuń sidebar w górę
  if (distanceToFooter < 20) {
    const offset = 10 - distanceToFooter;
    sidebar.value.style.transform = `translateY(-${offset}px)`;
  } else {
    sidebar.value.style.transform = 'translateY(0)';
  }
}

// Dodaj nasłuchiwanie na scroll
onMounted(() => {
  sidebar.value = document.getElementById('documentation-sidebar');
  footer.value = document.querySelector('footer');
  
  if (props.navigation && props.navigation.length > 0) {
    // Inicjalizacja rozwiniętych sekcji...
    const mainNav = props.navigation[0];
    if (mainNav && mainNav.children) {
      initExpandedSections(mainNav.children);
    }
  }
  
  window.addEventListener('scroll', scrollSidebar);
  // Wywołaj raz po załadowaniu, aby ustawić początkową pozycję
  setTimeout(scrollSidebar, 100);``
});

// Sprzątanie
onUnmounted(() => {
  window.removeEventListener('scroll', scrollSidebar);
});
</script>

<template>
  <div id="documentation-sidebar" class=" fixed w-56 h-[calc(100hv-55px)] pt-6 pb-42 flex flex-col justify-between  border-r border-primary-200/40 dark:border-primary-800/40" >
    <!-- Główna sekcja dokumentacji -->
    <div class="mb-6">
      <h2 class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 px-3">
        Dokumentacja
      </h2>

      <!-- Loader podczas ładowania nawigacji -->
      <div v-if="!navigation || navigation.length === 0" class="px-3 py-2 text-sm text-gray-500">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin h-4 w-4 inline mr-2" />
        Ładowanie nawigacji...
      </div>

      <!-- Nawigacja -->
      <ul v-else class="space-y-1">
        <!-- Strona główna dokumentacji -->
        <li class="mb-2">
          <NuxtLink 
            to="/docs" 
            class="flex items-center px-3 py-2 text-sm rounded-md transition-colors"
            :class="[
              isActive('/docs') ? 
                ' text-primary-600  dark:bg-opacity-30 dark:text-primary-400' : 
                'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
            ]"
          >
            <UIcon name="i-heroicons-home" class="h-5 w-5 mr-2" />
            Dokumentacja ATP
          </NuxtLink>
        </li>

        <!-- Rekurencyjny komponent nawigacji -->
        <template v-for="(item, index) in mainNavigation" :key="`nav-${index}-${item.path}`">
          <XDocumentationSidebarItem 
            :item="item" 
            :level="0"
            :is-active="isActive"
            :has-active-child="hasActiveChild"
            :expanded-sections="expandedSections"
            @toggle-section="toggleSection"
          />
        </template>
      </ul>
    </div>


  </div>
</template>

<style scoped>
.documentation-sidebar {

  padding-bottom: 24px;
  overflow-y: auto;
}
</style>