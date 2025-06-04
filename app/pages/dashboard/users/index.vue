<script lang="ts" setup>
import type { TableColumn, DropdownMenuItem } from '@nuxt/ui'
import { XAvatar} from '#components'
import { z } from 'zod'

definePageMeta({
  layout: 'authorization',
  middleware: 'auth',
})
const { user } = useAuth()
// Użycie composable
const { 
  users, 
  pagination,
  isLoading, 
  error, 
  fetchUsers, 
  createUser,
  deleteUser,
  updateUser,
} = useUsersApi()


const UBadge = resolveComponent('UBadge')
const UAvatar = resolveComponent('UAvatar')
const toast = useToast()
const query = ref('')

// Create User Form State
const createUserForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  roles: [] as RoleSlug[]
})

// Computed property for role selection in the form
const selectedRoleObjects = computed({
  get: () => {
    return createUserForm.roles.map(role => ({ value: role, label: ROLE_NAMES[role] }))
  },
  set: (value: { value: string; label: string }[]) => {
    createUserForm.roles = value.map(item => item.value as RoleSlug)
  }
})

// Computed property for view selection
const selectedViewOption = computed({
  get: () => {
    return viewOptions.find(option => option.value === settings.view) || viewOptions[0]
  },
  set: (value: { value: string; label: string; icon: string }) => {
    settings.view = value.value
  }
})

// Form validation state
const formErrors = ref<Record<string, string>>({})
const isCreatingUser = ref(false)

// Create User Form Schema for validation
const createUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name must not exceed 50 characters'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name must not exceed 50 characters'),
  email: z.string().email('Please provide a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
  roles: z.array(z.string()).min(1, 'At least one role must be selected')
})

// Dashboard Page Reference for sidebar control
const dashboardPage = ref<{ openSettingsSidebar: () => void } | null>(null)

// Dane dla filtrów
const statusOptions = [
  { value: 'all', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
  { value: 'suspended', label: 'Suspended' }
]

// Uaktualnione opcje ról z wykorzystaniem stałych systemowych
const roleOptions = [
  { value: 'all', label: 'All roles' },
  { value: USER_ROLES.ADMIN, label: ROLE_NAMES[USER_ROLES.ADMIN] },
  { value: USER_ROLES.MANAGER, label: ROLE_NAMES[USER_ROLES.MANAGER] },
  { value: USER_ROLES.COACH, label: ROLE_NAMES[USER_ROLES.COACH] },
  { value: USER_ROLES.ATHLETE, label: ROLE_NAMES[USER_ROLES.ATHLETE] },
  { value: USER_ROLES.EDITOR, label: ROLE_NAMES[USER_ROLES.EDITOR] },
  { value: USER_ROLES.USER, label: ROLE_NAMES[USER_ROLES.USER] }
]

// User view options
const viewOptions = [
  { value: 'table', label: 'Table view', icon: 'i-lucide-layout-list' },
  { value: 'grid', label: 'Grid view', icon: 'i-lucide-layout-grid' },
  { value: 'compact', label: 'Compact view', icon: 'i-lucide-layout-dashboard' },
]

// Settings for display
const settings = reactive({
  view: 'table',
  pageSize: 10,
  dateFormat: 'relative',
  showAvatar: true,
  enableAnimations: true,
  refreshInterval: 0
})

// Pagination state
const currentPage = ref(1)

// Filtry
const selectedStatus = ref(statusOptions[0])
const selectedRole = ref(roleOptions[0])
const sortBy = ref('createdAt')
const sortDesc = ref(true)

// Stan UI
const isCreateModalOpen = ref(false)
const isImportModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const isSwitchActiveModalOpen = ref(false)
const selectedBulkAction = ref(null)
const selectedUsers = ref([])

// Delete user state
const userToDelete = ref<UserResource | null>(null)
const isDeletingUser = ref(false)
const deleteConfirmationText = ref('')

// Switch active user state
const userToSwitch = ref<UserResource | null>(null)
const isSwitchingUser = ref(false)

// Refresh interval
let refreshTimer: ReturnType<typeof setInterval> | null = null

// Set refresh interval when settings change
watch(() => settings.refreshInterval, (newValue) => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
  }
  if (newValue > 0) {
    refreshTimer = setInterval(() => {
      refreshData()
    }, newValue * 1000)
  }
})

onBeforeUnmount(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
  }
})

// Pobierz użytkowników przy załadowaniu komponentu
onMounted(async () => await loadUsers())

// Computed property for fetch parameters
const fetchParams = computed(() => ({
  page: currentPage.value,
  limit: settings.pageSize,
  search: query.value || undefined,
  status: selectedStatus.value?.value !== 'all' ? selectedStatus.value?.value : undefined,
  role: selectedRole.value?.value !== 'all' ? selectedRole.value?.value : undefined,
  sortBy: sortBy.value,
  sortOrder: sortDesc.value ? 'desc' : 'asc'
}))

// Load users with current parameters
async function loadUsers() {
  await fetchUsers(fetchParams.value)
}

