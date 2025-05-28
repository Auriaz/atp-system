<script setup lang="ts">
// SEO Meta
useSeoMeta({
  title: 'O nas - ATP System',
  description: 'Poznaj historię ATP System, nasz zespół i misję rewolucjonizowania treningu sportowego poprzez zaawansowane analizy i technologie.',
  ogTitle: 'O nas - ATP System',
  ogDescription: 'Zespół pasjonatów sportu i technologii, który tworzy przyszłość treningu sportowego.',
  ogImage: '/images/about-og.jpg',
  twitterCard: 'summary_large_image'
})

// Dane zespołu
const teamMembers = [
  {
    name: 'GitHub Copilot',
    position: 'Główny Architekt & Developer',
    bio: 'AI asystent programistyczny odpowiedzialny za pełną architekturę i implementację systemu ATP. Specjalizuje się w Vue.js, Nuxt 3, TypeScript i nowoczesnych technologiach webowych.',
    image: null,
    social: {
      github: 'https://github.com/features/copilot',
      linkedin: '#'
    }
  },
  {
    name: 'Community Contributors',
    position: 'Zespół Open Source',
    bio: 'Społeczność deweloperów i entuzjastów sportu współtworzących platformę ATP System. Każdy może wnieść swój wkład w rozwój projektu.',
    image: null,
    social: {
      github: '#',
      twitter: '#'
    }
  },
  {
    name: 'Sports Experts',
    position: 'Konsultanci Sportowi',
    bio: 'Grupa ekspertów z dziedziny sportu i treningu, którzy konsultują funkcjonalności systemu i zapewniają zgodność z najlepszymi praktykami.',
    image: null,
    social: {
      linkedin: '#'
    }
  },
  {
    name: 'Tech Community',
    position: 'Społeczność Techniczna',
    bio: 'Grupa programistów, testerów i użytkowników, którzy aktywnie uczestniczą w testowaniu, zgłaszaniu błędów i proponowaniu nowych funkcji.',
    image: null,
    social: {
      github: '#',
      twitter: '#'
    }
  }
]

// Kamienie milowe firmy
const milestones = [
  {
    year: '2025',
    title: 'Początek Projektu',
    description: 'Rozpoczęcie prac nad demonstracyjną platformą ATP System wykorzystującą Nuxt 3, Vue.js i nowoczesne technologie webowe.'
  },
  {
    year: '2025',
    title: 'Architektura Systemu',
    description: 'Zaprojektowanie kompletnej architektury aplikacji z autoryzacją JWT, zarządzaniem sesjami i systemem uprawnień.'
  },
  {
    year: '2025',
    title: 'Interfejs Użytkownika',
    description: 'Stworzenie responsywnego interfejsu z dark mode, komponentami UI i optymalizacją dla urządzeń mobilnych.'
  },
  {
    year: '2025',
    title: 'Funkcje Biznesowe',
    description: 'Implementacja kluczowych funkcji: zarządzanie zawodnikami, plany treningowe, analizy wydajności i raportowanie.'
  },
  {
    year: '2025',
    title: 'Dokumentacja i Testy',
    description: 'Opracowanie komprehensywnej dokumentacji, testów jednostkowych, integracyjnych i end-to-end.'
  },
  {
    year: '2025',
    title: 'Prezentacja Demonstracyjna',
    description: 'Ukończenie projektu demonstracyjnego pokazującego pełne możliwości nowoczesnej platformy treningowej.'
  }
]

