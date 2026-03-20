<template>
  <n-card title="Suggested Hashtags">
    <div v-if="hashtags.length === 0" class="text-center py-6 text-gray-400 text-sm">
      No hashtags available.
    </div>
    <div v-else class="flex flex-wrap gap-2">
      <n-tag
        v-for="tag in hashtags"
        :key="tag"
        type="info"
        size="medium"
        class="cursor-pointer"
        @click="copyTag(tag)"
      >
        #{{ tag.replace(/^#/, '') }}
      </n-tag>
    </div>
    <template v-if="hashtags.length > 0" #footer>
      <n-button size="small" @click="copyAll">Copy All</n-button>
    </template>
  </n-card>
</template>

<script setup lang="ts">
import { useMessage } from 'naive-ui'

const props = defineProps<{
  hashtags: string[]
}>()

const message = useMessage()

async function copyTag(tag: string) {
  await navigator.clipboard.writeText(`#${tag.replace(/^#/, '')}`)
  message.success('Copied!')
}

async function copyAll() {
  const text = props.hashtags.map((t) => `#${t.replace(/^#/, '')}`).join(' ')
  await navigator.clipboard.writeText(text)
  message.success('All hashtags copied!')
}
</script>
