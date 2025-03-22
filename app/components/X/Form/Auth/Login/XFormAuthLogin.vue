<script setup lang="ts">
  import * as v from 'valibot'
  const authStore = useAuthStore()
  const { loginForm } = storeToRefs(authStore)
  const { onSubmitLogin } = authStore
  const previewPassword = ref(false)
</script>

<template>
  <UForm :schema="v.safeParser(loginSchema)" :state="loginForm.data" class="w-full space-y-6 px-6" @submit="onSubmitLogin">
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
