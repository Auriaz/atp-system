<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Funkcje pomocnicze do animacji
onMounted(() => {
  if (process.client) {
    gsap.registerPlugin(ScrollTrigger)
    
    // Animacja hero section
    gsap.from('.hero-title', { 
      opacity: 0, 
      y: 50, 
      duration: 1, 
      ease: 'power3.out' 
    })
    
    gsap.from('.hero-description', { 
      opacity: 0, 
      y: 30, 
      duration: 1, 
      delay: 0.3, 
      ease: 'power3.out' 
    })
    
    gsap.from('.hero-cta', { 
      opacity: 0, 
      y: 20, 
      duration: 0.8, 
      delay: 0.6, 
      ease: 'power3.out' 
    })
    
    gsap.from('.hero-image', { 
      opacity: 0, 
      x: 50, 
      duration: 1.2, 
      delay: 0.3, 
      ease: 'power3.out' 
    })
    
    // Animacje features
    gsap.from('.feature-card', { 
      opacity: 0, 
      y: 50, 
      duration: 0.8, 
      stagger: 0.2, 
      scrollTrigger: {
        trigger: '.features-section',
        start: 'top 80%'
      }
    })
    
    // Animacje stats
    gsap.from('.stat-item', { 
      opacity: 0, 
      scale: 0.8, 
      duration: 0.6, 
      stagger: 0.15, 
      scrollTrigger: {
        trigger: '.stats-section',
        start: 'top 80%'
      }
    })
    
    // Animacje testimonials
    gsap.from('.testimonial', { 
      opacity: 0, 
      y: 40, 
      duration: 0.8, 
      scrollTrigger: {
        trigger: '.testimonials-section',
        start: 'top 80%'
      }
    })
  }
})

// Funkcja do animacji licznika
const animateCounter = (target: HTMLElement, end: number, duration: number) => {
  let startTime: number | null = null
  const startValue = 0
  
  function step(timestamp: number) {
    if (!startTime) startTime = timestamp
    
    const progress = Math.min((timestamp - startTime) / duration, 1)
    const currentValue = Math.floor(progress * (end - startValue) + startValue)
    
    target.textContent = currentValue.toString()
    
    if (progress < 1) {
      window.requestAnimationFrame(step)
    } else {
      target.textContent = end.toString()
    }
  }
  
  window.requestAnimationFrame(step)
}

// Funkcja do uruchomienia animacji liczników po dotarciu do sekcji
onMounted(() => {
  if (import.meta.client) {
    const observerOptions = {
      threshold: 0.5,
    }
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counterElements = document.querySelectorAll('.counter-value')
          counterElements.forEach(el => {
            const target = el as HTMLElement
            const value = parseInt(target.getAttribute('data-value') || '0')
            animateCounter(target, value, 2000)
          })
          observer.disconnect()
        }
      })
    }, observerOptions)
    
    const statsSection = document.querySelector('.stats-section')
    if (statsSection) {
      observer.observe(statsSection)
    }
  }
})

// Testimonials
const testimonials = [
  // {
  //   quote: "System ATP pomógł mi zoptymalizować treningi i znacząco poprawić wyniki mojej drużyny w ciągu zaledwie jednego sezonu.",
  //   author: "Marek Kowalski",
  //   position: "Główny trener, KS Olimpia",
  //   avatar: "/images/avatar-1.jpg"
  // },
  {
    quote: "ATP System to narzędzie, które pozwala mi skupić się na pracy z zawodnikami, a nie na zbieraniu i analizie danych treningowych.",
    author: "Anna Nowak",
    position: "Trener personalny",
    avatar: "/images/avatar-2.jpg"
  },
  // {
  //   quote: "Intuicyjny interfejs i zaawansowane możliwości analityczne czynią z ATP System niezastąpione narzędzie w codziennej pracy trenera.",
  //   author: "Piotr Wiśniewski",
  //   position: "Dyrektor sportowy, Akademia Sportowa",
  //   avatar: "/images/avatar-3.jpg"
  // }
]

// Features
const features = [
  {
    icon: 'i-lucide-bar-chart-2',
    title: 'Zaawansowana analityka',
    description: 'Szczegółowa analiza danych treningowych i wyników sportowych w czasie rzeczywistym.'
  },
  {
    icon: 'i-lucide-clipboard-list',
    title: 'Plany treningowe',
    description: 'Tworzenie i zarządzanie indywidualnymi planami treningowymi dla każdego zawodnika.'
  },
  {
    icon: 'i-lucide-users',
    title: 'Zarządzanie drużyną',
    description: 'Kompleksowe narzędzia do zarządzania zawodnikami, trenerami i personelem.'
  },
  {
    icon: 'i-lucide-calendar',
    title: 'Harmonogram treningów',
    description: 'Planowanie i koordynacja treningów, zawodów i innych wydarzeń sportowych.'
  },
  {
    icon: 'i-lucide-smartphone',
    title: 'Aplikacja mobilna',
    description: 'Pełna funkcjonalność systemu dostępna na urządzeniach mobilnych.'
  },
  {
    icon: 'i-lucide-activity',
    title: 'Monitoring zdrowia',
    description: 'Śledzenie stanu zdrowia, zmęczenia i regeneracji zawodników.'
  }
]
</script>

