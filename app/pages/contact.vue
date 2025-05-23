<script lang="ts" setup>
// Stan formularza
const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
  agreement: false
})

// Lista często zadawanych pytań
const faqs = ref([
  {
    question: 'Jak mogę założyć konto w systemie ATP?',
    answer: 'Rejestracja w systemie ATP jest prosta. Wystarczy kliknąć przycisk "Zarejestruj się" na stronie głównej i wypełnić formularz rejestracyjny. Po weryfikacji adresu e-mail, Twoje konto będzie aktywne.',
    open: false
  },
  {
    question: 'Czy oferujecie wersję próbną systemu?',
    answer: 'Tak, oferujemy 14-dniowy okres próbny z pełnym dostępem do wszystkich funkcji systemu. Nie wymagamy podania danych karty kredytowej do rozpoczęcia okresu próbnego.',
    open: false
  },
  {
    question: 'Jakie są plany cenowe dla systemu ATP?',
    answer: 'Oferujemy kilka planów dostosowanych do różnych potrzeb - od planu dla indywidualnych trenerów po rozwiązania dla dużych klubów sportowych. Szczegółowe informacje o cenach znajdziesz w sekcji "Cennik" na naszej stronie.',
    open: false
  },
  {
    question: 'Czy mogę eksportować dane z systemu?',
    answer: 'Tak, system ATP umożliwia eksport danych w różnych formatach, w tym CSV, PDF i Excel. Dzięki temu możesz łatwo przenosić dane do innych programów lub tworzyć raporty.',
    open: false
  },
  {
    question: 'Czy oferujecie szkolenia z obsługi systemu?',
    answer: 'Oferujemy zarówno darmowe webinary wprowadzające, jak i dedykowane szkolenia dla zespołów. Posiadamy również obszerną bazę wiedzy z tutorialami wideo i dokumentacją.',
    open: false
  }
])

// Dane kontaktowe
const contactInfo = {
  address: 'Lorem ipsum dolor sit amet',
  email: 'przykład@atp-system.pl',
  phone: '+48 111 111 111 ',
  hours: 'Pon-Pt: 9:00 - 17:00'
}

// Obsługa wysłania formularza
const isSubmitting = ref(false)
const submitSuccess = ref(false)
const submitError = ref(false)
const toast = useToast()

