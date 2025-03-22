<script lang="ts" setup>
// Dane zespołu
const teamMembers = [
  {
    name: 'Marcin Kowalski',
    position: 'Założyciel & CEO',
    bio: 'Były trener olimpijski z ponad 15-letnim doświadczeniem. Stworzył ATP System, aby zrewolucjonizować podejście do treningu sportowego.',
    image: null, // Placeholder do zastąpienia rzeczywistym obrazem
    social: {
      linkedin: '#',
      twitter: '#'
    }
  },
  {
    name: 'Anna Nowak',
    position: 'Dyrektor ds. Rozwoju',
    bio: 'Specjalistka w dziedzinie analizy danych sportowych z doświadczeniem w pracy z najlepszymi klubami w kraju.',
    image: null,
    social: {
      linkedin: '#',
      twitter: '#'
    }
  },
  {
    name: 'Piotr Wiśniewski',
    position: 'Główny Architekt Systemu',
    bio: 'Inżynier oprogramowania z pasją do sportu. Odpowiada za technologiczną stronę ATP System od początku istnienia firmy.',
    image: null,
    social: {
      linkedin: '#',
      github: '#'
    }
  },
  {
    name: 'Katarzyna Dąbrowska',
    position: 'Specjalista ds. UX/UI',
    bio: 'Projektantka z doświadczeniem w tworzeniu intuicyjnych interfejsów dla złożonych systemów, zorientowana na potrzeby użytkownika.',
    image: null,
    social: {
      linkedin: '#',
      dribbble: '#'
    }
  }
]

// Kamienie milowe firmy
const milestones = [
  {
    year: '2018',
    title: 'Początek',
    description: 'Powstanie koncepcji ATP System jako odpowiedź na problemy nowoczesnego treningu.'
  },
  {
    year: '2019',
    title: 'Narodziny produktu',
    description: 'Pierwsza wersja beta systemu udostępniona wybranym klubom sportowym do testów.'
  },
  {
    year: '2020',
    title: 'Oficjalny start',
    description: 'Oficjalne uruchomienie platformy i pozyskanie pierwszych 50 klientów.'
  },
  {
    year: '2022',
    title: 'Ekspansja międzynarodowa',
    description: 'Rozszerzenie działalności na rynki europejskie, ponad 500 klubów korzystających z systemu.'
  },
  {
    year: '2024',
    title: 'Nowa wersja',
    description: 'Wprowadzenie rewolucyjnych funkcji analitycznych opartych na sztucznej inteligencji.'
  }
]

// Wartości firmy
const values = [
  {
    title: 'Innowacyjność',
    description: 'Nieustannie poszukujemy nowych rozwiązań i technologii, które mogą poprawić efektywność treningu sportowego.',
    icon: 'i-lucide-lightbulb'
  },
  {
    title: 'Dokładność',
    description: 'Dbamy o precyzję danych i analiz, które są fundamentem skutecznego treningu i rozwoju zawodników.',
    icon: 'i-lucide-check-circle'
  },
  {
    title: 'Współpraca',
    description: 'Wierzymy, że najlepsze wyniki osiąga się poprzez bliską współpracę między trenerami, zawodnikami i technologią.',
    icon: 'i-lucide-users'
  },
  {
    title: 'Adaptacja',
    description: 'Dostosowujemy nasze rozwiązania do zmieniających się potrzeb i wyzwań współczesnego sportu.',
    icon: 'i-lucide-refresh-cw'
  }
]

// Statystyki
const stats = [
  { value: '1000+', label: 'Klubów sportowych' },
  { value: '15 000+', label: 'Aktywnych użytkowników' },
  { value: '30+', label: 'Krajów' },
  { value: '98%', label: 'Zadowolonych klientów' }
]

// Partnerzy i klienci (logo placeholders)
const partners = [
  { name: 'Olympic Association', logo: null },
  { name: 'National Sports Academy', logo: null },
  { name: 'Pro Athletics', logo: null },
  { name: 'Sports University', logo: null },
  { name: 'Champions League', logo: null },
  { name: 'Athletic Federation', logo: null }
]

// Dane do sekcji "Nasz proces"
const process = [
  {
    title: 'Analiza',
    description: 'Identyfikujemy potrzeby i wymagania klienta, aby dostosować system do jego specyficznych potrzeb.',
    icon: 'i-lucide-search'
  },
  {
    title: 'Wdrożenie',
    description: 'Szkolimy zespół i integrujemy ATP System z istniejącymi procesami treningowymi.',
    icon: 'i-lucide-upload'
  },
  {
    title: 'Monitoring',
    description: 'Zapewniamy ciągłe wsparcie i monitorowanie wyników, aby zagwarantować maksymalną efektywność.',
    icon: 'i-lucide-bar-chart-2'
  },
  {
    title: 'Optymalizacja',
    description: 'Nieustannie ulepszamy system na podstawie danych i informacji zwrotnych od użytkowników.',
    icon: 'i-lucide-settings'
  }
]

// Funkcja do generowania inicjałów
const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('')
}