// Watch for parameter changes and reload data
watch([currentPage, () => settings.pageSize, query, selectedStatus, selectedRole, sortBy, sortDesc], 
  (newValues, oldValues) => {
    // Reset to first page when filters change (except for page changes)
    const isPageChange = newValues[0] !== oldValues?.[0] && oldValues?.[0] !== undefined
    const isPageSizeChange = newValues[1] !== oldValues?.[1] && oldValues?.[1] !== undefined
    
    if (!isPageChange && (isPageSizeChange || currentPage.value !== 1)) {
      currentPage.value = 1
    } else {
      loadUsers()
    }
  },
  { deep: true }
)

// Watch for page changes specifically
watch(currentPage, () => {
  loadUsers()
})

function refreshData() {
  toast.add({
    title: 'Refreshing data',
    description: 'User data is being refreshed',
    icon: 'i-lucide-refresh-cw',
    color: 'info',
  })
  loadUsers()
}

// Obsługa sortowania
const toggleSort = (field: string) => {
  if (sortBy.value === field) {
    sortDesc.value = !sortDesc.value
  } else {
    sortBy.value = field
    sortDesc.value = true
  }
}

// Definicja kolumn tabeli
const columns: TableColumn<UserResource>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => `#${row.getValue('id')}`,
    enableSorting: true
  },
  {
    accessorKey: 'username',
    header: 'User',
    cell: ({ row }) => {
      if (!settings.showAvatar) {
        return h('div', { class: 'flex flex-col' }, [
          h('p', { class: 'font-medium text-(--ui-text-highlighted)' }, row.original.firstName + ' ' + row.original.lastName),
          h('p', { class: 'text-xs text-gray-500 dark:text-gray-400' }, `@${row.original.username}`)
        ])
      }
      
      return h('div', { class: 'flex items-center gap-3' }, [
        h(XAvatar, {
          src: `${row.original.avatarUrl}`,
          size: settings.view === 'compact' ? 32 : 48,
          alt: `${row.original.firstName} ${row.original.lastName}`
        }),
        h('div', undefined, [
          h('p', { class: 'font-medium text-(--ui-text-highlighted)' }, row.original.firstName + ' ' + row.original.lastName),
          h('p', { class: 'text-xs text-gray-500 dark:text-gray-400' }, `@${row.original.username}`)
        ])
      ])
    },
    enableSorting: true
  },
  {
    accessorKey: 'email',
    header: 'Email',
    enableSorting: true
  },
  {
    accessorKey: 'role',
    header: 'Roles',
    cell: ({ row }) => {
      // Get roles from the original data object
      const userData = row.original;
      let roles: RoleSlug[] = [];
      
      // Check if roles exist as array
      if (userData.roles && Array.isArray(userData.roles)) {
        roles = userData.roles;
      }
      
      // If no roles, show default value
      if (!roles.length) {
        return h(UBadge, { 
          class: 'capitalize', 
          variant: 'subtle', 
          color: 'neutral', 
          icon: 'i-lucide-user' 
        }, () => 'No roles');
      }
      
      // Create elements for each role
      return h('div', { class: 'flex flex-wrap gap-1' }, 
        roles.map(role => {
          const color = USER_ROLE_COLORS[role] || 'observer';
          const icon = USER_ROLE_ICONS[role] || 'i-lucide-user';
          
          return h(UBadge, { 
            key: role,
            class: 'capitalize', 
            variant: 'subtle', 
            color, 
            icon 
          }, () => role);
        })
      );
    },
    enableSorting: true
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as UserStatus
      const color = USER_STATUS_COLORS[status] || 'nutral'
      let icon = 'i-lucide-circle'
      
      switch(status) {
        case 'active':
          icon = 'i-lucide-check-circle'
          break
        case 'inactive':
          icon = 'i-lucide-circle-off'
          break
        case 'pending':
          icon = 'i-lucide-clock'
          break
        case 'suspended':
          icon = 'i-lucide-alert-circle'
          break
      }

      return h(UBadge, { 
        class: 'capitalize', 
        variant: 'subtle', 
        color,
        icon
      }, () => status)
    },
    enableSorting: true
  },
  {
    accessorKey: 'createdAtAgo',
    header: 'Created',
    cell: ({ row }) => {
      if (settings.dateFormat === 'absolute') {
        return h('div', { class: 'text-sm' }, new Date(row.original.createdAtAgo).toLocaleDateString())
      }

      return h('div', { class: 'flex flex-col' }, [
        h('span', { class: 'text-sm' }, row.getValue('createdAtAgo')),
        h('span', { class: 'text-xs text-gray-500 dark:text-gray-400' }, new Date(row.original.createdAtAgo).toLocaleDateString())
      ])
    },
    enableSorting: true
  },
  {
    accessorKey: 'updatedAtAgo',
    header: 'Updated',
    cell: ({ row }) => {
      if (settings.dateFormat === 'absolute') {
        return h('div', { class: 'text-sm' }, row.original.updatedAtAgo ? new Date(row.original.updatedAtAgo).toLocaleDateString() : 'N/A')
      }
      
      return h('div', { class: 'flex flex-col' }, [
        h('span', { class: 'text-sm' }, row.getValue('updatedAtAgo')),
        h('span', { class: 'text-xs text-gray-500 dark:text-gray-400' }, row.original.updatedAtAgo ? new Date(row.original.updatedAtAgo).toLocaleDateString() : 'N/A')
      ])
    },
    enableSorting: true
  },
  {
    id: 'action'
  }
]

