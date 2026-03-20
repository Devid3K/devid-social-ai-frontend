<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Video Generation</h1>
      <AiThinkingAnimation v-if="videoStore.generating" />
    </div>

    <n-alert v-if="videoStore.error" type="error" :title="videoStore.error" closable />

    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <!-- Style picker -->
      <div class="space-y-4">
        <VideoStylePicker
          :styles="videoStore.styles"
          :loading="videoStore.loading"
          @select="handleStyleSelect"
        />

        <!-- Generate button -->
        <n-card v-if="selectedStyleId">
          <div class="space-y-3">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Selected style: <span class="font-medium text-indigo-600">{{ selectedStyleId }}</span>
            </p>
            <n-input
              v-model:value="scriptId"
              placeholder="Script ID (optional)"
              size="small"
            />
            <n-button
              type="primary"
              :loading="videoStore.generating"
              block
              @click="handleGenerate"
            >
              Generate Video
            </n-button>
          </div>
        </n-card>
      </div>

      <!-- Queue + preview -->
      <div class="space-y-4">
        <GenerationQueueStatus :jobs="videoStore.list" />
        <VideoPreviewPlayer :video-url="previewUrl ?? undefined" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useVideoStore } from '@/stores/video'
import VideoStylePicker from '@/components/video/video-style-picker.vue'
import GenerationQueueStatus from '@/components/video/generation-queue-status.vue'
import VideoPreviewPlayer from '@/components/video/video-preview-player.vue'
import AiThinkingAnimation from '@/components/common/ai-thinking-animation.vue'

const videoStore = useVideoStore()
const selectedStyleId = ref<string | number | null>(null)
const scriptId = ref('')
const previewUrl = ref<string | null>(null)

onMounted(async () => {
  await Promise.all([videoStore.fetch(), videoStore.fetchStyles()])
})

function handleStyleSelect(id: string | number) {
  selectedStyleId.value = id
}

async function handleGenerate() {
  if (!selectedStyleId.value) return
  const job = await videoStore.generate({
    styleId: selectedStyleId.value as any,
    scriptId: scriptId.value ? Number(scriptId.value) : undefined,
  } as any)
  if ((job as any)?.videoUrl) previewUrl.value = (job as any).videoUrl
}
</script>
