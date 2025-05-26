<template>
  <div class="space-y-6">
    <!-- Header z statystykami -->
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          Zarządzanie sesjami
        </h2>
        <UButton 
          @click="fetchSessions" 
          :loading="loading"
          variant="ghost"
          icon="i-heroicons-arrow-path"
        >
          Odśwież
        </UButton>
      </div>

      <!-- Statystyki -->
      <div v-if="stats" class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {{ stats.activeSessions }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            Aktywne sesje
          </div>
        </div>
        <div class="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div class="text-2xl font-bold text-green-600 dark:text-green-400">
            {{ stats.devicesCount }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            Urządzenia
          </div>
        </div>
        <div class="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {{ stats.totalSessions }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            Wszystkie sesje
          </div>
        </div>
        <div class="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
          <div class="text-sm font-medium text-orange-600 dark:text-orange-400">
            {{ stats.lastActivity ? formatLastActivity(new Date(stats.lastActivity)) : 'Brak' }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            Ostatnia aktywność
          </div>
        </div>
      </div>

      <!-- Akcje globalne -->
      <div class="flex flex-wrap gap-3">
        <UButton 
          @click="handleRevokeAllOther"
          :disabled="!currentSession || loading"
          color="orange"
          variant="outline"
          icon="i-heroicons-device-phone-mobile"
        >
          Wyloguj z innych urządzeń
        </UButton>
        <UButton 
          @click="handleRevokeAll"
          :disabled="loading"
          color="red"
          variant="outline"
          icon="i-heroicons-power"
        >
          Wyloguj ze wszystkich urządzeń
        </UButton>
      </div>
    </div>

    <!-- Lista sesji -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">
          Aktywne sesje ({{ sessions.length }})
        </h3>
      </div>

      <div v-if="loading && sessions.length === 0" class="p-6">
        <div class="flex items-center justify-center py-8">
          <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin text-gray-400" />
          <span class="ml-2 text-gray-500">Ładowanie sesji...</span>
        </div>
      </div>

      <div v-else-if="error" class="p-6">
        <UAlert
          icon="i-heroicons-exclamation-triangle"
          color="red"
          variant="soft"
          :title="error"
          :description="`Nie udało się pobrać listy sesji. Spróbuj ponownie.`"
        />
      </div>

      <div v-else-if="sessions.length === 0" class="p-6">
        <div class="text-center py-8">
          <UIcon name="i-heroicons-device-phone-mobile" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Brak aktywnych sesji
          </h3>
          <p class="text-gray-500">
            Zaloguj się z innych urządzeń, aby zobaczyć je tutaj.
          </p>
        </div>
      </div>

      <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
        <div 
          v-for="session in sessions" 
          :key="session.id"
          class="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <div class="flex items-start justify-between">
            <div class="flex items-start space-x-4">
              <!-- Ikona urządzenia -->
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <UIcon 
                    :name="getDeviceIcon(session.deviceName)" 
                    class="w-5 h-5 text-gray-600 dark:text-gray-400"
                  />
                </div>
              </div>

              <!-- Informacje o sesji -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center space-x-2">
                  <h4 class="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {{ session.deviceName || 'Nieznane urządzenie' }}
                  </h4>
                  <UBadge 
                    v-if="isCurrentSession(session)"
                    color="green"
                    variant="soft"
                    size="xs"
                  >
                    Aktualna sesja
                  </UBadge>
                </div>
                
                <div class="mt-1 space-y-1">
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    IP: {{ session.ipAddress || 'Nieznane' }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    Ostatnia aktywność: {{ formatLastActivity(session.lastUsedAt) }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    Utworzona: {{ new Date(session.createdAt).toLocaleDateString('pl-PL') }}
                  </p>
                  <p v-if="session.location" class="text-xs text-gray-500 dark:text-gray-400">
                    Lokalizacja: {{ session.location }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Akcje -->
            <div class="flex-shrink-0 ml-4">
              <UButton
                v-if="!isCurrentSession(session)"
                @click="handleRevokeSession(session)"
                :loading="loading"
                color="red"
                variant="ghost"
                size="sm"
                icon="i-heroicons-x-mark"
              >
                Wyloguj
              </UButton>
              <UBadge 
                v-else
                color="green"
                variant="soft"
                size="sm"
              >
                To urządzenie
              </UBadge>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal potwierdzenia -->
    <UModal v-model="showConfirmModal">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">{{ confirmAction.title }}</h3>
        </template>

        <p class="text-gray-600 dark:text-gray-400">
          {{ confirmAction.description }}
        </p>

        <template #footer>
          <div class="flex justify-end space-x-3">
            <UButton 
              @click="showConfirmModal = false"
              variant="ghost"
            >
              Anuluj
            </UButton>
            <UButton 
              @click="executeConfirmAction"
              :loading="loading"
              :color="confirmAction.color"
            >
              {{ confirmAction.confirmText }}
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { SessionInfo } from '~/server/utils/services/session-management.service'

// Composables
const { 
  sessions, 
  stats, 
  loading, 
  error,
  fetchSessions,
  revokeSession,
  revokeAllOtherSessions,
  revokeAllSessions,
  formatLastActivity,
  isCurrentSession,
  getDeviceIcon
} = useSessionManagement()

// Reactive data
const showConfirmModal = ref(false)
const confirmAction = ref({
  title: '',
  description: '',
  confirmText: '',
  color: 'red' as const,
  action: null as (() => Promise<void>) | null
})

// Computed
const currentSession = computed(() => {
  return sessions.value.find(session => isCurrentSession(session))
})

// Methods
const handleRevokeSession = (session: SessionInfo) => {
  confirmAction.value = {
    title: 'Wyloguj z urządzenia',
    description: `Czy na pewno chcesz wylogować się z urządzenia "${session.deviceName}"? Ta sesja zostanie natychmiast zakończona.`,
    confirmText: 'Wyloguj',
    color: 'red',
    action: () => revokeSession(session.id)
  }
  showConfirmModal.value = true
}

const handleRevokeAllOther = () => {
  if (!currentSession.value) return

  confirmAction.value = {
    title: 'Wyloguj z innych urządzeń',
    description: 'Czy na pewno chcesz wylogować się ze wszystkich innych urządzeń? Tylko aktualna sesja pozostanie aktywna.',
    confirmText: 'Wyloguj z innych',
    color: 'orange',
    action: () => revokeAllOtherSessions(currentSession.value!.id)
  }
  showConfirmModal.value = true
}

const handleRevokeAll = () => {
  confirmAction.value = {
    title: 'Wyloguj ze wszystkich urządzeń',
    description: 'Czy na pewno chcesz wylogować się ze wszystkich urządzeń? Zostaniesz przekierowany na stronę logowania.',
    confirmText: 'Wyloguj ze wszystkich',
    color: 'red',
    action: () => revokeAllSessions()
  }
  showConfirmModal.value = true
}

const executeConfirmAction = async () => {
  if (confirmAction.value.action) {
    await confirmAction.value.action()
  }
  showConfirmModal.value = false
}

// Lifecycle
onMounted(() => {
  fetchSessions()
})
</script>
