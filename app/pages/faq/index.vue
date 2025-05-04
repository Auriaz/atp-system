<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

const { locale } = useI18n()
const currentLang = computed(() => locale.value === 'en' ? 'en' : 'pl')

// Kategorie FAQ wraz z ikonami
const categories = [
  { id: 'general', name: { en: 'General', pl: 'Ogólne' }, icon: 'i-lucide-info' },
  { id: 'account', name: { en: 'Account', pl: 'Konto' }, icon: 'i-lucide-user' },
  { id: 'training', name: { en: 'Training', pl: 'Trening' }, icon: 'i-lucide-dumbbell' },
  { id: 'nutrition', name: { en: 'Nutrition', pl: 'Odżywianie' }, icon: 'i-lucide-apple' },
  { id: 'payments', name: { en: 'Payments', pl: 'Płatności' }, icon: 'i-lucide-credit-card' },
  { id: 'technical', name: { en: 'Technical', pl: 'Techniczne' }, icon: 'i-lucide-wrench' },
]

// Wyszukiwanie i filtrowanie
const searchQuery = ref('')
const selectedCategory = ref('all')

// Pobieranie wszystkich pytań FAQ
const { data: faqItems } = await useAsyncData('faq-list', () => 
queryCollection('faq')
    .where( 'language', '=', currentLang.value )
    .order('order', 'DESC')
    .all()
)

// Filtrowane pytania na podstawie kategorii i wyszukiwania
const filteredFaqItems = computed(() => {
  if (!faqItems.value) return []
  
  let filtered = faqItems.value

  // Filtruj według kategorii
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(item => {
      // Obsługa różnej pisowni kategorii (konto vs account)
      const category = item.category?.toLowerCase()
      const selected = selectedCategory.value?.toLowerCase()
      
      if (currentLang.value === 'pl') {
        if (selected === 'account') return category === 'konto'
        if (selected === 'training') return category === 'trening'
        if (selected === 'general') return category === 'ogolne' || category === 'ogólne'
        if (selected === 'technical') return category === 'techniczne'
        if (selected === 'payments') return category === 'platnosci' || category === 'płatności'
        if (selected === 'nutrition') return category === 'odzywianie' || category === 'odżywianie'
      }
      
      return category === selected
    })
  }

  // Filtruj według frazy wyszukiwania
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(item => 
      item.title?.toLowerCase().includes(query) || 
      item.description?.toLowerCase().includes(query) || 
      item.tags?.some(tag => tag.toLowerCase().includes(query))
    )
  }

  return filtered
})

// Grupowanie pytań według kategorii dla widoku zbiorczego
const groupedFaqItems = computed(() => {
  const grouped: Record<string, any[]> = {}
  
  if (!filteredFaqItems.value) return grouped
  
  filteredFaqItems.value.forEach(item => {
    const category = item.category || 'general'
    if (!grouped[category]) {
      grouped[category] = []
    }
    grouped[category].push(item)
  })
  
  return grouped
})

// Główne (wyróżnione) pytania do wyświetlenia na górze
const featuredFaqItems = computed(() => 
  faqItems.value?.filter(item => item.featured) || []
)
</script>

