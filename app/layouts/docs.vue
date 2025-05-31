<script setup lang="ts">
const route = useRoute();

// Skip navigation query for now - let sidebar handle it
const navigation = ref([])
const document = ref<{title?: string; description?: string; category?: string} | undefined>(undefined)
const searchSections = ref([])

const searchTerm = ref('')
const isSearchModalOpen = ref(false)

// Funkcja do otwierania wyszukiwania
const openSearch = () => {
  isSearchModalOpen.value = true
}

// Get documentation categories for search
const { data: searchCategories } = await useAsyncData('search-categories', async () => {
  try {
    const docs = await queryCollection('docs').all()
    
    // Group by categories for search
    const categoriesMap: Record<string, any[]> = {};
    docs.forEach(doc => {
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
  } catch (error) {
    console.error('Error loading search categories:', error);
    return [];
  }
});

// Helper functions for category styling
function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    'Publiczne': 'i-heroicons-globe-alt',
    'Zawodnicy': 'i-heroicons-user',
    'Trenerzy': 'i-heroicons-academic-cap',
    'Menedżerowie': 'i-heroicons-briefcase',
    'Administratorzy': 'i-heroicons-shield-check',
    'Rozwój': 'i-heroicons-code-bracket',
    'Raporty': 'i-heroicons-chart-bar',
    'Edytorzy': 'i-heroicons-pencil',
    'Użytkownicy': 'i-heroicons-users'
  };
  return icons[category] || 'i-heroicons-document-text';
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'Publiczne': 'emerald',
    'Zawodnicy': 'blue',
    'Trenerzy': 'purple',
    'Menedżerowie': 'orange',
    'Administratorzy': 'red',
    'Rozwój': 'gray',
    'Raporty': 'yellow',
    'Edytorzy': 'pink',
    'Użytkownicy': 'indigo'
  };
  return colors[category] || 'gray';
}

// Skip error handling for now
// Obsługa błędów dokumentu
// if (documentError.value && route.path !== '/docs') {
//   throw createError({
//     statusCode: 404,
//     statusMessage: 'Dokument nie został znaleziony'
//   })
// }
</script>

<template>
  <XDocumentationLayout :document="document" class="">
    <!-- Reading Progress Bar -->
    <XDocumentationProgressBar />
    
    <template #header>
      <x-navbar>
          <template #logo>
            <x-logo size="24"/>
          </template>            
          
          <template #search>
            <XDocumentationSearch
              :categories="searchCategories || []"
              :search-config="{ 
                resultLimit: 42,
                threshold: 0.2
              }"
              placeholder="Szukaj w dokumentacji..."
            />
          </template>

          <template #action>
          </template>
        </x-navbar>
    </template>  

    <template #sidebar>
      <!-- Sidebar for documentation -->
      <XDocumentationSidebar
        :navigation="navigation" 
        :current-path="$route.path"
        @open-search="openSearch"
      />
    </template>

    <!-- Main content -->
    <div class="px-6 py-8">
      <slot />
    </div>

    <!-- Back to Top Button -->
    <XDocumentationBackToTop />

  </XDocumentationLayout>
</template>