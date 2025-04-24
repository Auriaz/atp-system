<script lang="ts" setup>
import type { PageCollections } from '@nuxt/content';

// Define interfaces for better type safety
interface TocLink {
  id: string;
  text: string;
  depth: number;
}

interface Toc {
  links: TocLink[];
}

interface PageDocument {
  title: string;
  author?: string;
  createdAt?: string;
  body?: any; // Using 'any' to accommodate MinimalTree structure
}

interface SurroundingDocument {
  path: string;
  title: string;
  description?: string;
  category?: string;
}

const route = useRoute();
const { data: pageDocument } = await useAsyncData(route.path, () => {
  return queryCollection('docs').path(route.path).first();
});

const { data } = await useAsyncData<SurroundingDocument[]>('surround', () => {
  return queryCollectionItemSurroundings<keyof PageCollections>('docs', route.path, {
    before: 1,
    after: 1,
    fields: [ 'description']
  });
});

// Extract TOC information for "On this page" section
const toc = computed<Toc>(() => {
  return (pageDocument.value?.body as any)?.toc || { links: [] };
});

const hasToc = computed<boolean>(() => toc.value.links?.length > 0);

// Referencje do DOM
const fixedToc = ref<HTMLElement | null>(null);
const footer = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);

// Śledzenie aktywnej sekcji
const activeSection = ref<string>('');
const visibleHeadings = ref<Map<string, number>>(new Map());
const headingElements = ref<HTMLElement[]>([]);

// Stan rozwinięcia mobilnego TOC
const isMobileTocOpen = ref(false);

// Funkcja do przełączania mobilnego TOC
function toggleMobileToc() {
  isMobileTocOpen.value = !isMobileTocOpen.value;
}

// Płynne przewijanie do elementu
function scrollToElement(id: string): boolean {
  if (typeof window === 'undefined') return false;
  
  const element = document.getElementById(id);
  if (element) {
    // Dodaj małe opóźnienie dla lepszego UX
    setTimeout(() => {
      const yOffset = -80; // Dodaj offset, aby nagłówek nie był zasłonięty przez nawigację
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      
      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
      
      // Ustaw aktywną sekcję po przewinięciu
      activeSection.value = id;
    }, 10);
    
    return true;
  }
  
  return false;
}

// Funkcja do obsługi kliknięcia w link mobilnego TOC
function handleMobileTocClick(id: string) {
  if (scrollToElement(id)) {
    activeSection.value = id;
    isMobileTocOpen.value = false; // Zamykamy menu po kliknięciu
  }
}

// Funkcja do obsługi przewijania i zatrzymania TOC przed footerem
function updateTocPosition(): void {
  if (!fixedToc.value || !footer.value) return;
  
  const tocEl = fixedToc.value as HTMLElement;
  const footerEl = footer.value as HTMLElement;
  
  // Pobierz pozycje elementów
  const footerRect = footerEl.getBoundingClientRect();
  const tocRect = tocEl.getBoundingClientRect();
  
  // Domyślne ustawienie "przyczepione" do góry
  const defaultTop = '6rem';
  
  // Gdy footer zbliża się, oblicz nową pozycję top
  if (footerRect.top < window.innerHeight) {
    // Oblicz ile miejsca jest między dolną krawędzią TOC a górną krawędzią footera
    const distanceToFooter = footerRect.top - (tocRect.top + tocRect.height);
    
    // Jeśli ta odległość jest mała lub ujemna, przesuń TOC w górę
    if (distanceToFooter < 20) {
      const newTop = `calc(6rem - ${20 - distanceToFooter}px)`;
      tocEl.style.top = newTop;
    } else {
      tocEl.style.top = defaultTop;
    }
  } else {
    tocEl.style.top = defaultTop;
  }
}

