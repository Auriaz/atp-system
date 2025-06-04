<script lang="ts" setup>
import type {  SelectMenuItem, ChipProps } from '@nuxt/ui'

definePageMeta({
  layout: 'authorization',
  middleware: 'auth',
})


// Get user ID from route params
const route = useRoute()
const userId = computed(() => route.params.id as string)

// Use users API
const { fetchUserById, updateUser, isLoading, error } = useUsersApi()

// Toast for notifications
const toast = useToast()

// Current user data
const currentUser = ref<UserResource | null>(null)
const isUpdating = ref(false)

// Form data
const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  username: '',
  bio: '',
  status: 'active' as UserStatus,
  roles: [] as RoleSlugs
})

// Form validation
const formErrors = ref<Record<string, string>>({})

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
      return
    }    // Populate form with user data
    form.firstName = currentUser.value.firstName || ''
    form.lastName = currentUser.value.lastName || ''
    form.email = currentUser.value.email || ''
    form.username = currentUser.value.username || ''
    form.bio = currentUser.value.bio || ''
    form.status = currentUser.value.status as UserStatus || 'active'
    form.roles = currentUser.value.roles || []
    
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

// Validation function
function validateForm() {
  const errors: Record<string, string> = {}
  
  if (!form.firstName.trim()) {
    errors.firstName = 'First name is required'
  }
  
  if (!form.lastName.trim()) {
    errors.lastName = 'Last name is required'
  }
  
  if (!form.email.trim()) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email address'
  }
  
  if (!form.username.trim()) {
    errors.username = 'Username is required'
  } else if (form.username.length < 3) {
    errors.username = 'Username must be at least 3 characters'
  }
  
  if (form.roles.length === 0) {
    errors.roles = 'At least one role must be selected'
  }
  
  formErrors.value = errors
  return Object.keys(errors).length === 0
}

// Handle form submission
async function handleUpdateUser() {
  if (!validateForm()) {
    toast.add({
      title: 'Validation Error',
      description: 'Please fix the form errors before submitting',
      color: 'error',
      icon: 'i-lucide-alert-triangle'
    })
    return
  }
  if (!currentUser.value) return

  isUpdating.value = true

  try {
    const updateData = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      username: form.username,
      bio: form.bio || null,
      status: form.status,
      roles: form.roles as RoleSlugs
    }

    const result = await updateUser(userId.value, updateData)
    
    if (result) {
      toast.add({
        title: 'Success',
        description: 'User profile updated successfully',
        color: 'success',
        icon: 'i-lucide-check-circle'
      })
      
      // Navigate back to user profile
      await navigateTo(`/dashboard/users/${userId.value}/view`)
    }
  } catch (error: any) {
    console.error('Error updating user:', error)
    toast.add({
      title: 'Update Failed',
      description: error?.message || 'Failed to update user profile. Please try again.',
      color: 'error',
      icon: 'i-lucide-x-circle'
    })
  } finally {
    isUpdating.value = false
  }
}

// Navigation functions
function goBack() {
  navigateTo(`/dashboard/users/${userId.value}/view`)
}

function goToUsersList() {
  navigateTo('/dashboard/users')
}

// Computed property for role selection
const selectedRoleObjects = computed({
  get: () => {
    return form.roles.map((role: RoleSlug) => ({ value: role, label: ROLE_NAMES[role as keyof typeof ROLE_NAMES], disabled: false }))
  },
  set: (value: { value: string; label: string; disabled: boolean }[]) => {
    form.roles = value.map(item => item.value) as RoleSlugs
  }
})

// Computed property for status selection
const selectedStatusObject = computed({
  get: () => {
    return { value: form.status, label: USER_STATUS_NAMES[form.status], disabled: false, chip: { color: USER_STATUS_COLORS[form.status]} }
  },
  set: (value: { value: string; label: string; disabled: boolean } | null) => {
    if (value) {
      form.status = value.value as UserStatus
    }
  }
})
console.log('selectedStatusObject:', selectedStatusObject.value)
// Add reactive options for better performance
const statusOptions = computed(() => 
  Object.entries(USER_STATUS_NAMES).map(([value, label]) => ({ 
    value,
    label,
    disabled: false,
    chip: { 
      color: USER_STATUS_COLORS[value as UserStatus],
    } 
  }))
)

