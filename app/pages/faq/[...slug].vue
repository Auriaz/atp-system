<script setup lang="ts">
const route = useRoute()

// Pobranie pytania na podstawie ścieżki
const { data: faq } = await useAsyncData(`faq-${route.params.slug ? (Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug) : 'index'}`, () => {
  const path = route.path
  return queryCollection('faq').where('path', '=',  path ).first()
})

// Pobranie powiązanych pytań
const { data: relatedFaqs } = await useAsyncData(`related-faqs-${route.params.slug ? (Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug) : 'index'}`, async () => {
  if (!faq.value?.category) return []
  
  return queryCollection('faq')
    .where(
      'category', '=', faq.value.category,
    )
    .orWhere(query => {
      return query.where('path', '=', { $ne: route.path })
    })
    .limit(4)
    .all()
})

// Tytuł strony
useHead({
  title: faq.value?.title || 'FAQ',
  meta: [
    { name: 'description', content: faq.value?.description || 'Frequently Asked Questions' }
  ]
})
</script>

<template>
  <NuxtLayout>
    <div v-if="faq" class="container mx-auto px-4 py-12">
      <div class="max-w-3xl mx-auto">
        <!-- Nawigacja wstecz -->
        <NuxtLink to="/faq" class="inline-flex items-center gap-1 text-primary-600 dark:text-primary-400 hover:underline mb-6">
          <UIcon name="i-lucide-arrow-left" />
          {{ $t('faq.backToList', 'Powrót do listy pytań') }}
        </NuxtLink>
        
        <!-- Treść pytania -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <UIcon 
            :name="faq.icon || 'i-lucide-help-circle'" 
            class="text-primary-500 dark:text-primary-400 mb-4"
            size="xl"
          />
          
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {{ faq.title }}
          </h1>
          
          <div class="prose dark:prose-invert max-w-none">
            <ContentRenderer :value="faq" />
          </div>
          
          <!-- Tagi i metadane -->
          <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div v-if="faq.tags?.length" class="flex flex-wrap gap-2 mb-4">
              <UBadge v-for="tag in faq.tags" :key="tag" color="primary" variant="subtle">
                {{ tag }}
              </UBadge>
            </div>
            
            <div class="text-sm text-gray-500 dark:text-gray-400 flex flex-wrap items-center gap-x-4 gap-y-2">
              <span v-if="faq.category" class="flex items-center gap-1">
                <UIcon name="i-lucide-folder" class="text-gray-400" />
                {{ faq.category }}
              </span>
              
              <span v-if="faq.lastUpdated" class="flex items-center gap-1">
                <UIcon name="i-lucide-calendar" class="text-gray-400" />
                {{ new Date(faq.lastUpdated).toLocaleDateString() }}
              </span>
            </div>
          </div>
        </div>
        
        <!-- Przydatność odpowiedzi -->
        <div class="mt-8 bg-gray-50 dark:bg-gray-900 p-6 rounded-lg text-center">
          <p class="text-gray-700 dark:text-gray-300 mb-4">
            {{ $t('faq.wasHelpful', 'Czy ta odpowiedź była pomocna?') }}
          </p>
          <div class="flex justify-center gap-4">
            <UButton color="neutral" variant="ghost" icon="i-lucide-thumbs-up">
              {{ $t('faq.helpful', 'Tak, to pomogło') }}
            </UButton>
            <UButton color="neutral" variant="ghost" icon="i-lucide-thumbs-down">
              {{ $t('faq.notHelpful', 'Nie, to nie pomogło') }}
            </UButton>
          </div>
        </div>
        
        <!-- Powiązane pytania -->
        <div v-if="relatedFaqs?.length" class="mt-12">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            {{ $t('faq.relatedQuestions', 'Powiązane pytania') }}
          </h2>
          
          <div class="grid sm:grid-cols-2 gap-4">
            <NuxtLink
              v-for="related in relatedFaqs"
              :key="related.path"
              :to="related.path"
              class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-primary-300 dark:hover:border-primary-700 transition-colors group"
            >
              <div class="flex items-center gap-2">
                <UIcon 
                  :name="related.icon || 'i-lucide-help-circle'" 
                  class="text-primary-500 dark:text-primary-400 flex-shrink-0"
                />
                <h3 class="text-base font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {{ related.title }}
                </h3>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="container mx-auto px-4 py-16 text-center">
      <UIcon name="i-lucide-file-question" class="mx-auto mb-4" size="xl" />
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {{ $t('faq.questionNotFound', 'Pytanie nie zostało znalezione') }}
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mb-8">
        {{ $t('faq.questionNotFoundDesc', 'Przepraszamy, ale nie możemy znaleźć szukanego pytania') }}
      </p>
      <NuxtLink to="/faq">
        <UButton color="primary">
          {{ $t('faq.browseFaq', 'Przeglądaj FAQ') }}
        </UButton>
      </NuxtLink>
    </div>
  </NuxtLayout>
</template>