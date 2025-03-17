<script lang="ts" setup>
  interface MenuItem {
    label?: string
    name: string
    icon?: string
    to: string
    items?: MenuItem[]
  }

  defineProps<{
    link: MenuItem
  }>()

  const { closeMobile } = useNavbar()
  const open = ref(false)
</script>

<template>
  <div>
    <!-- Link bez podmenu -->
    <ULink v-if="!link.items" :to="link.to" color="primary-link" @click="closeMobile()">
      <div class="flex items-center space-x-2">
        <Icon v-if="link.icon" :name="link.icon" class="w-5 h-5" />
        <span>{{ link.label || link.name }}</span>
      </div>
    </ULink>

    <!-- Link z podmenu -->
    <div v-else class="relative duration-300" @mouseenter="open = true" @mouseleave="open = false">
      <div class="flex items-center space-x-2 cursor-pointer">
        <ULink :to="link.to">
          <div class="flex items-center space-x-2">
            <Icon v-if="link.icon" :name="link.icon" class="w-5 h-5" />
            <span>{{ link.label || link.name }}</span>
          </div>
        </ULink>
      </div>

      <!-- Podmenu -->
      <transition enter-active-class="transition ease-out duration-300" enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-200"
        leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
        <div v-if="open" class="absolute z-50 left-0 mt-2 w-56 rounded-md shadow-lg">
          <div class="rounded-md ring-1 ring-black ring-opacity-5 py-1 bg-white dark:bg-slate-800">
            <template v-for="(item, index) in link.items" :key="index">
              <ULink :to="item.to" class="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700"
                @click="closeMobile()">
                <div class="flex items-center space-x-2">
                  <Icon v-if="item.icon" :name="item.icon" class="w-4 h-4" />
                  <span>{{ item.label || item.name }}</span>
                </div>
              </ULink>

              <!-- Zagnieżdżone podmenu -->
              <template v-if="item.items">
                <ULink v-for="(subItem, subIndex) in item.items" :key="`${index}-${subIndex}`" :to="subItem.to"
                  class="block px-8 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700" @click="closeMobile()">
                  {{ subItem.label || subItem.name }}
                </ULink>
              </template>
            </template>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
