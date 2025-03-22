export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('can', {
    mounted(el, binding) {
      const { userSession } = useUserSession();
      const userRole = userSession.value?.user?.role || 'observer';

      // Sprawdź, czy użytkownik ma uprawnienie
      const hasAccess = hasPermission(userRole, binding.value as Permission);

      // Jeśli nie ma dostępu, usuń element z DOM
      if (!hasAccess) {
        el.parentNode?.removeChild(el);
      }
    }
  });
});
