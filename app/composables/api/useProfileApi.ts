export default function useProfileApi() {
  // Współdzielony stan aplikacji - używamy useState, aby dane były dostępne między komponentami
  const profile = useState<UserResource | null>('profile', () => null)
  const isLoading = useState<boolean>('profile-loading', () => false)
  const isPasswordChanging = useState<boolean>('password-changing', () => false)
  const error = useState<Error | null>('profile-error', () => null)

  // Dodatkowe composables
  const toast = useToast()

  /**
   * Pobiera profil użytkownika z API
   */
  const fetchProfile = async () => {
    isLoading.value = true
    error.value = null

    try {
      // Wykonaj zapytanie do API
      const response = await $fetch('/api/profile', {
        method: 'GET'
      })
      // Aktualizuj stan lokalny
      if (response.payload) {
        profile.value = response.payload.data || null
      }

      console.log('Profile response:', profile.value)
      return response
    } catch (err: any) {
      // Obsługa błędów
      error.value = err

      // Wyświetl komunikat
      toast.add({
        title: 'Error',
        description: err?.data?.message || err?.message || 'Failed to load profile',
        color: 'error'
      })

      // Przekieruj w przypadku błędu autoryzacji
      if (err?.statusCode === 401) {
        navigateTo('/auth/login')
      } else if (err?.statusCode === 403) {
        navigateTo('/auth/403')
      }

      return null
    } finally {
      // Zawsze aktualizuj stan ładowania
      isLoading.value = false
    }
  }

  const avatarUrlUpdate = async (url: string) => {

  }

  const update = async (data: Partial<UserResource>) => {
    isLoading.value = true
    error.value = null
    try {
      // Wykonaj zapytanie do API
      const response = await $fetch('/api/profile', {
        method: 'PUT',
        body: data
      })
      // Aktualizuj stan lokalny
      if (response.payload) {
        profile.value = response.payload.data || null
      }


      toast.add({ ...response.message })


      console.log('Profile response:', response)
      return response
    }
    catch (err: any) {
      // Obsługa błędów
      error.value = err
      // Wyświetl komunikat
      toast.add({
        title: 'Error',
        description: err?.data?.message || err?.message || 'Failed to load profile',
        color: 'error'
      })
      // Przekieruj w przypadku błędu autoryzacji
      if (err?.statusCode === 401) {
        navigateTo('/auth/login')
      } else if (err?.statusCode === 403) {
        navigateTo('/auth/403')
      }
      return null
    } finally {
      // Zawsze aktualizuj stan ładowania
      isLoading.value = false
    }
  }

  /**
   * Zmienia hasło użytkownika
   * @param passwordData Obiekt zawierający aktualne hasło i nowe hasło
   * @returns Obiekt odpowiedzi z API lub null w przypadku błędu
   */
  const changePassword = async (passwordData: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    isPasswordChanging.value = true;
    error.value = null;

    try {
      // Wykonaj zapytanie do API
      const response = await $fetch('/api/profile/password', {
        method: 'PUT',
        body: passwordData
      });

      // Wyświetl komunikat sukcesu
      toast.add({
        title: response.message?.title || 'Success',
        description: response.message?.description || 'Password changed successfully',
        color: response.message?.color || 'success'
      });

      return response;
    } catch (err: any) {
      // Obsługa błędów
      error.value = err;

      // Obsługa błędów walidacji
      if (err?.data?.issues) {
        const validationErrors = err.data.issues.map((issue: any) => issue.message).join(', ');

        toast.add({
          title: 'Validation Error',
          description: validationErrors || 'Please check your input',
          color: 'warning'
        });

        return { validationErrors: err.data.issues };
      }

      // Wyświetl komunikat błędu
      toast.add({
        title: 'Error',
        description: err?.data?.message || err?.message || 'Failed to change password',
        color: 'error'
      });

      // Przekieruj w przypadku błędu autoryzacji
      if (err?.statusCode === 401) {
        navigateTo('/auth/login');
      } else if (err?.statusCode === 403) {
        navigateTo('/auth/403');
      }

      return null;
    } finally {
      // Zawsze aktualizuj stan ładowania
      isPasswordChanging.value = false;
    }
  };

  return {
    profile,
    isLoading,
    isPasswordChanging,
    error,
    fetchProfile,
    avatarUrlUpdate,
    update,
    changePassword
  }
}
