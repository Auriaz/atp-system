<script setup lang="ts">
interface NavigationItem {
  title: string
  to: string
  icon?: string
  description?: string
  children?: NavigationItem[]
  roles?: string[]
  permissions?: string[]
  category?: string
}

interface NavigationCategory {
  title: string
  key: string
  icon: string
  items: NavigationItem[]
  roles?: string[]
  permissions?: string[]
  priority?: number
}

interface DocumentContent {
  _path: string
  title?: string
  description?: string
  icon?: string
  roles?: string[]
  permissions?: string[]
  navigation?: {
    title?: string
    description?: string
    icon?: string
  }
  [key: string]: any
}

// Composables
const { checkDocumentAccess } = useDocumentation() // Re-enable
const route = useRoute()

// State
const searchQuery = ref('')
const debouncedSearchQuery = refDebounced(searchQuery, 300)
const expandedCategories = ref(new Set<string>())
const isLoading = ref(true)
const error = ref('')
const navigationData = ref<NavigationCategory[]>([])

// Documentation metadata
const docs = {
  navigation: {
    title: 'Dokumentacja',
    subtitle: 'Przewodnik po systemie ATP',
    search: 'Szukaj w dokumentacji...'
  }
}

// Computed properties
const activePath = computed(() => route.path)

// Category configuration with priorities and icons
const categoryConfig: Record<string, { title: string; icon: string; priority: number }> = {
  public: { title: 'Wprowadzenie', icon: 'i-heroicons-home', priority: 1 },
  athlete: { title: 'Dla zawodników', icon: 'i-heroicons-user', priority: 2 },
  coach: { title: 'Dla trenerów', icon: 'i-heroicons-academic-cap', priority: 3 },
  manager: { title: 'Dla menedżerów', icon: 'i-heroicons-briefcase', priority: 4 },
  admin: { title: 'Administracja', icon: 'i-heroicons-cog-6-tooth', priority: 5 },
  editor: { title: 'Edytor', icon: 'i-heroicons-pencil-square', priority: 6 },
  reports: { title: 'Raporty', icon: 'i-heroicons-chart-bar-square', priority: 7 },
  user: { title: 'Użytkownik', icon: 'i-heroicons-user-circle', priority: 8 },
  development: { title: 'Development', icon: 'i-heroicons-code-bracket', priority: 9 }
}

// Load documentation dynamically from Nuxt Content
async function loadDocumentation() {
  try {
    isLoading.value = true
    error.value = ''
    
    // Try direct queryCollection call without useAsyncData
    try {
      const docsData = await queryCollection('docs').all()
      
      if (docsData && docsData.length > 0) {
        // Check if data is grouped (has .name and .items) or flat (individual docs)
        const firstItem = docsData[0] as any
        if (firstItem && firstItem.name && firstItem.items) {
          // Data is grouped
          await processGroupedDocs(docsData as any[])
        } else {
          // Data is flat list of documents
          await processFlatDocs(docsData)
        }
        return
      }
    } catch (directError) {
      console.warn('Direct queryCollection failed:', directError)
    }
    
    throw new Error('Nie znaleziono dokumentacji')

  } catch (err: any) {
    console.error('Error loading documentation:', err)
    error.value = err.message || 'Nie udało się załadować dokumentacji'
    
    // Fallback to mock data for development
    try {
      navigationData.value = [{
        title: 'Wprowadzenie',
        key: 'public',
        icon: 'i-heroicons-home',
        items: [{
          title: 'Wprowadzenie do systemu',
          to: '/docs/public/introduction',
          icon: 'i-heroicons-document-text',
          description: 'Podstawowe informacje o systemie ATP'
        }],
        priority: 1
      }]
    } catch (mockError) {
      console.error('Mock data also failed:', mockError)
    }
  } finally {
    isLoading.value = false
  }
}

