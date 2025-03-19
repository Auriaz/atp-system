<script lang="ts" setup>
  const isShowLoginModal = ref(false)
  const isShowRegisterModal = ref(false)

  const toggleLoginModal = () => {
    isShowLoginModal.value = !isShowLoginModal.value
    isShowRegisterModal.value = false
  }

  const toggleRegisterModal = () => {
    isShowRegisterModal.value = !isShowRegisterModal.value
    isShowLoginModal.value = false
  }
</script>

<template>
  <div class="flex space-x-4">
    <UModal
      v-model:open="isShowLoginModal"
      title="Log in"
      :close="{
        color: 'primary',
        variant: 'outline',
        class: 'rounded-full'
      }"
    >
      <UTooltip text="Login">
        <UButton
          icon="i-line-md-person-filled"
          color="primary"
          variant="ghost"
          square

        />
      </UTooltip>

      <template #body>
        <div class="flex flex-col justify-center items-center space-y-4">
          <div class="text-center pb-8">
            <Icon
              name="i-line-md-person-filled"
              class="text-7xl text-center text-primary"
            />

            <h2 class="text-primary-900 dark:text-primary-100 text-center text-3xl font-semibold">
              Welcome back!
            </h2>

            <div class="text-basic-900 dark:text-basic-400 flex justify-center items-center">
              <p>Don't have an account?</p>
              <UButton
                variant="link"
                label="Sign Up"
                @click="toggleRegisterModal"
              />
            </div>
          </div>

          <XFormAuthLogin />
        </div>
      </template>
    </UModal>

    <UModal
      v-model:open="isShowRegisterModal"
      title="Register"
      :close="{
        color: 'primary',
        variant: 'outline',
        class: 'rounded-full'
      }"
    >
      <UTooltip text="Register">
        <UButton
          variant="ghost"
          color="primary"
          icon="i-line-md-person-add-filled"
          square
        />
      </UTooltip>

      <template #body>
        <div class="flex flex-col justify-center items-center space-y-4">
          <div class="text-center pb-8">
            <Icon
              name="i-line-md-person-add-filled"
              class="text-7xl text-center text-primary"
            />

            <h2 class="text-basic-700 dark:text-basic-300 flex justify-center items-center">
              <p>You already have an account?</p>

              <UButton
                variant="link"
                label="Log in"
                @click="toggleLoginModal"
              />
            </h2>
          </div>
  <!-- 
    <XFormAuthRegister />
  -->
        </div>
      </template>
    </UModal>
  </div>
</template>