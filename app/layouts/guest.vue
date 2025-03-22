<script lang="ts" setup>
const appName = 'ATP System'
const currentYear = new Date().getFullYear()

// Możliwe informacje motywacyjne do wyświetlenia na stronie logowania
const inspirationalQuotes = [
  "Trenuj ciężko, a sukces przyjdzie sam.",
  "Każdy cel jest osiągalny z odpowiednim planem.",
  "Najlepsi sportowcy są najlepiej zarządzani.",
  "Połączenie technologii i sportu tworzy mistrzów.",
  "Zostań lepszą wersją siebie każdego dnia."
]

// Losowa informacja motywacyjna
const randomQuote = computed(() => {
  const randomIndex = Math.floor(Math.random() * inspirationalQuotes.length)
  return inspirationalQuotes[randomIndex]
})

// Gradient dla tła (będzie się zmieniał delikatnie)
const gradientStyle = computed(() => {
  return {
    backgroundImage: 'linear-gradient(135deg, var(--color-primary-900) 0%, var(--color-primary-800) 40%, var(--color-primary-600) 100%)',
  }
})

// Pobierz bieżący tryb kolorów
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

// Funkcja do przełączania trybu kolorów
const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

// Pobierz bieżącą ścieżkę dla identyfikacji aktualnego formularza
const route = useRoute()
const currentPath = computed(() => route.path)

// Sprawdź, na której stronie jesteśmy
const isLoginPage = computed(() => currentPath.value === '/login')
const isRegisterPage = computed(() => currentPath.value === '/register')
const isForgotPasswordPage = computed(() => currentPath.value === '/forgot-password')
</script>

