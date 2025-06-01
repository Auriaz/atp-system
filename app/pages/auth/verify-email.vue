<script setup lang="ts">
import { z } from 'zod'

definePageMeta({
  layout: 'guest',
  middleware: 'auth',
  auth: false // Allow access without authentication
})

const route = useRoute()
const { verifyEmail, resendVerification } = useAuth()

// State management
const isLoading = ref(false)
const isResending = ref(false)
const verificationStatus = ref('pending') // 'pending', 'success', 'error', 'expired'
const errorMessage = ref('')
const successMessage = ref('')
const userEmail = ref('')

// Get token from URL
const token = computed(() => String(route.query.token || ''))

// Verify email on component mount
onMounted(async () => {
  if (!token.value) {
    verificationStatus.value = 'error'
    errorMessage.value = 'No verification token provided'
    return
  }

  await handleVerifyEmail()
})

// Handle email verification
const handleVerifyEmail = async () => {
  if (!token.value) return

  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const result = await verifyEmail(token.value)
    
    if (result.success) {
      verificationStatus.value = 'success'
      successMessage.value = result.data.description || 'Email verified successfully!'
      userEmail.value = result.data.payload.user.email
      
      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        navigateTo('/dashboard')
      }, 3000)
    } else {
      verificationStatus.value = 'error'
      errorMessage.value = result.message || 'Verification failed'
    }
  } catch (error) {
    verificationStatus.value = 'error'
    errorMessage.value = error instanceof Error ? error.message : 'An error occurred during verification'
  } finally {
    isLoading.value = false
  }
}

// Handle resend verification email
const handleResendVerification = async () => {
  if (!userEmail.value) {
    // Prompt for email if not available
    const email = prompt('Please enter your email address:')
    if (!email) return
    userEmail.value = email
  }

  isResending.value = true
  errorMessage.value = ''

  try {
    const result = await resendVerification(userEmail.value)
    
    if (result.success) {
      successMessage.value = 'Verification email sent successfully!'
    } else {
      errorMessage.value = result.message || 'Failed to resend verification email'
    }
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'An error occurred while resending email'
  } finally {
    isResending.value = false
  }
}

// Page title and meta
useHead({
  title: 'Verify Your Email - ATP System',
  meta: [
    { name: 'description', content: 'Verify your email address to complete your ATP System registration.' }
  ]
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="text-center">
        <Icon name="heroicons:envelope-open" class="mx-auto h-12 w-12 text-primary-600" />
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
          Email Verification
        </h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Please wait while we verify your email address
        </p>
      </div>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
        
        <!-- Loading State -->
        <div v-if="isLoading" class="text-center">
          <Icon name="heroicons:arrow-path" class="animate-spin h-8 w-8 text-primary-600 mx-auto" />
          <p class="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Verifying your email address...
          </p>
        </div>

        <!-- Success State -->
        <div v-else-if="verificationStatus === 'success'" class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20">
            <Icon name="heroicons:check" class="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          
          <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            Email Verified Successfully! 🎉
          </h3>
          
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {{ successMessage }}
          </p>
          
          <div class="mt-6">
            <UButton 
              to="/dashboard" 
              color="primary" 
              size="lg" 
              class="w-full"
            >
              Continue to Dashboard
            </UButton>
          </div>
          
          <p class="mt-4 text-xs text-gray-500 dark:text-gray-400">
            You will be redirected automatically in a few seconds...
          </p>
        </div>

        <!-- Error State -->
        <div v-else-if="verificationStatus === 'error'" class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20">
            <Icon name="heroicons:x-mark" class="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          
          <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            Verification Failed
          </h3>
          
          <p class="mt-2 text-sm text-red-600 dark:text-red-400">
            {{ errorMessage }}
          </p>
          
          <div class="mt-6 space-y-3">
            <UButton 
              @click="handleResendVerification"
              :loading="isResending"
              color="primary" 
              variant="outline"
              size="lg" 
              class="w-full"
            >
              <Icon v-if="!isResending" name="heroicons:paper-airplane" class="w-4 h-4 mr-2" />
              {{ isResending ? 'Sending...' : 'Resend Verification Email' }}
            </UButton>
            
            <UButton 
              to="/auth/register" 
              color="neutral" 
              variant="ghost"
              size="lg" 
              class="w-full"
            >
              Back to Registration
            </UButton>
          </div>
        </div>

        <!-- Success Message Alert -->
        <UAlert 
          v-if="successMessage && verificationStatus !== 'success'" 
          icon="heroicons:check-circle"
          color="success"
          variant="soft"
          :title="successMessage"
          class="mt-4"
        />

        <!-- Error Message Alert -->
        <UAlert 
          v-if="errorMessage && verificationStatus !== 'error'" 
          icon="heroicons:exclamation-triangle"
          color="error"
          variant="soft"
          :title="errorMessage"
          class="mt-4"
        />
      </div>

      <!-- Help Text -->
      <div class="mt-6 text-center">
        <p class="text-xs text-gray-500 dark:text-gray-400">
          Having trouble? 
          <NuxtLink to="/contact" class="font-medium text-primary-600 hover:text-primary-500">
            Contact our support team
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Additional custom styles if needed */
</style>
