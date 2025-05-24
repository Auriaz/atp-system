<script lang="ts" setup>
const uploadedImage = ref<string | null>(null);
const file = ref<File | null>(null);
const isUploading = ref(false);
const uploadProgress = ref(0); 
const errorMessage = ref<string | null>(null);
const successMessage = ref<string | null>(null);
const { updatedLogo } = useSettingsApi();
const toast = useToast();

// Resetowanie komunikatów
const resetMessages = () => {
  errorMessage.value = null;
  successMessage.value = null;
};

const getUploadedLogo = async (e: Event) => {
  const input = e.target as HTMLInputElement;
  
  if (!input.files || input.files.length === 0) return;
  
  try {
    // Resetuj stany i komunikaty
    resetMessages();
    isUploading.value = true;
    uploadProgress.value = 0;
    const selectedFile = input.files[0];
    
    // Ensure selectedFile exists
    if (!selectedFile) {
      throw new Error('No file selected');
    }
    
    // Walidacja po stronie klienta
    if (selectedFile.size > 4 * 1024 * 1024) { // 4MB
      throw new Error('File size exceeds 4MB limit');
    }
    
    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(selectedFile.type)) {
      throw new Error('Only PNG and JPG formats are allowed');
    }
    
    if (selectedFile) {
      file.value = selectedFile;
      uploadedImage.value = URL.createObjectURL(selectedFile);
      
      // Symulacja postępu z wyraźnymi skokami
      uploadProgress.value = 10;
      const simulateProgress = () => {
        const intervals = [
          { target: 30, time: 300 },
          { target: 60, time: 500 },
          { target: 80, time: 700 },
          { target: 90, time: 500 }
        ];
        
        let currentIndex = 0;
        
        const progressStep = () => {
          if (currentIndex < intervals.length) {
            const step = intervals[currentIndex];
            if (!step) return;
            
            const increment = (step.target - uploadProgress.value) / 10;
            
            const stepInterval = setInterval(() => {
              if (uploadProgress.value < step.target) {
                uploadProgress.value += increment;
              } else {
                clearInterval(stepInterval);
                currentIndex++;
                if (currentIndex < intervals.length) {
                  setTimeout(progressStep, 200);
                }
              }
            }, 100);
          }
        };
        
        progressStep();
      };
      
      simulateProgress();
      
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      try {
        // Przesłanie logo i obsługa odpowiedzi
        const response = await updatedLogo(formData);
        
        // Po zakończeniu przesyłania
        uploadProgress.value = 100;
        successMessage.value = 'Logo successfully updated';
        toast.add({
          title: 'Success',
          description: 'Logo has been successfully updated',
          color: 'success'
        });
        
        // Resetowanie paska postępu po 2s
        setTimeout(() => {
          uploadProgress.value = 0;
        }, 2000);
      } catch (apiError: any) {
        // Obsługa błędów API
        console.error('API error:', apiError);
        errorMessage.value = apiError.message || 'Error uploading logo';
        uploadProgress.value = 0;
        
        // Wyświetl powiadomienie o błędzie
        toast.add({
          title: 'Error',
          description: errorMessage.value || 'An error occurred',
          color: 'error'
        });
      }
    }
  } catch (error: any) {
    // Obsługa błędów walidacji po stronie klienta
    console.error('Error uploading logo:', error);
    errorMessage.value = error.message || 'Unknown error occurred';
    uploadProgress.value = 0;
    
    // Wyświetl powiadomienie o błędzie
    toast.add({
      title: 'Error',
      description: errorMessage.value || 'An error occurred',
      color: 'error'
    });
  } finally {
    isUploading.value = false;
    // Resetuj input file, aby można było ponownie wybrać ten sam plik
    const fileInput = document.getElementById('logo-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }
};

// Clean up object URL on component unmount
onBeforeUnmount(() => {
  if (uploadedImage.value) {
    URL.revokeObjectURL(uploadedImage.value);
  }
});

// Obliczenie stylu paska postępu
const progressBarStyle = computed(() => {
  return { width: `${uploadProgress.value}%` };
});

// Kolor paska postępu zależny od wartości
const progressBarColor = computed(() => {
  if (errorMessage.value) return 'bg-red-500';
  if (uploadProgress.value < 30) return 'bg-blue-500';
  if (uploadProgress.value < 70) return 'bg-blue-600';
  if (uploadProgress.value < 90) return 'bg-green-500';
  return 'bg-green-600';
});

// Status message color
const statusMessageClass = computed(() => {
  if (errorMessage.value) return 'text-red-500';
  return 'text-primary';
});

// Status message text
const statusMessage = computed(() => {
  if (errorMessage.value) return errorMessage.value;
  if (successMessage.value) return successMessage.value;
  if (isUploading.value) return 'Processing your logo';
  return '';
});
</script>

<template>
  <div class="relative w-full flex flex-col rounded-lg box-border">
    <x-card-action>
      <template #title>
        <div class="flex items-center space-x-2">
          <Icon name="heroicons:photo" class="h-5 w-5 text-primary" />
          <span>Logo</span>
        </div>
      </template>

      <template #description>
        <span class="text-gray-500">Your logo helps others recognize your brand.</span>
      </template>

      <template #content>
        <div class="relative flex flex-col items-center">
          <!-- Container dla obrazu i progress bara -->
          <div class="relative">
            <!-- Progress bar nałożony na logo -->
            <div 
              v-if="uploadProgress > 0"
              class="absolute -top-6 left-1/2 transform -translate-x-1/2 w-48 z-10"
            >
              <!-- Label -->
              <div class="mb-1 flex justify-between items-center">
                <span class="text-xs text-gray-600 font-medium">
                  {{ errorMessage ? 'Error' : 'Uploading' }}
                </span>
                <span 
                  class="text-xs font-bold" 
                  :class="errorMessage ? 'text-red-500' : 'text-primary'"
                >
                  {{ Math.round(uploadProgress) }}%
                </span>
              </div>
              
              <!-- Pasek postępu -->
              <div class="h-2 w-full bg-gray-200 rounded-full overflow-hidden shadow-inner">
                <div 
                  class="h-full transition-all duration-300 ease-out rounded-full"
                  :class="progressBarColor"
                  :style="progressBarStyle"
                ></div>
              </div>
            </div>
                
            <!-- Logo container -->
            <label 
              for="logo-upload" 
              class="relative cursor-pointer block mt-6"
              :class="{ 'cursor-not-allowed': isUploading }"
            >
              <div 
                class="w-36 h-36 rounded-full overflow-hidden  flex justify-center items-center border-2 border-white shadow-lg transition-all duration-300 hover:shadow-xl"
                :class="{ 
                  'opacity-80': isUploading,
                  'border-red-300': errorMessage,
                  'border-green-300': successMessage && !errorMessage
                }"
              >
                <NuxtImg 
                  v-if="uploadedImage" 
                  :src="uploadedImage" 
                  alt="Uploaded Logo" 
                  class="w-full h-full object-cover"
                  loading="lazy"
                />
                <XLogo 
                  v-else 
                  size="36"
                  alt="Default Logo" 
                  class="w-full h-full object-cover"
                />
              </div>
              
              <!-- Edit button -->
              <div 
                class="absolute bottom-1 right-1 w-9 h-9 flex justify-center items-center rounded-full bg-white border border-gray-300 shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-gray-50"
                :class="{ 'opacity-50 pointer-events-none': isUploading }"
              >
                <Icon 
                  name="heroicons:pencil-square" 
                  class="w-5 h-5 text-gray-700"
                />
              </div>
            </label>
            
            <!-- Ukryty input file -->
            <input 
              class="hidden" 
              type="file" 
              id="logo-upload" 
              @change="getUploadedLogo"
              accept="image/png, image/jpeg, image/jpg"
              :disabled="isUploading"
            >
          </div>
          
          <!-- Status message: success, error, or processing -->
          <div 
            v-if="statusMessage"
            class="mt-4 text-center text-sm font-medium flex items-center justify-center"
            :class="statusMessageClass"
          >
            <!-- Error icon -->
            <Icon 
              v-if="errorMessage"
              name="heroicons:exclamation-triangle" 
              class="w-4 h-4 mr-1"
            />
            
            <!-- Success icon -->
            <Icon 
              v-else-if="successMessage && !isUploading"
              name="heroicons:check-circle" 
              class="w-4 h-4 mr-1"
            />
            
            <span class="inline-block">{{ statusMessage }}</span>
            <span 
              v-if="isUploading" 
              class="dots-animation inline-block ml-1"
            ></span>
          </div>
          
          <!-- Instrukcja -->
          <div class="mt-4 text-sm text-gray-500 text-center max-w-xs">
            <p>
              Click the logo to upload a new one. For best results, use a square image with minimum size of 200x200 pixels.
            </p>
            <p class="mt-1 text-xs font-medium">
              Allowed formats: PNG, JPG. Maximum file size: 4MB.
            </p>
          </div>
        </div>
      </template>
    </x-card-action>
  </div>
</template>

<style scoped>
/* Dodatkowe style dla lepszych animacji */
.rounded-full {
  transition: all 0.3s ease;
}

/* Dodatkowy efekt hover dla przycisku edycji */
label:not(.cursor-not-allowed):hover .border-gray-300 {
  border-color: var('--colors-primary-500');
  transform: scale(1.05);
}

/* Animacja kropek w trakcie ładowania */
.dots-animation::after {
  content: '';
  animation: dots 1.5s infinite;
}

@keyframes dots {
  0%, 20% { content: '.'; }
  40%, 60% { content: '..'; }
  80%, 100% { content: '...'; }
}
</style>