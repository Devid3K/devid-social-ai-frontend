<template>
  <n-card size="small">
    <div class="flex items-center gap-3">
      <n-icon size="20" :class="statusColor">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
        </svg>
      </n-icon>
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between mb-1">
          <p class="text-sm font-medium text-white truncate">
            Job #{{ job.id }}
          </p>
          <n-tag size="small" :type="statusTagType">{{ job.status }}</n-tag>
        </div>
        <n-progress
          v-if="job.status === 'processing' || job.status === 'queued'"
          type="line"
          :percentage="job.progress ?? 0"
          :height="6"
          :border-radius="4"
          :fill-border-radius="4"
        />
        <p class="text-xs text-slate-300 mt-1">
          {{ job.createdAt ? new Date(job.createdAt).toLocaleString() : '' }}
        </p>
      </div>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { VideoJob } from '@/types/video.d'
import { VideoJobStatus } from '@/enums'

const props = defineProps<{
  job: VideoJob
}>()

const statusColor = computed(() => {
  switch (props.job.status) {
    case VideoJobStatus.COMPLETED: return 'text-green-500'
    case VideoJobStatus.FAILED: return 'text-red-500'
    case VideoJobStatus.PROCESSING: return 'text-rose-400'
    default: return 'text-gray-400'
  }
})

const statusTagType = computed(() => {
  switch (props.job.status) {
    case VideoJobStatus.COMPLETED: return 'success'
    case VideoJobStatus.FAILED: return 'error'
    case VideoJobStatus.PROCESSING: return 'info'
    default: return 'default'
  }
})
</script>
