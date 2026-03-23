<template>
  <n-card :title="title ?? 'ตัวอย่างบทละคร'">
    <div
      v-if="script"
      class="whitespace-pre-wrap text-sm text-slate-200 leading-relaxed font-mono bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-h-96 overflow-y-auto"
    >{{ script }}</div>
    <div v-else class="text-center py-12 text-gray-400 text-sm">
      <div class="text-4xl mb-3">📝</div>
      <p>เลือกบทละครจากด้านล่างเพื่อดูตัวอย่าง</p>
      <p class="text-xs mt-1">หรือสร้างบทละครใหม่จากฟอร์มด้านซ้าย</p>
    </div>
    <template v-if="script" #footer>
      <div class="flex justify-end gap-2">
        <n-button size="small" @click="copyToClipboard">
          คัดลอกบทละคร
        </n-button>
      </div>
    </template>
  </n-card>
</template>

<script setup lang="ts">
import { useMessage } from 'naive-ui'

const props = defineProps<{
  script?: string | null
  title?: string
}>()

const message = useMessage()

async function copyToClipboard() {
  if (!props.script) return
  try {
    await navigator.clipboard.writeText(props.script)
    message.success('คัดลอกบทละครแล้ว!')
  } catch {
    message.error('ไม่สามารถคัดลอกได้')
  }
}
</script>
