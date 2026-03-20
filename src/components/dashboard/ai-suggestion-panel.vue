<template>
  <n-card title="AI Suggestions">
    <template #header-extra>
      <AiThinkingAnimation v-if="loading" />
    </template>
    <div v-if="suggestions.length === 0 && !loading" class="text-center py-6 text-gray-500 dark:text-gray-400 text-sm">
      No suggestions available.
    </div>
    <div class="space-y-3">
      <div
        v-for="(suggestion, i) in suggestions"
        :key="i"
        class="flex items-start gap-3 p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800"
      >
        <n-icon class="text-indigo-500 flex-shrink-0 mt-0.5" size="16">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </n-icon>
        <p class="text-sm text-gray-700 dark:text-gray-300">{{ suggestion.message ?? suggestion }}</p>
      </div>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import type { AiSuggestion } from '@/types/dashboard.d'
import AiThinkingAnimation from '@/components/common/ai-thinking-animation.vue'

defineProps<{
  suggestions: AiSuggestion[]
  loading?: boolean
}>()
</script>
