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

// Reactive computations for styling
const isExpanded = computed(() => props.expandedSections[props.item.to]);
const isItemActive = computed(() => props.isActive(props.item.to));
const hasActiveChildItem = computed(() => props.hasActiveChild(props.item));

// Obliczenia dla kolorów i stylów
const itemClasses = computed(() => {
  const base = 'flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200 ease-in-out group relative';
  const activeClasses = 'bg-primary-50 text-primary-700  border-primary-500 dark:bg-primary-900/20 dark:text-primary-300 dark:border-primary-400 font-medium shadow-sm';
  const inactiveClasses = 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white border-l-4 border-transparent hover:border-gray-200 dark:hover:border-gray-700';
  
  return `${base} ${isItemActive.value || hasActiveChildItem.value ? activeClasses : inactiveClasses}`;
});

const iconClasses = computed(() => {
  const base = 'h-5 w-5 mr-3 transition-colors duration-200';
  const activeColor = 'text-primary-600 dark:text-primary-400';
  const inactiveColor = 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300';
  
  return `${base} ${isItemActive.value || hasActiveChildItem.value ? activeColor : inactiveColor}`;
});

const chevronClasses = computed(() => {
  const base = 'h-4 w-4 transition-all duration-200 ease-in-out';
  const expanded = 'transform rotate-90';
  const activeColor = 'text-primary-600 dark:text-primary-400';
  const inactiveColor = 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300';
  
  return `${base} ${isExpanded.value ? expanded : ''} ${isItemActive.value || hasActiveChildItem.value ? activeColor : inactiveColor}`;
});
</script>

<template>
  <li :class="{ 
    'mb-1': level === 0,
    'mt-0.5': level > 0
  }"
  class="list-none"
  >
    <!-- Element ma dzieci - nagłówek rozwijalnej sekcji -->
    <template v-if="item.children && item.children.length > 0">      <UButton 
        @click="toggleSection(item.to)"
        :class="itemClasses"
        variant="ghost"
        size="sm"
        class="w-full justify-between hover:scale-[1.02] transform"
      >
        <div class="flex items-center">
          <UIcon 
            v-if="item.icon && typeof item.icon === 'string'" 
            :name="item.icon" 
            :class="iconClasses"
          />
          <span class="font-medium">{{ item.category }}</span>
          <!-- Badge z liczbą dokumentów -->
          <UBadge 
            v-if="item.children.length" 
            :label="`${item.children.length}`" 
            size="xs" 
            variant="soft" 
            class="ml-2 opacity-60"
          />
        </div>
        <UIcon 
          name="i-heroicons-chevron-right" 
          :class="chevronClasses"
        />
      </UButton>
      
      <!-- Podmenu sekcji - rekurencyjne renderowanie z animacją -->
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 max-h-0 transform -translate-y-2"
        enter-to-class="opacity-100 max-h-96 transform translate-y-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 max-h-96 transform translate-y-0"
        leave-to-class="opacity-0 max-h-0 transform -translate-y-2"
      >        
        <ul 
          v-if="expandedSections[item.to]"
          :class="{
            'mt-2 space-y-1 overflow-hidden': true,
            'ml-3 pl-3 border-l-2 border-gray-100 dark:border-blue-800': level < 2,
            'ml-3': level >= 2
          }"
          class="bg-white dark:bg-gray-900 list-none"
        >
          <XDocumentationSidebarItem
            v-for="child in item.children" 
            :key="child.to"
            :item="child"
            :level="level + 1"
            :is-active="isActive"
            :has-active-child="hasActiveChild"
            :expanded-sections="expandedSections"
            @toggle-section="toggleSection"
          />
        </ul>
      </Transition>
    </template>    
    
    <!-- Element nie ma dzieci - zwykły link -->
    <NuxtLink 
      v-else
      :to="item.to"
      :class="itemClasses"
      class="hover:scale-[1.01] transform"
      :style="level > 0 ? `margin-left: ${Math.min(level * 8, 24)}px` : ''"
    >      
      <UIcon
        v-if="item.icon && typeof item.icon === 'string' && level === 0" 
        :name="item.icon" 
        :class="iconClasses"
      />
      <!-- No bullet points for nested items -->
      <span class="flex-1">{{ item.title }}</span>
      
      <!-- Status indicator dla aktywnych elementów -->
      <div 
        v-if="isActive(item.to)"
        class="h-2 w-2 rounded-full bg-primary-500 animate-pulse"
      />
    </NuxtLink>
  </li>
</template>