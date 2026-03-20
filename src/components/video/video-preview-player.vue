<template>
  <div class="w-full">
    <video
      v-if="videoUrl"
      :src="videoUrl"
      controls
      class="w-full rounded-lg bg-black max-h-96"
      preload="metadata"
    />
    <div v-else class="flex items-center justify-center h-48 bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
      <div class="text-center">
        <n-icon size="32" class="text-gray-400 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
          </svg>
        </n-icon>
        <p class="text-sm text-gray-500 dark:text-gray-400">No video available</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  videoUrl?: string
}>()
</script>
