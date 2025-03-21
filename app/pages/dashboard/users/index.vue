<script lang="ts" setup>
import { h, resolveComponent } from 'vue'
import type { TableColumn, DropdownMenuItem  } from '@nuxt/ui'
import {USER_STATUS_COLORS} from '@@/shared/utils/constants/user.constants'

definePageMeta({
  layout: 'authorization',
  middleware: 'auth',
})

  const UBadge = resolveComponent('UBadge')
  const UAvatar = resolveComponent('UAvatar')
  const { fetchUsers } = useUsersStore()
  const { state } = storeToRefs(useUsersStore())
  const toast = useToast()
  // const { createColumns } = useTableTools()
  // const selectedColumns = ref([...columns.value])
  // const selected = ref([])
  const query = ref('')

  
    await fetchUsers()
  

  // const items = (row: {id: number}) => [
  //   [{
  //     label: 'Edit',
  //     icon: 'i-heroicons-pencil-square-20-solid',
  //     // click: () => useUsers().toggleModalUserEdit(row.id)
  //   }, {
  //     label: 'Show',
  //     icon: 'i-heroicons-user-circle-16-solid',
  //     // click: () => navigateTo(`/dashboard/users/${row.id}/show`)
  //   }], [{
  //     label: 'Delete',
  //     icon: 'i-heroicons-trash-20-solid',
  //     // click: () => useRemoveModal().toggleModalRemove({
  //     //   id: row.id,
  //     //   title: 'Delete user',
  //     //   description: 'Are you sure you want to delete this user?',
  //     //   actionText: 'Delete',
  //     //   action: () => useUsersStore().deleteUserById(row.id)
  //     // })
  //   }]
  // ]

  const columns: TableColumn<IUserResource>[] = [
    {
      accessorKey: 'id',
      header: '#',
      cell: ({ row }) => `#${row.getValue('id')}`
    },
    {
      accessorKey: 'username',
      header: 'Name',
      cell: ({ row }) => {
        return h('div', { class: 'flex items-center gap-3' }, [
          h(UAvatar, {
            src: row.original.avatarUrl,
            size: 'lg'
          }),
          h('div', undefined, [
            h('p', { class: 'font-medium text-(--ui-text-highlighted)' }, row.original.username),
            h('p', { class: '' }, `@${row.original.username}`)
          ])
        ])
      }
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const color = USER_STATUS_COLORS[row.getValue('status') as UserStatus] || 'natural'

        return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () =>
          row.getValue('status')
        )
      }
    },
    {
      accessorKey: 'email',
      header: 'Email'
    },
    {
      accessorKey: 'createdAtAgo',
      header: 'Created'
    },
    {
      id: 'action'
    }
  ]

  function getDropdownActions(user: IUserResource): DropdownMenuItem[][] {
    return [
      [
        {
          label: 'Copy user Id',
          icon: 'i-lucide-copy',
          onSelect: () => {
            navigator.clipboard.writeText(user.id.toString())
            toast.add({
              title: 'User ID copied to clipboard!',
              color: 'success',
              icon: 'i-lucide-circle-check'
            })
          }
        }
      ],
      [
        {
          label: 'Edit',
          icon: 'i-lucide-edit'
        },
        {
          label: 'Delete',
          icon: 'i-lucide-trash',
          color: 'error'
        }
      ]
    ]
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

          <UTable :loading="state.loading" loading-color="primary" loading-animation="carousel"  :data="state.data" :columns="columns" class=" flex-1" >
            <template #action-cell="{ row }">
              <UDropdownMenu :items="getDropdownActions(row.original)">
                <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" />
              </UDropdownMenu>
            </template>
          </UTable>
        </div>
      </template>
    </XDashboardPage>
  </NuxtLayout>
</template>