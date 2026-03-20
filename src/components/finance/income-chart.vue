<template>
  <n-card :title="title">
    <div class="flex items-center justify-center h-48 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700">
      <div class="text-center">
        <n-icon size="32" class="text-gray-400 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
          </svg>
        </n-icon>
        <p class="text-sm text-gray-500 dark:text-gray-400">TODO: integrate chart library</p>
      </div>
    </div>
  </n-card>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    data?: unknown[]
  }>(),
  { title: 'Income / Expense' }
)
</script>
