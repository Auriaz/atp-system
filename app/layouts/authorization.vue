<script lang="ts" setup>
const { sidebar } = useSidebar()
const { user, isAuthenticated } = useAuth()

let query = ref('')

// Data i czas
const currentDate = new Date().toLocaleDateString('pl-PL', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})
</script>

<template>
  <XDashboardLayout>
    <template #header>
      <XDashboardNavbar>
        <template #bar>

        </template>

        <template #content>
          <div class="flex justify-center items-center">
            <div>
              <p class="w-48 text-gray-600 dark:text-gray-400 mt-1">{{ currentDate }}</p>
            </div>
          </div>
        </template>
          <template #action>

        </template>
      </XDashboardNavbar>
    </template>

    <template #main>
        <slot />
    </template>
  </XDashboardLayout>
</template>
