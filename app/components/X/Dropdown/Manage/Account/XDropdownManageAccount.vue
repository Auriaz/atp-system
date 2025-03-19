<script setup>
defineProps({
  user: {
    type: Object,
    required: true,
  },
})

const items = [
    [{
      label: 'ben@example.com',
      slot: 'account',
      disabled: true
    }], [{
      label: 'Settings',
      icon: 'i-heroicons-cog-8-tooth'
    }], [{
      label: 'Dashboard',
      icon: 'i-heroicons-presentation-chart-line-20-solid',
      to: '/dashboard'
    }, 
    {
      label: 'Profile',
      icon: 'i-heroicons-user-plus-solid',
      to: '/dashboard/profile'
    }, {
      label: 'Notifications',
      icon: 'i-heroicons-bell'
    },
    {
      label: 'Changelog',
      icon: 'i-heroicons-megaphone'
    }, {
      label: 'Status',
      icon: 'i-heroicons-signal'
    }], [{
      label: 'Sign out',
      icon: 'i-heroicons-arrow-left-on-rectangle',
      slot: 'signout'
    }]
  ]
</script>

<template>
  <UDropdownMenu
    :items="items"
    :content="{
      align: 'start',
      side: 'bottom',
      sideOffset: 8
    }"
    class=""
  >
  <UButton   color="neutral" variant="link" >
    <UAvatar :src="user.avatarUrl" />
  </UButton>
  
  <template #account="{ item }">
    <div class="flex items-center space-x-4">
      <UAvatar :src="user.avatarUrl" />
      <div class="text-left">
            <p>
            Signed in as
            </p>
            <p class="truncate font-medium text-gray-900 dark:text-white">
            {{ user.email }}
            </p>
        </div>
    </div>
    </template>

    <template #item="{ item }">
      <span class="truncate">{{ item.label }}</span>

      <UIcon :name="item.icon" class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto" />
    </template>

    <template #signout>
      <XBtnAuthLogout class="w-full flex justify-center" />
    </template>
  </UDropdownMenu>
</template>