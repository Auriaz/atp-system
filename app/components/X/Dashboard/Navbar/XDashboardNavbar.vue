<script lang="ts" setup>
const { navbar, handleScroll } = useNavbar()
const { sidebar, toggleShowMenuBar } = useSidebar()
const { user, isAuthenticated } = useAuth()

onMounted(() => {
  handleScroll('main-nav-dashboard')
});
</script>

<template>
  <div
    id="main-nav-dashboard"
    :class="[
      navbar.isScroll ? 'fixed top-0 left-0 backdrop-blur-lg bg-secondary-50/50 dark:bg-secondary-950/50' : 'fixed top-0 left-0 bg-secondary-50 dark:bg-secondary-950',
    ]"
    class="w-screen z-40 box-border h-20 transition-all duration-500  hover:shadow-black shadow-lg"
  >
    <div class="h-full flex items-center justify-center lg:justify-between">
      <div class="relative  hidden lg:flex">
        <slot name="bar" />
      </div>

      <div  class="lg:hidden absolute top-6 left-0">
        <slot name="bar" />
      </div>

      <div class="w-full hidden lg:block">
        <div class="relative w-full flex justify-around items-center ">
          <div class="flex w-full justify-center items-center space-x-10 ">
            <slot name="content" />
          </div>

          <div class="w-70 flex justify-end items-center pr-6 space-x-3 box-border bg-white dark:bg-black h-full rounded-lg shadow-xl hover:shadow-black transition-all duration-500">
            <div class="flex justify-center items-center space-x-3">
              <UTooltip :text="sidebar.isShowMenuBar ? 'Close side bar helper' : 'Open side bar helper'">
                <UButton  @click="toggleShowMenuBar()" color="primary" variant="ghost" square :icon="sidebar.isShowMenuBar ? 'i-material-symbols-right-panel-close-sharp' : 'i-material-symbols-light-left-panel-open-rounded' "/>
              </UTooltip>
              
              <XBtnColorMode />

              <slot name="action" />
              <div v-if="isAuthenticated" class="user-navigation hidden sm:block">
                <AuthState>
                  <XDropdownManageAccount :user="user" :items="userDropdownItems" />
                </AuthState>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="absolute top-5 right-5 lg:hidden flex justify-center items-center mr-4">
        <div class="flex justify-center items-center space-x-3">
          <UTooltip :text="sidebar.isShowMenuBar ? 'Close side bar' : 'Open side bar'">
            <UButton  @click="toggleShowMenuBar()" color="primary" variant="ghost" square :icon="sidebar.isShowMenuBar ? 'i-material-symbols-right-panel-close-sharp' : 'i-material-symbols-light-left-panel-open-rounded' "/>
          </UTooltip>

          <XBtnColorMode />
      

          <slot name="action" />

          <div v-if="isAuthenticated" class="user-navigation hidden sm:block">
            <AuthState>
              <XDropdownManageAccount :user="user" :items="userDropdownItems" />
            </AuthState>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
