<template>
  <div class="p-8">
    <h1>Content Test Page</h1>
    <h2>Navigation Data:</h2>
    <pre>{{ JSON.stringify(navigation, null, 2) }}</pre>
    
    <h2>All Docs:</h2>
    <pre>{{ JSON.stringify(allDocs, null, 2) }}</pre>
    
    <h2>Error:</h2>
    <pre v-if="error">{{ error }}</pre>
  </div>
</template>

<script setup>
const { data: navigation, error: navError } = await useAsyncData('test-nav', async () => {
  try {
    console.log('Trying to fetch navigation...')
    const result = await queryContent('/docs').find()
    console.log('Navigation result:', result)
    return result
  } catch (err) {
    console.error('Navigation error:', err)
    throw err
  }
})

const { data: allDocs, error: docsError } = await useAsyncData('test-all-docs', async () => {
  try {
    console.log('Trying to fetch all docs...')
    const result = await queryContent().find()
    console.log('All docs result:', result)
    return result
  } catch (err) {
    console.error('All docs error:', err)
    throw err
  }
})

const error = computed(() => navError.value || docsError.value)
</script>