const roleOptions = computed(() => 
  Object.entries(ROLE_NAMES).map(([value, label]) => ({ 
    value, 
    label,
    disabled: false 
  }))
)
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
            class="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Back to Profile
          </UButton>
          
          <UBreadcrumb 
            :links=" [
              { label: 'Users', to: '/dashboard/users', icon: 'i-lucide-users' },
              { label: currentUser?.firstName + ' ' + currentUser?.lastName || 'User', to: `/dashboard/users/${userId}/view`, icon: 'i-lucide-user' },
              { label: 'Edit', icon: 'i-lucide-edit' }
            ]"
            class="text-sm"
          />
        </div>
      </template>
      
      <template #header-right>
        <div class="flex space-x-3">
          <UButton 
            variant="ghost"
            color="neutral"
            @click="goBack"
            :disabled="isUpdating"
            class="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </UButton>
          
          <UButton 
            color="primary"
            icon="i-lucide-save"
            @click="handleUpdateUser"
            :loading="isUpdating"
            class="shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
          >
            {{ isUpdating ? 'Saving...' : 'Save Changes' }}
          </UButton>
        </div>
      </template>

      <template #main>
        <!-- Error State -->
        <div v-if="error" class="flex items-center justify-center py-16">
          <div class="text-center max-w-md">
            <div class="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <UIcon name="i-lucide-alert-circle" class="w-10 h-10 text-red-500" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">Error Loading User</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{{ error }}</p>
            <UButton color="primary" variant="soft" @click="goToUsersList" class="transition-all duration-200">
              <UIcon name="i-lucide-arrow-left" class="w-4 h-4 mr-2" />
              Back to Users
            </UButton>
          </div>
        </div>

        <!-- Edit Form -->
        <div v-else-if="currentUser" class="max-w-5xl mx-auto space-y-8">
          <!-- Header Card with Gradient -->
          <UCard class="overflow-hidden shadow-xl border-0 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-600/20 dark:to-secondary-600/20">
            <div class="p-8">
              <div class="flex items-center space-x-6">
                <div class="relative">
                  <XAvatar 
                    :src="`${currentUser.avatarUrl}`"
                    :alt="`${currentUser.firstName} ${currentUser.lastName}`"
                    :firstName="currentUser.firstName"
                    :lastName="currentUser.lastName"
                    :size="80"
                    class="ring-4 ring-white dark:ring-gray-800 shadow-lg"
                  />
                  <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                    <UIcon name="i-lucide-edit-3" class="w-3 h-3 text-white" />
                  </div>
                </div>
                <div class="flex-1">
                  <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Edit User Profile
                  </h1>
                  <p class="text-gray-600 dark:text-gray-300 text-lg">
                    Update {{ currentUser.firstName }}'s information and permissions
                  </p>
                  <div class="flex items-center space-x-4 mt-3">
                    <UBadge :color="form.status === 'active' ? 'success' : form.status === 'suspended' ? 'error' : 'warning'" variant="soft">
                      {{ USER_STATUS_NAMES[form.status] }}
                    </UBadge>
                    <div class="flex space-x-1">
                      <UBadge v-for="role in form.roles" :key="role" :color="role" :icon="USER_ROLE_ICONS[role]" variant="soft" size="sm">
                        {{ ROLE_NAMES[role as keyof typeof ROLE_NAMES] }}
                      </UBadge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </UCard>

          <!-- Form Card -->
          <UCard class="shadow-xl border-0">
            <div class="p-8">
              <UForm :state="form" @submit.prevent="handleUpdateUser" class="space-y-8">
                <!-- Personal Information Section -->
                <div class="space-y-6">
                  <div class="flex items-center space-x-3 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div class="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                      <UIcon name="i-lucide-user" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                      Personal Information
                    </h2>
                  </div>
                  
                  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <UFormField label="First Name" required :error="formErrors.firstName">
                      <UInput 
                        v-model="form.firstName"
                        placeholder="Enter first name" 
                        size="lg"
                        :color="formErrors.firstName ? 'error' : 'primary'"
                        class="w-full transition-all duration-200 focus:scale-[1.02]"
                        icon="i-lucide-user"
                        :disabled="isUpdating"
                      />
                    </UFormField>
                    
                    <UFormField label="Last Name" required :error="formErrors.lastName">
                      <UInput 
                        v-model="form.lastName"
                        placeholder="Enter last name" 
                        size="lg"
                        :color="formErrors.lastName ? 'error' : 'primary'"
                        class="w-full transition-all duration-200 focus:scale-[1.02]"
                        icon="i-lucide-user"
                        :disabled="isUpdating"
                      />
                    </UFormField>
                  </div>

                  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <UFormField label="Email Address" required :error="formErrors.email">
                      <UInput 
                        v-model="form.email"
                        placeholder="Enter email address" 
                        type="email" 
                        size="lg"
                        :color="formErrors.email ? 'error' : 'primary'"
                        class="w-full transition-all duration-200 focus:scale-[1.02]"
                        icon="i-lucide-mail"
                        :disabled="isUpdating"
                      />
                    </UFormField>
                    
                    <UFormField label="Username" required :error="formErrors.username">
                      <UInput 
                        v-model="form.username"
                        placeholder="Enter username" 
                        size="lg"
                        :color="formErrors.username ? 'error' : 'primary'"
                        class="w-full transition-all duration-200 focus:scale-[1.02]"
                        icon="i-lucide-at-sign"
                        :disabled="isUpdating"
                      />
                    </UFormField>
                  </div>

                  <UFormField label="Biography" :error="formErrors.bio">
                    <UTextarea 
                      v-model="form.bio"
                      placeholder="Enter a brief biography (optional)" 
                      :rows="4"
                      size="lg"
                      class="w-full transition-all duration-200 focus:scale-[1.01] resize-none"
                      :disabled="isUpdating"
                    />
                  </UFormField>
                </div>


                <!-- Account Settings Section -->
                <div class="space-y-6">
                  <div class="flex items-center space-x-3 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div class="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                      <UIcon name="i-lucide-settings" class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                      Account Settings
                    </h2>
                  </div>
                  
                  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <UFormField label="Account Status" required :error="formErrors.status">
                      <USelectMenu
                        v-model="selectedStatusObject"
                        :items="statusOptions"
                        size="xl"
                        class="w-full transition-all duration-200"
                        :disabled="isUpdating"
                      >
                        <template #leading="{  modelValue, ui }">
                          <UChip
                            v-if="modelValue"
                            v-bind="modelValue.chip"
                            inset
                            standalone
                            :size="(ui.itemLeadingChipSize() as ChipProps['size'])"
                            :class="ui.itemLeadingChip()"
                          />
                        </template>
                      </USelectMenu>
                    </UFormField>

                    <UFormField label="User Roles" required :error="formErrors.roles">
                      <USelectMenu
                        v-model="selectedRoleObjects"
                        :items="roleOptions"
                        multiple
                        :color="formErrors.roles ? 'error' : 'primary'"
                        class="w-full transition-all duration-200"
                        :disabled="isUpdating"
                      /> 
                    </UFormField>
                  </div>

                  <!-- Debug info (remove in production) -->
                  <div v-if="$dev" class="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs">
                    <p><strong>Form Status:</strong> {{ form.status }}</p>
                    <p><strong>Form Roles:</strong> {{ form.roles }}</p>
                    <p><strong>Is Updating:</strong> {{ isUpdating }}</p>
                  </div>
                </div>
              </UForm>
            </div>
          </UCard>

          <!-- Sticky Action Bar -->
          <div class="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-6 -mx-6 mt-8">
            <div class="flex justify-between items-center max-w-5xl mx-auto">
              <UButton 
                variant="ghost"
                color="neutral"
                icon="i-lucide-x"
                @click="goBack"
                :disabled="isUpdating"
                size="lg"
                class="hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
              >
                Cancel Changes
              </UButton>
              
              <div class="flex space-x-3">
                <UButton 
                  variant="soft"
                  color="primary"
                  icon="i-lucide-eye"
                  @click="goBack"
                  :disabled="isUpdating"
                  size="lg"
                  class="transition-all duration-200"
                >
                  Preview
                </UButton>
                
                <UButton 
                  color="primary"
                  icon="i-lucide-save"
                  @click="handleUpdateUser"
                  :loading="isUpdating"
                  size="lg"
                  class="shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 min-w-[140px]"
                >
                  {{ isUpdating ? 'Saving...' : 'Save Changes' }}
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </template>
    </XDashboardPage>
  </NuxtLayout>
</template>

<style scoped>
/* Custom animations and transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Smooth focus transitions */
input:focus, textarea:focus, select:focus {
  transform: scale(1.01);
  transition: transform 0.2s ease;
}

/* Loading animation */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
