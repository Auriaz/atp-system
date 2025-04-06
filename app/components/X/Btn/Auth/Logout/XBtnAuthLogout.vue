<script lang="ts" setup>
const { loggedIn, clear, session } = useUserSession()

const toast = useToast()

async function logout() { 
  await $fetch('/api/auth/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(() => {
    // Handle successful logout
    loggedIn.value = false
    clear()
    toast.add({
      title: 'Success',
      description: 'You have been logged out',
      color: 'success'
    })
  })
  .catch((error) => {
    // Handle error
    console.error('Logout failed:', error)
    toast.add({
      title: 'Error',
      description: 'Logout failed. Please try again.',
      color: 'error'
    })
  })
  .finally(() => {
    // Optionally, you can redirect the user or perform any other actions after logout
    navigateTo('/')
  })
}
</script>

<template>
  <UTooltip text="Logout">
    <UButton
      v-if="loggedIn"
      @click="logout"
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