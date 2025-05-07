<script lang="ts" setup>
  const { fetchProfile, isLoading, profile } = useProfileApi()


  onBeforeMount(async () => {
    await fetchProfile()
  })

  definePageMeta({
    layout: 'authorization',
    middleware: "auth"
  })
</script>

<template>
  <NuxtLayout>
    <XDashboardPage :loading="isLoading">
      <template #header-left />
  
      <template #main>
        <div v-if="profile" class="w-full p-6 flex flex-col space-y-8 box-border container mx-auto">
          <div class="w-full p-6 bg-secondary-200/20 dark:bg-secondary-950/20 rounded-xl">
            <XDashboardProfileUpdatePicture :profile="profile"/>
          </div>
  
          <div class="w-full px-6 pt-6 bg-secondary-200/20 dark:bg-secondary-900/20 rounded-xl">
              <XDashboardProfileUpdateInformation  :profile="profile" />
          </div>
  
          <div class="w-full bg-secondary/20 dark:bg-secondary-dark/20 rounded-xl">
            <!--
              <XDashboardProfileUpdatePassword />
            -->
          </div>
        </div>
      </template>
  
      <template #sidebar />
    </XDashboardPage>
  </NuxtLayout>
</template>