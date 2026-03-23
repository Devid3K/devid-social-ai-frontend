<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">สร้างวิดีโอ AI</h1>
        <p class="text-sm text-slate-400 mt-1">เลือกสไตล์ ใส่ prompt แล้ว AI จะสร้างวิดีโอให้</p>
      </div>
      <AiThinkingAnimation v-if="videoStore.generating" label="กำลังส่งงาน..." />
    </div>

    <n-alert v-if="videoStore.error" type="error" closable @close="videoStore.error = null">
      {{ videoStore.error }}
    </n-alert>

    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <!-- Left: Style picker + Generate form -->
      <div class="space-y-4">
        <!-- Style Picker -->
        <n-card title="เลือกสไตล์วิดีโอ">
          <div v-if="videoStore.styles.length === 0" class="text-center py-6 text-gray-400 text-sm">
            กำลังโหลดสไตล์...
          </div>
          <div v-else class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div
              v-for="style in videoStore.styles"
              :key="style.id"
              class="cursor-pointer rounded-lg border-2 p-3 transition-all duration-150 hover:shadow-md text-center"
              :class="
                selectedStyle === style.id
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-gray-200 hover:border-indigo-300'
              "
              @click="selectedStyle = style.id"
            >
              <div class="text-2xl mb-1">{{ styleEmoji(style.id) }}</div>
              <p class="text-sm font-medium text-gray-900">{{ style.label }}</p>
              <p class="text-xs text-gray-500 mt-0.5">{{ style.description }}</p>
            </div>
          </div>
        </n-card>

        <!-- Generate Form -->
        <n-card title="รายละเอียดวิดีโอ">
          <n-form label-placement="top" @submit.prevent="handleGenerate">
            <n-form-item label="Prompt (อธิบายฉากวิดีโอ)">
              <n-input
                v-model:value="prompt"
                type="textarea"
                :rows="3"
                placeholder="เช่น สาวออฟฟิศนั่งทำงาน หยิบเซรั่มขึ้นมาทา แสงธรรมชาติสวย..."
              />
            </n-form-item>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <n-form-item label="Provider">
                <n-select
                  v-model:value="provider"
                  :options="providerOptions"
                  placeholder="เลือก provider"
                />
              </n-form-item>
              <n-form-item label="Aspect Ratio">
                <n-select
                  v-model:value="aspectRatio"
                  :options="aspectOptions"
                />
              </n-form-item>
              <n-form-item label="ความยาว (วินาที)">
                <n-input-number
                  v-model:value="durationSeconds"
                  :min="3"
                  :max="30"
                  class="w-full"
                />
              </n-form-item>
            </div>

            <n-form-item label="Script ID (เชื่อมกับบทละคร)">
              <n-input-number
                v-model:value="scriptId"
                :min="1"
                placeholder="(ไม่บังคับ)"
                class="w-full"
                clearable
              />
            </n-form-item>

            <n-button
              type="primary"
              attr-type="submit"
              :loading="videoStore.generating"
              :disabled="!prompt || !selectedStyle"
              block
              size="large"
            >
              {{ videoStore.generating ? 'กำลังส่ง...' : 'เริ่มสร้างวิดีโอ' }}
            </n-button>
          </n-form>
        </n-card>
      </div>

      <!-- Right: Queue + Video preview -->
      <div class="space-y-4">
        <!-- Queue Status -->
        <n-card title="คิวงานวิดีโอ">
          <template #header-extra>
            <n-badge :value="videoStore.pendingJobs.length" :max="99" type="info" />
          </template>
          <LoadingSpinner v-if="videoStore.loading" size="small" />
          <div v-else-if="videoStore.list.length === 0" class="text-center py-6 text-gray-400 text-sm">
            ยังไม่มีงาน — สร้างวิดีโอแรกจากด้านซ้าย
          </div>
          <div v-else class="space-y-2 max-h-80 overflow-y-auto">
            <div
              v-for="job in videoStore.list"
              :key="job.id"
              class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
              @click="selectJob(job)"
            >
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-1">
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-medium text-gray-900">
                      Job #{{ job.id }}
                    </span>
                    <n-tag size="small" :type="statusTagType(job.status)">
                      {{ statusLabel(job.status) }}
                    </n-tag>
                  </div>
                  <n-button
                    v-if="job.status === 'queued' || job.status === 'failed'"
                    size="tiny"
                    type="error"
                    quaternary
                    @click.stop="videoStore.deleteJob(job.id)"
                  >
                    ลบ
                  </n-button>
                </div>
                <n-progress
                  v-if="job.status === 'processing' || job.status === 'queued'"
                  type="line"
                  :percentage="job.progress"
                  :height="6"
                  :border-radius="4"
                />
                <div class="flex items-center gap-2 mt-1">
                  <n-tag size="small">{{ job.styleTemplate }}</n-tag>
                  <n-tag size="small" type="info">{{ job.provider }}</n-tag>
                  <span class="text-xs text-gray-400 ml-auto">
                    {{ formatDate(job.createdAt) }}
                  </span>
                </div>
                <p v-if="job.errorMessage" class="text-xs text-red-500 mt-1 truncate">
                  {{ job.errorMessage }}
                </p>
              </div>
            </div>
          </div>
        </n-card>

        <!-- Video Preview -->
        <n-card title="ตัวอย่างวิดีโอ">
          <video
            v-if="previewUrl"
            :src="previewUrl"
            controls
            class="w-full rounded-lg bg-black max-h-96"
            preload="metadata"
          />
          <div v-else class="flex items-center justify-center h-48 bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
            <div class="text-center">
              <div class="text-4xl mb-2">🎬</div>
              <p class="text-sm text-gray-500">เลือกงานที่เสร็จแล้วเพื่อดูวิดีโอ</p>
            </div>
          </div>
        </n-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useVideoStore } from '@/stores/video'
