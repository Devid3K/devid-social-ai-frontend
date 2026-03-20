<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between flex-wrap gap-3">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Auto Post</h1>
      <n-button type="primary" @click="$router.push({ name: ROUTE_NAMES.NEW_POST })">
        + New Post
      </n-button>
    </div>

    <n-alert v-if="postStore.error" type="error" :title="postStore.error" closable />

    <!-- Filter tabs -->
    <n-tabs v-model:value="activeTab" type="segment" animated @update:value="handleTabChange">
      <n-tab-pane name="all" tab="All" />
      <n-tab-pane name="draft" tab="Drafts" />
      <n-tab-pane name="scheduled" tab="Scheduled" />
      <n-tab-pane name="published" tab="Published" />
    </n-tabs>

    <!-- Posts data table -->
    <n-card>
      <LoadingSpinner v-if="postStore.loading" />
      <div v-else-if="postStore.list.length === 0" class="text-center py-12 text-gray-400 text-sm">
        No posts found.
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <PostPreviewCard
          v-for="post in postStore.list"
          :key="post.id"
          :post="post"
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
import { useRouter } from 'vue-router'
import { usePostStore } from '@/stores/post'
import { ROUTE_NAMES } from '@/constants/routes'
import PostPreviewCard from '@/components/post/post-preview-card.vue'
import LoadingSpinner from '@/components/common/loading-spinner.vue'

const postStore = usePostStore()
const router = useRouter()
const activeTab = ref('all')

onMounted(() => {
  postStore.fetch()
})

function handleTabChange(tab: string) {
  const status = tab === 'all' ? undefined : tab
  postStore.fetch({ page: 1, status })
}

function handlePageChange(page: number) {
  postStore.fetch({ page })
}
</script>
