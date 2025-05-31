<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// SEO Meta
useSeoMeta({
  title: 'ATP System - Profesjonalna platforma treningowa',
  ogTitle: 'ATP System - Platforma dla trenerów personalnych',
  description: 'Nowoczesny system zarządzania treningiem, analizy wyników i rozwoju zawodników. Idealne rozwiązanie dla trenerów personalnych i klubów sportowych.',
  ogDescription: 'Zaawansowane narzędzia dla trenerów: plany treningowe, analityka, monitoring postępów i wiele więcej.',
  ogImage: '/images/atp-system-og.jpg',
  twitterCard: 'summary_large_image'
})

// Funkcje pomocnicze do animacji i paralaksy
onMounted(() => {
  if (import.meta.client) {
    gsap.registerPlugin(ScrollTrigger)
    
    // Stabilize hero section position immediately
    const heroSection = document.querySelector('.hero-section')
    if (heroSection) {
      gsap.set(heroSection, {
        position: 'relative',
        top: 0,
        left: 0,
        margin: 0,
        transform: 'translate3d(0, 0, 0)'
      })
    }
    
      // Video background setup
    const heroVideo = document.querySelector('.hero-video') as HTMLVideoElement
    if (heroVideo) {
      // Ensure video plays on mobile devices
      heroVideo.play().catch((e: Error) => console.log('Video autoplay prevented:', e.message))
      
      // Reduce video playback rate for smooth effect
      heroVideo.playbackRate = 0.75
    }
    
    // Zaawansowane animacje hero section
    const tl = gsap.timeline()
    
    tl.from('.hero-badge', { 
      opacity: 0, 
      scale: 0.8, 
      duration: 0.8, 
      ease: 'back.out(1.7)' 
    })
    .from('.hero-title', { 
      opacity: 0, 
      y: 80, 
      duration: 1.2, 
      ease: 'power4.out' 
    }, '-=0.3')
    .from('.hero-subtitle', { 
      opacity: 0, 
      y: 50, 
      duration: 1, 
      ease: 'power3.out' 
    }, '-=0.8')
    .from('.hero-description', { 
      opacity: 0, 
      y: 30, 
      duration: 0.8, 
      ease: 'power2.out' 
    }, '-=0.6')
    .from('.hero-cta-group', { 
      opacity: 0, 
      y: 40, 
      duration: 0.8, 
      ease: 'power2.out' 
    }, '-=0.4')
    .from('.hero-stats', { 
      opacity: 0, 
      y: 20, 
      duration: 0.6, 
      ease: 'power2.out' 
    }, '-=0.2')
      // Animacja floating elements - bez wpływu na layout
    gsap.set('.floating-card', { 
      position: 'absolute',
      willChange: 'transform'
    })
    
    gsap.from('.floating-card', { 
      opacity: 0, 
      scale: 0, 
      duration: 1, 
      stagger: 0.2, 
      ease: 'back.out(1.7)',
      delay: 1.5
    })
    
    // Continuous floating animation - tylko transform
    gsap.to('.floating-card', {
      y: '+=15',
      duration: 2,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1,
      stagger: 0.3,
      force3D: true // GPU acceleration
    })
      // Parallax scroll effect for video background
    gsap.to('.hero-video', {
      y: '0%',
      scale: 1.1,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    })
    
    // Parallax for video container
    gsap.to('.hero-bg-gradient', {
      y: '0%',
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.5
      }
    })
    
    // Advanced video parallax with transform
    ScrollTrigger.create({
      trigger: '.hero-section',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress
        const video = document.querySelector('.hero-video') as HTMLVideoElement
        if (video) {
          const yMovement = progress * 100 - 50
          const scaleValue = 1 + progress * 0.2
          video.style.transform = `translate(-50%, calc(-50% + ${yMovement}px)) scale(${scaleValue})`
        }
      }
    })
    
    // Advanced features animation
    gsap.from('.feature-card', { 
      opacity: 0, 
      y: 100, 
      duration: 1, 
      stagger: 0.15, 
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.features-section',
        start: 'top 85%'
      }
    })
    
    // Stats counter animation
    gsap.from('.stat-number', { 
      textContent: 0,
      duration: 2,
      ease: 'power2.out',
      snap: { textContent: 1 },
      stagger: 0.2,
      scrollTrigger: {
        trigger: '.stats-section',
        start: 'top 80%'
      }
    })
    
    // Services cards hover effect
    const serviceCards = document.querySelectorAll('.service-card')
    serviceCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, { scale: 1.05, duration: 0.3, ease: 'power2.out' })
        gsap.to(card.querySelector('.service-icon'), { rotate: 360, duration: 0.5 })
      })
      
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { scale: 1, duration: 0.3, ease: 'power2.out' })
      })
    })
    
    // Testimonials slider animation
    gsap.from('.testimonial-card', { 
      opacity: 0, 
      x: 100, 
      duration: 0.8, 
      stagger: 0.2,
      scrollTrigger: {
        trigger: '.testimonials-section',
        start: 'top 80%'
      }
    })
    
    // CTA section animation
    gsap.from('.cta-content', { 
      opacity: 0, 
      scale: 0.9, 
      duration: 1, 
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.cta-section',
        start: 'top 80%'
      }
    })
  }
})

