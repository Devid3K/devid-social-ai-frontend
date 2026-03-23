<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between flex-wrap gap-3">
      <h1 class="text-2xl font-bold text-gray-900">Auto Post</h1>
      <n-button type="primary" @click="$router.push({ name: ROUTE_NAMES.NEW_POST })">
        + สร้างโพสต์ใหม่
      </n-button>
    </div>

    <n-alert v-if="postStore.error" type="error" :title="postStore.error" closable />

    <!-- Filter tabs -->
    <n-tabs v-model:value="activeTab" type="segment" animated @update:value="handleTabChange">
      <n-tab-pane name="all" tab="ทั้งหมด" />
      <n-tab-pane name="draft" tab="แบบร่าง" />
      <n-tab-pane name="scheduled" tab="ตั้งเวลา" />
      <n-tab-pane name="published" tab="เผยแพร่แล้ว" />
      <n-tab-pane name="failed" tab="ล้มเหลว" />
    </n-tabs>

    <!-- Posts grid -->
    <n-card>
      <LoadingSpinner v-if="postStore.loading" />
      <div v-else-if="postStore.list.length === 0" class="text-center py-12 text-gray-400 text-sm">
        ยังไม่มีโพสต์ — สร้างโพสต์ใหม่เลย!
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <PostPreviewCard
          v-for="post in postStore.list"
          :key="post.id"
          :post="post"
          @publish="handlePublish"
          @delete="handleDelete"
        />
      </div>
      <div class="flex justify-center mt-4">
        <n-pagination
          v-if="postStore.total > postStore.limit"
          v-model:page="postStore.page"
          :item-count="postStore.total"
          :page-size="postStore.limit"
          @update:page="handlePageChange"
        />
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePostStore } from '@/stores/post'
import { ROUTE_NAMES } from '@/constants/routes'
import PostPreviewCard from '@/components/post/post-preview-card.vue'
import LoadingSpinner from '@/components/common/loading-spinner.vue'

const postStore = usePostStore()
const activeTab = ref('all')

onMounted(() => {
  postStore.fetch()
})

function handleTabChange(tab: string) {
  const status = tab === 'all' ? undefined : tab
  postStore.fetch({ page: 1, status })
}

function handlePageChange(page: number) {
  const status = activeTab.value === 'all' ? undefined : activeTab.value
  postStore.fetch({ page, status })
}

async function handlePublish(id: number) {
  await postStore.publish(id)
}

async function handleDelete(id: number) {
  await postStore.delete(id)
}
</script>
