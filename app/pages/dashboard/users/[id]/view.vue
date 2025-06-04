<script lang="ts" setup>
definePageMeta({
  layout: 'authorization',
  middleware: 'auth',
})

// Local role constants (to avoid import issues)
const USER_ROLES = {
  ADMIN: 'admin',
  COACH: 'coach', 
  ATHLETE: 'athlete',
  MANAGER: 'manager',
  EDITOR: 'editor',
  USER: 'user',
  OBSERVER: 'observer'
} as const

const ROLE_NAMES = {
  admin: 'Administrator',
  coach: 'Coach',
  athlete: 'Athlete', 
  manager: 'Manager',
  editor: 'Editor',
  user: 'User',
  observer: 'Observer'
} as const

const USER_ROLE_COLORS = {
  admin: 'primary',
  coach: 'success',
  athlete: 'warning',
  manager: 'secondary',
  editor: 'primary',
  user: 'info',
  observer: 'neutral'
} as const

const USER_ROLE_ICONS = {
  admin: 'i-lucide-shield',
  coach: 'i-lucide-dumbbell',
  athlete: 'i-lucide-running',
  manager: 'i-lucide-users',
  editor: 'i-lucide-edit',
  user: 'i-lucide-user',
  observer: 'i-lucide-eye'
} as const

type RoleSlug = keyof typeof ROLE_NAMES

// Get user ID from route params
const route = useRoute()
const userId = computed(() => route.params.id as string)

// Use users API to fetch single user
const { fetchUserById, isLoading, error } = useUsersApi()

// Toast for notifications
const toast = useToast()

const avatarUrl = computed(() => {
  return `/images/${currentUser.value?.avatarUrl}` || '/images/default-avatar.png'
})
// Current user data
const currentUser = ref<UserResource | null>(null)