// Enhanced data for professional trainer presentation
const heroStats = [
  { number: '500+', label: 'Zadowolonych klientów' },
  { number: '15+', label: 'Lat doświadczenia' },
  { number: '98%', label: 'Skuteczność planów' },
  { number: '24/7', label: 'Wsparcie online' }
]

const services = [
  {
    icon: 'i-lucide-target',
    title: 'Spersonalizowane plany treningowe',
    description: 'Indywidualne programy dostosowane do Twoich celów, możliwości i preferencji.',
    price: 'od 199 zł/miesiąc',
    features: ['Analiza potrzeb', 'Plan na 4 tygodnie', 'Modyfikacje na bieżąco', 'Wsparcie przez aplikację']
  },
  {
    icon: 'i-lucide-activity',
    title: 'Monitoring postępów',
    description: 'Zaawansowana analityka wyników i progress tracking w czasie rzeczywistym.',
    price: 'od 149 zł/miesiąc',
    features: ['Tracking wyników', 'Raporty tygodniowe', 'Analiza biomechaniki', 'Porady żywieniowe']
  },
  {
    icon: 'i-lucide-users',
    title: 'Treningi grupowe online',
    description: 'Profesjonalne sesje treningowe w małych grupach z pełną obsługą trenera.',
    price: 'od 89 zł/sesja',
    features: ['Maksymalnie 6 osób', 'Sesje na żywo', 'Spersonalizowana uwaga', 'Dostęp do nagrań']
  },
  {
    icon: 'i-lucide-brain',
    title: 'Konsultacje trenerskie',
    description: 'Profesjonalne doradztwo w zakresie treningu, diety i stylu życia.',
    price: 'od 120 zł/h',
    features: ['Analiza obecnej formy', 'Plan rozwoju', 'Wskazówki żywieniowe', 'Motywacja i wsparcie']
  }
]

// Features enhanced for trainer business
const features = [
  {
    icon: 'i-lucide-bar-chart-3',
    title: 'Zaawansowana analityka wyników',
    description: 'Szczegółowe raporty postępów, analiza trendów i predykcja rozwoju formy sportowej.',
    color: 'from-blue-500 to-blue-600'
  },
  {
    icon: 'i-lucide-clipboard-check',
    title: 'Inteligentne plany treningowe',
    description: 'AI-powered systemy tworzące spersonalizowane programy treningowe na podstawie Twoich celów.',
    color: 'from-green-500 to-green-600'
  },
  {
    icon: 'i-lucide-smartphone',
    title: 'Aplikacja mobilna Premium',
    description: 'Pełna funkcjonalność w kieszeni - treningi, komunikacja, progress tracking.',
    color: 'from-purple-500 to-purple-600'
  },
  {
    icon: 'i-lucide-heart-pulse',
    title: 'Monitoring zdrowia 24/7',
    description: 'Integracja z urządzeniami fitness, monitoring HR, analiza snu i regeneracji.',
    color: 'from-red-500 to-red-600'
  },
  {
    icon: 'i-lucide-video',
    title: 'Sesje treningowe online',
    description: 'Wysokiej jakości sesje wideo, screen sharing, replay i analiza techniki.',
    color: 'from-orange-500 to-orange-600'
  },
  {
    icon: 'i-lucide-trophy',
    title: 'System gamifikacji',
    description: 'Osiągnięcia, rankingi, wyzwania i nagrody motywujące do systematyczności.',
    color: 'from-yellow-500 to-yellow-600'
  }
]

