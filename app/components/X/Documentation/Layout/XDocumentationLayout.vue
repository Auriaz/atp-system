<script lang="ts" setup>

</script>

<template>
  <div class="relative w-full h-full box-border">
    <x-header>
      <slot name="header" />
    </x-header>

    <div class="container mx-auto min-h-[calc(100vh-55px)] flex justify- flex-row">
      <div class="hidden lg:block  h-full  rounded-lg p-4">
        <slot name="sidebar" />
      </div>
  
      <main class="flex-1 overflow-y-auto w-[calc(100% - 300px)] lg:w-[calc(100%-300px)] ml-0 lg:ml-64 transition-all duration-500">
        <div class="container mx-auto px-4 py-8">
          <!-- Użycie klasy 'prose' dla zawartości dokumentacji -->
          <div class="prose prose-primary dark:prose-invert max-w-none">
            <slot></slot>
          </div>
        </div>
      </main>
    </div>
      
    <x-footer>
      <slot name="footer" />
    </x-footer>
  </div>
</template>