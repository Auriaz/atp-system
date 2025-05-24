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

  return {
    updatedLogo,
  }
}
