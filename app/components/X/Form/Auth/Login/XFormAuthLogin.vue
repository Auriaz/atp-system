<script setup lang="ts">
import * as v from 'valibot'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { Toast } from '@nuxt/ui/runtime/composables/useToast.js' 
const {fetch} = useUserSession() 

type loginSchema = v.InferOutput<typeof loginSchema>

const state = reactive({
  email: '',
  password: '',
  rememberMe: false
})

const previewPassword = ref(false)

const toast = useToast()
async function onSubmit(event: FormSubmitEvent<loginSchema>) {
  const {data, error} = await useFetch('/api/auth/login', {
    method: 'POST',
    body: event.data
  })

  if(error.value) {
    toast.add({
      title: 'Error',
      description: error.value.data.message,
      color: 'error'
    })
    return
  }

  fetch()

  toast.add(data.value?.message as Toast)
  navigateTo('/dashboard')
}
</script>

<template>
  <UForm :schema="v.safeParser(loginSchema)" :state="state" class="w-full space-y-6 px-6" @submit="onSubmit">
    <UFormField required label="Email" name="email" class="w-full">
      <UInput v-model="state.email" class="w-full"/>
    </UFormField>

    <UFormField required class="w-full relative" label="Password" name="password">
      <UInput v-model="state.password" :type="previewPassword ? 'text' : 'password'" class="w-full" >
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
      <UCheckbox v-model="state.rememberMe"  color="primary" />
      <span class="text-sm">Remember me</span>
    </div>

    <UButton type="submit" color="primary" variant="solid" block class="text-bold">
      Submit
    </UButton>

    <USeparator />

    <XBtnOAuthLogin />
  </UForm>
</template>
