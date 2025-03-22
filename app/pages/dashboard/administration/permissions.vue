<!-- app/pages/dashboard/administration/permissions.vue -->
<script  setup>
definePageMeta({
  middleware: ['auth'],
  layout: 'authorization'
})

// Lista ról do wyświetlenia
const roles = [
  { value: USER_ROLES.ADMIN, label: 'Administrator' },
  { value: USER_ROLES.MANAGER, label: 'Manager' },
  { value: USER_ROLES.COACH, label: 'Trener' },
  { value: USER_ROLES.EDITOR, label: 'Redaktor' },
  { value: USER_ROLES.ATHLETE, label: 'Sportowiec' },
  { value: USER_ROLES.USER, label: 'Użytkownik' },
  { value: USER_ROLES.OBSERVER, label: 'Obserwator' }
];

// Grupowanie uprawnień według kategorii
const groupedPermissions = computed(() => {
  const result = {};
  
  for (const role of roles) {
    const permissions = getAllUserPermissions(role.value);
    result[role.value] = {};
    
    permissions.forEach(permission => {
      const [category] = permission.split(':');

      if (!result[role.value]?.[category]) {
        result[role.value][category] = [];
      }

      result[role.value][category].push(permission);
    });
  }
  
  return result;
});

// Formatowanie nazwy kategorii
function formatCategory(category) {
  const categoryNames = {
    user: 'Użytkownicy',
    training: 'Treningi',
    progress: 'Postępy',
    content: 'Treści',
    schedule: 'Harmonogram',
    system: 'System',
    message: 'Wiadomości',
    notification: 'Powiadomienia',
    stats: 'Statystyki',
    report: 'Raporty'
  };
  
  return categoryNames[category] || category;
}

// Formatowanie nazwy uprawnienia
function formatPermission(permission) {
  const [category, action] = permission.split(':');
  
  const actionNames = {
    view: 'Przeglądanie',
    view_all: 'Przeglądanie wszystkich',
    create: 'Tworzenie',
    edit: 'Edycja',
    delete: 'Usuwanie',
    assign: 'Przypisywanie',
    assign_role: 'Przypisywanie ról',
    add: 'Dodawanie',
    publish: 'Publikowanie',
    settings: 'Ustawienia',
    logs: 'Logi',
    backup: 'Kopie zapasowe',
    send: 'Wysyłanie',
    advanced: 'Zaawansowane',
    generate: 'Generowanie'
  };
  
  return actionNames[action] || action;
}
</script>

<template>
  <NuxtLayout>
    <XDashboardPage>
      <template #main>
        <div class="p-6 space-y-6">
          <h1 class="text-2xl font-bold">Uprawnienia systemu</h1>
          
          <UCard>
            <template #header>
              <div class="flex justify-between items-center">
                <h3 class="text-lg font-medium">Lista uprawnień według ról</h3>
              </div>
            </template>
            
            <UTabs :items="roles">
              <template #item="{ item }">
                <div class="p-4">
                  <div class="flex items-center gap-3 mb-4">
                    <UIcon :name="USER_ROLE_ICONS[item.value]" class="size-6" :color="USER_ROLE_COLORS[item.value]" />
                    <h3 class="text-lg font-medium capitalize">{{ item.label }}</h3>
                  </div>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <UCard v-for="(permissions, category) in groupedPermissions[item.value]" :key="category">
                      <template #header>
                        <h4 class="font-medium">{{ formatCategory(category) }}</h4>
                      </template>
                      
                      <ul class="space-y-2">
                        <li v-for="permission in permissions" :key="permission" class="flex items-center gap-2">
                          <UIcon name="i-lucide-check" class="text-green-500" />
                          <span>{{ formatPermission(permission) }}</span>
                        </li>
                      </ul>
                    </UCard>
                  </div>
                </div>
              </template>
            </UTabs>
          </UCard>
        </div>
      </template>
    </XDashboardPage>
  </NuxtLayout>
</template>