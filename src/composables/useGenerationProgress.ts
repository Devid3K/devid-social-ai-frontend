import { ref } from 'vue'
import { useRealtimeSocket } from '@/composables/useRealtimeSocket'
import { useVideoStore } from '@/stores/video'

export interface VideoProgressEvent {
  jobId: number
  progress: number
}

export interface VideoCompleteEvent {
  jobId: number
  videoUrl: string
  thumbnailUrl: string
}

export interface VideoFailedEvent {
  jobId: number
  errorMessage: string
}

/**
 * Composable for tracking video generation progress via socket events.
 * Listens to `video:progress`, `video:complete`, and `video:failed` events.
 */
export function useGenerationProgress() {
  const videoStore = useVideoStore()
  const { on } = useRealtimeSocket()

  const activeJobId = ref<number | null>(null)
  const progress = ref<number>(0)
  const isComplete = ref<boolean>(false)
  const isFailed = ref<boolean>(false)
  const errorMessage = ref<string | null>(null)
  const resultVideoUrl = ref<string | null>(null)

  on<VideoProgressEvent>('video:progress', (data) => {
    if (activeJobId.value !== null && data.jobId !== activeJobId.value) return

    progress.value = data.progress
    // Update progress in video store so the jobs list stays in sync
    videoStore.updateJobProgress(data.jobId, data.progress)
  })

  on<VideoCompleteEvent>('video:complete', (data) => {
    if (activeJobId.value !== null && data.jobId !== activeJobId.value) return

    progress.value = 100
    isComplete.value = true
    resultVideoUrl.value = data.videoUrl
    // TODO: update the job in video store with completed status and URLs
  })

  on<VideoFailedEvent>('video:failed', (data) => {
    if (activeJobId.value !== null && data.jobId !== activeJobId.value) return

    isFailed.value = true
    errorMessage.value = data.errorMessage
    // TODO: update the job in video store with failed status and error message
  })

  /**
   * Start tracking a specific video job.
   * Call this after triggering a generate request.
   */
  function trackJob(jobId: number) {
    activeJobId.value = jobId
    progress.value = 0
    isComplete.value = false
    isFailed.value = false
    errorMessage.value = null
    resultVideoUrl.value = null
  }

  /**
   * Reset tracking state.
   */
  function reset() {
    activeJobId.value = null
    progress.value = 0
    isComplete.value = false
    isFailed.value = false
    errorMessage.value = null
    resultVideoUrl.value = null
  }

  return {
    activeJobId,
    progress,
    isComplete,
    isFailed,
    errorMessage,
    resultVideoUrl,
    trackJob,
    reset,
  }
}
