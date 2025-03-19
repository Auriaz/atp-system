<script setup lang="ts">
import type { button } from '#build/ui'

 const oauthEndpoints = {
  connect: (provider: string) => `/api/auth/oauth/connect/${provider}`,
  disconnect: (provider: string) => `/api/auth/oauth/disconnect/${provider}`,
  accounts: '/api/auth/oauth/accounts'
} as const

const oauthProviders = {
  github: {
    name: 'github',
    label: 'GitHub',
    icon: 'mdi:github',
    color: 'secondary' as const
  },
  // google: {
  //   name: 'google',
  //   label: 'Google',
  //   icon: 'mdi:google',
  //   color: 'danger' as const
  // },
  // facebook: {
  //   name: 'facebook',
  //   label: 'Facebook',
  //   icon: 'mdi:facebook',
  //   color: 'bg-blue-600' as const
  // }
} as const


const providers = Object.values(oauthProviders)

const loginWithProvider = (provider: string) => {
  navigateTo(`/api/auth/${provider}`, {
    external: true
  })
}
</script>

<template>
  <div class="flex flex-col space-y-3">
    <UButton
      v-for="provider in providers"
      :key="provider.name"
      :icon="provider.icon"
      :color="provider.color"
      :label="`Continue with ${provider.label}`"
      variant="solid"
      block class="text-bold"
      @click="loginWithProvider(provider.name)"
    />
  </div>
</template> 