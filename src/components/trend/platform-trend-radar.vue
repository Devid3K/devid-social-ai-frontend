<template>
  <n-card title="Platform Trend Radar">
    <div class="flex items-center justify-center h-48 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-200">
      <div class="text-center">
        <n-icon size="32" class="text-gray-400 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="2" /><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14" />
          </svg>
        </n-icon>
        <p class="text-sm text-gray-500">TODO: integrate radar chart</p>
      </div>
    </div>
  </n-card>
</template>

<script setup lang="ts">
defineProps<{
  data?: unknown
}>()
</script>