// Ulepszona obsługa aktywnej sekcji podczas przewijania
function setupIntersectionObserver(): IntersectionObserver | undefined {
  if (typeof window === 'undefined' || !pageDocument.value) return;
  
  // Lepsze opcje dla obserwatora
  const options: IntersectionObserverInit = {
    root: null, 
    rootMargin: '-100px 0px -70% 0px', // Poprawione marginesy dla lepszej detekcji
    threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] // Dodatkowe progi dla bardziej płynnej detekcji
  };
  
  let currentActiveHeading: string | null = null;
  
  // Tworzymy nowy obserwator
  const observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
    // Aktualizuj widoczne nagłówki
    entries.forEach(entry => {
      const id = entry.target.id;
      
      if (entry.isIntersecting) {
        visibleHeadings.value.set(id, entry.intersectionRatio);
      } else {
        visibleHeadings.value.delete(id);
      }
    });
    
    // Znajdź najlepszy nagłówek do ustawienia jako aktywny
    updateActiveHeading();
  }, options);
  
  // Funkcja do znajdowania najlepszego aktywnego nagłówka
  function updateActiveHeading(): void {
    if (visibleHeadings.value.size === 0) {
      // Jeśli nie ma widocznych nagłówków, zachowaj ostatni aktywny lub użyj pierwszego
      if (!currentActiveHeading && headingElements.value.length > 0 && headingElements.value[0]) {
        activeSection.value = headingElements.value[0].id;
      }
      return;
    }
    
    // Konwertuj mapę na tablicę, żeby móc jej użyć
    const headingsArray = Array.from(visibleHeadings.value.entries());
    
    // Jeśli jest tylko jeden widoczny nagłówek, użyj go
    if (headingsArray.length === 1 && headingsArray[0]) {
      activeSection.value = headingsArray[0][0];
      currentActiveHeading = headingsArray[0][0];
      return;
    }
    
    // Znajdź nagłówek z najwyższym współczynnikiem widoczności
    const mostVisible = headingsArray.reduce((prev, current) => {
      return (current[1] > prev[1]) ? current : prev;
    });
    
    activeSection.value = mostVisible[0];
    currentActiveHeading = mostVisible[0];
  }
  
  // Znajdź i obserwuj wszystkie nagłówki po załadowaniu dokumentu
  function observeHeadings(): void {
    if (!contentRef.value) return;
    
    // Znajdź wszystkie nagłówki w treści dokumentu
    const headings = contentRef.value.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]');
    
    if (headings.length === 0) {
      // Spróbuj jeszcze raz, używając całego dokumentu
      const allHeadings = document.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]');
      headingElements.value = Array.from(allHeadings) as HTMLElement[];
      
      allHeadings.forEach(heading => {
        observer.observe(heading);
      });
      
      // Domyślnie ustaw pierwszy nagłówek jako aktywny
      if (allHeadings.length > 0 && allHeadings[0]) {
        activeSection.value = allHeadings[0].id;
        currentActiveHeading = allHeadings[0].id;
      }
    } else {
      // Zapisz referencje do nagłówków
      headingElements.value = Array.from(headings) as HTMLElement[];
      
      // Obserwuj każdy nagłówek
      headings.forEach(heading => {
        observer.observe(heading);
      });
      
      // Domyślnie ustaw pierwszy nagłówek jako aktywny
      if (headings.length > 0 && headings[0]) {
        activeSection.value = headings[0].id;
        currentActiveHeading = headings[0].id;
      }
    }
  }
  
  // Inicjalizacja z opóźnieniem, aby upewnić się, że treść jest wyrenderowana
  nextTick(() => {
    setTimeout(observeHeadings, 1000);
  });
  
  return observer;
}

// Nasłuchiwanie przewijania i aktywacji obserwatora po zamontowaniu komponentu
onMounted(() => {
  if (typeof window === 'undefined') return;
  
  // Aktualizuj pozycję TOC podczas przewijania
  window.addEventListener('scroll', updateTocPosition);
  
  // Utwórz i zwróć obserwator
  const observer = setupIntersectionObserver();
  
  // Wywołaj raz po zamontowaniu
  nextTick(() => {
    updateTocPosition();
  });
  
  // Sprzątanie przy odmontowaniu
  onBeforeUnmount(() => {
    if (typeof window === 'undefined') return;
    
    window.removeEventListener('scroll', updateTocPosition);
    if (observer) {
      observer.disconnect();
    }
  });
});
</script>