<template>
  <NuxtLayout>
    <div class="container mx-auto px-4 py-12">
      <!-- Nagłówek sekcji -->
      <div class="max-w-3xl mx-auto text-center mb-12">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {{ $t('faq.title', 'Często zadawane pytania') }}
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-400">
          {{ $t('faq.subtitle', 'Znajdź odpowiedzi na najczęściej zadawane pytania dotyczące platformy ATP') }}
        </p>
      </div>
  
      <!-- Wyszukiwarka -->
      <div class="max-w-2xl mx-auto mb-12">
        <UInput
          v-model="searchQuery"
          :placeholder="$t('faq.searchPlaceholder', 'Szukaj w FAQ...')"
          icon="i-lucide-search"
          class="w-full"
          size="lg"
        />
      </div>
  
      <!-- Filtry kategorii -->
      <div class="max-w-4xl mx-auto mb-12">
        <div class="flex flex-wrap justify-center gap-2">
          <UButton
            variant="ghost"
            :color="selectedCategory === 'all' ? 'primary' : 'secondary'"
            @click="selectedCategory = 'all'"
          >
            {{ $t('faq.allCategories', 'Wszystkie') }}
          </UButton>
          
          <UButton
            v-for="category in categories"
            :key="category.id"
            variant="ghost"
            :color="selectedCategory === category.id ? 'primary' : 'secondary'"
            @click="selectedCategory = category.id"
            class="flex items-center gap-2"
          >
            <UIcon :name="category.icon" />
            {{ category.name[currentLang] }}
          </UButton>
        </div>
      </div>
  
      <!-- Wyróżnione pytania (jeśli nie ma wyszukiwania ani filtrowania) -->
      <div v-if="featuredFaqItems.length > 0 && !searchQuery && selectedCategory === 'all'" class="max-w-4xl mx-auto mb-16">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          {{ $t('faq.featuredQuestions', 'Popularne pytania') }}
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NuxtLink
            v-for="item in featuredFaqItems"
            :key="item.path"
            :to="item.path"
            class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 transition-colors group"
          >
            <div class="flex items-start gap-4">
              <UIcon 
                :name="item.icon || 'i-lucide-help-circle'" 
                class="text-primary-500 dark:text-primary-400 flex-shrink-0 mt-1"
                size="lg"
              />
              <div>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {{ item.title }}
                </h3>
                <p class="text-gray-600 dark:text-gray-400 mt-1">
                  {{ item.description }}
                </p>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
  
      <!-- Lista FAQ -->
      <div v-if="filteredFaqItems.length" class="max-w-4xl mx-auto">
        <!-- Jeśli szukamy lub filtrujemy - lista płaska -->
        <div v-if="searchQuery || selectedCategory !== 'all'">
          <UAccordion :items="filteredFaqItems.map(item => ({
            icon: item.icon || 'i-lucide-help-circle',
            label: item.title,
            content: item.description,
            to: item.path
          }))" :ui="{
            body: 'divide-y divide-gray-200 dark:divide-gray-700',
            trailingIcon: 'text-primary-500 dark:text-primary-400 py-4'
          }" />
        </div>
        
        <!-- Jeśli bez wyszukiwania i bez filtru - grupowane według kategorii -->
        <div v-else>
          <div v-for="(items, category) in groupedFaqItems" :key="category" class="mb-12">
            <div class="flex items-center gap-2 mb-4">
              <UIcon 
                :name="categories.find(c => 
                  c.id === category || 
                  (currentLang === 'pl' && 
                    ((c.id === 'account' && category === 'konto') ||
                     (c.id === 'training' && category === 'trening') ||
                     (c.id === 'technical' && category === 'techniczne') ||
                     (c.id === 'nutrition' && category === 'odżywianie') ||
                     (c.id === 'payments' && category === 'płatności') ||
                     (c.id === 'general' && (category === 'ogólne' || category === 'ogolne')))
                  )
                )?.icon || 'i-lucide-folder'" 
                class="text-primary-500 dark:text-primary-400"
                size="lg"
              />
  
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                {{ 
                  categories.find(c => 
                    c.id === category || 
                    (currentLang === 'pl' && 
                      ((c.id === 'account' && category === 'konto') ||
                      (c.id === 'training' && category === 'trening') ||
                      (c.id === 'technical' && category === 'techniczne') ||
                      (c.id === 'nutrition' && category === 'odżywianie') ||
                      (c.id === 'payments' && category === 'płatności') ||
                      (c.id === 'general' && (category === 'ogólne' || category === 'ogolne')))
                    )
                  )?.name[currentLang] || (
                    currentLang === 'pl' ? 'Inne pytania' : 'Other questions'
                  ) 
                }}
              </h2>
  
              <UAccordion 
                :items="items.map(item => ({
                  icon: item.icon || 'i-lucide-help-circle',
                  label: item.title,
                  content: item.description,
                  to: item._path
                }))" 
                :ui="{
                  body: 'divide-y divide-gray-200 dark:divide-gray-700',
                  trailingIcon: 'text-primary-500 dark:text-primary-400 py-4'
                }" 
              />
          </div>
          </div>
        </div>
      </div>
      
      <!-- Brak wyników wyszukiwania -->
      <div v-else-if="searchQuery || selectedCategory !== 'all'" class="max-w-md mx-auto text-center py-16">
        <UIcon name="i-lucide-search-x" class="text-gray-400 mx-auto mb-4" size="xl" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {{ $t('faq.noResults', 'Nie znaleziono wyników') }}
        </h3>
        <p class="text-gray-600 dark:text-gray-400">
          {{ $t('faq.tryAnotherSearch', 'Spróbuj użyć innych słów kluczowych lub przeglądaj wszystkie kategorie') }}
        </p>
        <UButton class="mt-6" color="primary" @click="searchQuery = ''; selectedCategory = 'all'">
          {{ $t('faq.viewAllQuestions', 'Pokaż wszystkie pytania') }}
        </UButton>
      </div>
      
      <!-- Kontakt, jeśli nie znaleziono odpowiedzi -->
      <div class="max-w-2xl mx-auto mt-16 bg-gray-50 dark:bg-gray-800 p-8 rounded-lg text-center">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {{ $t('faq.cantFindAnswer', 'Nie znalazłeś odpowiedzi na swoje pytanie?') }}
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          {{ $t('faq.contactUs', 'Skontaktuj się z nami, a nasz zespół wsparcia odpowie na Twoje pytanie') }}
        </p>
        <NuxtLink to="/contact">
          <UButton color="primary" size="lg">
            {{ $t('faq.contactSupport', 'Kontakt z działem wsparcia') }}
          </UButton>
        </NuxtLink>
      </div>
    </div>
  </NuxtLayout>
</template>