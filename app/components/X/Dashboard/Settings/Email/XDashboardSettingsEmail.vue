<template>
  <div class="bg-white dark:bg-blue-950 rounded-lg shadow-md p-6 transition-colors duration-200">
    <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Email Configuration</h3>
      <!-- Email Provider Selection -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Email Provider
      </label>
      <select 
        v-model="emailConfig.provider" 
        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
        @change="onProviderChange"
      >
        <option value="gmail">Gmail</option>
        <option value="outlook">Outlook/Hotmail</option>
        <option value="yahoo">Yahoo Mail</option>
        <option value="office365">Office 365</option>
        <option value="zoho">Zoho Mail</option>
        <option value="sendgrid">SendGrid</option>
        <option value="mailgun">Mailgun</option>
        <option value="ses">Amazon SES</option>
        <option value="custom">Custom SMTP</option>
      </select>
    </div>    <!-- Provider Information -->
    <div class="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md transition-colors duration-200" v-if="providerInfo">
      <p class="text-sm text-blue-800 dark:text-blue-200">
        <strong>{{ providerInfo.name }}:</strong> {{ providerInfo.description }}
      </p>
    </div>

    <form @submit.prevent="saveEmailSettings" class="space-y-4">      <!-- SMTP Host -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          SMTP Host
        </label>
        <input
          v-model="emailConfig.host"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
          :placeholder="providerDefaults.host"
          :disabled="emailConfig.provider !== 'custom'"
        />
      </div>

      <!-- SMTP Port -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          SMTP Port
        </label>
        <input
          v-model.number="emailConfig.port"
          type="number"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
          :placeholder="providerDefaults.port.toString()"
          :disabled="emailConfig.provider !== 'custom'"
        />
      </div>

      <!-- Security -->
      <div>
        <label class="flex items-center">
          <input
            v-model="emailConfig.secure"
            type="checkbox"
            class="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
            :disabled="emailConfig.provider !== 'custom'"
          />
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Use SSL/TLS</span>
        </label>
      </div>

      <!-- Username/Email -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Username/Email
        </label>
        <input
          v-model="emailConfig.user"
          type="email"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
          placeholder="your-email@example.com"
          required
        />
      </div>

      <!-- Password -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Password/App Password
        </label>
        <input
          v-model="emailConfig.password"
          type="password"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
          placeholder="your-password"
          required
        />
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          For Gmail, use an App Password instead of your regular password.
        </p>
      </div>

      <!-- From Name -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          From Name
        </label>
        <input
          v-model="emailConfig.fromName"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
          placeholder="ATP System"
        />
      </div>

      <!-- From Email -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          From Email
        </label>
        <input
          v-model="emailConfig.fromEmail"
          type="email"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
          placeholder="noreply@yourdomain.com"
        />
      </div>

      <!-- Test Email -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Test Email Address
        </label>
        <input
          v-model="testEmailAddress"
          type="email"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
          placeholder="test@example.com"
        />
      </div>

      <!-- Action Buttons -->
      <div class="flex space-x-3 pt-4">
        <button
          type="submit"
          :disabled="loading"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200"
        >
          {{ loading ? 'Saving...' : 'Save Settings' }}
        </button>
        
        <button
          type="button"
          @click="testEmailSettings"
          :disabled="testing || !canTest"
          class="px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 transition-colors duration-200"
        >
          {{ testing ? 'Testing...' : 'Test Email' }}
        </button>

        <button
          type="button"
          @click="loadCurrentSettings"
          :disabled="loading"
          class="px-4 py-2 bg-gray-600 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 transition-colors duration-200"
        >
          Reset
        </button>
      </div>
    </form>

    <!-- Status Messages -->
    <div v-if="statusMessage" class="mt-4 p-3 rounded-md" :class="statusClass">
      <p class="text-sm">{{ statusMessage }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Email configuration reactive data
const emailConfig = ref({
  provider: 'gmail',
  host: '',
  port: 587,
  secure: false,
  user: '',
  password: '',
  fromName: 'ATP System',
  fromEmail: ''
})

const testEmailAddress = ref('')
const loading = ref(false)
const testing = ref(false)
const statusMessage = ref('')
const statusType = ref<'success' | 'error' | 'info'>('info')

// SMTP providers configuration
const smtpProviders = {
  gmail: {
    name: 'Gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    description: 'Google Gmail SMTP'
  },
  outlook: {
    name: 'Outlook/Hotmail',
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false,
    description: 'Microsoft Outlook/Hotmail SMTP'
  },
  yahoo: {
    name: 'Yahoo Mail',
    host: 'smtp.mail.yahoo.com',
    port: 587,
    secure: false,
    description: 'Yahoo Mail SMTP'
  },
  office365: {
    name: 'Office 365',
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    description: 'Microsoft Office 365 SMTP'
  },
  zoho: {
    name: 'Zoho Mail',
    host: 'smtp.zoho.com',
    port: 587,
    secure: false,
    description: 'Zoho Mail SMTP'
  },
  sendgrid: {
    name: 'SendGrid',
    host: 'smtp.sendgrid.net',
    port: 587,
    secure: false,
    description: 'SendGrid SMTP (API Key as password)'
  },
  mailgun: {
    name: 'Mailgun',
    host: 'smtp.mailgun.org',
    port: 587,
    secure: false,
    description: 'Mailgun SMTP'
  },
  ses: {
    name: 'Amazon SES',
    host: 'email-smtp.us-east-1.amazonaws.com',
    port: 587,
    secure: false,
    description: 'Amazon Simple Email Service'
  },
  custom: {
    name: 'Custom SMTP',
    host: '',
    port: 587,
    secure: false,
    description: 'Custom SMTP server'
  }
}

// Computed properties
const providerInfo = computed(() => {
  return smtpProviders[emailConfig.value.provider as keyof typeof smtpProviders]
})

const providerDefaults = computed(() => {
  return smtpProviders[emailConfig.value.provider as keyof typeof smtpProviders]
})

const canTest = computed(() => {
  return emailConfig.value.user && emailConfig.value.password && testEmailAddress.value
})

const statusClass = computed(() => {
  const baseClasses = 'border transition-colors duration-200'
  switch (statusType.value) {
    case 'success':
      return `${baseClasses} bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200`
    case 'error':
      return `${baseClasses} bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200`
    default:
      return `${baseClasses} bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200`
  }
})

// Methods
const onProviderChange = () => {
  const provider = providerDefaults.value
  if (emailConfig.value.provider !== 'custom') {
    emailConfig.value.host = provider.host
    emailConfig.value.port = provider.port
    emailConfig.value.secure = provider.secure
  }
}

const loadCurrentSettings = async () => {
  try {
    loading.value = true
    const { getEmailSettings } = useSettingsApi()
    const settings = await getEmailSettings()
    
    if (settings) {
      emailConfig.value = { ...emailConfig.value, ...settings }
    }
    
    showStatus('Settings loaded successfully', 'success')
  } catch (error: any) {
    showStatus(`Failed to load settings: ${error.message}`, 'error')
  } finally {
    loading.value = false
  }
}

const saveEmailSettings = async () => {
  try {
    loading.value = true
    const { updateEmailSettings } = useSettingsApi()
    
    await updateEmailSettings(emailConfig.value)
    showStatus('Email settings saved successfully', 'success')
  } catch (error: any) {
    showStatus(`Failed to save settings: ${error.message}`, 'error')
  } finally {
    loading.value = false
  }
}

const testEmailSettings = async () => {
  try {
    testing.value = true
    const { testEmailSettings: testEmail } = useSettingsApi()
    
    await testEmail({
      ...emailConfig.value,
      testEmail: testEmailAddress.value
    })
    
    showStatus('Test email sent successfully! Check your inbox.', 'success')
  } catch (error: any) {
    showStatus(`Failed to send test email: ${error.message}`, 'error')
  } finally {
    testing.value = false
  }
}

const showStatus = (message: string, type: 'success' | 'error' | 'info') => {
  statusMessage.value = message
  statusType.value = type
  
  setTimeout(() => {
    statusMessage.value = ''
  }, 5000)
}

// Initialize on mount
onMounted(() => {
  loadCurrentSettings()
  onProviderChange()
})
</script>
