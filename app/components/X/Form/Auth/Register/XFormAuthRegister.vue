<script setup lang="ts">
import * as v from 'valibot'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { Toast } from '@nuxt/ui/runtime/composables/useToast.js' 

type registerSchema = v.InferOutput<typeof registerSchema>

const state = reactive({
  username: '',
  email: '',
  firstName: '',
  lastName: '',
  password: '',
  password_confirmation: '',
  isAgreedToTerms: false,
})

const canSeeThePassword = ref(false)
const canSeeTheConfirmPassword = ref(false)

const isOpenAgreementModel = ref<boolean>(false)
const lang = ref('en')

const itemsSelected = ref(['en', 'pl'])

function agreement(value: boolean) {
  state.isAgreedToTerms = value
  isOpenAgreementModel.value = false
}

const {data: terms} = await useAsyncData(() => queryCollection('content').path(`/terms/${lang.value}`).first())

watch(() => lang.value, async () => {
  terms.value = await queryCollection('content').path(`/terms/${lang.value}`).first()
})

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<registerSchema>)  {
  const { data, error } = await useFetch('/api/auth/register', {
    method: 'POST',
    body: state,
  })

  if (error.value) {
    toast.add({
      title: 'Error',
      description: error.value.data.message,
      color: 'error',
    })
    return
  }

  toast.add(data.value?.message as Toast)
}

</script>

<template>
  <div class="w-full">
    <UForm :schema="v.safeParser(registerSchema)" :state="state" class="w-full space-y-6 px-6 overflow-y-auto" @submit="onSubmit" >
      <UFormField required label="Username" name="username" class="w-full">
        <UInput v-model="state.username" class="w-full" />
      </UFormField>
      
      <UFormField label="First Name" name="first_name" class="w-full">
        <UInput v-model="state.firstName" class="w-full" />
      </UFormField>

      <UFormField label="Last Name" name="last_name" class="w-full">
        <UInput v-model="state.lastName" class="w-full" />
      </UFormField>

      <UFormField required label="Email" name="email" class="w-full">
        <UInput v-model="state.email" class="w-full" />
      </UFormField>

      <UFormField required class="w-full relative" label="Password" name="password">
        <UInput v-model="state.password" :type="canSeeThePassword ? 'text' : 'password'" class="w-full">
          <template #trailing>
            <UButton
              @click="canSeeThePassword = !canSeeThePassword"
              color="secondary"
              size="sm"
              variant="link"
              :icon="canSeeThePassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              :aria-label="canSeeThePassword ? 'Hide password' : 'Show password'"
              :aria-pressed="canSeeThePassword"
              aria-controls="password"
            />
          </template>
        </UInput>
      </UFormField>

      <UFormField required class="w-full relative" label="Confirm Password" name="password_confirmation">
        <UInput v-model="state.password_confirmation" :type="canSeeTheConfirmPassword ? 'text' : 'password'" class="w-full">
          <template #trailing>
            <UButton
              @click="canSeeTheConfirmPassword = !canSeeTheConfirmPassword"
              color="secondary"
              size="sm"
              variant="link"
              :icon="canSeeTheConfirmPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              :aria-label="canSeeTheConfirmPassword ? 'Hide password' : 'Show password'"
              :aria-pressed="canSeeTheConfirmPassword"
              aria-controls="password"
            />
          </template>
        </UInput>
      </UFormField>

      <UCheckbox v-model="state.isAgreedToTerms" required color="primary">
        <template #label>
          <span class="italic">I accept the 
            <UButton variant="link" label="Terms and Conditions" class="p-0" @click="isOpenAgreementModel = true" />
          </span>
        </template>
      </UCheckbox>

      <UButton type="submit" color="primary" variant="solid" block class="text-bold">
        Submit
      </UButton>
    </UForm>

    <UModal
      v-model:open="isOpenAgreementModel" 
      title="Terms and Conditions"        
      :close="{
        color: 'primary',
        variant: 'outline',
        class: 'rounded-full'
      }"
    >
      <template #body>
        <div class="w-full relative  p-4">
      <div class="absolute top-2 right-4 flex items-center space-x-2">
        <p class="text-sm text-bold">lang:</p>

        <USelect v-model="lang" label="Language" :items="itemsSelected" />
      </div>

      <h2 class="text-xl font-semibold pb-4">Terms and Conditions</h2>

      <div v-if="terms" class="w-full overflow-y-auto h-80  p-4 bg-gray-100 dark:bg-gray-800 text-justify rounded">
        <ContentRenderer :value="terms" />
      </div>

      <div class="w-full mt-4 flex justify-between">
        <UButton variant="solid" color="error" label="Decline" @click="agreement(false)" />

        <UButton variant="solid" color="primary" label="Accept" @click="agreement(true)" />
      </div>
    </div>
      </template>
    </UModal>
  </div>
</template>
