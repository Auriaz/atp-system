export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('can', {
    mounted(el, binding) {
      try {        // Bezpieczne pobranie sesji użytkownika
        const { session: userSession } = useAuth();        // Dodanie mechanizmu reaktywnego, żeby reagować na zmiany w sesji
        watch(() => userSession.value, (session) => {
          // Bezpieczne sprawdzenie wartości - teraz sprawdzamy roles zamiast role
          const userRoles = session?.roles || ['observer'];

          // Sprawdź, czy użytkownik ma uprawnienie
          const hasAccess = hasPermission(userRoles, binding.value as Permission);

          // Jeśli nie ma dostępu, usuń element z DOM
          if (!hasAccess) {
            if (el.parentNode) {
              el.parentNode.removeChild(el);
            }
          }
        }, { immediate: true });

        // Początkowe sprawdzenie (jeśli sesja już istnieje)
        if (userSession.value) {
          const userRoles = userSession.value?.roles || ['observer'];
          const hasAccess = hasPermission(userRoles, binding.value as Permission);

          if (!hasAccess && el.parentNode) {
            el.parentNode.removeChild(el);
          }
        }
      } catch (error) {
        console.error('Error in v-can directive:', error);
        // W przypadku błędu, bezpiecznie ukryj element
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
      }
    }
  });
});
