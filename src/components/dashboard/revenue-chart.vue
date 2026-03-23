<template>
  <n-card title="Revenue">
    <div class="flex items-center justify-center h-48 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-200">
      <div class="text-center">
        <n-icon size="32" class="text-gray-400 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </n-icon>
        <p class="text-sm text-gray-500">TODO: integrate chart library</p>
      </div>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import type { RevenueData } from '@/types/dashboard.d'

defineProps<{
  data?: RevenueData[]
}>()
</script>
