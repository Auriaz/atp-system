<script lang="ts" setup>
  definePageMeta({
    layout: 'authorization',
    middleware: 'auth',
  })

  const { fetchUsers } = useUsersStore()
  const { state } = storeToRefs(useUsersStore())
  const { createColumns } = useTableTools()
  const columns = ref([])
  const selectedColumns = ref([...columns.value])
  const selected = ref([])
  const query = ref('')

  
    await fetchUsers()
  

  const items = (row: {id: number}) => [
    [{
      label: 'Edit',
      icon: 'i-heroicons-pencil-square-20-solid',
      // click: () => useUsers().toggleModalUserEdit(row.id)
    }, {
      label: 'Show',
      icon: 'i-heroicons-user-circle-16-solid',
      // click: () => navigateTo(`/dashboard/users/${row.id}/show`)
    }], [{
      label: 'Delete',
      icon: 'i-heroicons-trash-20-solid',
      // click: () => useRemoveModal().toggleModalRemove({
      //   id: row.id,
      //   title: 'Delete user',
      //   description: 'Are you sure you want to delete this user?',
      //   actionText: 'Delete',
      //   action: () => useUsersStore().deleteUserById(row.id)
      // })
    }]
  ]

  function addColumns() {
    columns.value = createColumns(state.value.data, 
      [
        { key: 'actions', label: 'Actions' }
      ], 
      [
        { key: 'email', sortable: true}, 
        { key: 'createdAt', sortable: true }, 
        { key: 'updatedAt', sortable: true }
      ]
    )
  }

  const filteredRows = computed(() => {
    if (!query.value) {
      return state.value.data
    }

    return state.value.data.filter((person) => {
      return Object.values(person).some((value) => {
        return String(value).toLowerCase().includes(query.value.toLowerCase())
      })
    })
  }) 

  function clearQuery() {
    query.value = ''
  }
</script>

<template>
  <NuxtLayout>
    <XDashboardPage :loading="false">
      <template #header-right>
        <div class="flex items-center justify-between">
          <div  class="w-full relative">
            <UInput
              v-model="query"
              placeholder="Search"
              color="primary"
              icon="i-heroicons-magnifying-glass-16-solid"
              class="w-96"
            />
    
            <div class="absolute top-1 right-1 z-2">
              <UButton v-if="query === '' ? false : true" color="primary" variant="ghost" size="sm"  @click="clearQuery()" >
                <Icon class="text-sm" name="i-line-md-menu-to-close-transition" />
              </UButton>
            </div>
          </div>
        </div>
      </template>
  
      <template #main>
        <div class="p-6 space-y-6">
          <!-- Szybkie akcje -->
          <h1>Users</h1>

          <UTable :loading="state.loading" loading-color="primary" loading-animation="carousel"  :data="state.data"  class=" flex-1" />
        </div>
      </template>
    </XDashboardPage>
  </NuxtLayout>
</template>