// Helper function to process grouped docs from queryCollection
async function processGroupedDocs(docsGroups: any[]) {
  console.log('Processing', docsGroups.length, 'document groups...')
  
  const categoriesMap = new Map<string, NavigationItem[]>()
  
  docsGroups.forEach((group: any) => {
    console.log('Processing group:', group.name, 'with', group.items?.length || 0, 'items')
    
    // Extract category from group name or use 'public' as default
    let categoryKey = 'public'
    
    // Map group names to category keys
    const groupNameToCategory: Record<string, string> = {
      'Pierwsze kroki': 'public',
      'Użytkownicy': 'user',
      'Zawodnicy': 'athlete',
      'Trenerzy': 'coach',
      'Menedżerowie': 'manager',
      'Administracja': 'admin',
      'Edytor': 'editor',
      'Raporty': 'reports',
      'Development': 'development'
    }
    
    categoryKey = groupNameToCategory[group.name] || 'public'
    
    console.log(`Group "${group.name}" mapped to category: ${categoryKey}`)
    
    if (!group.items || !Array.isArray(group.items)) {
      console.warn('Group has no items array:', group)
      return
    }
    
    group.items.forEach((doc: any) => {
      if (!doc.path && !doc._path) {
        console.warn('Document without path:', doc)
        return
      }
      
      const docPath = doc.path || doc._path
      console.log('Processing document:', docPath, doc.title)
      
      const navItem: NavigationItem = {
        title: doc.navigation?.title || doc.title || docPath.split('/').pop()?.replace(/-/g, ' ') || 'Bez tytułu',
        to: docPath,
        description: doc.navigation?.description || doc.description || '',
        icon: doc.navigation?.icon || doc.icon || 'i-heroicons-document-text',
        roles: doc.roles || [],
        permissions: doc.permissions || [],
        category: categoryKey
      }
      
      if (!categoriesMap.has(categoryKey)) {
        categoriesMap.set(categoryKey, [])
      }
      categoriesMap.get(categoryKey)!.push(navItem)
    })
  })
  
  console.log('Categories found:', Array.from(categoriesMap.keys()))
  buildNavigationFromCategories(categoriesMap)
}

// Helper function to process flat docs array (fallback)
async function processFlatDocs(docs: any[]) {
  console.log('Processing', docs.length, 'flat documents...')
  
  const categoriesMap = new Map<string, NavigationItem[]>()
  
  docs.forEach((doc: any) => {
    if (!doc.id && !doc._path && !doc.path) {
      return
    }
    
    // Extract path from id, _path, or path
    const docPath = doc.path || doc._path || doc.id?.replace('.md', '')
    
    // Skip template files
    if (docPath.includes('.doc-templates')) {
      return
    }
    
    // Extract category from path structure or document category
    let category = 'public' // default
    
    if (doc.category) {
      // Map document category to our category keys
      const categoryMap: Record<string, string> = {
        'Pierwsze kroki': 'public',
        'Użytkownicy': 'user',
        'Zawodnicy': 'athlete',
        'Trenerzy': 'coach',
        'Menedżerowie': 'manager',
        'Administracja': 'admin',
        'Edytor': 'editor',
        'editor': 'editor',
        'Content Management': 'editor',
        'Raporty': 'reports',
        'Development': 'development',
        'API': 'development',
        'FAQ': 'public'
      }
      category = categoryMap[doc.category] || 'public'
    } else {
      // Extract from path if no category
      const pathParts = docPath.split('/').filter(Boolean)
      if (pathParts.length > 2 && pathParts[0] === 'docs' && pathParts[1] === 'docs') {
        category = pathParts[2] || 'public'
      } else if (pathParts.length > 1 && pathParts[0] === 'docs') {
        category = pathParts[1] || 'public'
      }
    }
    
    const navItem: NavigationItem = {
      title: doc.navigation?.title || doc.title || docPath.split('/').pop()?.replace(/-/g, ' ')?.replace('.md', '') || 'Bez tytułu',
      to: docPath.replace(/^docs\/docs/, '/docs').replace(/\.md$/, ''),
      description: doc.navigation?.description || doc.description || '',
      icon: doc.navigation?.icon || doc.icon || 'i-heroicons-document-text',
      roles: doc.roles || doc.requiredRole || [],
      permissions: doc.permissions || [],
      category
    }
    
    if (!categoriesMap.has(category)) {
      categoriesMap.set(category, [])
    }
    categoriesMap.get(category)!.push(navItem)
  })
  
  buildNavigationFromCategories(categoriesMap)
}

// Helper function to build navigation from categories map
function buildNavigationFromCategories(categoriesMap: Map<string, NavigationItem[]>) {
  const categories: NavigationCategory[] = []
  
  for (const [categoryKey, items] of categoriesMap) {
    const config = categoryConfig[categoryKey] || {
      title: categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1),
      icon: 'i-heroicons-folder',
      priority: 999
    }

    categories.push({
      title: config.title,
      key: categoryKey,
      icon: config.icon,
      items: items.sort((a, b) => a.title.localeCompare(b.title)),
      priority: config.priority
    })
  }
  
  navigationData.value = categories.sort((a, b) => (a.priority || 999) - (b.priority || 999))
}

