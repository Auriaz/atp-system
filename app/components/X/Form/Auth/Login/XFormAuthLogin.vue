<script setup lang="ts">
  import type { FormSubmitEvent } from '@nuxt/ui'
  import type { Toast } from '@nuxt/ui/runtime/composables/useToast.js'
  
  const { fetch } = useUserSession()
  const toast = useToast()

  const loginForm = reactive({
    data: {
      email: '',
      password: '',
      rememberMe: false
    },

    loading: false,
  })

  async function onSubmitLogin(event: FormSubmitEvent<LoginForm>) {
    loginForm.loading = true
    await useAsyncData('login', async () => $fetch('/api/auth/login', {
      method: 'POST',
      body: event.data
    })
      .then(res => {
        fetch()
        toast.add(res.message as Toast)
        navigateTo('/dashboard', { replace: true })
      })
      .catch(error => {
        toast.add({
          title: 'Error',
          description: error.data?.message || 'Login failed',
          color: 'error'
        })
      })
      .finally(() => {
        loginForm.loading = false
        resetFormLogin()
      })
    )
  }

  const resetFormLogin = () => {
    loginForm.data.email = ''
    loginForm.data.password = ''
    loginForm.data.rememberMe = false
  }

  const previewPassword = ref(false)
</script>

<template>
  <UForm :schema="LoginFormSchema" :state="loginForm.data" class="w-full space-y-6 px-6" @submit.prevent="onSubmitLogin">
    <UFormField required label="Email" name="email" class="w-full">
      <UInput v-model="loginForm.data.email" class="w-full"/>
    </UFormField>

    <UFormField required class="w-full relative" label="Password" name="password">
      <UInput v-model="loginForm.data.password" :type="previewPassword ? 'text' : 'password'" class="w-full" >
        <template #trailing>
          <UButton
            @click="previewPassword = !previewPassword"
            color="secondary"
            size="sm"
            variant="link"
            :icon="previewPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
            :aria-label="previewPassword ? 'Hide password' : 'Show password'"
            :aria-pressed="previewPassword"
            aria-controls="password"
          />
        </template>
      </UInput>
    </UFormField>

    <div class="flex items-center space-x-2">
      <UCheckbox v-model="loginForm.data.rememberMe"  color="primary" />
      <span class="text-sm">Zapamiętaj mnie</span>
    </div>

    <UButton :loading="loginForm.loading" type="submit" color="primary" variant="solid" block class="text-bold">
      Submit
    </UButton>
<!---  
  <USeparator />

  <XBtnOAuthLogin />
  --->
  </UForm>
</template>
