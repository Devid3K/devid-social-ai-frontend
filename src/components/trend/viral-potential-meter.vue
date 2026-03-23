<template>
  <n-card title="Viral Potential">
    <div class="flex flex-col items-center gap-4">
      <div class="relative w-32 h-32">
        <svg viewBox="0 0 36 36" class="w-32 h-32 -rotate-90">
          <circle
            cx="18" cy="18" r="15.915"
            fill="none"
            stroke="#e5e7eb"
            stroke-width="3"
          />
          <circle
            cx="18" cy="18" r="15.915"
            fill="none"
            :stroke="meterColor"
            stroke-width="3"
            stroke-linecap="round"
            :stroke-dasharray="`${score} 100`"
            class="transition-all duration-700"
          />
        </svg>
        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <span class="text-2xl font-bold" :style="{ color: meterColor }">{{ score }}</span>
          <span class="text-xs text-gray-500">/ 100</span>
        </div>
      </div>
      <n-tag :type="tagType" size="medium">{{ label }}</n-tag>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  score: number
}>()

const meterColor = computed(() => {
  if (props.score >= 70) return '#22c55e'
  if (props.score >= 40) return '#f59e0b'
  return '#ef4444'
})

const tagType = computed(() => {
  if (props.score >= 70) return 'success'
  if (props.score >= 40) return 'warning'
  return 'error'
})

const label = computed(() => {
  if (props.score >= 70) return 'High Potential'
  if (props.score >= 40) return 'Medium Potential'
  return 'Low Potential'
})
</script>