<template>
  <div>
    <div v-if="pageDocument" class="container mx-auto px-4">
      <!-- Mobilny TOC - widoczny tylko na małych ekranach -->
      <div 
        v-if="hasToc" 
        class="md:hidden w-screen fixed top-20 left-0 backdrop-blur-lg z-30"
      >
        <div 
          class="flex items-center justify-between p-3 cursor-pointer" 
          @click="toggleMobileToc"
        >
          <div class="flex items-center">
            <UIcon name="i-heroicons-list-bullet" class="w-5 h-5 mr-2 text-primary-500" />
            <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">Na tej stronie</h3>
          </div>
          <UIcon 
            :name="isMobileTocOpen ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'" 
            class="w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-200"
          />
        </div>
        
        <!-- Rozwijana lista linków -->
        <div 
          class="mobile-toc-content overflow-hidden transition-all duration-300 bg-gray-50 dark:bg-gray-800/50"
          :class="isMobileTocOpen ? 'max-h-[70vh] py-2' : 'max-h-0'"
        >
          <nav class="px-3 space-y-1 overflow-y-auto max-h-[calc(70vh-3rem)]">
            <div v-for="link in toc.links" :key="link.id" class="text-sm">
              <a
                :href="`#${link.id}`"
                class="block py-2 px-2 rounded-md transition-all duration-200"
                :class="[
                  activeSection === link.id 
                    ? 'bg-primary-50 text-primary-700 font-medium dark:bg-primary-900/20 dark:text-primary-400' 
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/60',
                  { 'pl-2': link.depth === 2, 'pl-6': link.depth === 3, 'pl-10': link.depth >= 4 }
                ]"
                @click.prevent="handleMobileTocClick(link.id)"
              >
                {{ link.text }}
              </a>
            </div>
          </nav>
        </div>
      </div>

      <!-- Główna zawartość -->
      <div class="flex gap-8 relative" style="min-height: 80vh;">
        <!-- Main content -->
        <div ref="contentRef" class="prose prose-lg dark:prose-invert max-w-none flex-1">
          <!-- Metadane dokumentu -->
          <h1>{{ pageDocument.title }}</h1>
          
          <div class="text-sm text-gray-500 flex items-center gap-2 mb-8">
            <div v-if="pageDocument.author">Autor: {{ pageDocument.author }}</div>
            <div v-if="pageDocument.createdAt">
              Utworzono: {{ pageDocument.createdAt }}
            </div>
          </div>

          <!-- Właściwa treść za pomocą ContentRenderer -->
          <ContentRenderer :value="pageDocument" />

          <!-- Sekcja z przyciskami do nawigacji -->
          <div ref="footer" class="mt-12 pt-8 border-t border-primary-200/40 dark:border-primary-800/40">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Poprzedni artykuł -->
              <NuxtLink 
                v-if="data?.[0]" 
                :to="data[0].path" 
                class="group flex flex-col p-4 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-primary-500 dark:hover:border-primary-500 transition-all duration-200 hover:shadow-md"
              >
                <div class="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center">
                  <UIcon name="i-heroicons-arrow-left" class="mr-1 h-4 w-4" />
                  <span>Poprzedni artykuł</span>
                </div>
                
                <div class="font-medium text-lg mb-1 text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {{ data[0].title }}
                </div>
                
                <div v-if="data[0].description" class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {{ data[0].description }}
                </div>
                
                <div v-if="data[0].category" class="mt-2">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                    {{ data[0].category }}
                  </span>
                </div>
              </NuxtLink>
              
              <div v-else class="hidden md:block"></div>
              
              <!-- Następny artykuł -->
              <NuxtLink 
                v-if="data?.[1]" 
                :to="data[1].path" 
                class="group flex flex-col p-4 border border-primary-200/40 dark:border-primary-800/40 rounded-xl hover:border-primary-500 dark:hover:border-primary-500 transition-all duration-200 hover:shadow-md md:text-right"
              >
                <div class="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center md:justify-end">
                  <span>Następny artykuł</span>
                  <UIcon name="i-heroicons-arrow-right" class="ml-1 h-4 w-4" />
                </div>
                
                <div class="font-medium text-lg mb-1 text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {{ data[1].title }}
                </div>
                
                <div v-if="data[1].description" class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {{ data[1].description }}
                </div>
                
                <div v-if="data[1].category" class="mt-2 md:flex md:justify-end">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                    {{ data[1].category }}
                  </span>
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- "On this page" sidebar - z position fixed, widoczny tylko na większych ekranach -->
        <div 
          v-if="hasToc" 
          class="toc-sidebar w-64 shrink-0 hidden md:block"
        >
          <div 
            ref="fixedToc"
            class="fixed-toc pl-4 pr-4 py-2"
            style="position: fixed; top: 6rem; width: 16rem; max-height: calc(100vh - 8rem); overflow-y: auto;"
          >
            <h3 class="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">Na tej stronie</h3>
            <nav class="space-y-2">
              <div v-for="link in toc.links" :key="link.id" class="text-sm">
                <NuxtLink
                  :to="`#${link.id}`"
                  class="toc-link block py-1 transition-all duration-200"
                  :class="[
                    activeSection === link.id 
                      ? 'text-primary-600 font-medium border-l-2 border-primary-500 -ml-[calc(0.25rem+1px)] pl-[calc(0.75rem-1px)] dark:text-primary-400' 
                      : 'text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 pl-3',
                    { 'ml-0': link.depth === 2, 'ml-3': link.depth === 3, 'ml-6': link.depth >= 4 }
                  ]"
                  @click.prevent="() => {
                    if (scrollToElement(link.id)) {
                      activeSection = link.id;
                    }
                  }"
                >
                  {{ link.text }}
                </NuxtLink>
              </div>
            </nav>

            <div v-if="toc.links && toc.links.length > 0">
              <!-- Sekcje dodatkowe - zewnętrzne zasoby -->
              <div class="mt-8 border-t border-primary-200/40 dark:border-primary-700/40 pt-4">
                <h2 class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 px-3">
                  Zasoby
                </h2>
                <ul class="space-y-1">
                  <li>
                    <a 
                      href="https://github.com/Auriaz/atp-system" 
                      target="_blank"
                      rel="noopener noreferrer"
                      class="flex items-center px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
                    >
                      <UIcon name="i-simple-icons-github" class="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                      GitHub
                    </a>
                  </li>

                  <li>
                    <NuxtLink 
                      to="/faq" 
                      class="flex items-center px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
                    >
                      <UIcon name="i-heroicons-question-mark-circle" class="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                      FAQ
                    </NuxtLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>

    <div v-else class="container mx-auto px-4 py-8">
      <p>Ładowanie dokumentu...</p>
    </div>

  </div>
</template>

<style scoped>
.toc-sidebar {
  position: relative;
}
.fixed-toc {
  z-index: 10;
  transition: top 0.3s ease;
}

.toc-link {
  position: relative;
}
.toc-link::before {
  content: '';
  position: absolute;
  left: -4px;
  top: 0;
  height: 100%;
  width: 0;
  transition: width 0.3s;
}
.toc-link.active::before {
  width: 3px;
}

/* Style dla mobilnego TOC */
.mobile-toc-content {
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.mobile-toc-content::-webkit-scrollbar {
  width: 4px;
}

.mobile-toc-content::-webkit-scrollbar-track {
  background: transparent;
}

.mobile-toc-content::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 2px;
}
</style>