// Randomowy kolor tła dla awatarów
const getRandomBackground = (name) => {
  const colors = ['primary', 'info', 'success', 'warning']
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[hash % colors.length]
}
</script>

<template>
  <NuxtLayout>
    <div class="about-page">
      <!-- Hero Section -->
      <section class="relative py-20 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 dark:from-gray-900 dark:via-gray-800 dark:to-primary-900 overflow-hidden">
        <!-- Animated background elements -->
        <div class="absolute inset-0 overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-full">
            <div class="absolute top-10 left-10 w-64 h-64 bg-primary-500 dark:bg-primary-600 opacity-10 rounded-full filter blur-3xl transform-gpu animate-blob"></div>
            <div class="absolute bottom-10 right-10 w-80 h-80 bg-blue-500 dark:bg-blue-600 opacity-10 rounded-full filter blur-3xl transform-gpu animate-blob animation-delay-2000"></div>
            <div class="absolute top-1/2 left-1/3 w-72 h-72 bg-indigo-500 dark:bg-indigo-600 opacity-10 rounded-full filter blur-3xl transform-gpu animate-blob animation-delay-4000"></div>
          </div>
        </div>
        
        <div class="container mx-auto px-4 relative z-10">
          <div class="text-center text-white max-w-3xl mx-auto">
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Nasza misja</h1>
            <p class="text-xl md:text-2xl text-primary-200 dark:text-gray-300 leading-relaxed">
              Rewolucjonizujemy świat treningu sportowego poprzez dostarczanie zaawansowanych narzędzi analitycznych, które pomagają trenerom i zawodnikom osiągać maksymalne wyniki.
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
      
      <!-- Our Story Section -->
      <section class="py-20 bg-white dark:bg-gray-900">
        <div class="container mx-auto px-4">
          <div class="max-w-4xl mx-auto">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white text-center mb-6">Nasza historia</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-12">
              <div>
                <div class="prose prose-lg dark:prose-invert max-w-none">
                  <p>
                    ATP System narodził się z pasji do sportu i technologii. Nasz założyciel, Marcin Kowalski, były trener olimpijski, dostrzegł lukę między zaawansowanymi technikami treningowymi a narzędziami do ich analizy i optymalizacji.
                  </p>
                  <p>
                    W 2018 roku, wraz z zespołem ekspertów z dziedziny sportu, analizy danych i technologii, rozpoczęliśmy prace nad systemem, który nie tylko gromadzi dane treningowe, ale także przekształca je w praktyczne wskazówki dla trenerów i zawodników.
                  </p>
                  <p>
                    Dziś ATP System jest wykorzystywany przez ponad 1000 klubów sportowych w 30 krajach, pomagając trenerom podnosić wydajność zawodników i zespołów poprzez precyzyjną analizę danych treningowych i personalizację planów treningowych.
                  </p>
                </div>
              </div>
              
              <div class="bg-gray-100 dark:bg-gray-800 rounded-xl p-8 shadow-lg">
                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-6">Nasza droga</h3>
                <div class="space-y-10">
                  <div v-for="(milestone, index) in milestones" :key="index" class="relative pl-8 pb-6 border-l-2 border-primary-200 dark:border-primary-800 last:border-0 last:pb-0">
                    <div class="absolute top-0 left-0 mt-1.5 -ml-3.5 w-6 h-6 rounded-full bg-primary-500 dark:bg-primary-400 shadow-md"></div>
                    <div class="bg-white dark:bg-gray-700 shadow-sm rounded-lg p-4">
                      <div class="text-primary-600 dark:text-primary-400 font-bold text-lg mb-1">{{ milestone.year }}</div>
                      <h4 class="font-semibold text-gray-900 dark:text-white mb-2">{{ milestone.title }}</h4>
                      <p class="text-gray-600 dark:text-gray-400 text-sm">{{ milestone.description }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Our Values Section -->
      <section class="py-20 bg-gray-50 dark:bg-gray-800">
        <div class="container mx-auto px-4">
          <div class="text-center max-w-3xl mx-auto mb-12">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">Nasze wartości</h2>
            <p class="text-xl text-gray-600 dark:text-gray-400">
              Wartości, które kierują naszymi działaniami i decyzjami każdego dnia.
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div v-for="(value, index) in values" :key="index" class="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 transition-transform duration-300 hover:translate-y-[-5px]">
              <div class="bg-primary-100 dark:bg-primary-900/30 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                <UIcon :name="value.icon" class="text-primary-600 dark:text-primary-400 text-2xl" />
              </div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white text-center mb-3">{{ value.title }}</h3>
              <p class="text-gray-600 dark:text-gray-400 text-center">{{ value.description }}</p>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Stats Section -->
      <section class="py-20 bg-primary-900 dark:bg-gray-900">
        <div class="container mx-auto px-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div v-for="(stat, index) in stats" :key="index" class="text-center">
              <div class="text-4xl md:text-5xl font-bold text-white mb-2">{{ stat.value }}</div>
              <div class="text-primary-200 dark:text-gray-400 text-lg">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Our Team Section -->
      <section class="py-20 bg-white dark:bg-gray-900">
        <div class="container mx-auto px-4">
          <div class="text-center max-w-3xl mx-auto mb-12">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">Nasz zespół</h2>
            <p class="text-xl text-gray-600 dark:text-gray-400">
              Poznaj pasjonatów stojących za sukcesem ATP System. Łączymy ekspertyzę sportową z technologiczną innowacją.
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div v-for="(member, index) in teamMembers" :key="index" class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
              <div class="relative pt-[100%] bg-gray-100 dark:bg-gray-700">
                <!-- Avatar z inicjałami, do zastąpienia rzeczywistymi zdjęciami -->
                <div class="absolute inset-0 flex items-center justify-center">
                  <UAvatar
                    size="xl"
                    :text="getInitials(member.name)"
                    :ui="{
                      background: `bg-${getRandomBackground(member.name)}-100 dark:bg-${getRandomBackground(member.name)}-900/30`,
                      text: `text-${getRandomBackground(member.name)}-700 dark:text-${getRandomBackground(member.name)}-300 text-4xl`
                    }"
                  />
                </div>
              </div>
              <div class="p-6">
                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-1">{{ member.name }}</h3>
                <p class="text-primary-600 dark:text-primary-400 mb-4">{{ member.position }}</p>
                <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">{{ member.bio }}</p>
                <div class="flex gap-3">
                  <a v-if="member.social.linkedin" href="#" class="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                    <UIcon name="i-lucide-linkedin" class="w-5 h-5" />
                  </a>
                  <a v-if="member.social.twitter" href="#" class="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                    <UIcon name="i-lucide-twitter" class="w-5 h-5" />
                  </a>
                  <a v-if="member.social.github" href="#" class="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                    <UIcon name="i-lucide-github" class="w-5 h-5" />
                  </a>
                  <a v-if="member.social.dribbble" href="#" class="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                    <UIcon name="i-lucide-dribbble" class="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Our Process Section -->
      <section class="py-20 bg-gray-50 dark:bg-gray-800">
        <div class="container mx-auto px-4">
          <div class="text-center max-w-3xl mx-auto mb-12">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">Nasz proces</h2>
            <p class="text-xl text-gray-600 dark:text-gray-400">
              Współpraca z ATP System to proces zorientowany na osiąganie realnych wyników.
            </p>
          </div>
          
          <div class="max-w-5xl mx-auto">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div v-for="(step, index) in process" :key="index" class="relative">
                <div class="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 h-full z-10 relative">
                  <div class="bg-primary-100 dark:bg-primary-900/30 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                    <UIcon :name="step.icon" class="text-primary-600 dark:text-primary-400 text-2xl" />
                  </div>
                  <div class="absolute top-6 right-6 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold">
                    {{ index + 1 }}
                  </div>
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">{{ step.title }}</h3>
                  <p class="text-gray-600 dark:text-gray-400">{{ step.description }}</p>
                </div>
                
                <!-- Connector line -->
                <div v-if="index < process.length - 1" class="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-primary-300 dark:bg-primary-700 z-0"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Partners Section -->
      <section class="py-20 bg-white dark:bg-gray-900">
        <div class="container mx-auto px-4">
          <div class="text-center max-w-3xl mx-auto mb-12">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">Nasi partnerzy</h2>
            <p class="text-xl text-gray-600 dark:text-gray-400">
              Współpracujemy z najlepszymi organizacjami sportowymi na świecie.
            </p>
          </div>
          
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            <div v-for="(partner, index) in partners" :key="index" class="flex items-center justify-center h-24 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <!-- Placeholder dla logo -->
              <div class="text-center">
                <div class="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-2">
                  <UIcon name="i-lucide-briefcase" class="text-primary-600 dark:text-primary-400" />
                </div>
                <span class="text-xs font-medium text-gray-600 dark:text-gray-400">{{ partner.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- CTA Section -->
      <section class="py-20 bg-gradient-to-br from-primary-800 to-primary-900 dark:from-gray-900 dark:to-primary-900">
        <div class="container mx-auto px-4 text-center">
          <h2 class="text-3xl font-bold text-white mb-6">Dołącz do społeczności ATP System</h2>
          <p class="text-xl text-primary-200 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Rozpocznij współpracę z nami i odkryj, jak ATP System może zrewolucjonizować Twój trening.
          </p>
          
          <div class="flex flex-col sm:flex-row justify-center gap-4">
            <UButton to="/auth/register" size="xl" color="white" variant="solid" icon="i-lucide-user-plus">
              Zarejestruj się za darmo
            </UButton>
            <UButton to="/contact" size="xl" variant="outline" color="white" icon="i-lucide-mail">
              Skontaktuj się z nami
            </UButton>
          </div>
        </div>
      </section>
    </div>
  </NuxtLayout>
</template>

<style scoped>
.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

/* Smooth scroll */
html {
  scroll-behavior: smooth;
}
</style>