// Akcje dla menu kontekstowego
function getDropdownActions(user: UserResource): DropdownMenuItem[][] {
  return [
    [
      {
        label: 'View profile',
        icon: 'i-lucide-user',
        to: `/dashboard/users/${user.id}/view`
      },
      {
        label: 'Copy ID',
        icon: 'i-lucide-copy',
        onSelect: () => {
          navigator.clipboard.writeText(user.id.toString())
          toast.add({
            title: 'User ID copied to clipboard!',
            color: 'success',
            icon: 'i-lucide-check-circle'
          })
        }
      }
    ],
    [
      {
        label: 'Edit',
        icon: 'i-lucide-edit',
        to: `/dashboard/users/${user.id}/edit`
      },
      {
        label: user.status === 'active' ? 'Deactivate' : 'Activate',
        icon: user.status === 'active' ? 'i-lucide-user-x' : 'i-lucide-user-check',
        color: user.status === 'active' ? 'warning' : 'success',
        onSelect: () => {
          openSwitchActiveModal(user)
        }
      }
    ],
    [
      {
        label: 'Delete',
        icon: 'i-lucide-trash',
        color: 'error',
        onSelect: () => {
          openDeleteModal(user)
        }
      }
    ]
  ]
}

// Akcje grupowe
const bulkActions = [
  { value: 'activate', label: 'Activate selected' },
  { value: 'deactivate', label: 'Deactivate selected' },
  { value: 'delete', label: 'Delete selected', color: 'red' }
]

// Handle pagination change
function handlePageChange(page: number) {
  currentPage.value = page
}

// Reset filters and pagination
function resetFilters() {
  selectedStatus.value = statusOptions[0]
  selectedRole.value = roleOptions[0]
  query.value = ''
  currentPage.value = 1
}

// Metody pomocnicze
function clearQuery() {
  query.value = ''
  currentPage.value = 1
}

// Delete user functions
function openDeleteModal(user: UserResource) {
  userToDelete.value = user
  deleteConfirmationText.value = ''
  isDeleteModalOpen.value = true
}

function openSwitchActiveModal(user: UserResource) {
  userToSwitch.value = user
  isSwitchActiveModalOpen.value = true
}

function closeDeleteModal() {
  isDeleteModalOpen.value = false
  userToDelete.value = null
  deleteConfirmationText.value = ''
  isDeletingUser.value = false
}

function closeSwitchActiveModal() {
  isSwitchActiveModalOpen.value = false
  userToSwitch.value = null
  isSwitchingUser.value = false
}

const isDeleteConfirmationValid = computed(() => {
  if (!userToDelete.value) return false
  const expectedText = `${userToDelete.value.firstName} ${userToDelete.value.lastName}`
  return deleteConfirmationText.value === expectedText
})

async function handleDeleteUser() {
  if (!userToDelete.value || !isDeleteConfirmationValid.value) {
    toast.add({
      title: 'Invalid confirmation',
      description: 'Please type the user\'s full name to confirm deletion',
      color: 'error',
      icon: 'i-lucide-alert-triangle'
    })
    return
  }

  isDeletingUser.value = true

  try {
    const result = await deleteUser(userToDelete.value.id.toString())
    
    if (result) {
      toast.add({
        title: 'User deleted',
        description: `${userToDelete.value.firstName} ${userToDelete.value.lastName} has been permanently deleted`,
        color: 'success',
        icon: 'i-lucide-check-circle'
      })
      
      // Close modal and refresh data
      closeDeleteModal()
      await loadUsers()
      
      // Clear selection if deleted user was selected
      selectedUsers.value = selectedUsers.value.filter(
        (selected: any) => selected.id !== userToDelete.value?.id
      )
    }
  } catch (error: any) {
    console.error('Error deleting user:', error)
    toast.add({
      title: 'Delete failed',
      description: error?.message || 'Failed to delete user. Please try again.',
      color: 'error',
      icon: 'i-lucide-x-circle'
    })
  } finally {
    isDeletingUser.value = false
  }
}

