<template>
  <n-card title="Script Preview">
    <div
      v-if="script"
      class="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-mono bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-h-96 overflow-y-auto"
    >{{ script }}</div>
    <div v-else class="text-center py-8 text-gray-400 text-sm">
      No script to preview.
    </div>
    <template v-if="script" #footer>
      <div class="flex justify-end gap-2">
        <n-button size="small" @click="copyToClipboard">
          Copy Script
        </n-button>
      </div>
    </template>
  </n-card>
</template>

<script setup lang="ts">
import { useMessage } from 'naive-ui'

const props = defineProps<{
  script?: string
}>()

const message = useMessage()

async function copyToClipboard() {
  if (!props.script) return
  try {
    await navigator.clipboard.writeText(props.script)
    message.success('Script copied to clipboard!')
  } catch {
    message.error('Failed to copy.')
  }
}
</script>
