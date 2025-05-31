/**
 * Composable służący do zarządzania użytkownikami i komunikacji z API
 * 
 * Zapewnia funkcje do pobierania, tworzenia, aktualizacji i usuwania użytkowników
 * oraz zarządza stanem lokalnym za pomocą useState.
 */
export function useUsersApi() {
    // Współdzielony stan aplikacji - używamy useState, aby dane były dostępne między komponentami
    const users = useState<UserResource[]>('users', () => [])
    const pagination = useState<Record<string, any>>('users-pagination', () => ({}))
    const isLoading = useState<boolean>('users-loading', () => false)
    const error = useState<Error | null>('users-error', () => null)

    // Dodatkowe composables
    const toast = useToast()

    /**
     * Pobiera listę użytkowników z API
     * @param params Opcjonalne parametry zapytania (filtrowanie, sortowanie, paginacja)
     */
    const fetchUsers = async (params: Record<string, any> = {}) => {
        isLoading.value = true
        error.value = null

        try {
            // Wykonaj zapytanie do API
            const response = await $fetch('/api/users', {
                method: 'GET',
                params
            })

            // Aktualizuj stan lokalny
            if (response.payload) {
                users.value = response.payload.data || []
                pagination.value = response.payload.pagination || {}
            }

            return response
        } catch (err: any) {
            // Obsługa błędów
            error.value = err

            // Wyświetl komunikat
            toast.add({
                title: 'Error',
                description: err?.data?.message || err?.message || 'Failed to load users',
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

    // /**
    //  * Pobiera pojedynczego użytkownika po ID
    //  * @param id ID użytkownika
    //  */
    // const fetchUserById = async (id: string) => {
    //     isLoading.value = true
    //     error.value = null

    //     try {
    //         // Wykonaj zapytanie do API
    //         const response = await $fetch(`/api/users/${id}`, {
    //             method: 'GET'
    //         })

    //         return response.payload
    //     } catch (err: any) {
    //         // Obsługa błędów
    //         error.value = err

    //         // Wyświetl komunikat
    //         toast.add({
    //             title: 'Error',
    //             description: err?.data?.message || err?.message || `Failed to load user with ID: ${id}`,
    //             color: 'error'
    //         })

    //         // Przekieruj w przypadku błędu autoryzacji
    //         if (err?.statusCode === 401) {
    //             navigateTo('/auth/login')
    //         } else if (err?.statusCode === 404) {
    //             // W przypadku, gdy nie znaleziono użytkownika
    //             navigateTo('/dashboard/users')
    //         }

    //         return null
    //     } finally {
    //         // Zawsze aktualizuj stan ładowania
    //         isLoading.value = false
    //     }
    // }

    /**
     * Tworzy nowego użytkownika
     * @param userData Dane nowego użytkownika
     */
    const createUser = async (userData: Partial<UserResource>) => {
        isLoading.value = true
        error.value = null

        try {
            // Wykonaj zapytanie do API
            const response = await $fetch('/api/users', {
                method: 'POST',
                body: userData
            })

            // Wyświetl komunikat o sukcesie
            toast.add({
                title: 'Success',
                description: 'User created successfully',
                color: 'primary'
            })

            // Odśwież listę użytkowników
            await fetchUsers()

            return response
        } catch (err: any) {
            // Obsługa błędów
            error.value = err

            // Wyświetl komunikat o błędzie
            toast.add({
                title: 'Error',
                description: err?.data?.message || err?.message || 'Failed to create user',
                color: 'error'
            })

            return null
        } finally {
            isLoading.value = false
        }
    }

    // /**
    //  * Aktualizuje istniejącego użytkownika
    //  * @param id ID użytkownika
    //  * @param userData Dane do aktualizacji
    //  */
    // const updateUser = async (id: string, userData: Partial<IUserResource>) => {
    //     isLoading.value = true
    //     error.value = null

    //     try {
    //         // Wykonaj zapytanie do API
    //         const response = await $fetch(`/api/users/${id}`, {
    //             method: 'PUT',
    //             body: userData
    //         })

    //         // Wyświetl komunikat o sukcesie
    //         toast.add({
    //             title: 'Success',
    //             description: 'User updated successfully',
    //             color: 'green'
    //         })

    //         // Odśwież listę użytkowników
    //         await fetchUsers()

    //         return response
    //     } catch (err: any) {
    //         // Obsługa błędów
    //         error.value = err

    //         // Wyświetl komunikat o błędzie
    //         toast.add({
    //             title: 'Error',
    //             description: err?.data?.message || err?.message || 'Failed to update user',
    //             color: 'error'
    //         })

    //         return null
    //     } finally {
    //         isLoading.value = false
    //     }
    // }

    // /**
    //  * Usuwa użytkownika
    //  * @param id ID użytkownika do usunięcia
    //  */
    // const deleteUser = async (id: string) => {
    //     isLoading.value = true
    //     error.value = null

    //     try {
    //         // Wykonaj zapytanie do API
    //         const response = await $fetch(`/api/users/${id}`, {
    //             method: 'DELETE'
    //         })

    //         // Wyświetl komunikat o sukcesie
    //         toast.add({
    //             title: 'Success',
    //             description: 'User deleted successfully',
    //             color: 'green'
    //         })

    //         // Odśwież listę użytkowników
    //         await fetchUsers()

    //         return response
    //     } catch (err: any) {
    //         // Obsługa błędów
    //         error.value = err

    //         // Wyświetl komunikat o błędzie
    //         toast.add({
    //             title: 'Error',
    //             description: err?.data?.message || err?.message || 'Failed to delete user',
    //             color: 'error'
    //         })

    //         return null
    //     } finally {
    //         isLoading.value = false
    //     }
    // }

    /**
     * Resetuje stan - przydatne np. przy wylogowaniu
     */
    const resetState = () => {
        users.value = []
        pagination.value = {}
        isLoading.value = false
        error.value = null
    }

    // Zwróć dostęp do stanu i funkcji
    return {
        // Stan
        users,
        pagination,
        isLoading,
        error,

        // Funkcje
        fetchUsers,
        // fetchUserById,
        createUser,
        // updateUser,
        // deleteUser,
        resetState
    }
}