<template>
  <div class="min-h-screen w-full relative flex flex-col overflow-hidden guest-layout">
    <div class="absolute top-0 left-0 right-0 bottom-0 overflow-hidden background-container">
      <!-- Dynamiczne tło z gradientem -->
      <div class="absolute top-0 left-0 right-0 bottom-0 gradient-overlay" :style="gradientStyle"></div>
      
      <!-- Dekoracyjne elementy tła -->
      <div class="absolute top-0 left-0 right-0 bottom-0 overflow-hidden background-patterns">
        <div class="absolute rounded-full opacity-20 w-96 h-96 -top-20 -left-20 pattern pattern-1"></div>
        <div class="absolute rounded-full opacity-20 w-80 h-80 top-1/3 -right-16 pattern pattern-2"></div>
        <div class="absolute rounded-full opacity-20 w-64 h-64 bottom-1/4 left-1/4 pattern pattern-3"></div>
        <div class="absolute rounded-full opacity-20 w-72 h-72 -bottom-20 -right-20 pattern pattern-4"></div>
      </div>
      
      <!-- Obrazek w tle (sportowy motyw) -->
      <div class="absolute top-0 left-0 right-0 bottom-0 bg-center bg-no-repeat bg-cover opacity-5 background-image"></div>
    </div>

    <div class="container mx-auto px-4 py-8 flex flex-col min-h-screen layout-container">
      <!-- Nagłówek -->
      <header class="flex justify-between items-center py-4 layout-header">
        <NuxtLink to="/" class="flex items-center gap-3 text-white logo-container">
          <UAvatar
            src="/images/logo.svg"
            alt="ATP Logo"
            size="sm"
          />
          <h1 class="text-xl font-bold hidden md:block logo-text">{{ appName }}</h1>
        </NuxtLink>
        
        <div class="flex items-center gap-2 header-actions">
          <ClientOnly>
            <UButton
              to="/"
              variant="ghost"
              color="neutral"
              icon="i-lucide-home"
              size="sm"
            >
              Strona główna
            </UButton>
            
            <!-- Poprawiony przełącznik trybu kolorów -->
            <UButton 
              variant="ghost"
              color="neutral"
              size="sm"
              :icon="isDark ? 'i-lucide-sun' : 'i-lucide-moon'"
              @click="toggleColorMode"
              class="hidden sm:flex"
            />
          </ClientOnly>
        </div>
      </header>

      <!-- Główna zawartość -->
      <main class="flex-1 flex items-center justify-center py-8 layout-content">
        <div class="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center content-container">
          <div class="hidden lg:flex flex-col justify-center text-white content-left">
            <div class="space-y-8 pr-8 welcome-content">
              <h2 class="text-4xl font-extrabold leading-tight welcome-title">
                Witaj w systemie<br/>
                <span class="text-white opacity-90">{{ appName }}</span>
              </h2>
              
              <p class="text-xl italic text-white opacity-80 border-l-4 border-white border-opacity-30 pl-4 welcome-quote">
                "{{ randomQuote }}"
              </p>
              
              <div class="space-y-4 mt-8 welcome-features">
                <div class="flex items-center gap-3 text-white opacity-90 feature">
                  <UIcon name="i-lucide-trending-up" class="w-5 h-5 text-primary-300 feature-icon" />
                  <span>Zaawansowana analiza wyników</span>
                </div>
                <div class="flex items-center gap-3 text-white opacity-90 feature">
                  <UIcon name="i-lucide-dumbbell" class="w-5 h-5 text-primary-300 feature-icon" />
                  <span>Personalizowane programy treningowe</span>
                </div>
                <div class="flex items-center gap-3 text-white opacity-90 feature">
                  <UIcon name="i-lucide-users" class="w-5 h-5 text-primary-300 feature-icon" />
                  <span>Zarządzanie drużyną i zawodnikami</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="flex justify-center content-right">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6 sm:p-8 auth-container">
              <!-- Panel nawigacyjny między formularzami -->
              <div v-if="isLoginPage || isRegisterPage || isForgotPasswordPage" class="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div class="flex justify-between">
                  <UButton
                    to="/login"
                    variant="ghost"
                    :color="isLoginPage ? 'primary' : 'neutral'"
                    :class="isLoginPage ? 'font-bold' : 'font-normal'"
                  >
                    Logowanie
                  </UButton>
                  <UButton
                    to="/register"
                    variant="ghost"
                    :color="isRegisterPage ? 'primary' : 'neutral'"
                    :class="isRegisterPage ? 'font-bold' : 'font-normal'"
                  >
                    Rejestracja
                  </UButton>
                  <UButton
                    to="/forgot-password"
                    variant="ghost"
                    :color="isForgotPasswordPage ? 'primary' : 'neutral'"
                    :class="isForgotPasswordPage ? 'font-bold' : 'font-normal'"
                    class="whitespace-nowrap"
                  >
                    Odzyskaj hasło
                  </UButton>
                </div>
              </div>
              
              <!-- Tytuł formularza -->
              <div v-if="isLoginPage || isRegisterPage || isForgotPasswordPage" class="mb-6 text-center">
                <h1 v-if="isLoginPage" class="text-2xl font-bold text-gray-900 dark:text-white">
                  Zaloguj się do systemu
                </h1>
                <h1 v-if="isRegisterPage" class="text-2xl font-bold text-gray-900 dark:text-white">
                  Utwórz nowe konto
                </h1>
                <h1 v-if="isForgotPasswordPage" class="text-2xl font-bold text-gray-900 dark:text-white">
                  Odzyskiwanie hasła
                </h1>
              </div>
              
              <!-- Zawartość formularza -->
              <slot />
              
              <!-- Dodatkowe linki pod formularzem -->
              <div v-if="isLoginPage" class="mt-6 text-center">
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Nie pamiętasz hasła?
                  <NuxtLink to="/forgot-password" class="text-primary-600 dark:text-primary-400 hover:underline font-medium">
                    Zresetuj hasło
                  </NuxtLink>
                </p>
                <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Nie masz jeszcze konta?
                  <NuxtLink to="/register" class="text-primary-600 dark:text-primary-400 hover:underline font-medium">
                    Zarejestruj się
                  </NuxtLink>
                </p>
              </div>
              
              <div v-if="isRegisterPage" class="mt-6 text-center">
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Masz już konto?
                  <NuxtLink to="/login" class="text-primary-600 dark:text-primary-400 hover:underline font-medium">
                    Zaloguj się
                  </NuxtLink>
                </p>
              </div>
              
              <div v-if="isForgotPasswordPage" class="mt-6 text-center">
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Przypomniałeś sobie hasło?
                  <NuxtLink to="/login" class="text-primary-600 dark:text-primary-400 hover:underline font-medium">
                    Wróć do logowania
                  </NuxtLink>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Stopka -->
      <footer class="text-center text-white opacity-60 text-sm py-4 mt-4 flex flex-col sm:flex-row justify-between items-center layout-footer">
        <div>
          &copy; {{ currentYear }} {{ appName }} | Wszystkie prawa zastrzeżone
        </div>
        <div class="flex gap-4 mt-2 sm:mt-0 footer-links">
          <NuxtLink to="/terms" class="hover:text-white transition-colors footer-link">Regulamin</NuxtLink>
          <NuxtLink to="/privacy" class="hover:text-white transition-colors footer-link">Polityka prywatności</NuxtLink>
          <NuxtLink to="/contact" class="hover:text-white transition-colors footer-link">Kontakt</NuxtLink>
        </div>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.guest-layout {
  font-family: 'Inter', system-ui, sans-serif;
}

.background-container {
  z-index: -1;
}

.gradient-overlay {
  opacity: 0.9;
}

.pattern {
  background: linear-gradient(90deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%);
}

.background-image {
  background-image: url('/images/sports-background.webp');
}

.auth-container {
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.pattern-1 {
  animation: float 20s infinite ease-in-out;
}

.pattern-2 {
  animation: float 25s infinite ease-in-out reverse;
}

.pattern-3 {
  animation: pulse 15s infinite ease-in-out;
}

.pattern-4 {
  animation: float 18s infinite ease-in-out 2s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.1;
    transform: scale(1);
  }
  50% {
    opacity: 0.2;
    transform: scale(1.05);
  }
}
</style>