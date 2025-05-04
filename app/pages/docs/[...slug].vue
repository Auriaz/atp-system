<!-- pages/docs/[...slug].vue -->
<script setup>
definePageMeta({
  layout: 'docs',

});

</script>

<template>
  <NuxtLayout>
    <XDocumentationGuard>
      <XDocumentationPage />
    </XDocumentationGuard>
  </NuxtLayout>
</template>