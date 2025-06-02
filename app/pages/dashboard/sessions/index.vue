<script setup lang="ts">
// Middleware i guards
definePageMeta({
  middleware: 'auth',
  layout: 'authorization'
})

// Get auth state
const { isAuthenticated } = useAuth()

// SEO
useSeoMeta({
  title: 'Zarządzanie sesjami - ATP System',
  ogTitle: 'Zarządzanie sesjami - ATP System',
  description: 'Zarządzaj swoimi sesjami i urządzeniami w systemie ATP. Monitoruj aktywne sesje i dbaj o bezpieczeństwo swojego konta.',
  ogDescription: 'Zarządzaj swoimi sesjami i urządzeniami w systemie ATP. Monitoruj aktywne sesje i dbaj o bezpieczeństwo swojego konta.',
  robots: 'noindex, nofollow' // Strona tylko dla zalogowanych użytkowników
})

// Wait for authentication before proceeding
await until(isAuthenticated).toBe(true)
</script>

<template>
  <NuxtLayout>
    <XDashboardPage :loading="false">
      <template #main>
        <Head>
          <Title>Zarządzanie sesjami - ATP System</Title>
          <Meta name="description" content="Zarządzaj swoimi sesjami i urządzeniami w systemie ATP" />
        </Head>

        <div class="container mx-auto px-4 py-8 max-w-6xl">
          <!-- Breadcrumb -->
          <nav class="flex mb-6" aria-label="Breadcrumb">
            <ol class="inline-flex items-center space-x-1 md:space-x-3">
              <li class="inline-flex items-center">
                <NuxtLink 
                  to="/dashboard" 
                  class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
                >
                  <UIcon name="i-heroicons-home" class="w-4 h-4 mr-2" />
                  Dashboard
                </NuxtLink>
              </li>
              <li>
                <div class="flex items-center">
                  <UIcon name="i-heroicons-chevron-right" class="w-4 h-4 text-gray-400" />
                  <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">
                    Bezpieczeństwo
                  </span>
                </div>
              </li>
              <li aria-current="page">
                <div class="flex items-center">
                  <UIcon name="i-heroicons-chevron-right" class="w-4 h-4 text-gray-400" />
                  <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">
                    Zarządzanie sesjami
                  </span>
                </div>
              </li>
            </ol>
          </nav>

          <!-- Page Header -->
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Zarządzanie sesjami
            </h1>
            <p class="text-gray-600 dark:text-gray-400">
              Monitoruj i zarządzaj swoimi aktywnymi sesjami na różnych urządzeniach. 
              Możesz wylogować się z wybranych urządzeń lub zakończyć wszystkie sesje naraz.
            </p>
          </div>

          <!-- Informacje o bezpieczeństwie -->
          <UAlert
            icon="i-heroicons-shield-check"
            color="neutral"
            variant="soft"
            class="mb-8"
            title="Bezpieczeństwo sesji"
            description="Regularnie sprawdzaj swoje aktywne sesje. Jeśli zauważysz nieznane urządzenie, natychmiast je wyloguj i zmień hasło."
          />

          <!-- Komponent zarządzania sesjami -->
          <XSessionManagement />

          <!-- Dodatkowe informacje -->
          <div class="mt-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Informacje o sesjach
            </h3>
            
            <div class="space-y-4 text-sm text-gray-600 dark:text-gray-400">
              <div class="flex items-start space-x-3">
                <UIcon name="i-heroicons-clock" class="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <strong>Czas wygaśnięcia:</strong> Sesje automatycznie wygasają po 30 dniach nieaktywności.
                </div>
              </div>
              
              <div class="flex items-start space-x-3">
                <UIcon name="i-heroicons-shield-check" class="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <strong>Bezpieczeństwo:</strong> Każda sesja jest chroniona unikalnym tokenem i jest monitorowana pod kątem bezpieczeństwa.
                </div>
              </div>
              
              <div class="flex items-start space-x-3">
                <UIcon name="i-heroicons-device-phone-mobile" class="w-5 h-5 text-purple-500 mt-0.5" />
                <div>
                  <strong>Rozpoznawanie urządzeń:</strong> System automatycznie rozpoznaje typ urządzenia i przeglądarkę.
                </div>
              </div>
              
              <div class="flex items-start space-x-3">
                <UIcon name="i-heroicons-map-pin" class="w-5 h-5 text-orange-500 mt-0.5" />
                <div>
                  <strong>Lokalizacja:</strong> Zapisujemy adres IP dla celów bezpieczeństwa, ale nie przechowujemy dokładnej lokalizacji.
                </div>
              </div>
            </div>

            <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h4 class="text-md font-medium text-gray-900 dark:text-white mb-3">
                Działania bezpieczeństwa
              </h4>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex items-center space-x-2">
                  <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-green-500" />
                  <span class="text-sm">Regularne sprawdzanie aktywnych sesji</span>
                </div>
                <div class="flex items-center space-x-2">
                  <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-green-500" />
                  <span class="text-sm">Wylogowywanie z nieznanych urządzeń</span>
                </div>
                <div class="flex items-center space-x-2">
                  <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-green-500" />
                  <span class="text-sm">Używanie silnych haseł</span>
                </div>
                <div class="flex items-center space-x-2">
                  <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-green-500" />
                  <span class="text-sm">Włączenie dwuskładnikowej autoryzacji</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </XDashboardPage>
  </NuxtLayout>
</template>

