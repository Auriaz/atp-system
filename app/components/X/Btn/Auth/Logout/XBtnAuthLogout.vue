<script lang="ts" setup>
const { loggedIn, clear } = useUserSession()

const toast = useToast()

function logout() {
  clear()

  toast.add({
    title: 'Success',
    description: 'You have been logged out',
    color: 'success'
  })

  navigateTo('/')
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