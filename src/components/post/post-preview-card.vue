<template>
  <n-card hoverable>
    <div class="flex items-start justify-between gap-2 mb-2">
      <div class="flex items-center gap-2 flex-wrap">
        <PlatformIcon
          v-for="platform in post.platforms"
          :key="platform"
          :platform="platform"
          show-label
        />
      </div>
      <n-tag size="small" :type="statusTagType">{{ post.status }}</n-tag>
    </div>
    <p class="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
      {{ post.caption }}
    </p>
    <template #footer>
      <div class="flex items-center justify-between text-xs text-gray-400">
        <span v-if="post.scheduledAt">
          Scheduled: {{ new Date(post.scheduledAt).toLocaleString() }}
        </span>
        <span v-else>Draft</span>
        <span>{{ post.createdAt ? new Date(post.createdAt).toLocaleDateString() : '' }}</span>
      </div>
    </template>
  </n-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Post } from '@/types/post.d'
import { PostStatus } from '@/enums'
import PlatformIcon from '@/components/common/platform-icon.vue'

const props = defineProps<{
  post: Post
}>()

const statusTagType = computed(() => {
  switch (props.post.status) {
    case PostStatus.PUBLISHED: return 'success'
    case PostStatus.SCHEDULED: return 'info'
    case PostStatus.FAILED: return 'error'
    default: return 'default'
  }
})
</script>
