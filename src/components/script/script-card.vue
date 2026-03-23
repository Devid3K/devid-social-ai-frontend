<template>
  <n-card
    class="cursor-pointer transition-all duration-150 hover:shadow-md"
    :class="isSelected ? 'ring-2 ring-indigo-500' : ''"
    hoverable
    @click="$emit('select', index)"
  >
    <div class="flex items-start justify-between gap-2 mb-2">
      <div class="flex items-center gap-2">
        <n-tag size="small" :type="isSelected ? 'info' : 'default'">
          Script {{ index + 1 }}
        </n-tag>
        <span v-if="script.title" class="text-xs font-medium text-gray-500">
          {{ script.title }}
        </span>
      </div>
      <ViralScoreBadge v-if="script.viralScore != null" :score="script.viralScore" />
    </div>

    <!-- Hook preview -->
    <div v-if="script.hooks?.length" class="mb-2">
      <p class="text-xs text-rose-400 dark:text-rose-300 font-medium italic">
        "{{ script.hooks[0] }}"
      </p>
    </div>

    <!-- Content preview -->
    <p class="text-sm text-slate-200 line-clamp-4 whitespace-pre-wrap">
      {{ previewText }}
    </p>

    <!-- Hashtags -->
    <div v-if="script.hashtags?.length" class="flex flex-wrap gap-1 mt-2">
      <span
        v-for="tag in script.hashtags.slice(0, 3)"
        :key="tag"
        class="text-xs text-blue-500"
      >{{ tag }}</span>
      <span v-if="script.hashtags.length > 3" class="text-xs text-gray-400">
        +{{ script.hashtags.length - 3 }}
      </span>
    </div>

    <template #footer>
      <div class="flex items-center justify-between">
        <span class="text-xs text-gray-400">
          {{ (script.content ?? '').length }} ตัวอักษร
        </span>
        <n-button
          size="small"
          :type="isSelected ? 'primary' : 'default'"
          @click.stop="$emit('select', index)"
        >
          {{ isSelected ? 'เลือกแล้ว' : 'เลือก' }}
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
  const text = props.script.content ?? ''
  return text.slice(0, 300)
})
</script>
