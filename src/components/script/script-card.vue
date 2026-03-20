<template>
  <n-card
    class="cursor-pointer transition-all duration-150 hover:shadow-md"
    :class="isSelected ? 'ring-2 ring-indigo-500' : ''"
    hoverable
    @click="$emit('select', index)"
  >
    <div class="flex items-start justify-between gap-2 mb-2">
      <n-tag size="small" :type="isSelected ? 'info' : 'default'">
        Script {{ index + 1 }}
      </n-tag>
      <ViralScoreBadge v-if="script.viralScore != null" :score="script.viralScore" />
    </div>
    <p class="text-sm text-gray-700 dark:text-gray-300 line-clamp-4 whitespace-pre-wrap">
      {{ previewText }}
    </p>
    <template #footer>
      <div class="flex items-center justify-between">
        <span class="text-xs text-gray-400">
          {{ (script.content ?? script.script ?? '').length }} chars
        </span>
        <n-button
          size="small"
          :type="isSelected ? 'primary' : 'default'"
          @click.stop="$emit('select', index)"
        >
          {{ isSelected ? 'Selected' : 'Select' }}
        </n-button>
      </div>
    </template>
  </n-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ViralScoreBadge from '@/components/common/viral-score-badge.vue'

const props = defineProps<{
  script: Record<string, any>
  index: number
  isSelected?: boolean
}>()

defineEmits<{
  (e: 'select', index: number): void
}>()

const previewText = computed(() => {
  const text = props.script.content ?? props.script.script ?? ''
  return text.slice(0, 300)
})
</script>
