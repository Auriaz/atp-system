<script lang="ts" setup>
const { isAuthenticated, user } = useAuth()
const {navbarItems} = useNavbar()
</script>

<template>
  <XLayout>
    <template #header>


      <div class="w-full flex flex-col lg:flex-row gap-8">
        <x-navbar container :links="navbarItems">
          <template #logo>
            <XLogo size="24"/>
          </template>          
          
          <template #action>
            <AuthState>
              <div v-if="!isAuthenticated" class="flex items-center space-x-4">
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

              <XDropdownManageAccount v-if="isAuthenticated && user" :user="user" />
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