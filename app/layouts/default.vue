<script lang="ts" setup>
</script>

<template>
  <XLayout>
    <template #header>
      <div class="w-full flex flex-col lg:flex-row gap-8">
        <x-navbar>
          <template #logo>
            <XLogo size="24"/>
          </template>          
          
          <template #action>

          </template>

        </x-navbar>
      </div>
    </template>

    <template #main>
      <slot />
    </template>

    <template #footer>
      <x-footer/>
    </template>
  </XLayout>
</template>

<style scoped>
/* Dodatkowe style dla stopki */
.footer-icon-link:hover {
  transform: translateY(-2px);
}
</style>