// Filter navigation based on search and permissions
const filteredNavigation = computed(() => {
  return navigationData.value
    .map(category => {
      // Filter items based on search query and permissions
      const filteredItems = category.items.filter(item => {
        // Check search query
        const searchTerm = debouncedSearchQuery.value.toLowerCase()
        const matchesSearch = !searchTerm || 
          item.title.toLowerCase().includes(searchTerm) ||
          item.description?.toLowerCase().includes(searchTerm)

        // Check permissions
        let hasAccess = true
        try {
          if (checkDocumentAccess && typeof checkDocumentAccess === 'function') {
            // Check if item has roles defined
            if (item.roles && item.roles.length > 0) {
              hasAccess = checkDocumentAccess({ requiredRole: item.roles })
            } else {
              // No roles required, allow access
              hasAccess = true
            }
          } else {
            // No permission function available, allow access only to public docs
            hasAccess = item.category === 'public'
          }
        } catch (permError) {
          // On permission error, allow access only to public docs
          hasAccess = item.category === 'public'
        }
        
        return matchesSearch && hasAccess
      })

      return {
        ...category,
        items: filteredItems
      }
    })
    .filter(category => category.items.length > 0)
})

// Category toggle and persistence
function toggleCategory(categoryKey: string) {
  if (expandedCategories.value.has(categoryKey)) {
    expandedCategories.value.delete(categoryKey)
  } else {
    expandedCategories.value.add(categoryKey)
  }
  saveExpandedState()
}

function saveExpandedState() {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('docs-expanded-categories', JSON.stringify([...expandedCategories.value]))
    }
  } catch (error) {
    console.warn('Failed to save expanded categories state:', error)
  }
}

function loadExpandedState() {
  try {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('docs-expanded-categories')
      if (saved) {
        const parsed = JSON.parse(saved)
        expandedCategories.value = new Set(parsed)
      } else {
        expandedCategories.value.add('public')
      }
    }
  } catch (error) {
    console.warn('Failed to load expanded categories state:', error)
    expandedCategories.value.add('public')
  }
}

function isActiveRoute(path: string): boolean {
  return path === activePath.value
}

function hasActiveChild(items: NavigationItem[]): boolean {
  return items.some(item => 
    isActiveRoute(item.to) || 
    (item.children && hasActiveChild(item.children))
  )
}

// Initialize
onMounted(() => {
  loadExpandedState()
  loadDocumentation()
  
  // Watch navigationData changes without excessive logging
  watch(navigationData, (newData) => {
    if (newData.length > 0) {
      console.log('Navigation loaded:', newData.length, 'categories')
    }
  }, { immediate: true })
})

// Watch route changes and reload if needed
watch(() => route.path, (newPath) => {
  // If we're on a docs page and have no navigation data, try to reload
  if (newPath.startsWith('/docs') && navigationData.value.length === 0 && !isLoading.value) {
    loadDocumentation()
  }
  
  // Auto-expand category containing active route
  if (newPath && newPath.startsWith('/docs/')) {
    const pathParts = newPath.split('/').filter(Boolean)
    if (pathParts.length > 1) {
      const category = pathParts[1]
      if (category) {
        expandedCategories.value.add(category)
      }
    }
  }
}, { immediate: true }) 
</script>

