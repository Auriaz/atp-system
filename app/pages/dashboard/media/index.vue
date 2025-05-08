<script lang="ts" setup>
definePageMeta({
  layout: 'authorization',
  middleware: 'auth',
})

// Dostępne statusy
type MediaStatus = 'active' | 'pending' | 'blocked' | 'reported'
type MediaVisibility = 'public' | 'premium' | 'private'
type PublishStatus = 'processing' | 'published' | 'draft'
type ViewMode = 'grid' | 'table'

// Media item type
interface MediaItem {
  id: number;
  name: string;
  title: string;
  description: string;
  pathUrl: string;
  previewUrl: string;
  mimeType: string;
  visibility: MediaVisibility;
  createdAt: Date;
  fileSize: number;
  statusInfo: {
    status: MediaStatus;
    label: string;
    note: string;
  }
}

// Stan widoku
const viewMode = ref<ViewMode>('grid')

const switchViewMode = (mode: ViewMode) => {
  viewMode.value = mode
} 

// Mapowanie statusu publikacji na status mediów
const mapPublishStatusToMediaStatus = (status: PublishStatus): MediaStatus => {
  switch (status) {
    case 'processing': return 'pending'
    case 'draft': return 'pending'
    case 'published': return 'active'
    default: return 'pending'
  }
}

// Mapowanie widoczności na etykietę
const visibilityLabels = {
  public: 'Public',
  premium: 'Premium',
  private: 'Private'
}

// Stan zaznaczenia
const selectedItems = ref<number[]>([])
const selectedAll = ref(false)

// Inicjalna wartość sortowania (zgodna z dokumentacją UTable)
const sorting = ref({
  column: 'createdAt',
  direction: 'desc' as const
})

// Przykładowe dane wideo
const videoItems: MediaItem[] = new Array(10).fill(null).map((_, index) => {
  const publishStatus: PublishStatus = ['processing', 'published', 'draft'][Math.floor(Math.random() * 3)] as PublishStatus
  const visibility: MediaVisibility = ['public', 'premium', 'private'][Math.floor(Math.random() * 3)] as MediaVisibility
  const createdAt = new Date()
  createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 30))
  
  return {
    id: index + 1,
    name: `Video ${index + 1}`,
    title: `Video Title ${index + 1}`,
    description: `Description for video ${index + 1}`,
    pathUrl: `video-${index + 1}`,
    previewUrl: `https://picsum.photos/500/400?random=${index}`,
    mimeType: Math.random() > 0.7 ? 'video/mp4' : 'image/jpeg',
    visibility: visibility,
    createdAt: createdAt,
    fileSize: Math.floor(Math.random() * 10000000), // Rozmiar w bajtach
    statusInfo: {
      status: mapPublishStatusToMediaStatus(publishStatus),
      label: publishStatus === 'published' ? 'Published' : publishStatus === 'processing' ? 'Processing' : 'Draft',
      note: publishStatus === 'processing' 
        ? 'Video is being processed' 
        : publishStatus === 'draft' 
          ? 'Video is saved as draft' 
          : `Video is published and visible to ${visibilityLabels[visibility]} users`
    }
  }
})

// Kolumny tabeli zgodne z aktualną dokumentacją UTable
const columns = [
  { accessorKey: 'select', header: '' },
  { accessorKey: 'thumbnail', header: 'Thumbnail' },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'visibility', header: 'Visibility' },
  { accessorKey: 'type', header: 'Type' },
  { accessorKey: 'size', header: 'Size' },
  { accessorKey: 'createdAt', header: 'Created' },
  { accessorKey: 'actions', header: 'Actions' }
]

// Funkcje zarządzania mediami
const handleMediaSelect = (selected: boolean, file: MediaItem) => {
  console.log('Select handler called with', selected, file.id)
  
  if (selected) {
    if (!selectedItems.value.includes(file.id)) {
      selectedItems.value = [...selectedItems.value, file.id]
    }
  } else {
    selectedItems.value = selectedItems.value.filter(id => id !== file.id)
  }
  
  // Aktualizacja stanu selectedAll
  selectedAll.value = selectedItems.value.length === videoItems.length
}

const toggleSelectAll = () => {
  selectedAll.value = !selectedAll.value
  
  if (selectedAll.value) {
    selectedItems.value = videoItems.map(item => item.id)
  } else {
    selectedItems.value = []
  }
}

const isSelected = (id: number) => {
  return selectedItems.value.includes(id)
}

const handleMediaModerate = (file: MediaItem) => {
  console.log('Moderate file:', file)
}

