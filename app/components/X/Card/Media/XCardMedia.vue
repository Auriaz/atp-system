<script setup lang="ts">

// Właściwości komponentu
const props = withDefaults(defineProps<{
  file: Media
  isFieldSelected?: boolean
  selected?: boolean
}>(), {
  isFieldSelected: true,
  selected: false
})

// Composables
const { hasRole } = useGuard()
const isAdmin = computed(() => hasRole('ROLE_ADMIN'))

// Emits
const emit = defineEmits(['moderate', 'select'])

// Stan komponentu
const isShowFieldAction = ref(false)

// Ta zmienna jest tylko do śledzenia wewnętrznego stanu, dostosowuje się do props
const internalSelected = computed({
  get: () => props.selected,
  set: (value) => {
    // Emitujemy zdarzenie zamiast bezpośrednio zmieniać wartość
    emit('select', value, props.file)
  }
})

// Status configurations
const statusConfig = {
  active: {
    bgClass: 'bg-success-500/80',
    icon: 'i-heroicons-check-circle',
    textClass: 'text-white'
  },
  pending: {
    bgClass: 'bg-warning-500/80',
    icon: 'i-heroicons-clock',
    textClass: 'text-white'
  },
  blocked: {
    bgClass: 'bg-error-500/80',
    icon: 'i-heroicons-x-circle',
    textClass: 'text-white'
  },
  reported: {
    bgClass: 'bg-info-500/80',
    icon: 'i-heroicons-exclamation-circle',
    textClass: 'text-white'
  }
}

// Computed properties
const fileStatus = computed(() => props.file.statusInfo?.status || 'pending')

const statusBgClass = computed(() => statusConfig[fileStatus.value]?.bgClass)
const statusIcon = computed(() => statusConfig[fileStatus.value]?.icon)
const statusTextClass = computed(() => statusConfig[fileStatus.value]?.textClass)

const isImage = computed(() => {
  const imageTypes = ['image/jpeg', 'image/png', 'image/webp']
  return imageTypes.includes(props.file.mimeType)
})

const isVideo = computed(() => props.file.mimeType === 'video/mp4')
const isYouTube = computed(() => props.file.mimeType === 'video/youTube')

// Methods
const handleModerate = () => {
  emit('moderate', props.file)
}

// Funkcja obsługująca kliknięcie checkboxa
const toggleSelected = () => {
  internalSelected.value = !internalSelected.value
}
</script>

<template>
  <div 
    @mouseover="isShowFieldAction = true" 
    @mouseleave="isShowFieldAction = false" 
    class="w-full relative bg-black rounded-xl overflow-hidden flex flex-col shadow-lg hover:shadow-xl shadow-black transition-shadow duration-200"
  >
    <!-- Selection area -->
    <div v-if="isFieldSelected" class="absolute left-2 top-2 w-10 text-center z-30">
 
      <UCheckbox
        :model-value="internalSelected"
        name="media-select"
        color="primary"
        @update:model-value="toggleSelected"
      />
   
    </div>

    <!-- Action buttons -->
    <UButtonGroup
      v-if="isShowFieldAction"
      class="absolute z-30 right-2 top-2"
      size="sm"
    >
      <slot name="action"></slot>
      
      <UTooltip v-if="isAdmin" text="Moderate">
        <UButton
          @click="handleModerate"
          color="primary"
          icon="i-heroicons-shield-check"
          variant="ghost"
          size="sm"
        />
      </UTooltip>
    </UButtonGroup>

    <!-- Reszta komponentu pozostaje bez zmian -->
    <!-- Media content -->
    <div class="w-full h-full relative flex justify-center">
      <!-- Image content -->
      <nuxt-img 
        v-if="isImage" 
        :src="file.previewUrl" 
        :alt="file.name" 
        class="h-full w-full object-cover"
        loading="lazy"
      />

      <!-- Video content -->
      <video 
        v-else-if="isVideo" 
        class="w-full aspect-video" 
        controls
        preload="metadata"
      >
        <source :src="file.previewUrl" :type="file.mimeType" :title="file.name">
        Your browser does not support the video tag.
      </video>

      <!-- YouTube embed -->
      <iframe 
        v-else-if="isYouTube"
        :src="`https://www.youtube.com/embed/${file.pathUrl}`" 
        class="w-full aspect-video"
        frameborder="0"
        allowfullscreen
        loading="lazy"
        title="YouTube video player"
      />

      <!-- Fallback for unsupported type -->
      <div 
        v-else
        class="w-full h-32 flex items-center justify-center bg-gray-800"
      >
        <UIcon name="i-heroicons-document" class="w-12 h-12 text-gray-400" />
        <p class="text-gray-300 text-sm mt-2">Unsupported format</p>
      </div>
    </div>
    
    <!-- Status badge with tooltip -->
    <UTooltip 
      v-if="file.statusInfo?.note" 
      :text="file.statusInfo.note"
      position="bottom"
    >
      <div 
        v-if="file.statusInfo" 
        class="absolute right-0 bottom-11 z-20 px-3 py-1 rounded-l-xl text-sm flex items-center gap-2"
        :class="statusBgClass"
      >
        <UIcon :name="statusIcon" class="w-4 h-4" />
        <span :class="statusTextClass" class="font-medium">{{ file.statusInfo.label }}</span>
      </div>
    </UTooltip>

    <!-- File name display for images -->
    <div 
      v-if="isImage" 
      class="absolute bottom-0 left-0 w-full flex justify-center items-center bg-black/60 backdrop-blur-sm p-2"
    >
      <p class="px-2 text-white text-sm truncate max-w-full">{{ file.name }}</p>
    </div>
  </div>
</template>