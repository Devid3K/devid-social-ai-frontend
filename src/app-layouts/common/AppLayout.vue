<template>
  <component :is="layoutComponent" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import BlankLayout from '@/app-layouts/Blank/index.vue'
import VerticalNavLayout from '@/app-layouts/VerticalNav/index.vue'

const route = useRoute()

const layoutComponent = computed(() => {
  const layout = route.meta?.layout as string | undefined
  if (layout === 'Blank') return BlankLayout
  return VerticalNavLayout
})
</script>