<template>
  <div class="documentation-sidebar bg-white dark:bg-gray-900 w-full h-full overflow-y-auto">
    
    <!-- Header with main docs link -->
    <div class="w-full p-4 border-b border-gray-200 dark:border-gray-700">
      <NuxtLink 
        to="/docs" 
        class="flex items-center gap-2 mb-3 p-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
        :class="{
          'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20': route.path === '/docs'
        }"
      >
        <UIcon name="i-heroicons-book-open" class="w-5 h-5" />
        <span>{{ docs.navigation.title }}</span>
      </NuxtLink>
      
      <!-- Search -->
      <UInput
        v-model="searchQuery"
        :placeholder="docs.navigation.search"
        icon="i-heroicons-magnifying-glass"
        class="w-full"
        :disabled="isLoading"
        aria-label="Wyszukaj w dokumentacji"
      />
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="p-4 space-y-4" role="status" aria-label="Ładowanie dokumentacji">
      <div v-for="i in 3" :key="i" class="animate-pulse">
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
        <div class="ml-4 space-y-2">
          <div class="h-3 bg-gray-100 dark:bg-gray-800 rounded w-3/4"></div>
          <div class="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/2"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="p-4" role="alert">
      <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <div class="flex items-center gap-2 text-red-700 dark:text-red-400 mb-2">
          <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5" />
          <span class="font-medium">Błąd ładowania</span>
        </div>
        <p class="text-sm text-red-600 dark:text-red-300 mb-3">{{ error }}</p>
        <UButton
          @click="loadDocumentation"
          size="sm"
          color="error"
          variant="outline"
          class="w-full"
        >
          Spróbuj ponownie
        </UButton>
      </div>
    </div>

    <!-- Navigation -->
    <nav v-else class="p-4 space-y-2" role="navigation" aria-label="Dokumentacja">
      <!-- Debug info in development only -->
      <div v-if="$dev" class="mb-4 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-xs">
        <strong>Debug:</strong> {{ filteredNavigation.length }} kategorii, {{ filteredNavigation.reduce((acc, cat) => acc + cat.items.length, 0) }} dokumentów
      </div>
      
      <template v-for="category in filteredNavigation" :key="category.key">
        <div class="mb-4">
          <!-- Category Header -->
          <button
            @click="toggleCategory(category.key)"
            class="flex items-center justify-between w-full p-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            :aria-expanded="expandedCategories.has(category.key)"
            :aria-controls="`category-${category.key}`"
          >
            <span class="flex items-center gap-2">
              <UIcon :name="category.icon" class="w-4 h-4" />
              {{ category.title }}
              <span class="text-xs text-gray-500">({{ category.items.length }})</span>
            </span>
            <UIcon
              :name="expandedCategories.has(category.key) ? 'i-heroicons-chevron-down' : 'i-heroicons-chevron-right'"
              class="w-4 h-4 transition-transform"
            />
          </button>

          <!-- Category Items -->
          <div
            v-show="expandedCategories.has(category.key)"
            :id="`category-${category.key}`"
            class="ml-4 mt-2 space-y-1"
          >
            <NuxtLink
              v-for="item in category.items"
              :key="item.to"
              :to="item.to"
              class="flex items-center gap-2 p-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 rounded transition-colors"
              :class="{
                'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium': isActiveRoute(item.to)
              }"
            >
              <UIcon :name="item.icon || 'i-heroicons-document-text'" class="w-4 h-4 flex-shrink-0" />
              <div class="flex-1 min-w-0">
                <div class="truncate">{{ item.title }}</div>
                <div v-if="item.description" class="text-xs text-gray-500 dark:text-gray-500 truncate">
                  {{ item.description }}
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </template>

      <!-- Empty state when no results -->
      <div v-if="filteredNavigation.length === 0 && searchQuery" class="p-4 text-center text-gray-500 dark:text-gray-400">
        <UIcon name="i-heroicons-document-magnifying-glass" class="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p class="text-sm">Nie znaleziono wyników dla "{{ searchQuery }}"</p>
      </div>

      <!-- Empty state when no documentation -->
      <div v-else-if="filteredNavigation.length === 0 && !searchQuery" class="p-4 text-center text-gray-500 dark:text-gray-400">
        <UIcon name="i-heroicons-document-plus" class="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p class="text-sm">Brak dostępnej dokumentacji</p>
        <p class="text-xs mt-1">Sprawdź, czy pliki dokumentacji znajdują się w folderze content/docs</p>
      </div>
    </nav>
  </div>
</template>

<style scoped>
.documentation-sidebar {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}

.documentation-sidebar::-webkit-scrollbar {
  width: 6px;
}

.documentation-sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.documentation-sidebar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 3px;
}

.documentation-sidebar::-webkit-scrollbar-thumb:hover {
  background-color: #94a3b8;
}

.dark .documentation-sidebar {
  scrollbar-color: #475569 transparent;
}

.dark .documentation-sidebar::-webkit-scrollbar-thumb {
  background-color: #475569;
}

.dark .documentation-sidebar::-webkit-scrollbar-thumb:hover {
  background-color: #64748b;
}
</style>