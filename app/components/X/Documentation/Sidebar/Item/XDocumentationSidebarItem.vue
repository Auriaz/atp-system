<script lang="ts" setup>
// Props dla komponentu NavItem
const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  level: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Function,
    required: true
  },
  hasActiveChild: {
    type: Function,
    required: true
  },
  expandedSections: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['toggleSection']);

// Przesyłanie żądania przełączania sekcji do rodzica
function toggleSection(path: string) {
  emit('toggleSection', path);
}
</script>

<template>
  <li :class="{ 
    'mb-2': level === 0,
    'mt-1': level > 0
  }">
    <!-- Element ma dzieci - nagłówek rozwijalnej sekcji -->
    <template v-if="item.children && item.children.length > 0">
      <UButton 
        @click="toggleSection(item.path)"
        class="w-full flex items-center justify-between px-3 py-1.5 text-sm rounded-md transition-colors"
        variant="link"
        :class="[
          hasActiveChild(item) || isActive(item.path) ? 
            'text-primary-600 dark:text-primary-400  font-medium' : 
            'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
        ]"
      >
        <div class="flex items-center">
          <UIcon 
            v-if="item.icon && typeof item.icon === 'string'" 
            :name="item.icon" 
            class="h-5 w-5 mr-2"
            :class="hasActiveChild(item) || isActive(item.path) ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'" 
          />
          <span>{{ item.category }}</span>
        </div>
        <UIcon 
          :name="expandedSections[item.path] ? 'i-heroicons-chevron-down' : 'i-heroicons-chevron-right'" 
          class="h-4 w-4 transition-transform"
          :class="hasActiveChild(item) || isActive(item.path) ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'" 
        />
      </UButton>
      
      <!-- Podmenu sekcji - rekurencyjne renderowanie -->
      <ul 
        v-if="expandedSections[item.path]"
        :class="{
          'mt-1 space-y-1': true,
          'ml-2 pl-2 border-l border-gray-200 dark:border-gray-700': level < 2,
          'ml-2': level >= 2
        }"
      >
        <XDocumentationSidebarItem
          v-for="child in item.children" 
          :key="child.path"
          :item="child"
          :level="level + 1"
          :is-active="isActive"
          :has-active-child="hasActiveChild"
          :expanded-sections="expandedSections"
          @toggle-section="toggleSection"
        />
      </ul>
    </template>

    <!-- Element nie ma dzieci - zwykły link -->
    <NuxtLink 
      v-else
      :to="item.path"
      class="flex items-center px-3 py-1.5 text-sm rounded-md transition-colors"
      :class="[
        isActive(item.path) ? 
          ' text-primary-600  dark:bg-opacity-30 dark:text-primary-400' : 
          'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
      ]"
      :style="level > 0 ? `margin-left: ${Math.min(level * 4, 16)}px` : ''"
    >
      <UIcon 
        v-if="item.icon && typeof item.icon === 'string' && level === 0" 
        :name="item.icon" 
        class="h-5 w-5 mr-2"
        :class="isActive(item.path) ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'" 
      />
      <span>{{ item.title }}</span>
    </NuxtLink>
  </li>
</template>