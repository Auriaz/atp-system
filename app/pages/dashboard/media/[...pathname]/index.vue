<script lang="ts" setup>
const route = useRoute()

const { pathname } = route.params


const path = Array.isArray(pathname) && pathname.length > 0 ? pathname.join('/') : ''

const image = await $fetch(`/api/media/${path}`)

console.log('pathname', image)

</script>

<template>
  <div>

  </div>
</template>