<script lang="ts" setup>
import { h, resolveComponent, ref } from 'vue'
import type { TableColumn, DropdownMenuItem } from '@nuxt/ui'

definePageMeta({
  layout: 'authorization',
  middleware: 'auth',
})

// Użycie composable
const { 
  users, 
  isLoading, 
  error, 
  fetchUsers, 
  // deleteUser 
} = useUsersApi()


const UBadge = resolveComponent('UBadge')
const UAvatar = resolveComponent('UAvatar')
const toast = useToast()
const query = ref('')

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

// Filtry
const selectedStatus = ref('all')
const selectedRole = ref('all')
const sortBy = ref('createdAt')
const sortDesc = ref(true)

// Stan UI
const isCreateModalOpen = ref(false)
const isImportModalOpen = ref(false)
const selectedBulkAction = ref(null)
const selectedUsers = ref([])

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
onMounted(async () => await fetchUsers())

function refreshData() {
  toast.add({
    title: 'Refreshing data',
    description: 'User data is being refreshed',
    icon: 'i-lucide-refresh-cw',
    color: 'info',
  })
  fetchUsers()
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
        h(UAvatar, {
          src: row.original.avatarUrl,
          size: settings.view === 'compact' ? 'sm' : 'lg',
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
      // Pobierz tablicę ról użytkownika zamiast pojedynczej roli
      const roles = row.getValue('roles') as RoleSlug[] || [row.getValue('role') as RoleSlug] || [];
      
      // Jeśli brak ról, pokaż domyślną wartość
      if (!roles.length) {
        return h(UBadge, { 
          class: 'capitalize', 
          variant: 'subtle', 
          color: 'gray', 
          icon: 'i-lucide-user' 
        }, () => 'No roles');
      }
      
      // Utwórz elementy dla każdej roli
      return h('div', { class: 'flex flex-wrap gap-1' }, 
        roles.map(role => {
          const color = USER_ROLE_COLORS[role] || 'gray';
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
      const color = USER_STATUS_COLORS[status] || 'gray'
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
        to: `/dashboard/users/${user.id}`
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
        color: user.status === 'active' ? 'warning' : 'success'
      }
    ],
    [
      {
        label: 'Delete',
        icon: 'i-lucide-trash',
        color: 'error',
        onSelect: () => {
          // Implementation for delete or confirmation modal
        }
      }
    ]
  ]
}

// Filtrowanie wyników
const filteredRows = computed(() => {
  if (!users.value) return []
  
  let filtered = [...users.value]
  
  // Filtrowanie według wyszukiwania
  if (query.value) {
    filtered = filtered.filter((user) => {
      return Object.values(user).some((value) => {
        return String(value).toLowerCase().includes(query.value.toLowerCase())
      })
    })
  }
  
  // Filtrowanie według statusu
  if (selectedStatus.value !== 'all') {
    filtered = filtered.filter(user => user.status === selectedStatus.value)
  }
  
// Filtrowanie według roli
if (selectedRole.value !== 'all') {
  filtered = filtered.filter(user => {
    // Obsługa zarówno tablicy ról jak i pojedynczej roli dla wstecznej kompatybilności
    const userRoles = user.roles || [user.roles];
    return userRoles.includes(selectedRole.value as RoleSlug);
  });
}
  
  // Sortowanie
  filtered.sort((a, b) => {
    let valueA = a[sortBy.value as keyof UserResource]
    let valueB = b[sortBy.value as keyof UserResource]
    
    // Obsługa sortowania dat
    if (sortBy.value.includes('At')) {
      valueA = valueA ? new Date(valueA as string).getTime() : 0
      valueB = valueB ? new Date(valueB as string).getTime() : 0
    }
    
    // Handle null or undefined values
    if (valueA === null || valueA === undefined) return sortDesc.value ? 1 : -1
    if (valueB === null || valueB === undefined) return sortDesc.value ? -1 : 1
    
    if (valueA < valueB) return sortDesc.value ? 1 : -1
    if (valueA > valueB) return sortDesc.value ? -1 : 1
    return 0
  })
  
  return filtered
})

// Akcje grupowe
const bulkActions = [
  { value: 'activate', label: 'Activate selected' },
  { value: 'deactivate', label: 'Deactivate selected' },
  { value: 'delete', label: 'Delete selected', color: 'danger' }
]

// Metody pomocnicze
function clearQuery() {
  query.value = ''
}

function resetFilters() {
  selectedStatus.value = 'all'
  selectedRole.value = 'all'
  query.value = ''
}

function handleBulkAction() {
  if (!selectedBulkAction.value || selectedUsers.value.length === 0) return
  
  // Implementacja akcji masowych
  toast.add({
    title: `Action performed: ${selectedBulkAction.value}`,
    description: `Number of selected users: ${selectedUsers.value.length}`,
    color: 'info'
  })
  
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
                :options="statusOptions"
                placeholder="Status"
                color="primary"
                variant="soft"
                class="w-44"
              />
              
              <USelectMenu
                v-model="selectedRole"
                :options="roleOptions"
                placeholder="Role"
                color="primary"
                variant="soft"
                class="w-44"
              />
              
              <UButton 
                v-if="selectedStatus !== 'all' || selectedRole !== 'all' || query" 
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
              :data="filteredRows" 
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
              Showing {{ filteredRows.length }} of {{ users?.length || 0 }} users
            </div>
            
            <UPagination 
              v-if="filteredRows.length > settings.pageSize"
              :total="filteredRows.length" 
              :default-page="1" 
              :ui="{ root: 'flex gap-1' }"
              :page-count="5" 
              :page-size="settings.pageSize" 
            />
          </div>
        </div>
      </template>
      
      <!-- Settings Sidebar Content -->
      <template #sidebar>
        <div class="space-y-6 p-4">
          <!-- View Settings -->
          <div class="bg-white dark:bg-slate-950 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">View Settings</h3>
            
            <div class="space-y-4">
              <UFormField label="Display Mode">
                <USelectMenu
                  v-model="settings.view"
                  :options="viewOptions"
                  placeholder="Select view mode"
                />
              </UFormField>
              
              <UFormField label="Items Per Page">
                <USelect
                  v-model="settings.pageSize"
                  :options="[5, 10, 20, 50, 100]"
                />
              </UFormField>
              
              <UFormField label="Date Format">
                <URadioGroup
                  v-model="settings.dateFormat" 
                  name="dateFormat"
                  :options="[
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
                :options="[
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
          <!-- User form placeholder -->
          <div class="w-full flex flex-col space-y-4 ">
            <UFormField label="First Name" required>
              <UInput placeholder="User's first name" class="w-full" />
            </UFormField>
            
            <UFormField label="Last Name" required>
              <UInput placeholder="User's last name" class="w-full"/>
            </UFormField>
            
            <UFormField label="Email" required>
              <UInput placeholder="User's email" type="email" class="w-full" />
            </UFormField>

            <UFormField label="Roles" required>
              <USelectMenu
                multiple
                :items="Object.entries(ROLE_NAMES).map(([value, label]) => ({ value, label }))"
                placeholder="Select roles"
                class="w-full"
              />
            </UFormField>
          </div>
          
          <template #footer>
            <div class="w-full flex justify-between gap-2">
              <UButton color="error" @click="isCreateModalOpen = false">
                Cancel
              </UButton>

              <UButton color="primary" icon="i-lucide-user-plus">
                Add User
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