// Testimonials from real clients
const testimonials = [
  {
    quote: "Dzięki ATP System zrzuciłem 25kg w 6 miesięcy i po raz pierwszy w życiu czuję się pewnie ze swoim ciałem. Trener Maciej ma niesamowite podejście!",
    author: "Anna Kowalska",
    position: "Klientka od 8 miesięcy",
    rating: 5,
    result: "-25kg w 6 miesięcy",
    avatar: "/user-placeholder.png"
  },
  {
    quote: "Jako busy mama myślałam, że nie znajdę czasu na trening. ATP System pokazał mi, że wystarczy 30 minut dziennie żeby osiągnąć spektakularne rezultaty.",
    author: "Magdalena Nowak",
    position: "Mama 2 dzieci, przedsiębiorczyni",
    rating: 5,
    result: "Forma życia po ciąży",
    avatar: "/user-placeholder.png"
  },
  {
    quote: "Po kontuzji kolan myślałem, że moja kariera sportowa się skończyła. Trener pomógł mi wrócić do formy i teraz jestem silniejszy niż kiedykolwiek.",
    author: "Tomasz Wiśniewski",
    position: "Zawodowy biegacz",
    rating: 5,
    result: "Powrót po kontuzji",
    avatar: "/user-placeholder.png"
  }
]

// Process steps for new clients
const processSteps = [
  {
    step: '01',
    title: 'Bezpłatna konsultacja',
    description: 'Poznajemy Twoje cele, analizujemy obecną formę i ustalamy plan działania.',
    icon: 'i-lucide-calendar-plus',
    duration: '30 min'
  },
  {
    step: '02', 
    title: 'Personalizacja programu',
    description: 'Tworzymy unikalny plan treningowy dopasowany do Twoich potrzeb i możliwości.',
    icon: 'i-lucide-settings',
    duration: '2-3 dni'
  },
  {
    step: '03',
    title: 'Start treningów',
    description: 'Rozpoczynamy regularne sesje z pełnym wsparciem i motywacją.',
    icon: 'i-lucide-play-circle',
    duration: 'Od zaraz'
  },
  {
    step: '04',
    title: 'Monitoring i optymalizacja',
    description: 'Śledzimy postępy i dostosowujemy program dla maksymalnej skuteczności.',
    icon: 'i-lucide-trending-up',
    duration: 'Ciągłe'
  }
]
</script>