async function handleSwitchUserActive() {
  if (!userToSwitch.value) return

  isSwitchingUser.value = true

  try {
    const newStatus = userToSwitch.value.status === 'active' ? 'inactive' : 'active'
    const actionText = newStatus === 'active' ? 'activated' : 'deactivated'
    
    const updateData = {
      ...userToSwitch.value,
      status: newStatus
    }

    const result = await updateUser(userToSwitch.value.id.toString(), updateData)
    
    if (result) {
      toast.add({
        title: `User ${actionText}`,
        description: `${userToSwitch.value.firstName} ${userToSwitch.value.lastName} has been ${actionText}`,
        color: newStatus === 'active' ? 'success' : 'warning',
        icon: newStatus === 'active' ? 'i-lucide-user-check' : 'i-lucide-user-x'
      })
      
      // Close modal and refresh data
      closeSwitchActiveModal()
      await loadUsers()
    }
  } catch (error: any) {
    console.error('Error switching user status:', error)
    toast.add({
      title: 'Status change failed',
      description: error?.message || 'Failed to change user status. Please try again.',
      color: 'error',
      icon: 'i-lucide-x-circle'
    })
  } finally {
    isSwitchingUser.value = false
  }
}

async function handleBulkDelete() {
  if (selectedUsers.value.length === 0) return
  
  const confirmed = confirm(`Are you sure you want to delete ${selectedUsers.value.length} selected users? This action cannot be undone.`)
  
  if (!confirmed) return
  
  try {
    // Delete users one by one (or implement bulk delete API)
    for (const user of selectedUsers.value) {
      await deleteUser((user as UserResource).id.toString())
    }
    
    toast.add({
      title: 'Users deleted',
      description: `${selectedUsers.value.length} users have been deleted`,
      color: 'success',
      icon: 'i-lucide-check-circle'
    })
    
    // Clear selection and refresh
    selectedUsers.value = []
    await loadUsers()
    
  } catch (error: any) {
    console.error('Error deleting users:', error)
    toast.add({
      title: 'Bulk delete failed',
      description: 'Some users could not be deleted. Please try again.',
      color: 'error',
      icon: 'i-lucide-x-circle'
    })
  }
}

function handleBulkAction() {
  if (!selectedBulkAction.value || selectedUsers.value.length === 0) return
  
  switch (selectedBulkAction.value) {
    case 'delete':
      handleBulkDelete()
      break
    default:
      // Implementacja innych akcji masowych
      toast.add({
        title: `Action performed: ${selectedBulkAction.value}`,
        description: `Number of selected users: ${selectedUsers.value.length}`,
        color: 'info'
      })
      break
  }
  
  selectedBulkAction.value = null
  selectedUsers.value = []
}

// Eksport do CSV/Excel
function exportUsers() {
  toast.add({
    title: 'Exporting users',
    description: 'The file will be downloaded in a few seconds',
    color: 'info',
    icon: 'i-lucide-download'
  })
}

// Open settings sidebar
function openSettings() {
  if (dashboardPage.value) {
    dashboardPage.value.openSettingsSidebar()
  }
}

// Form validation function
function validateForm(): boolean {
  try {
    createUserSchema.parse(createUserForm)
    formErrors.value = {}
    return true
  } catch (error) {
    if (error instanceof z.ZodError) {
      formErrors.value = {}
      error.errors.forEach((err) => {
        if (err.path.length > 0) {
          formErrors.value[err.path[0] as string] = err.message
        }
      })
    }
    return false
  }
}

// Reset create user form
function resetCreateUserForm() {
  createUserForm.firstName = ''
  createUserForm.lastName = ''
  createUserForm.email = ''
  createUserForm.password = ''
  createUserForm.roles = []
  formErrors.value = {}
}

// Handle create user form submission
async function handleCreateUser() {
  if (!validateForm()) {
    toast.add({
      title: 'Validation Error',
      description: 'Please fix the form errors before submitting',
      color: 'error'
    })
    return
  }

  isCreatingUser.value = true

  try {
    const userData = {
      firstName: createUserForm.firstName,
      lastName: createUserForm.lastName,
      email: createUserForm.email,
      password: createUserForm.password,
      role: createUserForm.roles[0] // API expects single role, use first selected role
    }

    const result = await createUser(userData)
    
    if (result) {
      toast.add({
        title: 'Success',
        description: 'User created successfully',
        color: 'primary'
      })
      
      // Close modal and reset form
      isCreateModalOpen.value = false
      resetCreateUserForm()
      
      // Refresh the users list to show the new user
      await loadUsers()
    }
  } catch (error) {
    console.error('Error creating user:', error)
  } finally {
    isCreatingUser.value = false
  }
}

// Handle modal close
function handleModalClose() {
  isCreateModalOpen.value = false
  resetCreateUserForm()
}
</script>

