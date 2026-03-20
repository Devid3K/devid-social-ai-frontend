<template>
  <n-tag :type="tagType" size="small" round>
    <template #icon>
      <n-icon>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </n-icon>
    </template>
    {{ score }}/100
  </n-tag>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  score: number
}>()

const tagType = computed(() => {
  if (props.score >= 70) return 'success'
  if (props.score >= 40) return 'warning'
  return 'error'
})
</script>