// Load user data on mount
onMounted(async () => {
  try {
    const userData = await fetchUserById(userId.value)
    currentUser.value = userData
    
    if (!currentUser.value) {
      toast.add({
        title: 'User not found',
        description: 'The requested user could not be found.',
        color: 'error',
        icon: 'i-lucide-alert-circle'
      })
      await navigateTo('/dashboard/users')
    }
  } catch (err) {
    console.error('Error loading user:', err)
    toast.add({
      title: 'Error loading user',
      description: 'There was an error loading the user profile.',
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
  }
})

// User status color mapping
const statusColors = {
  active: 'success',
  inactive: 'neutral',
  pending: 'warning',
  suspended: 'error'
} as const

// Format date helper
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Navigation back to users list
function goBack() {
  navigateTo('/dashboard/users')
}

// Edit user function
function editUser() {
  if (currentUser.value) {
    navigateTo(`/dashboard/users/${currentUser.value.id}/edit`)
  }
}
</script>

<template>
  <NuxtLayout>
    <XDashboardPage 
      :loading="isLoading"
      :error="error"
    >
      <template #header-left>
        <div class="flex items-center space-x-4">
          <UButton 
            variant="ghost" 
            color="neutral" 
            icon="i-lucide-arrow-left"
            @click="goBack"
          >
            Back to Users
          </UButton>
        </div>
      </template>
      
      <template #header-right>
        <div v-if="currentUser" class="flex space-x-2">
          <UButton 
            color="info" 
            variant="soft" 
            icon="i-lucide-mail"
          >
            Send Email
          </UButton>
          <UButton 
            color="primary" 
            icon="i-lucide-edit"
            @click="editUser"
          >
            Edit User
          </UButton>
        </div>
      </template>

      <template #main>
        <!-- Error State -->
        <div v-if="error" class="flex items-center justify-center py-12">
          <div class="text-center">
            <UIcon name="i-lucide-alert-circle" class="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Error Loading Profile</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-4">{{ error }}</p>
            <UButton color="primary" @click="goBack">
              <UIcon name="i-lucide-arrow-left" class="w-4 h-4 mr-2" />
              Back to Users
            </UButton>
          </div>
        </div>        <!-- User Profile Content -->
        <div v-else-if="currentUser" class="relative pt-10 pb-6 space-y-6">
          <!-- Profile Header Card with Enhanced Visual Design -->
          <UCard class="overflow-hidden">
            <div class="bg-gradient-to-r from-secondary-900 to-primary-600 px-6 py-8 text-white">
              <div class="flex items-center space-x-6">
                <XAvatar 
                    :src="`${currentUser.avatarUrl}`"
                    :alt="`${currentUser.firstName} ${currentUser.lastName}`"
                    :firstName="currentUser.firstName"
                    :lastName="currentUser.lastName"      
                    :size="80"
                    class="ring-4 ring-white/20"
                />
                <div>
                  <h2 class="text-2xl font-bold">
                    {{ currentUser.firstName }} {{ currentUser.lastName }}
                  </h2>
                  <p class="text-primary-100 text-lg">{{ currentUser.email }}</p>
                  <p class="text-primary-200">@{{ currentUser.username }}</p>
                  <div class="flex items-center space-x-3 mt-3">
                    <UBadge 
                      :color="statusColors[currentUser.status as keyof typeof statusColors]"
                      variant="solid"
                      class="capitalize"
                    >
                      {{ currentUser.status }}
                    </UBadge>
                    <span class="text-primary-200">•</span>
                    <span class="text-primary-200 text-sm">ID: #{{ currentUser.id }}</span>
                  </div>
                </div>
              </div>
            </div>
          </UCard>

          <!-- Main Content Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">            <!-- Main Content Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <!-- Main Profile Info -->
              <div class="lg:col-span-2 space-y-6">
                <!-- Basic Information Card -->
                <UCard>
                  <template #header>
                    <div class="flex items-center space-x-2">
                      <UIcon name="i-lucide-user" class="w-5 h-5 text-primary-500" />
                      <h3 class="text-lg font-medium text-gray-900 dark:text-white">Basic Information</h3>
                    </div>
                  </template>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-1">
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
                      <p class="text-gray-900 dark:text-white font-medium">{{ currentUser.firstName }}</p>
                    </div>
                    <div class="space-y-1">
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
                      <p class="text-gray-900 dark:text-white font-medium">{{ currentUser.lastName }}</p>
                    </div>
                    <div class="space-y-1">
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                      <p class="text-gray-900 dark:text-white font-medium">@{{ currentUser.username }}</p>
                    </div>
                    <div class="space-y-1">
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                      <p class="text-gray-900 dark:text-white font-medium">{{ currentUser.email }}</p>
                    </div>
                  </div>
                </UCard>

                <!-- Roles & Permissions Card -->
                <UCard>
                  <template #header>
                    <div class="flex items-center space-x-2">
                      <UIcon name="i-lucide-shield-check" class="w-5 h-5 text-success-500" />
                      <h3 class="text-lg font-medium text-gray-900 dark:text-white">Roles & Permissions</h3>
                    </div>
                  </template>

                  <div class="space-y-4">
                    <div v-if="currentUser.roles && currentUser.roles.length > 0">
                      <div class="flex flex-wrap gap-3">
                        <UBadge
                          v-for="role in currentUser.roles"
                          :key="role"
                          :color="USER_ROLE_COLORS[role as RoleSlug] || 'neutral'"
                          :icon="USER_ROLE_ICONS[role as RoleSlug] || 'i-lucide-user'"
                          variant="subtle"
                          size="lg"
                          class="capitalize px-3 py-1"
                        >
                          {{ ROLE_NAMES[role as RoleSlug] || role }}
                        </UBadge>
                      </div>
                    </div>
                    <div v-else class="text-center py-4">
                      <UIcon name="i-lucide-user-x" class="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p class="text-gray-600 dark:text-gray-400">No roles assigned</p>
                    </div>
                  </div>
                </UCard>

                <!-- Account Activity Card -->
                <UCard>
                  <template #header>
                    <div class="flex items-center space-x-2">
                      <UIcon name="i-lucide-activity" class="w-5 h-5 text-info-500" />
                      <h3 class="text-lg font-medium text-gray-900 dark:text-white">Account Activity</h3>
                    </div>
                  </template>

                  <div class="space-y-4">
                    <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div class="flex items-center space-x-3">
                        <div class="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                          <UIcon name="i-lucide-user-plus" class="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p class="font-medium text-gray-900 dark:text-white">Account Created</p>
                          <p class="text-sm text-gray-600 dark:text-gray-400">{{ currentUser.createdAtAgo }}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div v-if="currentUser.updatedAtAgo" class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div class="flex items-center space-x-3">
                        <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                          <UIcon name="i-lucide-edit" class="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p class="font-medium text-gray-900 dark:text-white">Last Updated</p>
                          <p class="text-sm text-gray-600 dark:text-gray-400">{{ currentUser.updatedAtAgo }}</p>
                        </div>
                      </div>
                    </div>                  </div>
                </UCard>
              </div>

              <!-- Sidebar with Additional Info -->
              <div class="space-y-6">
          <!-- Account Timeline -->
          <UCard>
            <template #header>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Account Timeline</h3>
            </template>
            
            <div class="space-y-4">
              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0">
                  <UIcon name="i-lucide-user-plus" class="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">Account Created</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ currentUser.createdAtAgo }}
                  </p>
                </div>
              </div>
              
              <div v-if="currentUser.updatedAtAgo" class="flex items-start space-x-3">
                <div class="flex-shrink-0">
                  <UIcon name="i-lucide-edit" class="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">Last Updated</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ currentUser.updatedAtAgo }}
                  </p>
                </div>
              </div>            
            </div>
          </UCard>
        </div>
            </div>
          </div>
        </div>

        <!-- User Not Found State -->
        <div v-else class="flex items-center justify-center py-12">
          <div class="text-center">
            <UIcon name="i-lucide-user-x" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">User Not Found</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-4">The requested user profile could not be found.</p>
            <UButton color="primary" @click="goBack">
              <UIcon name="i-lucide-arrow-left" class="w-4 h-4 mr-2" />
              Back to Users
            </UButton>
          </div>
        </div>
      </template>

      <template #sidebar>
        <div v-if="currentUser" class="space-y-6">
          <!-- Quick Actions -->
          <UCard>
            <template #header>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Quick Actions</h3>
            </template>
            
            <div class="space-y-2">
              <UButton 
                color="primary" 
                variant="soft" 
                icon="i-lucide-edit" 
                block
                @click="editUser"
              >
                Edit Profile
              </UButton>
              
              <UButton 
                color="info" 
                variant="soft" 
                icon="i-lucide-mail" 
                block
              >
                Send Email
              </UButton>
              
              <UButton 
                color="warning" 
                variant="soft" 
                icon="i-lucide-key" 
                block
              >
                Reset Password
              </UButton>
              
              <UButton 
                color="error" 
                variant="soft" 
                icon="i-lucide-user-x" 
                block
              >
                Suspend Account
              </UButton>
            </div>
          </UCard>

          <!-- User Statistics -->
          <UCard>
            <template #header>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">User Statistics</h3>
            </template>
            
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Profile Views</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">124</span>
              </div>
              
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Login Count</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">1,456</span>
              </div>
              
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Last Login</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">2 hours ago</span>
              </div>
            </div>
          </UCard>        </div>
      </template>
    </XDashboardPage>
  </NuxtLayout>
</template>
