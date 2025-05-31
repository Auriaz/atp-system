<script lang="ts" setup>
interface BreadcrumbItem {
  title: string;
  path?: string;
  icon?: string;
}

interface Props {
  currentPath: string;
  document?: {
    title?: string;
    category?: string;
    icon?: string;
  };
}

const props = defineProps<Props>();

// Generate breadcrumb items based on the current path
const breadcrumbItems = computed<BreadcrumbItem[]>(() => {
  const items: BreadcrumbItem[] = [
    {
      title: 'Dokumentacja',
      path: '/docs',
      icon: 'i-heroicons-home'
    }
  ];

  const pathSegments = props.currentPath.split('/').filter(Boolean);
  
  // Remove 'docs' from segments as it's already in the first item
  const contentSegments = pathSegments.slice(1);
  
  let currentPath = '/docs';
  
  for (let i = 0; i < contentSegments.length; i++) {
    const segment = contentSegments[i];
    currentPath += `/${segment}`;
    
    // For the last segment, use the document title if available
    if (i === contentSegments.length - 1 && props.document?.title) {
      items.push({
        title: props.document.title,
        icon: props.document.icon
      });
    } else {
      // Format segment name to be more readable
      const title = formatSegmentTitle(segment || '');
      
      // Only add path if it's not the last item
      items.push({
        title,
        path: i === contentSegments.length - 1 ? undefined : currentPath
      });
    }
  }

  return items;
});

// Helper function to format segment titles
function formatSegmentTitle(segment: string): string {
  // Remove number prefixes like "00.", "01.", etc.
  const withoutNumbers = segment.replace(/^\d+\./, '');
  
  // Convert to title case and replace hyphens with spaces
  return withoutNumbers
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
</script>

<template>
  <nav class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6 not-prose">
    <template v-for="(item, index) in breadcrumbItems" :key="item.path || item.title">
      <!-- Breadcrumb Item -->
      <div class="flex items-center">
        <NuxtLink
          v-if="item.path"
          :to="item.path"
          class="flex items-center hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          <UIcon 
            v-if="item.icon" 
            :name="item.icon" 
            class="w-4 h-4 mr-1 flex-shrink-0" 
          />
          <span class="truncate">{{ item.title }}</span>
        </NuxtLink>
        
        <span 
          v-else 
          class="flex items-center text-gray-900 dark:text-gray-100 font-medium"
        >
          <UIcon 
            v-if="item.icon" 
            :name="item.icon" 
            class="w-4 h-4 mr-1 flex-shrink-0" 
          />
          <span class="truncate">{{ item.title }}</span>
        </span>
      </div>
      
      <!-- Separator -->
      <UIcon 
        v-if="index < breadcrumbItems.length - 1"
        name="i-heroicons-chevron-right"
        class="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0"
      />
    </template>
  </nav>
</template>
