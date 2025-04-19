<script lang="ts" setup>
const { loggedIn, user } = useUserSession()
const {navbarItems} = useNavbar()
</script>

<template>
  <XLayout>
    <template #header>
      <UAlert
        title="Alpha version"
        description="The site is currently in alpha (early development) phase. Functionality may be limited and errors are possible. All data on the home page is false."
        color="warning"
        variant="subtle"
        :ui="{
          wrapper: 'mb-4 mx-auto container max-w-7xl'
        }"
        class="w-full"
      />

      <div class="w-full flex flex-col lg:flex-row gap-8">
        <x-navbar container :links="navbarItems">
          <template #logo>
            <XLogo />
          </template>

          <template #action>
            <AuthState>
              <div v-if="!loggedIn" class="flex items-center space-x-4">
                <UTooltip text="Login">
                  <UButton
                    to="/auth/login"
                    icon="i-line-md-person-filled"
                    color="primary"
                    variant="ghost"
                    square
                  />
                </UTooltip>

                <UTooltip text="Register">
                  <UButton
                    to="/auth/register"
                    variant="ghost"
                    color="primary"
                    icon="i-line-md-person-add-filled"
                    square
                  />
                </UTooltip>
              </div>

              <XDropdownManageAccount v-if="loggedIn && user" :user="user" />
            </AuthState>
          </template>

        </x-navbar>
      </div>
    </template>

    <template #main>
      <slot />
    </template>

    <template #footer>
      <x-footer/>
    </template>
  </XLayout>
</template>

<style scoped>
/* Dodatkowe style dla stopki */
.footer-icon-link:hover {
  transform: translateY(-2px);
}
</style>