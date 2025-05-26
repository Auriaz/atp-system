<script lang="ts" setup>
const { isAuthenticated, logout } = useAuth()

async function handleLogout() {
  await logout()
  // Navigate to home page after successful logout
  navigateTo('/')
}
</script>

<template>
  <UTooltip text="Logout">    <UButton
      v-if="isAuthenticated"
      @click="handleLogout"
      color="error"
      size="sm"
      variant="solid"
      label="Logout"
      icon="i-line-md-log-out"
      block
      aria-label="Logout"
    />
  </UTooltip>

</template>