<template>
  <NuxtLayout>
    <div class="homepage">
      <!-- Hero section -->
      <section class="hero-section relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 dark:from-gray-900 dark:via-gray-800 dark:to-primary-900">
        <!-- Animated background elements -->
        <div class="absolute inset-0 overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-full">
            <div class="absolute top-10 left-10 w-64 h-64 bg-primary-500 dark:bg-primary-600 opacity-10 rounded-full filter blur-3xl transform-gpu animate-blob"></div>
            <div class="absolute bottom-10 right-10 w-80 h-80 bg-blue-500 dark:bg-blue-600 opacity-10 rounded-full filter blur-3xl transform-gpu animate-blob animation-delay-2000"></div>
            <div class="absolute top-1/2 left-1/3 w-72 h-72 bg-indigo-500 dark:bg-indigo-600 opacity-10 rounded-full filter blur-3xl transform-gpu animate-blob animation-delay-4000"></div>
          </div>
        </div>
        
        <div class="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div class="text-white space-y-8">
              <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight hero-title">
                Profesjonalny system <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-primary-300">treningowo-analityczny</span>
              </h1>
              
              <p class="text-xl md:text-2xl text-gray-200 dark:text-gray-300 hero-description">
                Zaawansowane narzędzie do kompleksowego zarządzania treningiem, analizy wyników i rozwoju zawodników.
              </p>
              
              <div class="flex flex-col sm:flex-row gap-4 hero-cta">
                <UButton
                  to="/auth/register"
                  size="xl"
                  color="primary"
                  variant="solid"
                  icon="i-lucide-user-plus"
                >
                  Rozpocznij za darmo
                </UButton>
                
                <UButton
                  to="#features"
                  size="xl"
                  variant="ghost"
                  color="primary"
                  icon="i-lucide-info"
                >
                  Dowiedz się więcej
                </UButton>
              </div>
            </div>
            
            <div class="relative hero-image">
              <img 
                src="/images/dashboard-preview.webp" 
                alt="ATP System Dashboard Preview" 
                class="w-full h-auto rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
              />
              <div class="absolute -bottom-4 -right-4 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-lg">
                <div class="flex items-center space-x-2">
                  <UIcon name="i-lucide-trending-up" class="text-green-500 text-xl" />
                  <span class="font-bold text-gray-900 dark:text-white">+27% lepsze wyniki</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Wave separator -->
        <div class="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg class="relative block w-full h-16 sm:h-24" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.11,141.39,111.56,219.35,94.19Z" class="fill-white dark:fill-gray-900"></path>
          </svg>
        </div>
      </section>
  
      <!-- Trusted by section -->
      <section class="py-12 bg-white dark:bg-gray-900">
        <div class="container mx-auto px-4">
          <h2 class="text-center text-lg text-gray-600 dark:text-gray-400 mb-8">Zaufały nam kluby</h2>
          
          <div class="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            <!-- Partner logos 
              <img src="/images/logo-1.webp" alt="Partner logo" class="h-8 md:h-10 opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0" />
              <img src="/images/logo-2.webp" alt="Partner logo" class="h-8 md:h-10 opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0" />
              <img src="/images/logo-3.webp" alt="Partner logo" class="h-8 md:h-10 opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0" />
              <img src="/images/logo-4.webp" alt="Partner logo" class="h-8 md:h-10 opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0" />
              <img src="/images/logo-5.webp" alt="Partner logo" class="h-8 md:h-10 opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0" />
            -->
          </div>
        </div>
      </section>
  
      <!-- Features section -->
      <section id="features" class="py-20 bg-gray-50 dark:bg-gray-800 features-section">
        <div class="container mx-auto px-4">
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Funkcje systemu</h2>
            <p class="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              ATP System oferuje kompleksowe narzędzia dla trenerów, zawodników i organizacji sportowych.
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div v-for="(feature, index) in features" :key="index" class="feature-card bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div class="bg-primary-100 dark:bg-primary-900/30 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                <UIcon :name="feature.icon" class="text-primary-600 dark:text-primary-400 text-2xl" />
              </div>
              
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">{{ feature.title }}</h3>
              <p class="text-gray-600 dark:text-gray-400">{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </section>
  
      <!-- How it works -->
      <section class="py-20 bg-white dark:bg-gray-900">
        <div class="container mx-auto px-4">
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Jak to działa</h2>
            <p class="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Prosty proces wdrożenia i korzystania z systemu
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="text-center p-6 relative">

              <div class="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl font-bold text-primary-600 dark:text-primary-400">1</span>
              </div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Utwórz konto</h3>
              <p class="text-gray-600 dark:text-gray-400">Zarejestruj się i skonfiguruj swój profil trenera, zawodnika lub organizacji.</p>
            </div>
            
            <div class="text-center p-6 relative">
        
              <div class="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl font-bold text-primary-600 dark:text-primary-400">2</span>
              </div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Wprowadź dane</h3>
              <p class="text-gray-600 dark:text-gray-400">Dodaj zawodników, drużyny i rozpocznij wprowadzanie danych treningowych.</p>
            </div>
            
            <div class="text-center p-6 relative">
 
              <div class="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl font-bold text-primary-600 dark:text-primary-400 z-10">3</span>
              </div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Analizuj i optymalizuj</h3>
              <p class="text-gray-600 dark:text-gray-400">Korzystaj z zaawansowanych analiz, aby optymalizować treningi i poprawiać wyniki.</p>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Stats section -->
      <section class="py-20 bg-primary-900 dark:bg-gray-800 stats-section">
        <div class="container mx-auto px-4">
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">ATP System w liczbach</h2>
            <p class="text-xl text-primary-200 dark:text-gray-300 max-w-3xl mx-auto">
              Skuteczność potwierdzona przez naszych klientów
            </p>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div class="bg-white/10 dark:bg-gray-900/40 p-6 rounded-xl text-center stat-item">
              <span class="counter-value text-4xl font-bold text-white" data-value="0">0</span>
              <span class="text-4xl font-bold text-white">+</span>
              <p class="text-primary-200 dark:text-gray-300 mt-2">Aktywnych użytkowników</p>
            </div>
            
            <div class="bg-white/10 dark:bg-gray-900/40 p-6 rounded-xl text-center stat-item">
              <span class="counter-value text-4xl font-bold text-white" data-value="0">0</span>
              <span class="text-4xl font-bold text-white">+</span>
              <p class="text-primary-200 dark:text-gray-300 mt-2">Klubów sportowych</p>
            </div>
            
            <div class="bg-white/10 dark:bg-gray-900/40 p-6 rounded-xl text-center stat-item">
              <span class="counter-value text-4xl font-bold text-white" data-value="0">0</span>
              <span class="text-4xl font-bold text-white">%</span>
              <p class="text-primary-200 dark:text-gray-300 mt-2">Średni wzrost wydajności</p>
            </div>
            
            <div class="bg-white/10 dark:bg-gray-900/40 p-6 rounded-xl text-center stat-item">
              <span class="counter-value text-4xl font-bold text-white" data-value="0">0</span>
              <span class="text-4xl font-bold text-white">%</span>
              <p class="text-primary-200 dark:text-gray-300 mt-2">Zadowolonych klientów</p>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Testimonials section -->
      <section class="py-20 bg-gray-50 dark:bg-gray-900 testimonials-section">
        <div class="container mx-auto px-4">
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Co mówią nasi klienci</h2>
            <p class="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Opinie osób korzystających z systemu ATP
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div v-for="(testimonial, index) in testimonials" :key="index" class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg testimonial">
              <div class="flex items-center mb-4">
                <UAvatar :src="testimonial.avatar" alt="User avatar" size="lg" />
                <div class="ml-4">
                  <h3 class="font-bold text-gray-900 dark:text-white">{{ testimonial.author }}</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ testimonial.position }}</p>
                </div>
              </div>
              
              <div class="mb-4">
                <UIcon name="i-lucide-quote" class="text-primary-300 dark:text-primary-600 text-3xl" />
              </div>
              
              <p class="text-gray-700 dark:text-gray-300 italic">{{ testimonial.quote }}</p>
            </div>
          </div>
        </div>
      </section>
  
      <!-- CTA section -->
      <section class="py-20 bg-gradient-to-br from-primary-800 to-primary-900 dark:from-gray-900 dark:to-primary-900">
        <div class="container mx-auto px-4 text-center">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">Gotowy, aby zrewolucjonizować swój trening?</h2>
          <p class="text-xl text-primary-200 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Dołącz do tysięcy trenerów i zawodników, którzy już korzystają z ATP System.
          </p>
          
          <div class="flex flex-col sm:flex-row justify-center gap-4">
            <UButton
              to="/auth/register"
              size="xl"
              color="primary"
              variant="solid"
              icon="i-lucide-user-plus"
            >
              Rozpocznij za darmo
            </UButton>
            
            <UButton
              to="/contact"
              size="xl"
              variant="outline"
              color="primary"
              icon="i-lucide-mail"
            >
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

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}
</style>