// Wartości firmy
const values = [
  {
    title: 'Innowacyjność',
    description: 'Nieustannie poszukujemy nowych rozwiązań technologicznych, które mogą zrewolucjonizować sposób treningu i analizy wydajności sportowej.',
    icon: 'i-lucide-lightbulb'
  },
  {
    title: 'Precyzja',
    description: 'Dbamy o najwyższą dokładność danych i analiz, które stanowią fundament skutecznych decyzji treningowych i rozwoju zawodników.',
    icon: 'i-lucide-target'
  },
  {
    title: 'Współpraca',
    description: 'Wierzymy w siłę partnerstwa między trenerami, zawodnikami i technologią. Wspólnie osiągamy lepsze wyniki niż pojedynczo.',
    icon: 'i-lucide-users'
  },
  {
    title: 'Ciągły Rozwój',
    description: 'Dostosowujemy nasze rozwiązania do zmieniających się potrzeb sportu, ucząc się od naszych użytkowników i najnowszych badań.',
    icon: 'i-lucide-trending-up'
  }
]

// Statystyki
const stats = [
  { value: '1 projekt', label: 'Demonstracyjna aplikacja' },
  { value: '100+', label: 'Plików kodu źródłowego' },
  { value: '50+', label: 'Komponentów Vue' },
  { value: '5 języków', label: 'Technologii wykorzystanych' }
]

// Partnerzy i klienci
const partners = [
  { name: 'Vue.js', logo: null },
  { name: 'Nuxt 3', logo: null },
  { name: 'TypeScript', logo: null },
  { name: 'Tailwind CSS', logo: null },
  { name: 'Nuxt UI', logo: null },
  { name: 'GitHub Copilot', logo: null }
]

// Dane do sekcji "Nasz proces"
const process = [
  {
    title: 'Analiza Wymagań',
    description: 'Szczegółowa analiza potrzeb platformy treningowej, badanie najlepszych praktyk w branży sportowej i planowanie architektury systemu.',
    icon: 'i-lucide-search'
  },
  {
    title: 'Implementacja Backend',
    description: 'Stworzenie solidnego backendu z autoryzacją JWT, zarządzaniem bazą danych, API endpoints i systemem uprawnień użytkowników.',
    icon: 'i-lucide-server'
  },
  {
    title: 'Interfejs Użytkownika',
    description: 'Projektowanie i implementacja responsywnego interfejsu z wykorzystaniem Vue.js, Nuxt UI i Tailwind CSS z obsługą dark mode.',
    icon: 'i-lucide-monitor'
  },
  {
    title: 'Testowanie i Optymalizacja',
    description: 'Kompleksowe testowanie funkcjonalności, optymalizacja wydajności, zapewnienie bezpieczeństwa i przygotowanie dokumentacji.',
    icon: 'i-lucide-settings'
  }
]

// Funkcja do generowania inicjałów
const getInitials = (name: string): string => {
  return name.split(' ').map(n => n[0]).join('')
}

// Randomowy kolor tła dla awatarów
const getRandomBackground = (name: string) => {
  const colors = ['primary', 'info', 'success', 'warning']
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[hash % colors.length]
}
</script>

