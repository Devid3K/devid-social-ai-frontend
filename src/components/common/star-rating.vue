<template>
  <div class="flex items-center gap-0.5">
    <span
      v-for="i in 5"
      :key="i"
      class="text-lg leading-none"
      :class="i <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'"
    >
      &#9733;
    </span>
    <span v-if="showValue" class="ml-1 text-sm text-gray-500">
      {{ rating.toFixed(1) }}
    </span>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    rating: number
    showValue?: boolean
  }>(),
  { showValue: false }
)
</script>
