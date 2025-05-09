<script lang="ts" setup>
const { sidebar } = useSidebar()
const { user, loggedIn} = useUserSession()

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
          <div
              class="flex justify-start px-4 space-x-2"
              :class="[sidebar.isRail ? '' : 'w-64']"
          >
        
          </div>
        </template>

        <template #content>
          <div class="flex justify-center items-center">
            <div>
              <p class="text-gray-600 dark:text-gray-400 mt-1">{{ currentDate }}</p>
            </div>
          </div>
        </template>
        
        <template #action>
          <!-- Manage Account -->
          <XDropdownManageAccount v-if="loggedIn && user" :user="user" />
        </template>
      </XDashboardNavbar>
    </template>

    <template #main>
        <slot />
    </template>
  </XDashboardLayout>
</template>