<template>
  <NuxtLayout>
    <div class="homepage overflow-hidden">        <!-- Modern Hero Section -->      
        <section class="hero-section relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-gray-900 via-primary-900 to-gray-800" style="transform: translate3d(0,0,0); position: relative; top: 0; left: 0;">
        <!-- Video Background -->
        <div class="hero-bg-gradient absolute inset-0 z-0">          
          <!-- Background Video -->          
          <video 
            autoplay 
            muted 
            loop 
            playsinline
            preload="metadata"
            class="hero-video"
            style="display: block; font-size: 0; line-height: 0; margin: 0; padding: 0; border: none; outline: none;"
          >
            <source src="/videos/workout-hero.mp4" type="video/mp4">
            <!-- Fallback for browsers that don't support video -->
          </video>
          
          <!-- Video Overlay -->
          <div class="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-primary-900/70 to-gray-800/80"></div>
          <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        </div>
        
        <!-- Floating geometric shapes -->
        <div class="absolute inset-0 z-10 pointer-events-none">
          <div class="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-500 opacity-20 rounded-full filter blur-xl animate-pulse"></div>
          <div class="absolute top-40 right-20 w-48 h-48 bg-gradient-to-r from-green-400 to-blue-500 opacity-15 rounded-full filter blur-2xl animate-bounce" style="animation-duration: 3s;"></div>
          <div class="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-r from-purple-400 to-pink-500 opacity-20 rounded-full filter blur-xl animate-pulse" style="animation-delay: 1s;"></div>
        </div>        <div class="container mx-auto px-4 relative z-20">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <!-- Hero Content -->
            <div class="text-white space-y-8 max-w-2xl">
              <!-- Badge -->
              <div class="hero-badge inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-blue-500/30 rounded-full text-blue-200 text-sm font-medium">
                <UIcon name="i-lucide-star" class="mr-2 text-yellow-400" />
                #1 Platforma treningowa w Polsce
              </div>

              <!-- Main Heading -->
              <div class="space-y-4">
                <h1 class="hero-title text-5xl md:text-7xl font-bold leading-tight">
                  Twój <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">trener personalny</span>
                </h1>
                <p class="hero-subtitle text-xl md:text-2xl font-medium text-gray-300">
                  w erze cyfrowej transformacji
                </p>
              </div>

              <!-- Description -->
              <p class="hero-description text-lg md:text-xl text-gray-300 leading-relaxed max-w-xl">
                Profesjonalne wsparcie, spersonalizowane plany treningowe i monitoring postępów. 
                Osiągnij swoje cele fitness z najnowocześniejszą technologią.
              </p>

              <!-- CTA Group -->
              <div class="hero-cta-group flex flex-col sm:flex-row gap-4">
                <UButton
                  to="/auth/register"
                  size="xl"
                  class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  <UIcon name="i-lucide-rocket" class="mr-2" />
                  Zacznij bezpłatnie
                </UButton>
                
                <UButton
                  size="xl"
                  variant="outline"
                  class="border-2 border-gray-400 text-gray-300 hover:bg-white hover:text-gray-900 px-8 py-4 text-lg font-semibold transition-all duration-300"
                >
                  <UIcon name="i-lucide-play-circle" class="mr-2" />
                  Zobacz demo
                </UButton>
              </div>

              <!-- Hero Stats -->
              <div class="hero-stats grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
                <div v-for="(stat, index) in heroStats" :key="index" class="text-center">
                  <div class="text-2xl md:text-3xl font-bold text-white">{{ stat.number }}</div>
                  <div class="text-sm text-gray-400">{{ stat.label }}</div>
                </div>
              </div>
            </div>            <!-- Hero Visual -->
            <div class="relative">
              <!-- Main floating cards container - stabilized -->
              <div class="relative w-full h-96 md:h-[500px] overflow-hidden" style="transform: translate3d(0,0,0); position: relative; top: 0; left: 0;">                <!-- Training Plan Card -->
                <div class="floating-card absolute top-4 left-4 w-56 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl">
                  <div class="flex items-center mb-3">
                    <div class="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center mr-3">
                      <UIcon name="i-lucide-activity" class="text-white text-lg" />
                    </div>
                    <div>
                      <h3 class="text-white font-semibold text-sm">Plan treningowy</h3>
                      <p class="text-gray-300 text-xs">Dostosowany do Ciebie</p>
                    </div>
                  </div>
                  <div class="space-y-2">
                    <div class="flex justify-between text-xs">
                      <span class="text-gray-300">Postęp tygodniowy</span>
                      <span class="text-green-400 font-semibold">+12%</span>
                    </div>
                    <div class="w-full bg-gray-700 rounded-full h-2">
                      <div class="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full w-3/4"></div>
                    </div>
                  </div>
                </div>

                <!-- Progress Card -->
                <div class="floating-card absolute top-4 right-4 w-52 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl">
                  <h3 class="text-white font-semibold text-sm mb-3">Twoje osiągnięcia</h3>
                  <div class="space-y-2">
                    <div class="flex items-center">
                      <UIcon name="i-lucide-trophy" class="text-yellow-400 mr-2 text-sm" />
                      <span class="text-gray-300 text-xs">15 treningów ukończonych</span>
                    </div>
                    <div class="flex items-center">
                      <UIcon name="i-lucide-target" class="text-blue-400 mr-2 text-sm" />
                      <span class="text-gray-300 text-xs">Cel: -5kg osiągnięty!</span>
                    </div>
                    <div class="flex items-center">
                      <UIcon name="i-lucide-zap" class="text-purple-400 mr-2 text-sm" />
                      <span class="text-gray-300 text-xs">Streak: 7 dni</span>
                    </div>
                  </div>
                </div>

                <!-- Nutrition Card -->
                <div class="floating-card absolute top-32 right-8 w-54 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl">
                  <div class="flex items-center mb-3">
                    <div class="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl flex items-center justify-center mr-3">
                      <UIcon name="i-lucide-apple" class="text-white text-lg" />
                    </div>
                    <div>
                      <h3 class="text-white font-semibold text-sm">Plan żywieniowy</h3>
                      <p class="text-gray-300 text-xs">Kaloryczność: 2100 kcal</p>
                    </div>
                  </div>
                  <div class="space-y-1">
                    <div class="flex justify-between text-xs">
                      <span class="text-gray-300">Białko</span>
                      <span class="text-orange-400 font-semibold">140g</span>
                    </div>
                    <div class="flex justify-between text-xs">
                      <span class="text-gray-300">Węglowodany</span>
                      <span class="text-blue-400 font-semibold">200g</span>
                    </div>
                    <div class="flex justify-between text-xs">
                      <span class="text-gray-300">Tłuszcze</span>
                      <span class="text-green-400 font-semibold">80g</span>
                    </div>
                  </div>
                </div>

                <!-- Heart Rate Monitor Card -->
                <div class="floating-card absolute top-32 left-8 w-56 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl">
                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center">
                      <div class="w-10 h-10 bg-gradient-to-r from-red-400 to-pink-500 rounded-xl flex items-center justify-center mr-3">
                        <UIcon name="i-lucide-heart" class="text-white text-lg animate-pulse" />
                      </div>
                      <div>
                        <h4 class="text-white font-semibold text-sm">Tętno</h4>
                        <p class="text-gray-300 text-xs">Zone treningowa</p>
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="text-red-400 font-bold text-lg">142</div>
                      <div class="text-gray-400 text-xs">BPM</div>
                    </div>
                  </div>
                  <div class="w-full bg-gray-700 rounded-full h-2">
                    <div class="bg-gradient-to-r from-red-400 to-pink-500 h-2 rounded-full w-4/5 animate-pulse"></div>
                  </div>
                  <div class="text-center text-xs text-green-400 mt-2 font-medium">Strefa spalania tłuszczu</div>
                </div>

                <!-- Weekly Challenge Card -->
                <div class="floating-card absolute bottom-4 right-4 w-60 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl">
                  <div class="flex items-start justify-between mb-3">
                    <div class="flex items-center">
                      <div class="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mr-3">
                        <UIcon name="i-lucide-medal" class="text-white text-sm" />
                      </div>
                      <div>
                        <h4 class="text-white font-medium text-sm">Wyzwanie tygodnia</h4>
                        <p class="text-gray-300 text-xs">5/7 dni ukończonych</p>
                      </div>
                    </div>
                    <div class="text-yellow-400 text-xl">🔥</div>
                  </div>
                  <div class="w-full bg-gray-700 rounded-full h-2 mb-2">
                    <div class="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full w-5/7"></div>
                  </div>
                  <div class="flex justify-between text-xs">
                    <span class="text-gray-300">Postęp</span>
                    <span class="text-yellow-400 font-semibold">71%</span>
                  </div>
                </div>

                <!-- Notification Card -->
                <div class="floating-card absolute bottom-4 left-4 w-64 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl">
                  <div class="flex items-start">
                    <div class="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <UIcon name="i-lucide-bell" class="text-white text-sm" />
                    </div>
                    <div>
                      <h4 class="text-white font-medium text-sm">Przypomnienie</h4>
                      <p class="text-gray-300 text-xs">Czas na trening nóg! 💪 Rozpocznij za 15 minut.</p>
                      <button class="text-blue-400 text-xs mt-1 hover:text-blue-300">Przejdź do treningu →</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Scroll indicator -->
        <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <UIcon name="i-lucide-chevron-down" class="text-white text-2xl opacity-60" />
        </div>
      </section>

      <!-- Services/Pricing Section -->
      <section class="py-20 bg-gray-50 dark:bg-gray-900">
        <div class="container mx-auto px-4">
          <div class="text-center mb-16">
            <h2 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Usługi <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">premium</span>
            </h2>
            <p class="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Profesjonalne podejście do treningu personalnego z wykorzystaniem najnowszych technologii
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div v-for="(service, index) in services" :key="index" class="service-card group">
              <div class="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 h-full border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700">
                <!-- Icon -->
                <div class="service-icon w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <UIcon :name="service.icon" class="text-white text-2xl" />
                </div>
                
                <!-- Content -->
                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">{{ service.title }}</h3>
                <p class="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{{ service.description }}</p>
                
                <!-- Price -->
                <div class="mb-6">
                  <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ service.price }}</div>
                </div>
                
                <!-- Features -->
                <ul class="space-y-2 mb-8">
                  <li v-for="feature in service.features" :key="feature" class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <UIcon name="i-lucide-check" class="text-green-500 mr-2 flex-shrink-0" />
                    {{ feature }}
                  </li>
                </ul>
                
                <!-- CTA -->
                <UButton 
                  block 
                  variant="outline"
                  color="primary"
                  class="group-hover:bg-blue-600 group-hover:text-white transition-all duration-300"
                >
                  Wybierz plan
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Process Steps -->
      <section class="py-20 bg-white dark:bg-gray-800">
        <div class="container mx-auto px-4">
          <div class="text-center mb-16">
            <h2 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Jak <span class="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-600">zaczynamy</span>
            </h2>
            <p class="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Prosty 4-stopniowy proces wprowadzający Cię w świat profesjonalnego treningu
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div v-for="(step, index) in processSteps" :key="index" class="text-center group">
              <div class="relative mb-8">
                <!-- Step number -->
                <div class="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span class="text-white text-2xl font-bold">{{ step.step }}</span>
                </div>
                
                <!-- Icon -->
                <div class="w-12 h-12 bg-white dark:bg-gray-700 rounded-xl flex items-center justify-center mx-auto shadow-lg -mt-6 relative z-10">
                  <UIcon :name="step.icon" class="text-blue-600 dark:text-blue-400 text-xl" />
                </div>
                
                <!-- Connector line (except for last item) -->
                <div v-if="index < processSteps.length - 1" class="hidden lg:block absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-300 to-purple-300 transform translate-x-10"></div>
              </div>
              
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">{{ step.title }}</h3>
              <p class="text-gray-600 dark:text-gray-400 mb-4">{{ step.description }}</p>
              <div class="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
                <UIcon name="i-lucide-clock" class="mr-1 text-xs" />
                {{ step.duration }}
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Enhanced Features Section -->
      <section id="features" class="py-20 bg-gray-50 dark:bg-gray-900 features-section">
        <div class="container mx-auto px-4">
          <div class="text-center mb-16">
            <h2 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Zaawansowane <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">funkcje</span>
            </h2>
            <p class="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Odkryj moc technologii w służbie Twojego rozwoju fizycznego
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div v-for="(feature, index) in features" :key="index" class="feature-card group">
              <div class="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 h-full border border-gray-100 dark:border-gray-700 hover:border-transparent overflow-hidden relative">
                <!-- Gradient background on hover -->
                <div :class="`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`"></div>
                
                <!-- Icon with gradient background -->
                <div :class="`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10`">
                  <UIcon :name="feature.icon" class="text-white text-2xl" />
                </div>
                
                <!-- Content -->
                <div class="relative z-10">
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                    {{ feature.title }}
                  </h3>
                  <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {{ feature.description }}
                  </p>
                </div>
                
                <!-- Hover arrow -->
                <div class="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                  <UIcon name="i-lucide-arrow-right" class="text-blue-500 text-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Stats Section -->
      <section class="py-20 bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 stats-section relative overflow-hidden">
        <!-- Background effects -->
        <div class="absolute inset-0">
          <div class="absolute top-0 left-0 w-full h-full bg-[url('/images/stats-pattern.svg')] opacity-5"></div>
          <div class="absolute top-10 right-10 w-64 h-64 bg-blue-500 opacity-10 rounded-full filter blur-3xl"></div>
          <div class="absolute bottom-10 left-10 w-80 h-80 bg-purple-500 opacity-10 rounded-full filter blur-3xl"></div>
        </div>
        
        <div class="container mx-auto px-4 relative z-10">
          <div class="text-center mb-16">
            <h2 class="text-4xl md:text-5xl font-bold text-white mb-6">
              Rezultaty <span class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">mówią same</span>
            </h2>
            <p class="text-xl text-blue-200 max-w-3xl mx-auto">
              Dołącz do tysięcy zadowolonych klientów, którzy osiągnęli swoje cele
            </p>
          </div>
          
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div v-for="(stat, index) in heroStats" :key="index" class="text-center group">
              <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 group-hover:scale-105">
                <div class="stat-number text-4xl md:text-5xl font-bold text-white mb-2" :data-value="stat.number.replace(/[^0-9]/g, '')">
                  {{ stat.number }}
                </div>
                <div class="text-blue-200 font-medium">{{ stat.label }}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Testimonials section -->
      <section class="py-20 bg-white dark:bg-gray-800 testimonials-section">
        <div class="container mx-auto px-4">
          <div class="text-center mb-16">
            <h2 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">Prawdziwe historie</span> sukcesu
            </h2>
            <p class="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Zobacz, jak ATP System zmienił życie naszych klientów
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div v-for="(testimonial, index) in testimonials" :key="index" class="testimonial-card group">
              <div class="bg-gray-50 dark:bg-gray-900 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 h-full border border-gray-100 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-700 relative overflow-hidden">
                <!-- Success badge -->
                <div class="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  {{ testimonial.result }}
                </div>
                
                <!-- Quote -->
                <div class="mb-6">
                  <UIcon name="i-lucide-quote" class="text-green-400 text-4xl mb-4" />
                  <p class="text-gray-700 dark:text-gray-300 italic text-lg leading-relaxed">
                    "{{ testimonial.quote }}"
                  </p>
                </div>
                
                <!-- Rating -->
                <div class="flex items-center mb-4">
                  <div v-for="star in 5" :key="star" class="text-yellow-400 text-xl">
                    <UIcon name="i-lucide-star" :class="star <= testimonial.rating ? 'fill-current' : ''" />
                  </div>
                </div>
                
                <!-- Author -->
                <div class="flex items-center">
                  <UAvatar :src="testimonial.avatar" :alt="testimonial.author" size="lg" class="mr-4" />
                  <div>
                    <h4 class="font-bold text-gray-900 dark:text-white">{{ testimonial.author }}</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ testimonial.position }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Final CTA section -->
      <section class="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 cta-section relative overflow-hidden">
        <!-- Background effects -->
        <div class="absolute inset-0">
          <div class="absolute top-10 left-10 w-72 h-72 bg-blue-500 opacity-20 rounded-full filter blur-3xl animate-pulse"></div>
          <div class="absolute bottom-10 right-10 w-96 h-96 bg-purple-500 opacity-15 rounded-full filter blur-3xl animate-pulse" style="animation-delay: 2s;"></div>
        </div>
        
        <div class="container mx-auto px-4 text-center relative z-10">
          <div class="cta-content max-w-4xl mx-auto">
            <h2 class="text-4xl md:text-6xl font-bold text-white mb-6">
              Gotowy na <span class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">transformację</span>?
            </h2>
            <p class="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Dołącz do tysięcy osób, które już zmieniły swoje życie dzięki ATP System. 
              <br class="hidden md:block">
              Pierwsza konsultacja jest <strong class="text-yellow-400">całkowicie bezpłatna</strong>!
            </p>
            
            <!-- CTA Buttons -->
            <div class="flex flex-col sm:flex-row justify-center gap-6 mb-12">
              <UButton
                to="/auth/register"
                size="xl"
                class="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-gray-900 px-10 py-5 text-xl font-bold shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300"
              >
                <UIcon name="i-lucide-zap" class="mr-3 text-2xl" />
                Rozpocznij transformację
              </UButton>
              
              <UButton
                size="xl"
                variant="outline"
                class="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-10 py-5 text-xl font-semibold transition-all duration-300"
              >
                <UIcon name="i-lucide-calendar" class="mr-3 text-xl" />
                Umów bezpłatną konsultację
              </UButton>
            </div>
            
            <!-- Trust indicators -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-white/20">
              <div class="text-center">
                <div class="text-2xl font-bold text-white">100%</div>
                <div class="text-sm text-gray-400">Gwarancja satysfakcji</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-white">24/7</div>
                <div class="text-sm text-gray-400">Wsparcie online</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-white">0 zł</div>
                <div class="text-sm text-gray-400">Pierwsza konsultacja</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-white">30 dni</div>
                <div class="text-sm text-gray-400">Test bez ryzyka</div>
              </div>
            </div>
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