const submitForm = async () => {
  isSubmitting.value = true
  submitSuccess.value = false
  submitError.value = false
  
  try {
    // Tu normalnie byłoby wysłanie formularza do API
    await new Promise(resolve => setTimeout(resolve, 1500)) // Symulacja opóźnienia
    
    submitSuccess.value = true
    form.name = ''
    form.email = ''
    form.subject = ''
    form.message = ''
    form.agreement = false
    
    toast.add({
      title: 'Wiadomość wysłana',
      description: 'Dziękujemy za kontakt. Odpowiemy najszybciej jak to możliwe.',
      color: 'success',
      icon: 'i-lucide-check-circle'
    })
  } catch (error) {
    submitError.value = true
    toast.add({
      title: 'Błąd wysyłania',
      description: 'Przepraszamy, wystąpił problem podczas wysyłania wiadomości. Spróbuj ponownie później.',
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
  } finally {
    isSubmitting.value = false
  }
}

// Walidacja formularza
const nameRules = [(v: string | undefined) => !!v || 'Imię i nazwisko jest wymagane']
const emailRules = [
  (v: string | undefined) => !!v || 'Email jest wymagany',
  (v: string | undefined) => /.+@.+\..+/.test(v || '') || 'Email musi być poprawny'
]
const subjectRules = [(v: string | undefined) => !!v || 'Temat jest wymagany']
const messageRules = [
  (v: string | undefined) => !!v || 'Wiadomość jest wymagana',
  (v: string | undefined) => (v && v.length >= 10) || 'Wiadomość musi mieć co najmniej 10 znaków'
]
const agreementRules = [(v: boolean | undefined) => !!v || 'Zgoda na przetwarzanie danych jest wymagana']

// Obsługa FAQ
const toggleFaq = (index: number) => {
  if (index >= 0 && index < faqs.value.length) {
    const faq = faqs.value[index];
    if (faq) {
      faq.open = !faq.open;
    }
  }
}
</script>

<template>
  <NuxtLayout>
    <div class="contact-page">
      <!-- Hero Section -->
      <section class="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 dark:from-gray-900 dark:via-gray-800 dark:to-primary-900 py-16 md:py-24">
        <div class="container mx-auto px-4">
          <div class="text-center text-white">
            <h1 class="text-4xl md:text-5xl font-bold mb-4">Kontakt</h1>
            <p class="text-xl text-primary-200 dark:text-gray-300 max-w-3xl mx-auto">
              Masz pytania lub uwagi? Jesteśmy tutaj, aby pomóc. Skontaktuj się z nami, a odpowiemy najszybciej jak to możliwe.
            </p>
          </div>
        </div>
        
        <!-- Wave separator -->
        <div class="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg class="relative block w-full h-16 sm:h-24" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.11,141.39,111.56,219.35,94.19Z" class="fill-white dark:fill-gray-900"></path>
          </svg>
        </div>
      </section>
      
      <!-- Main Content -->
      <section class="py-12 md:py-20 bg-white dark:bg-gray-900">
        <div class="container mx-auto px-4">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <!-- Contact Form -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Wyślij wiadomość</h2>
              
              <UForm :state="form" @submit="submitForm" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <UFormField label="Imię i nazwisko" required>
                      <UInput
                        v-model="form.name"
                        placeholder="Twoje imię i nazwisko"
                        :rules="nameRules"
                        :ui="{ trailingIcon: 'i-lucide-user' }"
                      />
                    </UFormField>
                  </div>
                  
                  <div>
                    <UFormField label="Email" required>
                      <UInput
                        v-model="form.email"
                        placeholder="twoj@email.pl"
                        type="email"
                        :rules="emailRules"
                        :ui="{ trailingIcon: 'i-lucide-mail' }"
                      />
                    </UFormField>
                  </div>
                </div>
                
                <UFormField label="Temat" required>
                  <UInput
                    v-model="form.subject"
                    placeholder="Czego dotyczy Twoja wiadomość?"
                    :rules="subjectRules"
                    :ui="{ trailingIcon: 'i-lucide-tag' }"
                  />
                </UFormField>
                
                <UFormField label="Wiadomość" required>
                  <UTextarea
                    v-model="form.message"
                    placeholder="W czym możemy Ci pomóc?"
                    :rows="6"
                    :rules="messageRules"
                  />
                </UFormField>
                
                <UFormField>
                  <UCheckbox
                    v-model="form.agreement"
                    label="Wyrażam zgodę na przetwarzanie moich danych osobowych w celu udzielenia odpowiedzi na wiadomość zgodnie z polityką prywatności."
                    :rules="agreementRules"
                  />
                </UFormField>
                
                <div class="flex justify-end">
                  <UButton
                    type="submit"
                    color="primary"
                    block
                    size="lg"
                    :loading="isSubmitting"
                    :disabled="isSubmitting"
                    :icon="isSubmitting ? undefined : 'i-lucide-send'"
                  >
                    {{ isSubmitting ? 'Wysyłanie...' : 'Wyślij wiadomość' }}
                  </UButton>
                </div>
              </UForm>
              
              <div v-if="submitSuccess" class="mt-6 p-4 bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-300 rounded-lg">
                <p class="flex items-center">
                  <UIcon name="i-lucide-check-circle" class="h-5 w-5 mr-2" />
                  Twoja wiadomość została wysłana. Dziękujemy za kontakt!
                </p>
              </div>
              
              <div v-if="submitError" class="mt-6 p-4 bg-danger-50 dark:bg-danger-900/20 text-danger-700 dark:text-danger-300 rounded-lg">
                <p class="flex items-center">
                  <UIcon name="i-lucide-alert-circle" class="h-5 w-5 mr-2" />
                  Przepraszamy, wystąpił problem. Spróbuj ponownie później.
                </p>
              </div>
            </div>
            
            <!-- Contact Information -->
            <div class="space-y-8">
              <!-- Info Cards -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                  <div class="flex items-start">
                    <div class="bg-primary-100 dark:bg-primary-900/30 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 mr-4">
                      <UIcon name="i-lucide-map-pin" class="text-primary-600 dark:text-primary-400 text-xl" />
                    </div>
                    <div>
                      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">Adres</h3>
                      <p class="text-gray-600 dark:text-gray-400">{{ contactInfo.address }}</p>
                    </div>
                  </div>
                </div>
                
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                  <div class="flex items-start">
                    <div class="bg-primary-100 dark:bg-primary-900/30 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 mr-4">
                      <UIcon name="i-lucide-mail" class="text-primary-600 dark:text-primary-400 text-xl" />
                    </div>
                    <div>
                      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">Email</h3>
                      <a href="mailto:kontakt@atp-system.pl" class="text-primary-600 dark:text-primary-400 hover:underline">{{ contactInfo.email }}</a>
                    </div>
                  </div>
                </div>
                
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                  <div class="flex items-start">
                    <div class="bg-primary-100 dark:bg-primary-900/30 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 mr-4">
                      <UIcon name="i-lucide-phone" class="text-primary-600 dark:text-primary-400 text-xl" />
                    </div>
                    <div>
                      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">Telefon</h3>
                      <a href="tel:+48123456789" class="text-primary-600 dark:text-primary-400 hover:underline">{{ contactInfo.phone }}</a>
                    </div>
                  </div>
                </div>
                
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                  <div class="flex items-start">
                    <div class="bg-primary-100 dark:bg-primary-900/30 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 mr-4">
                      <UIcon name="i-lucide-clock" class="text-primary-600 dark:text-primary-400 text-xl" />
                    </div>
                    <div>
                      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">Godziny pracy</h3>
                      <p class="text-gray-600 dark:text-gray-400">{{ contactInfo.hours }}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Map (Placeholder) -->
              <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div class="bg-gray-200 dark:bg-gray-700 h-64 w-full rounded-lg relative overflow-hidden">
                  <!-- W rzeczywistej implementacji należy umieścić tutaj rzeczywistą mapę (Google Maps, Leaflet itp.) -->
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div class="text-center">
                      <UIcon name="i-lucide-map" class="h-12 w-12 text-gray-400 dark:text-gray-500 mb-2" />
                      <p class="text-gray-500 dark:text-gray-400">Mapa lokalizacji</p>
                      <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">ul. Sportowa 123, 00-001 Warszawa</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Social Media -->
              <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Śledź nas</h3>
                <div class="flex gap-4">
                  <a href="#" class="bg-primary-100 dark:bg-primary-900/30 w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary-200 dark:hover:bg-primary-800/50 transition-colors">
                    <UIcon name="i-lucide-facebook" class="text-primary-600 dark:text-primary-400" />
                  </a>
                  <a href="#" class="bg-primary-100 dark:bg-primary-900/30 w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary-200 dark:hover:bg-primary-800/50 transition-colors">
                    <UIcon name="i-lucide-twitter" class="text-primary-600 dark:text-primary-400" />
                  </a>
                  <a href="#" class="bg-primary-100 dark:bg-primary-900/30 w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary-200 dark:hover:bg-primary-800/50 transition-colors">
                    <UIcon name="i-lucide-instagram" class="text-primary-600 dark:text-primary-400" />
                  </a>
                  <a href="#" class="bg-primary-100 dark:bg-primary-900/30 w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary-200 dark:hover:bg-primary-800/50 transition-colors">
                    <UIcon name="i-lucide-linkedin" class="text-primary-600 dark:text-primary-400" />
                  </a>
                  <a href="#" class="bg-primary-100 dark:bg-primary-900/30 w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary-200 dark:hover:bg-primary-800/50 transition-colors">
                    <UIcon name="i-lucide-youtube" class="text-primary-600 dark:text-primary-400" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- FAQ Section -->
      <section class="py-12 md:py-20 bg-gray-50 dark:bg-gray-800">
        <div class="container mx-auto px-4">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Często zadawane pytania</h2>
            <p class="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Poniżej znajdziesz odpowiedzi na najczęściej zadawane pytania. Jeśli nie znajdziesz odpowiedzi, skontaktuj się z nami.
            </p>
          </div>
          
          <div class="max-w-3xl mx-auto">
            <UCard class="mb-4" v-for="(faq, index) in faqs" :key="index">
              <div
                class="flex justify-between items-center cursor-pointer p-4"
                @click="toggleFaq(index)"
              >
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">{{ faq.question }}</h3>
                <UIcon
                  :name="faq.open ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
                  class="h-5 w-5 text-gray-500 dark:text-gray-400"
                />
              </div>
              <div v-if="faq.open" class="px-4 pb-4 pt-0">
                <p class="text-gray-600 dark:text-gray-400">{{ faq.answer }}</p>
              </div>
            </UCard>
          </div>
        </div>
      </section>
      
      <!-- CTA Section -->
      <section class="py-12 md:py-20 bg-primary-900 dark:bg-gray-900">
        <div class="container mx-auto px-4 text-center">
          <h2 class="text-3xl font-bold text-white mb-6">Gotowy, aby rozpocząć?</h2>
          <p class="text-xl text-primary-200 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Dołącz do tysięcy trenerów i zawodników, którzy już korzystają z ATP System.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <UButton to="/auth/register" size="xl" color="neutral" variant="solid" icon="i-lucide-user-plus">
              Zarejestruj się za darmo
            </UButton>
            <UButton to="/pricing" size="xl" variant="outline" color="neutral" icon="i-lucide-info">
              Zobacz plany cenowe
            </UButton>
          </div>
        </div>
      </section>
    </div>
  </NuxtLayout>
</template>

<style scoped>
.contact-page section {
  position: relative;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.dark .map-placeholder {
  background-color: #1f2937;
}

.map-placeholder {
  animation: pulse 2s ease-in-out infinite;
}
</style>