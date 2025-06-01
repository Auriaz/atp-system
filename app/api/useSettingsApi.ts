export default function useSettingsApi() {
  const toast = useToast()

  async function updatedLogo(formData: FormData) {
    try {
      const response = await $fetch('/api/settings/update/logo', {
        method: 'POST',
        body: formData,
      })

      return response
    } catch (error: any) {
      // Obsługa błędów API
      console.error('Error updating logo:', error)

      // Sprawdź czy błąd ma strukturę API
      if (error.data && error.data.message) {
        throw new Error(error.data.message)
      } else if (error.message) {
        throw new Error(error.message)
      } else {
        throw new Error('Failed to update logo. Please try again.')
      }
    }
  }

  async function getEmailSettings() {
    try {
      const response = await $fetch('/api/settings/email', {
        method: 'GET',
      })

      return response
    } catch (error: any) {
      console.error('Error getting email settings:', error)

      if (error.data && error.data.message) {
        throw new Error(error.data.message)
      } else if (error.message) {
        throw new Error(error.message)
      } else {
        throw new Error('Failed to get email settings. Please try again.')
      }
    }
  }

  async function updateEmailSettings(emailConfig: any) {
    try {
      const response = await $fetch('/api/settings/email/update', {
        method: 'POST',
        body: emailConfig,
      })

      return response
    } catch (error: any) {
      console.error('Error updating email settings:', error)

      if (error.data && error.data.message) {
        throw new Error(error.data.message)
      } else if (error.message) {
        throw new Error(error.message)
      } else {
        throw new Error('Failed to update email settings. Please try again.')
      }
    }
  }

  async function testEmailSettings(emailConfig: any) {
    try {
      const response = await $fetch('/api/settings/email/test', {
        method: 'POST',
        body: emailConfig,
      })

      return response
    } catch (error: any) {
      console.error('Error testing email settings:', error)

      if (error.data && error.data.message) {
        throw new Error(error.data.message)
      } else if (error.message) {
        throw new Error(error.message)
      } else {
        throw new Error('Failed to test email settings. Please try again.')
      }
    }
  }

  return {
    updatedLogo,
    getEmailSettings,
    updateEmailSettings,
    testEmailSettings,
  }
}
