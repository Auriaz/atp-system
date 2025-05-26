<!-- layouts/docs.vue -->
<script setup>
const route = useRoute();
const {navbarItems} = useNavbar()
const { isAuthenticated, user } = useAuth()

// Pobierz aktualny dokument

const { data: document } = await useAsyncData(route.path, () => {
  return queryCollection('docs').path(route.path).first()
})

const { data: navigation } = await useAsyncData('navigation', () => queryCollectionNavigation('docs',[
  'title', 'category', 'path', 'requiredRole', 'description', 'icon'
]))
const { data: files } = await useAsyncData('search', () => queryCollectionSearchSections('docs'))

const searchTerm = ref('')
</script>

<template>
  <XDocumentationLayout :document="document" class="">
    <template #header>
      <x-navbar :container="true" :links="navbarItems">
          <template #logo>
            <x-logo />
          </template>

          <template #search>
            <XDocumentationSearch
              v-model:search-term="searchTerm"
              :files="files"
              :navigation="navigation"
              :fuse="{ 
                resultLimit: 42,
                threshold: 0.2,  // Zwiększa dokładność wyszukiwania (niższa = dokładniejsze)
                distance: 200    // Większa odległość dla dopasowań
              }"
              placeholder="Search"
            />
          </template>

          <template #action>

            <AuthState>
              <div v-if="!isAuthenticated" class="flex items-center space-x-4">
                <UTooltip text="Login">
                  <UButton
                    to="/auth/login"
                    icon="i-line-md-person-filled"
                    color="primary"
                    variant="ghost"
                    square
                  />
                </UTooltip>

                <UTooltip text="Register">
                  <UButton
                    to="/auth/register"
                    variant="ghost"
                    color="primary"
                    icon="i-line-md-person-add-filled"
                    square
                  />
                </UTooltip>
              </div>

              <XDropdownManageAccount v-if="isAuthenticated && user" :user="user" />
            </AuthState>
          </template>

        </x-navbar>
    </template>

    <template #sidebar>
      <!-- Sidebar for documentation -->
      <XDocumentationSidebar 
      :navigation="navigation" 
      :current-path="$route.path" 
      />
    </template>

    <!-- Main content -->
    <div class=" px-4 py-12">
      <slot />
    </div>

  </XDocumentationLayout>
</template>