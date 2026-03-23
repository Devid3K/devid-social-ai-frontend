<template>
  <n-card hoverable class="relative">
    <div class="flex items-start justify-between gap-2 mb-2">
      <div class="flex items-center gap-2">
        <n-tag size="small" :type="platformTagType">{{ post.platform }}</n-tag>
        <span v-if="post.socialAccount" class="text-xs text-gray-400">
          {{ post.socialAccount.accountName }}
        </span>
      </div>
      <n-tag size="small" :type="statusTagType">{{ statusLabel }}</n-tag>
    </div>

    <p class="text-sm text-slate-200 line-clamp-3 mb-2">
      {{ post.caption || 'ไม่มีแคปชั่น' }}
    </p>

    <!-- Hashtags -->
    <div v-if="hashtagList.length" class="flex flex-wrap gap-1 mb-2">
      <n-tag v-for="tag in hashtagList.slice(0, 5)" :key="tag" size="tiny" type="info">
        #{{ tag.replace(/^#/, '') }}
      </n-tag>
      <span v-if="hashtagList.length > 5" class="text-xs text-gray-400">
        +{{ hashtagList.length - 5 }}
      </span>
    </div>

    <!-- Video thumbnail -->
    <div v-if="post.videoJob?.thumbnailUrl" class="mb-2">
      <img
        :src="post.videoJob.thumbnailUrl"
        alt="Video thumbnail"
        class="w-full h-32 object-cover rounded"
      />
    </div>

    <!-- Metrics (if published) -->
    <div v-if="post.status === 'published'" class="grid grid-cols-4 gap-1 text-center text-xs text-gray-500 mb-2">
      <div>
        <div class="font-semibold text-gray-700">{{ formatCount(post.viewCount) }}</div>
        <div>Views</div>
      </div>
      <div>
        <div class="font-semibold text-gray-700">{{ formatCount(post.likeCount) }}</div>
        <div>Likes</div>
      </div>
      <div>
        <div class="font-semibold text-gray-700">{{ formatCount(post.shareCount) }}</div>
        <div>Shares</div>
      </div>
      <div>
        <div class="font-semibold text-gray-700">{{ formatCount(post.commentCount) }}</div>
        <div>Comments</div>
      </div>
    </div>

    <!-- Error message -->
    <n-alert v-if="post.errorMessage" type="error" size="small" class="mb-2">
      {{ post.errorMessage }}
    </n-alert>

    <template #footer>
      <div class="flex items-center justify-between">
        <span class="text-xs text-gray-400">
          <template v-if="post.publishedAt">
            เผยแพร่: {{ new Date(post.publishedAt).toLocaleString('th-TH') }}
          </template>
          <template v-else-if="post.scheduledAt">
            ตั้งเวลา: {{ new Date(post.scheduledAt).toLocaleString('th-TH') }}
          </template>
          <template v-else>
            สร้าง: {{ new Date(post.createdAt).toLocaleString('th-TH') }}
          </template>
        </span>
        <div class="flex gap-1">
          <n-button
            v-if="post.status === 'draft'"
            size="tiny"
            type="primary"
            @click="$emit('publish', post.id)"
          >
            เผยแพร่
          </n-button>
          <n-button
            v-if="post.status !== 'published'"
            size="tiny"
            type="error"
            quaternary
            @click="$emit('delete', post.id)"
          >
            ลบ
          </n-button>
        </div>
      </div>
    </template>
  </n-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Post } from '@/types/post.d'

const props = defineProps<{
  post: Post
}>()

defineEmits<{
  (e: 'publish', id: number): void
  (e: 'delete', id: number): void
}>()

const hashtagList = computed(() => {
  const h = props.post.hashtags
  if (Array.isArray(h)) return h
  return []
})

const platformTagType = computed(() => {
  switch (props.post.platform) {
    case 'tiktok': return 'default'
    case 'facebook': return 'info'
    case 'instagram': return 'warning'
    case 'youtube': return 'error'
    default: return 'default'
  }
})

const statusTagType = computed(() => {
  switch (props.post.status) {
    case 'published': return 'success'
    case 'scheduled': return 'info'
    case 'failed': return 'error'
    default: return 'default'
  }
})

const statusLabel = computed(() => {
  switch (props.post.status) {
    case 'draft': return 'แบบร่าง'
    case 'scheduled': return 'ตั้งเวลา'
    case 'published': return 'เผยแพร่แล้ว'
    case 'failed': return 'ล้มเหลว'
    default: return props.post.status
  }
})

function formatCount(n: number): string {
  if (!n) return '0'
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}
</script>