<template>  <NuxtLayout name="default">
    <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <!-- Hero Section -->
      <section class="relative pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-24 overflow-hidden">
        <!-- Background Elements -->
        <div class="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-pink-600/5 dark:from-blue-400/10 dark:via-purple-400/10 dark:to-pink-400/10"></div>
        
        <!-- Animated Background Shapes -->
        <div class="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div class="absolute top-0 right-0 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-delayed"></div>
        
        <div class="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div class="max-w-4xl mx-auto">            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Nasz 
              <span class="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Projekt
              </span>
            </h1>
            
            <p class="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Demonstracyjna platforma zarządzania treningiem sportowym, stworzona z wykorzystaniem najnowszych 
              technologii webowych, pokazująca możliwości nowoczesnych rozwiązań w aplikacjach biznesowych.
            </p>
            
            <!-- Mission Points -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <UIcon name="i-lucide-target" class="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Precyzja</h3>
                <p class="text-gray-600 dark:text-gray-300 text-sm">Dostarczamy najdokładniejsze dane treningowe</p>
              </div>
              <div class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <UIcon name="i-lucide-zap" class="w-12 h-12 text-purple-500 mx-auto mb-4" />
                <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Innowacja</h3>
                <p class="text-gray-600 dark:text-gray-300 text-sm">Wykorzystujemy najnowsze technologie AI</p>
              </div>
              <div class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <UIcon name="i-lucide-heart" class="w-12 h-12 text-pink-500 mx-auto mb-4" />
                <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Pasja</h3>
                <p class="text-gray-600 dark:text-gray-300 text-sm">Tworzone przez sportowców dla sportowców</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Our Story Section -->
      <section class="py-20 bg-white dark:bg-gray-900">
        <div class="container mx-auto px-4">
          <div class="max-w-4xl mx-auto">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white text-center mb-6">Nasza historia</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-12">
              <div>                <div class="prose prose-lg dark:prose-invert max-w-none">
                  <p>
                    ATP System to demonstracyjny projekt platformy zarządzania treningiem sportowym, stworzony w celu prezentacji nowoczesnych technologii webowych w kontekście aplikacji biznesowych.
                  </p>
                  <p>
                    Projekt wykorzystuje najnowsze rozwiązania technologiczne: Nuxt 3 jako framework full-stack, Vue.js 3 z Composition API, TypeScript dla type safety, Tailwind CSS do stylizacji oraz Nuxt UI jako system komponentów.
                  </p>
                  <p>
                    Celem tego projektu jest zademonstrowanie, jak nowoczesne technologie mogą być wykorzystane do stworzenia kompleksowej aplikacji biznesowej z uwzględnieniem autoryzacji, zarządzania danymi, responsywnego designu i najlepszych praktyk programistycznych.
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
        <div class="container mx-auto px-4">          <div class="text-center max-w-3xl mx-auto mb-12">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">Zespół projektowy</h2>
            <p class="text-xl text-gray-600 dark:text-gray-400">
              Poznaj twórców stojących za projektem ATP System. Łączymy ekspertyzę technologiczną z pasją do tworzenia nowoczesnych rozwiązań.
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
                      fallback: `bg-${getRandomBackground(member.name)}-100 dark:bg-${getRandomBackground(member.name)}-900/30 text-${getRandomBackground(member.name)}-700 dark:text-${getRandomBackground(member.name)}-300 text-4xl`
                    }"
                  />
                </div>
              </div>
              <div class="p-6">
                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-1">{{ member.name }}</h3>
                <p class="text-primary-600 dark:text-primary-400 mb-4">{{ member.position }}</p>
                <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">{{ member.bio }}</p>                <div class="flex gap-3">
                  <a v-if="member.social.linkedin" href="#" class="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                    <UIcon name="i-lucide-linkedin" class="w-5 h-5" />
                  </a>
                  <a v-if="member.social.twitter" href="#" class="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                    <UIcon name="i-lucide-twitter" class="w-5 h-5" />
                  </a>
                  <a v-if="member.social.github" href="#" class="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                    <UIcon name="i-lucide-github" class="w-5 h-5" />
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
        <div class="container mx-auto px-4">          <div class="text-center max-w-3xl mx-auto mb-12">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">Wykorzystane technologie</h2>
            <p class="text-xl text-gray-600 dark:text-gray-400">
              Projekt ATP System został stworzony z wykorzystaniem najnowszych i najlepszych technologii webowych.
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
          <h2 class="text-3xl font-bold text-white mb-6">Zainteresowany projektem?</h2>
          <p class="text-xl text-primary-200 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Poznaj możliwości platformy ATP System i odkryj, jak nowoczesne technologie mogą wspierać zarządzanie treningiem sportowym.
          </p>
          
          <div class="flex flex-col sm:flex-row justify-center gap-4">
            <UButton to="/features" size="xl" color="neutral" variant="solid" icon="i-lucide-star">
              Zobacz funkcje
            </UButton>
            <UButton to="/contact" size="xl" variant="outline" color="neutral" icon="i-lucide-mail">
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