// Format rozmiaru pliku
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Format daty
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
}

// Akcje dla wybranych mediów
const bulkActions = [
  { 
    label: 'Delete Selected', 
    icon: 'i-heroicons-trash', 
    onSelect() {console.log('Delete selected items', selectedItems.value)},
    color: 'error' as const,
  },
  { 
    label: 'Change Status', 
    icon: 'i-heroicons-arrow-path', 
    onSelect() {console.log('Change status of selected items', selectedItems.value)} 
  },
  { 
    label: 'Download Selected', 
    icon: 'i-heroicons-arrow-down-tray', 
    onSelect() { console.log('Download selected items', selectedItems.value)} 
  }
]
</script>

<template>
  <NuxtLayout>
    <XDashboardPage :loading="false">
      <template #header-right>
        <div class="flex items-center gap-2 z-50">
          <UButton 
            color="primary" 
            icon="i-heroicons-cloud-arrow-up" 
            size="sm"
          >
            Upload New
          </UButton>
          
          <UButton 
            color="neutral" 
            icon="i-heroicons-funnel" 
            size="sm" 
            variant="ghost"
          >
            Filter
          </UButton>
          
          <!-- View mode toggle -->
          <UButtonGroup size="sm">
            <UButton
              :color="viewMode === 'grid' ? 'primary' : 'neutral'"
              :variant="viewMode === 'grid' ? 'solid' : 'ghost'"
              icon="i-heroicons-squares-2x2"
              @click="switchViewMode('grid')"
              aria-label="Grid view"
            />
            <UButton
              :color="viewMode === 'table' ? 'primary' : 'neutral'"
              :variant="viewMode === 'table' ? 'solid' : 'ghost'"
              icon="i-heroicons-table-cells"
              @click="switchViewMode('table')"
              aria-label="Table view"
            />
          </UButtonGroup>


      

        </div>
      </template>
      
      <template #main>
        <div class="w-full  p-4 md:p-6">
          <!-- Selection controls       -->
          <div v-if="selectedItems.length > 0" class="mb-4 p-3 bg-primary-50 dark:bg-primary-950 rounded-lg border border-primary-200 dark:border-primary-800">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-check-circle" class="text-primary-500 w-5 h-5" />
                <span class="text-sm font-medium">{{ selectedItems.length }} item{{ selectedItems.length > 1 ? 's' : '' }} selected</span>
              </div>
              
              <div class="flex gap-2">
                <UDropdownMenu :items="bulkActions">
                  <UButton
                    color="primary"
                    size="sm"
                    variant="soft"
                  >
                    Bulk Actions
                    <template #trailing>
                      <UIcon name="i-heroicons-chevron-down" />
                    </template>
                  </UButton>
                </UDropdownMenu>
                
                <UButton
                  color="neutral"
                  size="sm"
                  variant="ghost"
                  icon="i-heroicons-x-mark"
                  @click="selectedItems = []"
                >
                  Clear Selection
                </UButton>
              </div>
            </div>
          </div>

          <!-- Grid View -->
          <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 xl:gap-6">
            <XCardMedia
              v-for="file in videoItems"
              :key="file.id"
              :file="file"
              :selected="isSelected(file.id)" 
              class="h-60 w-full bg-secondary-200/50 dark:bg-secondary-950/50"
              @select="(isSelected, mediaFile) => handleMediaSelect(isSelected, mediaFile)"
              @moderate="handleMediaModerate"
            >
              <template #action>
                <UTooltip text="Share">
                  <UButton
                    color="neutral"
                    icon="i-heroicons-share"
                    variant="ghost"
                    size="sm"
                  />
                </UTooltip>
                
                <UTooltip text="Edit">
                  <UButton
                    color="neutral"
                    icon="i-heroicons-pencil-square"
                    variant="ghost"
                    size="sm"
                  />
                </UTooltip>
                
                <UTooltip text="Delete">
                  <UButton
                    color="neutral"
                    icon="i-heroicons-trash"
                    variant="ghost"
                    size="sm"
                  />
                </UTooltip>
              </template>
            </XCardMedia>
          </div>
          

          <!-- Table View -->
          <div v-else class="w-full overflow-x-auto">
            <UTable
              :data="videoItems"
              :columns="columns"
              v-model:sort="sorting"
              hover
            >
              <!-- Kolumna z checkboxem -->
              <template #select-header>
                <UCheckbox
                  v-model="selectedAll"
                  name="select-all"
                  color="primary"
                  @change="toggleSelectAll"
                />
              </template>
              <!-- Kolumna z checkboxem 
              
              -->
              <template #select-cell="{ row }">
                <UCheckbox
                  :model-value="isSelected(Number(row.original.id))"
                  name="select-item"
                  color="primary"
                  @update:model-value="(value) => handleMediaSelect(!!value, row.original)"
                />
              </template>
              
              <!-- Kolumna z miniaturą -->
              <template #thumbnail-cell="{ row }">
                <div class="w-16 h-12 overflow-hidden rounded-md">
 
                  <img 
                    :src="row.original.previewUrl" 
                    :alt="row.original.name" 
                    class="w-full h-full object-cover"
                  >
                </div>
              </template>
              
              <!-- Kolumna z nazwą i opisem -->
              <template #name-cell="{ row }">
                <div class="flex flex-col">
                  <span class="font-medium text-gray-900 dark:text-white">{{ row.original.name }}</span>
                  <span class="text-xs text-gray-500 truncate max-w-[200px]">{{ row.original.description }}</span>
                </div>
              </template>
              
              <!-- Kolumna ze statusem -->
              <template #status-cell="{ row }">
                <UBadge
                  :color="row.original.statusInfo.status === 'active' ? 'success' : row.original.statusInfo.status === 'pending' ? 'warning' : 'error'"
                  variant="subtle"
                  size="sm"
                >
                  {{ row.original.statusInfo.label }}
                </UBadge>
              </template>
              
              <!-- Kolumna z widocznością -->
              <template #visibility-cell="{ row }">
                <span class="capitalize">
                  {{ row.original.visibility }}
                </span>
              </template>
              
              <!-- Kolumna z typem pliku -->
              <template #type-cell="{ row }">
                <div class="flex items-center gap-1">
                  <UIcon
                    :name="row.original.mimeType.includes('image') ? 'i-heroicons-photo' : 'i-heroicons-film'"
                    class="w-4 h-4 text-gray-500"
                  />
                  <span class="text-sm">
                    {{ row.original.mimeType.split('/')[1] }}
                  </span>
                </div>
              </template>
              
              <!-- Kolumna z rozmiarem pliku -->
              <template #size-cell="{ row }">
                {{ formatFileSize(row.original.fileSize) }}
              </template>
              
              <!-- Kolumna z datą utworzenia -->
              <template #createdAt-cell="{ row }">
                {{ formatDate(row.original.createdAt) }}
              </template>
              
              <!-- Kolumna z akcjami -->
              <template #actions-cell="{ row }">
                <div class="flex items-center space-x-1">
                  <UTooltip text="Edit">
                    <UButton
                      color="neutral"
                      icon="i-heroicons-pencil-square"
                      variant="ghost"
                      size="xs"
                    />
                  </UTooltip>
                  
                  <UTooltip text="Download">
                    <UButton
                      color="neutral"
                      icon="i-heroicons-arrow-down-tray"
                      variant="ghost"
                      size="xs"
                    />
                  </UTooltip>
                  
                  <UTooltip text="Delete">
                    <UButton
                      color="neutral"
                      icon="i-heroicons-trash"
                      variant="ghost"
                      size="xs"
                    />
                  </UTooltip>
                  
                  <UTooltip text="Moderate">
                    <UButton
                      color="primary"
                      icon="i-heroicons-shield-check"
                      variant="ghost"
                      size="xs"
                      @click="handleMediaModerate(row.original)"
                    />
                  </UTooltip>
                </div>
              </template>
              
              <!-- Empty state -->
              <template #empty>
                <div class="py-6 text-center">
                  <UIcon name="i-heroicons-photo" class="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p class="text-sm text-gray-500">No media found</p>
                </div>
              </template>
            </UTable>
          </div>
          
          <!-- Empty State for no items -->
          <div v-if="videoItems.length === 0" class="flex flex-col items-center justify-center py-12">
            <UIcon name="i-heroicons-photo" class="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" />
            <h3 class="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">No media items found</h3>
            <p class="text-gray-500 dark:text-gray-400 mb-4 text-center max-w-md">
              Upload your first media file to get started with the media library.
            </p>
            <UButton color="primary" icon="i-heroicons-cloud-arrow-up">
              Upload Media
            </UButton>
          </div>
          
          <!-- Pagination -->
          <div class="flex justify-center mt-8">
            <UPagination 
              :total="100" 
              :default-page="1" 
              :ui="{ 
                item: 'rounded-lg',
                root: 'flex items-center gap-1' 
              }" 
            />
          </div>
        </div>
      </template>
    </XDashboardPage>
  </NuxtLayout>
</template>