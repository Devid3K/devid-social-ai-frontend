<template>
  <n-card title="Select Video Style">
    <div v-if="loading" class="flex justify-center py-8">
      <n-spin />
    </div>
    <div v-else-if="styles.length === 0" class="text-center py-8 text-gray-400 text-sm">
      No styles available.
    </div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      <div
        v-for="style in styles"
        :key="style.id ?? style.name"
        class="cursor-pointer rounded-lg border-2 p-3 transition-all duration-150 hover:shadow-md"
        :class="
          selected === (style.id ?? style.name)
            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
            : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'
        "
        @click="handleSelect(style.id ?? style.name)"
      >
        <div class="aspect-video bg-gray-100 dark:bg-gray-800 rounded mb-2 flex items-center justify-center">
          <img
            v-if="style.thumbnail"
            :src="style.thumbnail"
            :alt="style.name"
            class="w-full h-full object-cover rounded"
          />
          <n-icon v-else size="24" class="text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
          </n-icon>
        </div>
        <p class="text-sm font-medium text-gray-900 dark:text-white">{{ style.name }}</p>
        <p v-if="style.description" class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
          {{ style.description }}
        </p>
      </div>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { VideoStyle } from '@/types/video.d'

defineProps<{
  styles: VideoStyle[]
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'select', styleId: string | number): void
}>()

const selected = ref<string | number | null>(null)

function handleSelect(id: string | number) {
  selected.value = id
  emit('select', id)
}
</script>
