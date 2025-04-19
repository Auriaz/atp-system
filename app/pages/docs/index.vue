<script setup lang="ts">
definePageMeta({
  layout: 'docs',
});

const { userRoles } = usePermissions();

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
    items
  }));
});

</script>

<template>
  <NuxtLayout>
    <div class="w-full">
      <div> 
        <h1 class="text-3xl font-bold mb-4">Dokumentacja ATP</h1>

        <p class="text-gray-600 mb-6">
          Witaj w centrum dokumentacji ATP. Wybierz kategorię, aby rozpocząć.
        </p>

        <p class="text-gray-600">
          ATP to platforma do zarządzania i automatyzacji procesów biznesowych.
          Poniżej znajdziesz dokumentację, która pomoże Ci w pełni wykorzystać
          możliwości ATP.
        </p>

        <p class="text-gray-600 mb-6">
          Witaj w centrum dokumentacji ATP. Wybierz kategorię, aby rozpocząć.
        </p>
    
        <div v-if="categories" class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <UCard
            v-for="category in categories"
            :key="category.name"
            class="border hover:shadow-md transition"
          >
            <template #header>
              <h2 class="text-lg font-semibold">{{ category.name }}</h2>
            </template>
            
            <ul class="list-disc list-inside space-y-2">
              <li v-for="doc in category.items.slice(0, 5)" :key="doc.path">
                <NuxtLink :to="doc.path" class="hover:underline text-primary">
                  {{ doc.title }}
                </NuxtLink>
              </li>
            </ul>
            <template #footer v-if="category.items.length > 5">
              <p class="text-sm text-gray-500">
                I {{ category.items.length - 5 }} więcej...
              </p>
            </template>
          </UCard>
        </div>

        <div v-else>
          <p>Ładowanie kategorii dokumentacji...</p>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>