<template>
  <NuxtLayout>
    <XDashboardPage 
      ref="dashboardPage"
      :loading="isLoading" 
    >
      <template #header-left>

      </template>
      
      <template #header-right>
        <div class="flex flex-col lg:flex-row items-start lg:items-center gap-4">
          <div class="flex flex-wrap gap-2">
            <UButton 
              color="primary" 
              icon="i-lucide-user-plus" 
              @click="isCreateModalOpen = true"
            >
              Add User
            </UButton>
            
            <UButton 
              color="primary" 
              variant="soft" 
              icon="i-lucide-upload" 
              @click="isImportModalOpen = true"
            >
              Import
            </UButton>
            
            <UButton 
              color="primary" 
              variant="soft" 
              icon="i-lucide-download" 
              @click="exportUsers"
            >
              Export
            </UButton>
          </div>

        </div>
      </template>
  
      <template #main>
        <div class="relative pt-10 pb-6 space-y-6">
          
          
          <div class="flex items-center gap-2">
              <!-- Search -->
            <div class="w-full lg:w-80 relative">
              <UInput
                v-model="query"
                placeholder="Search users..."
                color="primary"
                icon="i-lucide-search"
                class="w-full"
              />
      
              <div class="absolute top-1 right-1 z-2">
                <UButton 
                  v-if="query" 
                  color="primary" 
                  variant="ghost" 
                  size="sm" 
                  icon="i-lucide-x" 
                  @click="clearQuery()" 
                />
              </div>
            </div>
            
            <!-- Filters -->
            <div class="flex flex-wrap gap-2">
              <USelectMenu
                v-model="selectedStatus"
                :items="statusOptions"
                placeholder="Status"
                color="primary"
                variant="soft"
                class="w-44"
              />
              
              <USelectMenu
                v-model="selectedRole"
                :items="roleOptions"
                placeholder="Role"
                color="primary"
                variant="soft"
                class="w-44"
              />
              
              <UButton 
                v-if="selectedStatus?.value !== 'all' || selectedRole?.value !== 'all' || query" 
                color="primary" 
                variant="soft" 
                icon="i-lucide-x" 
                @click="resetFilters"
              >
                Clear Filters
              </UButton>
            </div>
          </div>
          <!-- Bulk Actions (visible only when users are selected) -->
          <div v-if="selectedUsers.length > 0" class="bg-white dark:bg-slate-950 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-check" class="text-primary-600 dark:text-primary-400" />
              <span>{{ selectedUsers.length }} users selected</span>
            </div>
            
            <div class="flex items-center gap-2">
              <USelectMenu
                v-model="selectedBulkAction"
                :options="bulkActions"
                placeholder="Choose action"
                color="primary"
                variant="soft"
                class="w-60"
              />
              
              <UButton 
                color="primary" 
                :disabled="!selectedBulkAction" 
                @click="handleBulkAction"
              >
                Execute
              </UButton>
              
              <UButton 
                color="primary" 
                variant="soft" 
                icon="i-lucide-x" 
                @click="selectedUsers = []"
              >
                Cancel
              </UButton>
            </div>
          </div>

          <!-- User Table/Grid -->
          <UCard class="bg-white dark:bg-slate-950" :ui="{ body: settings.view === 'compact' ? 'p-0' : 'p-4' }">            
            <UTable 
              :loading="isLoading" 
              loading-color="primary" 
              loading-animation="carousel"
              :data="users || []" 
              :columns="columns" 
              :ui="{
                td: settings.view === 'compact' ? 'px-4 py-2' : 'px-4 py-3',
                th: settings.view === 'compact' ? 'px-4 py-2' : 'px-4 py-3',
                root: 'bg-white dark:bg-slate-950',
                thead: 'bg-white dark:bg-slate-950',
                tbody: 'bg-white dark:bg-slate-950'
              }"
              :rows-selectable="true"
              v-model:selected="selectedUsers"
              :empty-state="{ 
                icon: 'i-lucide-users-x', 
                label: 'No users found', 
                description: 'No users match your search criteria.' 
              }"
              hover
              class="w-full"
            >
              <template #empty-state-icon>
                <div class="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                  <UIcon name="i-lucide-users-x" class="text-3xl text-gray-500 dark:text-gray-400" />
                </div>
              </template>
              
              <template #action-cell="{ row }">
                <UDropdownMenu :items="getDropdownActions(row.original)">
                  <UButton icon="i-lucide-more-horizontal" color="primary" variant="ghost" />
                </UDropdownMenu>
              </template>
              
              <template #header-cell="{ column }">
                <div class="flex items-center justify-between gap-2">
                  <span>{{ column.id === 'action' ? 'Actions' : String(column.columnDef?.header) }}</span>
                  <UButton 
                    v-if="column.columnDef?.enableSorting" 
                    variant="ghost" 
                    color="primary" 
                    size="xs"
                    :icon="sortBy === column.id 
                      ? (sortDesc ? 'i-lucide-arrow-down' : 'i-lucide-arrow-up')
                      : 'i-lucide-arrow-up-down'" 
                    @click="toggleSort(column.id)"
                  />
                </div>
              </template>
            </UTable>
          </UCard>
            <!-- Pagination -->
          <div class="flex justify-between items-center mt-4">
            <div class="text-sm text-gray-600 dark:text-gray-400">
              <template v-if="pagination.total">
                Showing {{ pagination.from || 1 }} to {{ pagination.to || (users?.length || 0) }} of {{ pagination.total }} users
              </template>
              <template v-else>
                Showing {{ users?.length || 0 }} users
              </template>
            </div>

            <UPagination 
              v-if="pagination.total && pagination.total > settings.pageSize"
              v-model:page="currentPage"
              :total="pagination.total" 
              :ui="{ root: 'flex gap-1' }"
              :page-count="5" 
              :items-per-page="settings.pageSize"
              :sibling-count="1" show-edges
              color="primary"
              @update:model-value="handlePageChange"
            />
          </div>
        </div>
        </template>
        <!-- Settings Section -->
        <template #sidebar>
        <div class="space-y-6">
          <!-- View Settings -->
          <div class="bg-white dark:bg-slate-950 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">View Settings</h3>
            
            <div class="space-y-4">
              <UFormField label="Display Mode">
                <USelectMenu
                  v-model="selectedViewOption"
                  :items="viewOptions"
                  placeholder="Select view mode"
                />
              </UFormField>
              
              <UFormField label="Items Per Page">
                <USelect
                  v-model="settings.pageSize"
                  :items="[5, 10, 20, 50, 100]"
                />
              </UFormField>
              
              <UFormField label="Date Format">
                <URadioGroup
                  v-model="settings.dateFormat" 
                  name="dateFormat"
                  :items="[
                    { value: 'relative', label: 'Relative (e.g. 2 days ago)' },
                    { value: 'absolute', label: 'Absolute (e.g. 03/22/2025)' }
                  ]"
                />
              </UFormField>
              
              <UFormField>
                <UCheckbox 
                  v-model="settings.showAvatar" 
                  label="Show user avatars" 
                />
              </UFormField>
              
              <UFormField>
                <UCheckbox 
                  v-model="settings.enableAnimations" 
                  label="Enable animations" 
                />
              </UFormField>
            </div>
          </div>
          
          <!-- Data Refresh Settings -->
          <div class="bg-white dark:bg-slate-950 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Data Settings</h3>
            
            <UFormField label="Auto-refresh Interval">
              <USelect
                v-model="settings.refreshInterval"
                :items="[
                  { label: 'Never', value: 0 },
                  { label: '30 seconds', value: 30 },
                  { label: '1 minute', value: 60 },
                  { label: '5 minutes', value: 300 },
                  { label: '15 minutes', value: 900 }
                ]"
              />
            </UFormField>
            
            <div class="mt-4">
              <UButton 
                color="primary" 
                icon="i-lucide-refresh-cw" 
                block 
                @click="refreshData"
              >
                Refresh Data Now
              </UButton>
            </div>
          </div>
          
          <!-- Export Options -->
          <div class="bg-white dark:bg-slate-950 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Export Options</h3>
            
            <div class="space-y-2">
              <UButton 
                color="primary" 
                variant="soft" 
                icon="i-lucide-file-text" 
                block
                @click="exportUsers"
              >
                Export as CSV
              </UButton>
              
              <UButton 
                color="primary" 
                variant="soft" 
                icon="i-lucide-file-spreadsheet" 
                block
                @click="exportUsers"
              >
                Export as Excel
              </UButton>
              
              <UButton 
                color="primary" 
                variant="soft" 
                icon="i-lucide-file-text" 
                block
                @click="exportUsers"
              >
                Export as PDF
              </UButton>
            </div>
          </div>
        </div>
      </template>
    </XDashboardPage>
    
    <!-- Modal for adding a user -->
    <UModal v-model:open="isCreateModalOpen" title="Add New User" description="Fill in the form below to add a new user to the system.">
      
      <template #body>
        <UCard>
          <!-- User form -->
          <UForm :state="createUserForm" @submit.prevent="handleCreateUser" class="w-full flex flex-col space-y-4">
            <UFormField label="First Name" required :error="formErrors.firstName">
              <UInput 
                v-model="createUserForm.firstName"
                placeholder="User's first name" 
                class="w-full"
                :color="formErrors.firstName ? 'error' : 'primary'"
              />
            </UFormField>
            
            <UFormField label="Last Name" required :error="formErrors.lastName">
              <UInput 
                v-model="createUserForm.lastName"
                placeholder="User's last name" 
                class="w-full"
                :color="formErrors.lastName ? 'error' : 'primary'"
              />
            </UFormField>
            
            <UFormField label="Email" required :error="formErrors.email">
              <UInput 
                v-model="createUserForm.email"
                placeholder="User's email" 
                type="email" 
                class="w-full"
                :color="formErrors.email ? 'error' : 'primary'"
              />
            </UFormField>
            <UFormField label="Password" required :error="formErrors.password">
              <UInput 
                v-model="createUserForm.password"
                placeholder="User's password" 
                type="password" 
                class="w-full"
                :color="formErrors.password ? 'error' : 'primary'"
              />
            </UFormField>

            <UFormField label="Roles" required :error="formErrors.roles">
              <USelectMenu
                v-model="selectedRoleObjects"
                multiple
                :items="Object.entries(ROLE_NAMES).map(([value, label]) => ({ value, label }))"
                placeholder="Select roles"
                class="w-full"
                :color="formErrors.roles ? 'error' : 'primary'"
              />
            </UFormField>
          </UForm>
          
          <template #footer>
            <div class="w-full flex justify-between gap-2">
              <UButton color="error" @click="handleModalClose" :disabled="isCreatingUser">
                Cancel
              </UButton>

              <UButton 
                color="primary" 
                icon="i-lucide-user-plus"
                @click="handleCreateUser"
                :loading="isCreatingUser"
                :disabled="isCreatingUser"
              >
                {{ isCreatingUser ? 'Creating...' : 'Add User' }}
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>
    
    <!-- Modal for importing users -->
    <UModal v-model="isImportModalOpen" title="Import Users" description="Import users from a CSV or Excel file. Make sure the data is in the correct format.">

      <template #body>
        <UCard :ui="{ body: 'p-6' }" class="">
          
          <div class="py-4">
            <p class="text-gray-600 dark:text-gray-400 mb-6">
              Import users from a CSV or Excel file. Make sure the data is in the correct format.
            </p>
            
            <div class="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
              <UIcon name="i-lucide-upload" class="mx-auto h-12 w-12 text-gray-400" />
              <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Drag and drop file or
              </p>
              <UButton color="primary" variant="soft" size="sm" class="mt-2">
                Choose file
              </UButton>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-500">
                Supported formats: CSV, XLS, XLSX
              </p>
            </div>
            
            <div class="mt-6">
              <UButton color="primary" variant="ghost" size="sm" icon="i-lucide-download">
                Download template
              </UButton>
            </div>
          </div>
          
          <template #footer>
            <div class="w-full flex justify-end gap-2">
              <UButton color="primary" @click="isImportModalOpen = false">
                Cancel
              </UButton>
              <UButton color="primary" icon="i-lucide-upload">
                Import
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>

    <!-- Delete User Confirmation Modal -->
    <UModal v-model:open="isDeleteModalOpen">
      <template #content>
        <UCard>
          <template #header>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <UIcon name="i-lucide-alert-triangle" class="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  Delete User
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  This action cannot be undone
                </p>
              </div>
            </div>
          </template>
  
          <div v-if="userToDelete" class="space-y-4">
            <div v-if="userToDelete?.id !== user.id" class="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div class="flex items-center gap-3 mb-3">
                <XAvatar
                  v-if="userToDelete.avatarUrl"
                  :src="`${userToDelete.avatarUrl}`"
                  :firstName="userToDelete.firstName"
                  :lastName="userToDelete.lastName"
                  :size="48"
                  class="ring-2 ring-red-200 dark:ring-red-800"
                />
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">
                    {{ userToDelete.firstName }} {{ userToDelete.lastName }}
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    @{{ userToDelete.username }} • {{ userToDelete.email }}
                  </p>
                </div>
              </div>
              
              <div class="space-y-2 text-sm">
                <p class="text-red-800 dark:text-red-200 font-medium">
                  ⚠️ This will permanently delete:
                </p>
                <ul class="list-disc list-inside text-red-700 dark:text-red-300 space-y-1 ml-4">
                  <li>User profile and account data</li>
                  <li>All associated permissions and roles</li>
                  <li>User activity history and logs</li>
                  <li>Any content created by this user</li>
                </ul>
              </div>
            </div>
            
            <div v-else>
              <p class="text-red-800 dark:text-red-200 font-medium">
                ⚠️ You cannot delete your own account. Please contact an administrator for assistance.
              </p>
            </div>
            <div v-if="userToDelete?.id !== user.id" class="space-y-3">
              <UFormField 
                :label="`Type '${userToDelete.firstName} ${userToDelete.lastName}' to confirm`" 
                required
              >
                <UInput 
                  v-model="deleteConfirmationText"
                  :placeholder="`${userToDelete.firstName} ${userToDelete.lastName}`"
                  :color="deleteConfirmationText && !isDeleteConfirmationValid ? 'error' : 'primary'"
                  size="lg"
                  :disabled="isDeletingUser"
                />
              </UFormField>
              
              <p class="text-xs text-gray-500 dark:text-gray-400">
                This confirmation helps prevent accidental deletions.
              </p>
            </div>
          </div>
  
          <template #footer>
            <div class="flex justify-between gap-3">
              <UButton 
                color="neutral" 
                variant="ghost"
                @click="closeDeleteModal"
                :disabled="isDeletingUser"
              >
                Cancel
              </UButton>
              
              <UButton 
                v-if="userToDelete?.id !== user.id"
                color="error"
                icon="i-lucide-trash"
                :loading="isDeletingUser"
                :disabled="!isDeleteConfirmationValid || isDeletingUser"
                @click="handleDeleteUser"
              >
                {{ isDeletingUser ? 'Deleting...' : 'Delete User' }}
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>

    <!-- Switch User Active Status Confirmation Modal -->
    <UModal v-model:open="isSwitchActiveModalOpen">
      <template #content>
        <UCard >
          <template #header>
            <div class="flex items-center gap-3">
              <div 
                class="w-10 h-10 rounded-full flex items-center justify-center"
                :class="userToSwitch?.status === 'active' 
                  ? 'bg-orange-100 dark:bg-orange-900/20' 
                  : 'bg-green-100 dark:bg-green-900/20'"
              >
                <UIcon 
                  :name="userToSwitch?.status === 'active' ? 'i-lucide-user-x' : 'i-lucide-user-check'" 
                  class="w-5 h-5"
                  :class="userToSwitch?.status === 'active' 
                    ? 'text-orange-600 dark:text-orange-400' 
                    : 'text-green-600 dark:text-green-400'"
                />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ userToSwitch?.status === 'active' ? 'Deactivate' : 'Activate' }} User
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Change user account status
                </p>
              </div>
            </div>
          </template>

          <div v-if="userToSwitch" class="space-y-4">
            <div v-if="userToSwitch.id !== user.id"
              class="border rounded-lg p-4"
              :class="userToSwitch.status === 'active' 
                ? 'bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800' 
                : 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800'"
            >
              <div class="flex items-center gap-3 mb-3">
                <XAvatar
                  v-if="userToSwitch.avatarUrl"
                  :src="`${userToSwitch.avatarUrl}`"
                  :firstName="userToSwitch.firstName"
                  :lastName="userToSwitch.lastName"
                  :size="48"
                  class="ring-2"
                  :class="userToSwitch.status === 'active' 
                    ? 'ring-orange-200 dark:ring-orange-800' 
                    : 'ring-green-200 dark:ring-green-800'"
                />
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">
                    {{ userToSwitch.firstName }} {{ userToSwitch.lastName }}
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    @{{ userToSwitch.username }} • {{ userToSwitch.email }}
                  </p>
                  <div class="flex items-center gap-2 mt-1">
                    <UBadge 
                      :color="USER_STATUS_COLORS[userToSwitch.status as UserStatus]" 
                      variant="soft"
                      size="sm"
                    >
                      Current: {{ USER_STATUS_NAMES[userToSwitch.status as UserStatus] }}
                    </UBadge>
                    <UIcon name="i-lucide-arrow-right" class="w-3 h-3 text-gray-400" />
                    <UBadge 
                      :color="userToSwitch.status === 'active' ? 'warning' : 'success'" 
                      variant="soft"
                      size="sm"
                    >
                      New: {{ userToSwitch.status === 'active' ? 'Inactive' : 'Active' }}
                    </UBadge>
                  </div>
                </div>
              </div>
              
              <div class="space-y-2 text-sm">
                <p 
                  class="font-medium"
                  :class="userToSwitch.status === 'active' 
                    ? 'text-orange-800 dark:text-orange-200' 
                    : 'text-green-800 dark:text-green-200'"
                >
                  {{ userToSwitch.status === 'active' ? '⚠️ Deactivating this user will:' : '✅ Activating this user will:' }}
                </p>
                <ul 
                  class="list-disc list-inside space-y-1 ml-4"
                  :class="userToSwitch.status === 'active' 
                    ? 'text-orange-700 dark:text-orange-300' 
                    : 'text-green-700 dark:text-green-300'"
                >
                  <template v-if="userToSwitch.status === 'active'">
                    <li>Prevent user from logging in</li>
                    <li>Revoke current active sessions</li>
                    <li>Hide user from public listings</li>
                    <li>Preserve user data for future reactivation</li>
                  </template>
                  <template v-else>
                    <li>Allow user to log in again</li>
                    <li>Restore access to all assigned roles</li>
                    <li>Show user in public listings</li>
                    <li>Resume all user functionality</li>
                  </template>
                </ul>
              </div>
            </div>

            <div v-else>
              <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  You cannot change your own account status. Please contact an administrator for assistance.
                </p>
              </div>
            </div>
            <div v-if="userToSwitch.id !== user.id" class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <p class="text-xs text-gray-600 dark:text-gray-400">
                <UIcon name="i-lucide-info" class="w-3 h-3 inline mr-1" />
                This action can be reversed at any time. User data will not be deleted.
              </p>
            </div>
          </div>

          <template #footer>
            <div class="flex justify-between gap-3">
              <UButton 
                color="neutral" 
                variant="ghost"
                @click="closeSwitchActiveModal"
                :disabled="isSwitchingUser"
              >
                Cancel
              </UButton>
              
              <UButton 
                v-if="userToSwitch?.id !== user.id"
                :color="userToSwitch?.status === 'active' ? 'warning' : 'success'"
                :icon="userToSwitch?.status === 'active' ? 'i-lucide-user-x' : 'i-lucide-user-check'"
                :loading="isSwitchingUser"
                :disabled="isSwitchingUser"
                @click="handleSwitchUserActive"
              >
                {{ isSwitchingUser 
                  ? 'Processing...' 
                  : (userToSwitch?.status === 'active' ? 'Deactivate User' : 'Activate User') 
                }}
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>
  </NuxtLayout>
</template>

<style scoped>
/* Animation for highlighting selected rows */
.selected-row-highlight {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    background-color: rgba(var(--color-primary-500), 0.05);
  }
  50% {
    background-color: rgba(var(--color-primary-500), 0.1);
  }
  100% {
    background-color: rgba(var(--color-primary-500), 0.05);
  }
}

/* Transitions between view modes */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>