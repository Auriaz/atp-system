<script lang="ts" setup>
import { UButton } from '#components';
import { CircleStencil, Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
const { avatarUrlUpdate } = useProfileApi()

const toast = useToast()
const props = defineProps({
  profile: {
    type: Object as PropType<UserResource>,
    default: () => ({})
  }
})
const emit = defineEmits(['update:avatarUrl'])

// Stan komponentu
const file = ref<File | null>(null)
const cropper = ref<any>(null)
const uploadedImage = ref<string | null>(null)
const progressImage = ref<number>(0)
const isUploading = ref<boolean>(false)

// Obsługa pobierania pliku z inputa
const getUploadedImage = async (e: Event) => {
  const input = e.target as HTMLInputElement
  
  if (input.files && input.files.length > 0) {
    const selectedFile = input.files[0];
    if (selectedFile) {
      file.value = selectedFile;
      uploadedImage.value = URL.createObjectURL(file.value);
    }
  }
}

// Funkcja obsługująca przycięcie i przesłanie avatara
const cropAndUpdateImage = async () => {
  if (!file.value || !cropper.value) return
  
  try {
    isUploading.value = true
    progressImage.value = 10 // Początkowy postęp
    
    // Pobieranie wyniku przycinania
    const { coordinates } = cropper.value.getResult()
    
    // Przygotowanie danych do wysłania
    const formData = new FormData()
    formData.append('file', file.value)
    formData.append('userId', props.profile?.id?.toString() || '')
    formData.append('height', coordinates.height.toString())
    formData.append('width', coordinates.width.toString())
    formData.append('left', coordinates.left.toString())
    formData.append('top', coordinates.top.toString())
    
    // Symulacja postępu (prawdziwy postęp wymaga wsparcia ze strony serwera)
    const progressInterval = setInterval(() => {
      if (progressImage.value < 90) {
        progressImage.value += 15
      }
    }, 300)
    
    // Wysłanie żądania do API
    await avatarUrlUpdate(formData).then(() => {
      progressImage.value = 100
    
      // Resetowanie po udanym przesłaniu
      setTimeout(() => {
        uploadedImage.value = null
        progressImage.value = 0
      }, 1000)
    }).catch(() => {
      progressImage.value = 0
    }).finally(() => {
      clearInterval(progressInterval)
    })
  } catch (e) {
    console.error('Wystąpił nieoczekiwany błąd:', e)
    toast.add({
      title: 'Błąd',
      description: 'Wystąpił nieoczekiwany błąd podczas aktualizacji avatara',
      color: 'error'
    })
    progressImage.value = 0
  } finally {
    isUploading.value = false
  }
}

// Anulowanie przesyłania
const cancelUpload = () => {
  uploadedImage.value = null
  progressImage.value = 0
  file.value = null
}

const { data: images, refresh } = await useFetch('/api/profile/avatar')
</script>

<template>
  <div class="relative w-full flex flex-col rounded-lg box-border">
    <x-card-action>
      <template #title>
        Profile Picture
      </template>

      <template #description>
        Your profile picture helps others recognize you.
      </template>

      <template #content>
        <div v-if="!uploadedImage" class="relative h-6 flex flex-col">
          
          <div class="absolute w-full h-full flex items-center justify-center lg:-mt-6">
            <label for="avatar-upload" class="relative cursor-pointer">
              <XAvatar 
                v-if="profile && profile.avatarUrl" 
                :src="profile.avatarUrl" 
                :alt="profile.firstName + ' ' + profile.lastName"    
                :firstName="profile.firstName" 
                :lastName="profile.lastName" 
                :size="96" 
              />

              <div
                class="absolute w-6 h-6 flex justify-center items-center bottom-0 right-0 rounded-full bg-white border border-gray-300 shadow-xl shadow-black">
                <Icon name="ph:pencil-simple-line-bold" size="17" class="-mt-1 ml-0.5 text-gray-600" />
              </div>
            </label>

            <input class="hidden" type="file" id="avatar-upload" @input="getUploadedImage"
              accept="image/png, image/jpeg, image/jpg">
          </div>
        </div>

        <div v-else class="w-full h-[300px] relative box-border space-y-4">
          <Cropper 
            class="h-[250px] w-full" 
            ref="cropper" 
            :stencil-component="CircleStencil" 
            :src="uploadedImage" 
            :stencil-props="{
              aspectRatio: 1,
              movable: true,
              resizable: true
            }"
          />

          <div v-if="progressImage > 0"
            class="w-full absolute -top-9 bg-gray-400/60 rounded-full h-5 shadow-inner overflow-hidden flex items-center justify-center">

            <div class="inline-block h-full bg-indigo-600 absolute top-0 left-0" :style="`width: ${progressImage}%`">
            </div>

            <div class="relative z-10 text-xs font-semibold text-center text-white drop-shadow text-shadow">{{
              progressImage }}%</div>
          </div>

          <div class="flex items-center justify-end space-x-3">
            <UButton @click="cancelUpload" color="neutral" variant="soft" rounded="full" :disabled="isUploading">
                <span class="mx-4 font-medium text-[15px]">Cancel</span>
            </UButton>

            <UButton @click="cropAndUpdateImage()" color="primary" rounded="full" :loading="isUploading" :disabled="isUploading">
              <span class="mx-4 font-medium text-[15px]">Save</span>
            </UButton>
          </div>
        </div>
      </template>
    </x-card-action>
  </div>
</template>