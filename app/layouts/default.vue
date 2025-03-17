<script lang="ts" setup>

</script>

<template>
  <XLayout>
    <template #header>
      <div class="w-full flex flex-col lg:flex-row gap-8">
        <x-navbar :container="true" :links="[
          { name: 'Home', to: '/' },
          { name: 'About', to: '/about' },
          { name: 'Contact', to: '/contact' },
        ]">
          <template #logo>
            <XLogo />
          </template>

        </x-navbar>
      </div>
    </template>

    <template #main>
      <slot />
    </template>

    <template #footer></template>
  </XLayout>
</template>