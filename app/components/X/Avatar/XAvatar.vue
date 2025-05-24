<script lang="ts" setup>
const props = defineProps({
  // URL do zdjęcia profilowego
  src: {
    type: Blob,
    default: null
  },
  // Imię użytkownika (do inicjałów)
  firstName: {
    type: String as PropType<string | null>,
    default: ''
  },
  // Nazwisko użytkownika (do inicjałów)
  lastName: {
    type: String as PropType<string | null>,
    default: ''
  },
  // Alternatywny tekst dla inicjałów, np. nazwa użytkownika
  alt: {
    type: String,
    default: ''
  },
  // Rozmiar avatara w pikselach
  size: {
    type: Number,
    default: 40
  },
  // Kształt: 'circle' (okrągły) lub 'square' (kwadratowy z zaokrąglonymi rogami)
  shape: {
    type: String,
    default: 'circle',
    validator: (value: string) => ['circle', 'square'].includes(value)
  },
  // Status użytkownika: null, 'online', 'offline', 'busy', 'away'
  status: {
    type: String,
    default: null,
    validator: (value: string | null) => 
      [null, 'online', 'offline', 'busy', 'away'].includes(value)
  },
  // Kolor tła dla avatarów z inicjałami (nadpisuje automatyczne kolory)
  bgColor: {
    type: String,
    default: ''
  },
  // Kolor tekstu dla avatarów z inicjałami
  textColor: {
    type: String,
    default: 'white'
  }
})

// Obsługa błędów ładowania obrazów
const hasImageError = ref(false)
const handleImageError = () => {
  hasImageError.value = true
}

// Generowanie inicjałów z imienia i nazwiska lub tekstu alternatywnego
const initials = computed(() => {
  if (props.firstName && props.lastName) {
    return `${props.firstName.charAt(0)}${props.lastName.charAt(0)}`.toUpperCase()
  } else if (props.firstName) {
    return props.firstName.charAt(0).toUpperCase()
  } else if (props.lastName) {
    return props.lastName.charAt(0).toUpperCase()
  } else if (props.alt) {
    // Pobierz inicjały z tekstu alternatywnego (np. pierwsza litera lub pierwsze litery słów)
    return props.alt.split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }
  
  return '??' // Fallback jeśli nie ma żadnych danych do inicjałów
})

// Automatyczne generowanie koloru tła na podstawie inicjałów (konsystentne dla tych samych inicjałów)
const backgroundColor = computed(() => {
  if (props.bgColor) return props.bgColor
  
  // Predefiniowane kolory dla avatarów
  const colors = [
    '#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#34495e',
    '#16a085', '#27ae60', '#2980b9', '#8e44ad', '#2c3e50',
    '#f1c40f', '#e67e22', '#e74c3c', '#95a5a6', '#f39c12',
    '#d35400', '#c0392b', '#7f8c8d'
  ]
  
  // Wybierz kolor na podstawie sumy kodów znaków inicjałów
  const hash = initials.value
    .split('')
    .reduce((sum, char) => sum + char.charCodeAt(0), 0)
  
  return colors[hash % colors.length]
})

// Styl dla głównego kontenera
const containerStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
  borderRadius: props.shape === 'circle' ? '50%' : '8px',
  position: 'relative' as const,
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden'
}))

// Styl dla inicjałów
const initialsStyle = computed(() => ({
  backgroundColor: backgroundColor.value,
  color: props.textColor,
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: `${Math.floor(props.size * 0.4)}px`,
  fontWeight: 600,
  userSelect: 'none' as const
}))

// Określa czy powinniśmy wyświetlić inicjały zamiast obrazka
const shouldShowInitials = computed(() => !props.src || hasImageError.value)

// Styl dla wskaźnika statusu
const statusStyle = computed(() => {
  const statusSize = Math.max(8, Math.floor(props.size * 0.25))
  
  // Kolor wskaźnika zależny od statusu
  const statusColors = {
    'online': 'bg-green-500',
    'offline': 'bg-gray-400',
    'busy': 'bg-red-500',
    'away': 'bg-yellow-500'
  }
  
  return {
    width: `${statusSize}px`,
    height: `${statusSize}px`,
    position: 'absolute' as const,
    bottom: '2px',
    right: '2px',
    borderRadius: '50%',
    border: '2px solid white'
  }
})

// Klasa CSS dla wskaźnika statusu
const statusClass = computed(() => {
  if (!props.status) return ''
  
  const statusColors = {
    'online': 'bg-green-500',
    'offline': 'bg-gray-400',
    'busy': 'bg-red-500',
    'away': 'bg-yellow-500'
  }
  
  return statusColors[props.status as keyof typeof statusColors] || ''
})
</script>

<template>
  <div :style="containerStyle" class="x-avatar">
    <!-- Wyświetlanie obrazka -->
    <img 
      v-if="!shouldShowInitials " 
      :src="`/images/${src}` || undefined" 
      :alt="alt || `${firstName} ${lastName}`"
      @error="handleImageError"
      class="w-full h-full object-cover"
    >
    
    <!-- Wyświetlanie inicjałów jeśli brak obrazka lub obrazek się nie załadował -->
    <div v-else :style="initialsStyle">
      {{ initials }}
    </div>
    
    <!-- Wskaźnik statusu (online, offline, etc.) -->
    <div 
      v-if="status" 
      :style="statusStyle" 
      :class="statusClass" 
      :title="status"
    ></div>
  </div>
</template>

<style scoped>
.x-avatar {
  flex-shrink: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.x-avatar:hover {
  transform: scale(1.05);
}
</style>