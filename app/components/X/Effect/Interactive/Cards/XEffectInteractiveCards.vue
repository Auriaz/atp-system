<script lang="ts" setup>
const card = ref<HTMLElement[]>()

onMounted(() => {
  card.value?.forEach((el, i) => {
    const { isOutside } = useMouseInElement(el)
    const adjacentCards = [i - 1, i + 1, i - 4, i + 4]
      .filter((index) => {
        if(index < 0 || index > 15) return false
        // jeżeli 
        if(i % 4 === 0 && index === i - 1) return false
        if(i % 4 === 3 && index === i + 1) return false
        return true
      })
      .map((index) => card.value?.[index])

    watch(isOutside, () => {
      if(!isOutside.value) {
        el.classList.add('card-hover')
        adjacentCards.forEach((card) => {
          card?.classList.add('card-adjacent')
        })
      } else {
        el.classList.remove('card-hover')
        adjacentCards.forEach((card) => {
          card?.classList.remove('card-adjacent')
        })
      }
    })
  })
})
</script>

<template>
  <div class="grid skew-y-2 grid-cols-4 ng-gray-950">
    <div
      v-for="(item, index) in 16"
      :key="index"
      ref="card"
      class="col-span-1 flex aspect-square origin-center items-center justify-center rounded  transition-all duration-300 shadow-[0_0_5px_#292e32]"

    >
      <nuxt-img 
        :src="`https://picsum.photos/500/400?random=${index}`" 
        :alt="`Training image ${index + 1}`"
        class="w-full h-full object-cover rounded"
        
      />
    </div>
  </div>
</template>

<style scoped>
.card-hover {
  z-index: 50;
  transform: scale(115%) translateX(-30px) translateY(-20px);
  box-shadow: 0 0 20px var(--color-primary-600);
}

.card-adjacent {
  z-index: 10;
  transform: scale(102%) translateX(-10px) translateY(-10px);
  box-shadow: 0 0 20px var(--color-primary-600);
}
</style>