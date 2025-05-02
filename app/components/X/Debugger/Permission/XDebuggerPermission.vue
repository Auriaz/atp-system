<script lang="ts" setup>
const { userRoles, can } = usePermissions();
const userSession = useUserSession();
const testPermission = ref('');
const testedPermission = ref('');
const canAccess = ref(false);

function testCan() {
  testedPermission.value = testPermission.value;
  canAccess.value = can(testPermission.value as Permission);
}
</script>

<template>
  <div  class="border p-4 rounded-lg">
    <h3 class="text-lg font-medium mb-2">Debugger uprawnień</h3>
    <div class="flex flex-col mb-2">
      <div class="flex items-center gap-2">
        <span>Role użytkownika:</span>
        <UBadge 
          v-for="role in userRoles" 
          :key="role"
          color="primary" 
          >
          <!--  
            TODO : Poprawić kolorystyke :color="USER_ROLE_COLORS[role]"
          -->
          {{ role }}
        </UBadge>
      </div>
      <div v-if="userSession?.user" class="text-sm text-gray-500 mt-1">
        Zalogowany jako: {{ userSession.user.username }}
      </div>
    </div>
    <div class="mb-4">
      <p class="text-sm text-gray-500">Testuj uprawnienia:</p>
      <div class="flex gap-2 mt-1">
        <UInput v-model="testPermission" placeholder="Wpisz uprawnienie" />
        <UButton @click="testCan">Sprawdź</UButton>
      </div>
      <p class="mt-2" v-if="testedPermission">
        {{ canAccess ? '✓ Masz uprawnienie' : '✗ Brak uprawnienia' }}
        <code>{{ testedPermission }}</code>
      </p>
    </div>
  </div>
</template>