/* Global layout stabilization - prevent all layout shifts */
.homepage {
  position: relative;
  top: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
  transform: translate3d(0, 0, 0);
}

/* Container stabilization */
.container {
  position: relative;
  transform: translate3d(0, 0, 0);
}

/* Gradient text animations */
@keyframes gradient-shift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.bg-gradient-animated {
  background-size: 200% 200%;
  animation: gradient-shift 4s ease infinite;
}

/* Floating animation for cards */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.floating-card {
  animation: float 3s ease-in-out infinite;
}

.floating-card:nth-child(2) {
  animation-delay: 1s;
}

.floating-card:nth-child(3) {
  animation-delay: 2s;
}

.floating-card:nth-child(4) {
  animation-delay: 0.5s;
}

.floating-card:nth-child(5) {
  animation-delay: 1.5s;
}

.floating-card:nth-child(6) {
  animation-delay: 2.5s;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Custom hover effects */
.service-card:hover .service-icon {
  transform: scale(1.1) rotate(360deg);
}

.feature-card:hover {
  transform: translateY(-5px);
}

/* Glass morphism effect */
.backdrop-blur-md {
  backdrop-filter: blur(12px);
}

/* Enhanced shadows */
.shadow-3xl {
  box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(45deg, #3b82f6, #8b5cf6);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(45deg, #2563eb, #7c3aed);
}

/* Enhanced parallax video background styles */
.hero-video {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100vw; /* Wider for parallax movement */
  height: 140vh; /* Taller for parallax movement */
  object-fit: cover;
  object-position: center center;
  filter: contrast(1.1) brightness(0.9);
  z-index: -1;
  display: block;
  transform: translate(-50%, -50%) scale(1.1);
  margin: 0;
  padding: 0;
  will-change: transform; /* Optimize for animations */
  transition: transform 0.1s ease-out;
}

/* Stabilize hero section - prevent layout shifts */
.hero-section {
  position: relative;
  height: 100vh; /* Fixed height */
  min-height: 100vh;
  overflow: hidden;
  transform: translate3d(0, 0, 0); /* GPU layer */
  backface-visibility: hidden;
  /* Prevent any layout shifts */
  top: 0 !important;
  margin: 0 !important;
  padding: 0;
}

/* Ensure video fills entire section with parallax support */
.hero-bg-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  will-change: transform; /* Optimize for parallax */
}

/* Floating cards - absolute positioning to prevent layout impact */
.floating-card {
  position: absolute;
  will-change: transform;
  transform: translate3d(0, 0, 0); /* GPU acceleration */
  backface-visibility: hidden;
}

/* Ensure video doesn't affect layout */
.hero-section video {
  pointer-events: none;
  user-select: none;
  font-size: 0;
  line-height: 0;
}

/* Fix for video aspect ratio issues */
.hero-section {
  position: relative;
  overflow: hidden;
}

/* Responsive video with parallax optimization */
@media (max-width: 768px) {
  .hero-video {
    width: 130vw; /* Even wider on mobile for smooth parallax */
    height: 130vh;
    object-position: center center;
    transform: translate(-50%, -50%) scale(1.15);
  }
}

@media (min-width: 769px) {
  .hero-video {
    width: 120vw; /* Wider for parallax effect */
    height: 120vh;
    object-position: center center;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

/* Parallax performance optimizations */
.hero-section {
  margin: 0;
  padding: 0;
  line-height: 0;
  position: relative;
  overflow: hidden;
  /* GPU acceleration for smooth parallax */
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
}

.hero-bg-gradient {
  margin: 0;
  padding: 0;
}

/* Performance optimization */
@media (prefers-reduced-motion: reduce) {
  .hero-video {
    animation: none;
  }
  
  .floating-card {
    animation: none;
  }
}
</style>
