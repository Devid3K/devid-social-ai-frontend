<template>
  <n-card title="Generation Queue">
    <template #header-extra>
      <n-badge :value="pendingJobs.length" :max="99" type="info" />
    </template>
    <div v-if="jobs.length === 0" class="text-center py-6 text-gray-400 text-sm">
      No jobs in queue.
    </div>
    <div v-else class="space-y-2 max-h-64 overflow-y-auto">
      <VideoProgressCard
        v-for="job in jobs"
        :key="job.id"
        :job="job"
      />
    </div>
  </n-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { VideoJob } from '@/types/video.d'
import VideoProgressCard from './video-progress-card.vue'

const props = defineProps<{
  jobs: VideoJob[]
}>()

const pendingJobs = computed(() =>
  props.jobs.filter((j) => j.status === 'queued' || j.status === 'processing')
)
</script>
