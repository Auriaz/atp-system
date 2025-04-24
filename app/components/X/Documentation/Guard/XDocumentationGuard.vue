<!-- components/Documentation/DocumentationGuard.vue -->
<script setup>
const route = useRoute()
const { data: document } = await useAsyncData(route.path, () => {
  return queryCollection('docs').path(route.path).first()
})

// Użyj systemu uprawnień ATP
const { userRoles } = usePermissions();

// Sprawdź, czy dokument jest dostępny dla roli użytkownika
const hasAccess = computed(() => {
  // Jeśli dokument nie istnieje
  if (!document.value) return false;
  
  // Jeśli dokument nie ma wymagań dotyczących roli, jest publiczny
  if (!document.value.requiredRole) return true;
  
  // Jeśli użytkownik ma uprawnienie admin, ma dostęp do wszystkiego
  if (userRoles.value.includes('admin')) return true;
  
  // Sprawdź, czy jakakolwiek rola użytkownika jest w wymaganych rolach dokumentu
  const requiredRoles = Array.isArray(document.value.requiredRole) 
    ? document.value.requiredRole 
    : [document.value.requiredRole];
    
  return userRoles.value.some(role => requiredRoles.includes(role));
});

// Przekieruj, jeśli nie ma dostępu
if (!hasAccess.value) {
  navigateTo('/docs/access-denied');
}
</script>

<template>
  <div v-if="hasAccess">
    <slot />
  </div>
  
  <div v-else class="flex items-center justify-center h-64">
    <UCard>
      <template #header>
        <div class="flex items-center gap-2 text-red-500">
          <Icon name="i-heroicons-lock-closed" />
          <h3>Brak dostępu</h3>
        </div>
      </template>
      <p>Nie masz uprawnień do wyświetlenia tej dokumentacji.</p>
      <template #footer>
        <NuxtLink to="/docs/public/getting-started" class="text-primary">
          Przejdź do dokumentacji publicznej
        </NuxtLink>
      </template>
    </UCard>
  </div>
</template>