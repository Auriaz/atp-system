<script setup lang="ts">
// import { useI18n } from 'vue-i18n';
definePageMeta({
  layout: 'legal',
});
const route = useRoute();
// const { locale } = useI18n();
const lang = ref('en')

const itemsSelected = ref(['en', 'pl'])

// Pobranie typu dokumentu z parametru URL (terms, privacy itp.)
const docType = computed(() => route.params.type as string);

// if(locale.value === 'en-US') {
//   locale.value = 'en'
// }

// Określenie ścieżki do dokumentu na podstawie typu i języka
// const docPath = computed(() => `${route.path}/${locale.value || 'en'}`);
const docPath = computed(() => `${route.path}/en`);

// Pobranie dokumentu
const { data: doc } = await useAsyncData( () => {
  // Pobranie dokumentu z kolekcji na podstawie ścieżki
  return queryCollection('legal').path(docPath.value).first();}

);

// Tytuły dla różnych typów dokumentów
const titles: Record<string, Record<string, string>> = {
  terms: {
    en: 'Terms and Conditions',
    pl: 'Warunki korzystania'
  },
  privacy: {
    en: 'Privacy Policy',
    pl: 'Polityka prywatności'
  },
  cookies: {
    en: 'Cookie Policy',
    pl: 'Polityka cookies'
  },
  gdpr: {
    en: 'GDPR Information',
    pl: 'Informacje o RODO'
  }
};

// Tytuł strony
useHead({
  // title: titles[docType.value]?.[locale.value] || doc.value?.title || docType.value
  title: titles[docType.value]?.[lang.value] || doc.value?.title || docType.value,
});

watch(() => lang.value, async () => {
    doc.value = await queryCollection('legal').path(`${route.path}/${lang.value}`).first()
  })
</script>

<template>
  <NuxtLayout class="max-w-4xl mx-auto px-4 py-12">
    <!-- Menu  -->
    <div class="flex justify-between mt-8 py-4 border-b-2 border-gray-200 dark:border-gray-700">
      <!-- Przycisk powrotu -->
      <UButton @click="$router.back()" icon="i-heroicons-arrow-left" color="primary" variant="ghost">
        Go back
      </UButton>

      <div>
        <!-- Select do zmiany jezyka -->
        <USelect v-model="lang" label="Language" :items="itemsSelected" class="mr-4"/>
        <!-- Mode color -->
        <XBtnColorMode />
      </div>
    </div>
    <ContentRenderer v-if="doc" :value="doc" />
    <UAlert v-else type="warning" title="Document not found" description="The requested legal document is not available" />
  </NuxtLayout>
</template>

<style scoped>
:deep(.prose) {
  max-width: 100%;
}

:deep(h1) {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--color-primary-600);
}

:deep(h2) {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: var(--color-primary-500);
}

:deep(ul) {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin: 1rem 0;
}

:deep(li) {
  margin-bottom: 0.5rem;
}

:deep(p) {
  margin-bottom: 1rem;
  line-height: 1.7;
}
</style>