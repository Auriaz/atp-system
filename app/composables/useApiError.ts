/**
 * Funkcja pomocnicza do obsługi błędów API
 */
export function useApiError() {
  const toast = useToast();
  const { loggedIn } = useUserSession();

  // Helper function for general API error handling
  const handleApiError = (error: any) => {
    // Check if it's an HTTP error
    console.error('API error:', error);
    if (error?.statusCode) {
      switch (error.statusCode) {
        case 400:
          toast.add({ title: 'Error', description: 'Invalid input data', color: 'error' });
          break;
        case 401:
          navigateTo('/auth/login');
          break;
        case 403:
          navigateTo('/auth/403');
          break;
        case 404:
          toast.add({ title: 'Error', description: 'Resource not found', color: 'error' });
          break;
        case 422:
          toast.add({ title: 'Error', description: 'Invalid input data', color: 'error' });
          break;
        case 409:
          toast.add({ title: 'Error', description: error.data?.message || 'Conflict occurred', color: 'error' });
        case 500:
        case 502:
        case 503:
          toast.add({ title: 'Error', description: 'Internal server error', color: 'error' });
          break;
        default:
          toast.add({ title: 'Error', description: `An error occurred: ${error.message || 'Unknown error'}`, color: 'error' });
      }
    } else {
      // Handling non-HTTP errors
      toast.add({ title: 'Error', description: `An error occurred: ${error.message || 'Unknown error'}`, color: 'error' });
      console.error('API error:', error);
    }

    return error;
  };

  // Function to execute API requests with built-in error handling
  const safeApiCall = async <T>(
    apiFunc: () => Promise<T>,
    options?: {
      silent?: boolean,
      defaultValue?: T
    }
  ): Promise<T> => {
    try {
      return await apiFunc();
    } catch (error) {
      if (!options?.silent) {
        handleApiError(error);
      }
      return options?.defaultValue as T;
    }
  };

  return {
    handleApiError,
    safeApiCall
  };
}