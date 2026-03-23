<template>
  <div class="p-6 space-y-6">
    <h1 class="text-2xl font-bold text-gray-900">ประวัติ Prompt</h1>

    <n-alert v-if="promptHistoryStore.error" type="error" :title="promptHistoryStore.error" closable />

    <!-- Stats cards -->
    <div v-if="promptHistoryStore.stats" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      <n-card size="small">
        <p class="text-xs text-gray-500">Prompt ทั้งหมด</p>
        <p class="text-xl font-bold text-gray-900">{{ promptHistoryStore.stats.totalPrompts }}</p>
      </n-card>
      <n-card size="small">
        <p class="text-xs text-gray-500">สร้างบทละคร</p>
        <p class="text-xl font-bold text-rose-400">{{ promptHistoryStore.stats.scriptPrompts }}</p>
      </n-card>
      <n-card size="small">
        <p class="text-xs text-gray-500">สร้างวิดีโอ</p>
        <p class="text-xl font-bold text-rose-400">{{ promptHistoryStore.stats.videoPrompts }}</p>
      </n-card>
      <n-card size="small">
        <p class="text-xs text-gray-500">โพสต์</p>
        <p class="text-xl font-bold text-green-600">{{ promptHistoryStore.stats.postPrompts }}</p>
      </n-card>
      <n-card size="small">
        <p class="text-xs text-gray-500">7 วันล่าสุด</p>
        <p class="text-xl font-bold text-orange-500">{{ promptHistoryStore.stats.recentWeekActivity }}</p>
      </n-card>
    </div>

    <!-- Filter -->
    <div class="flex gap-3 items-center flex-wrap">
      <n-select
        v-model:value="moduleFilter"
        :options="moduleOptions"
        placeholder="กรองตามโมดูล"
        clearable
        class="w-48"
        @update:value="handleFilter"
      />
    </div>

    <!-- Data table -->
    <n-card>
      <n-data-table
        :columns="columns"
        :data="promptHistoryStore.list"
        :loading="promptHistoryStore.loading"
        :pagination="pagination"
        :bordered="false"
        size="small"
        @update:page="handlePageChange"
      />
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h, onMounted } from 'vue'
import { NButton, NTag } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { usePromptHistoryStore } from '@/stores/prompt-history'
import type { PromptHistoryItem } from '@/stores/prompt-history'

const promptHistoryStore = usePromptHistoryStore()
const moduleFilter = ref<string | null>(null)

const moduleOptions = [
  { label: 'บทละคร (Script)', value: 'script' },
  { label: 'วิดีโอ (Video)', value: 'video' },
  { label: 'โพสต์ (Post)', value: 'post' },
]

const columns: DataTableColumns<PromptHistoryItem> = [
  {
    title: 'วันที่',
    key: 'createdAt',
    width: 160,
    render: (row) => new Date(row.createdAt).toLocaleString('th-TH'),
  },
  {
    title: 'โมดูล',
    key: 'module',
    width: 120,
    render: (row) => {
      if (row.aiScript) return h(NTag, { size: 'small', type: 'info' }, () => 'Script')
      if (row.videoJob) return h(NTag, { size: 'small', type: 'warning' }, () => 'Video')
      if (row.post) return h(NTag, { size: 'small', type: 'success' }, () => 'Post')
      return h(NTag, { size: 'small' }, () => 'Other')
    },
  },
  {
    title: 'Prompt',
    key: 'promptText',
    ellipsis: { tooltip: true },
    render: (row) => row.promptText?.slice(0, 100) ?? '-',
  },
  {
    title: 'Views',
    key: 'viewCount',
    width: 80,
    render: (row) => String(row.viewCount ?? 0),
  },
  {
    title: 'Revenue',
    key: 'revenue',
    width: 100,
    render: (row) => `฿${Number(row.revenue ?? 0).toLocaleString()}`,
  },
  {
    title: '',
    key: 'actions',
    width: 80,
    render: (row) =>
      h(NButton, { size: 'tiny', type: 'error', quaternary: true, onClick: () => promptHistoryStore.delete(row.id) }, () => 'ลบ'),
  },
]

const pagination = computed(() => ({
  page: promptHistoryStore.page,
  pageSize: promptHistoryStore.limit,
  itemCount: promptHistoryStore.total,
  showSizePicker: false,
}))

onMounted(async () => {
  await Promise.all([promptHistoryStore.fetch(), promptHistoryStore.fetchStats()])
})

function handleFilter(value: string | null) {
  promptHistoryStore.fetch({ page: 1, module: value ?? undefined })
}

function handlePageChange(page: number) {
  promptHistoryStore.fetch({ page, module: moduleFilter.value ?? undefined })
}
</script>
