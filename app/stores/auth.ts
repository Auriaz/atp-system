import { defineStore } from 'pinia'

import type { FormSubmitEvent } from '@nuxt/ui'
import type { Toast } from '@nuxt/ui/runtime/composables/useToast.js'

export const useAuthStore = defineStore('Auth', () => {
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

  const registerForm = reactive({
    data: {
      username: '',
      email: '',
      password: '',
      password_confirmation: '',
      firstName: '',
      lastName: '',
      isAgreedToTerms: false
    },

    loading: false,
  })

  async function onSubmitLogin(event: FormSubmitEvent<LoginFormData>) {
    await useAsyncData('login', async () => $fetch('/api/auth/login', {
      method: 'POST',
      body: event.data
    })
      .then(res => {
        fetch()
        toast.add(res.message as Toast)
      })
      .catch(error => {
        toast.add({
          title: 'Error',
          description: error.data?.message || 'Login failed',
          color: 'error'
        })
      })
      .finally(() => {
        navigateTo('/dashboard', { replace: true })
      })
    )
  }

  async function onSubmitRegister(event: FormSubmitEvent<RegisterFormData>) {
    await useAsyncData('login', async () => await $fetch('/api/auth/register', {
      method: 'POST',
      body: event.data,
    })
      .then(res => {
        fetch()
        toast.add(res.message as Toast)
      })
      .catch(error => {
        toast.add({
          title: 'Error',
          description: error.data?.message || 'Registration failed',
          color: 'error'
        })
      })
      .finally(() => {
        navigateTo('/dashboard', { replace: true })
      })
    )
  }

  return {
    loginForm,
    registerForm,
    onSubmitLogin,
    onSubmitRegister,
  }
})