import type { VideoJob } from '@/types/video.d'
import AiThinkingAnimation from '@/components/common/ai-thinking-animation.vue'
import LoadingSpinner from '@/components/common/loading-spinner.vue'

const videoStore = useVideoStore()

const selectedStyle = ref<string | null>(null)
const prompt = ref('')
const provider = ref<string>('kling')
const aspectRatio = ref('9:16')
const durationSeconds = ref(5)
const scriptId = ref<number | null>(null)
const previewUrl = ref<string | null>(null)

const providerOptions = [
  { label: 'Kling AI (แนะนำ)', value: 'kling' },
  { label: 'Replicate', value: 'replicate' },
]

const aspectOptions = [
  { label: '9:16 (Vertical — TikTok/Reels)', value: '9:16' },
  { label: '16:9 (Horizontal)', value: '16:9' },
  { label: '1:1 (Square)', value: '1:1' },
]

onMounted(async () => {
  await Promise.all([videoStore.fetch(), videoStore.fetchStyles()])
})

async function handleGenerate() {
  if (!prompt.value || !selectedStyle.value) return

  await videoStore.generate({
    prompt: prompt.value,
    provider: provider.value as 'kling' | 'replicate',
    style: selectedStyle.value,
    durationSeconds: durationSeconds.value,
    aspectRatio: aspectRatio.value,
    scriptId: scriptId.value ?? undefined,
  })
}

function selectJob(job: VideoJob) {
  videoStore.current = job
  previewUrl.value = job.videoUrl
}

function styleEmoji(id: string): string {
  const map: Record<string, string> = {
    anime: '🎌',
    realistic: '📸',
    drama: '🎭',
    kawaii: '💖',
    cinematic: '🎬',
    nature: '🌿',
    dark: '🌙',
  }
  return map[id] ?? '🎥'
}

function statusTagType(status: string) {
  switch (status) {
    case 'completed': return 'success'
    case 'failed': return 'error'
    case 'processing': return 'info'
    default: return 'default'
  }
}

function statusLabel(status: string) {
  const map: Record<string, string> = {
    queued: 'รอคิว',
    processing: 'กำลังสร้าง',
    completed: 'เสร็จแล้ว',
    failed: 'ล้มเหลว',
  }
  return map[status] ?? status
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>
