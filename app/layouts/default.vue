<script lang="ts" setup>
  const { loggedIn, user } = useUserSession()
</script>

<template>
  <XLayout>
    <template #header>
      <div class="w-full flex flex-col lg:flex-row gap-8">
        <x-navbar :container="true" :links="[
          { name: 'Home', to: '/' },
          { name: 'About', to: '/about' },
          { name: 'Contact', to: '/contact' },
        ]">
          <template #logo>
            <XLogo />
          </template>

          <template #action>
            <AuthState>
              <XModalAuth v-if="!loggedIn" />

              <XDropdownManageAccount v-else :user="user" />
            </AuthState>
          </template>

        </x-navbar>
      </div>
    </template>

    <template #main>
      <slot />
    </template>

    <template #footer></template>
  </XLayout>
</template>