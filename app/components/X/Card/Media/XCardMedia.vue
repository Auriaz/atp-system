<script setup lang="ts">
import type { IMedia } from '~~/types/media';

const props = withDefaults(defineProps<{
    file: IMedia
    isFieldSelected?: boolean
    selected?: boolean
}>(), {
    isFieldSelected: true,
    selected: false
})

const { hasRole } = useGuard()
const isAdmin = computed(() => hasRole('ROLE_ADMIN'))

const selected = ref(false)
const isShowFieldAction = ref(false)

// Status configurations
const statusConfig = {
  active: {
    bgClass: 'bg-success-500/80',
    icon: 'i-heroicons-check-circle'
  },
  pending: {
    bgClass: 'bg-warning-500/80',
    icon: 'i-heroicons-clock'
  },
  blocked: {
    bgClass: 'bg-error-500/80',
    icon: 'i-heroicons-x-circle'
  },
  reported: {
    bgClass: 'bg-info-500/80',
    icon: 'i-heroicons-exclamation-circle'
  }
}

const statusBgClass = computed(() => {
  return statusConfig[props.file.statusInfo?.status || 'pending']?.bgClass
})

const statusIcon = computed(() => {
  return statusConfig[props.file.statusInfo?.status || 'pending']?.icon
})

watch(() => props.selected, (e) => {
    selected.value = e
})

const emit = defineEmits(['moderate'])

const handleModerate = () => {
  emit('moderate', props.file)
}
</script>

<template>
    <div 
        @mouseover="isShowFieldAction = true" 
        @mouseleave="isShowFieldAction = false" 
        class="w-full relative bg-black rounded-xl overflow-hidden flex flex-col shadow-lg hover:shadow-xl shadow-black"
    >
        <div v-if="isFieldSelected" class="absolute left-2 top-2 w-10 text-center z-30">
           <slot name="selected"></slot>
        </div>

        <x-speed-dial v-if="isShowFieldAction" class="absolute z-30 flex right-0 translate-x-[10%] top-2 scale-75">
            <slot name="action"></slot>
            
            <x-tooltip v-if="isAdmin" text="Moderate">
                <x-btn
                    @click="handleModerate"
                    color="primary"
                    icon="i-heroicons-shield-check"
                    variant="ghost"
                    square
                />
            </x-tooltip>
        </x-speed-dial>

        <div class="w-full h-full relative flex justify-center">
            <nuxt-img v-if="file.mimeType === 'image/jpeg' || file.mimeType === 'image/png' || file.mimeType === 'image/webp'" :src="file.previewUrl" :alt="file.name" class="h-full object-cover" />

            <video v-if="file.mimeType === 'video/mp4'" class="w-full aspect-video" controls>
                <source :src="file.previewUrl" :type="file.mimeType" :title="file.name">
            </video>

            <iframe 
                v-if="file.mimeType === 'video/youTube'"
                :src="'https://www.youtube.com/embed/'+file.pathUrl" 
                class="w-full aspect-video"
                frameborder="0"
                allowfullscreen
            />
        </div>
        
        <XTooltip 
            v-if="file.statusInfo?.note" 
            :text="file.statusInfo.note"
            position="bottom"
        >
            <div v-if="file.statusInfo" 
                class="absolute right-0 bottom-11 z-20 px-3 py-1 rounded-l-xl text-sm flex items-center gap-2"
                :class="statusBgClass">
                <Icon :name="statusIcon" class="w-4 h-4" />
                <span class="text-white font-medium">{{ file.statusInfo.label }}</span>
            </div>
        </XTooltip>

        <div v-if="file.mimeType === 'image/jpeg' || file.mimeType === 'image/png' || file.mimeType === 'image/webp'" class="absolute bottom-0 left-0 h-10 w-full flex justify-center items-center bg-black/60">
            <p class="px-2 text-white w-80 truncate">{{ file.name }}</p>
        </div>
    </div>
</template>