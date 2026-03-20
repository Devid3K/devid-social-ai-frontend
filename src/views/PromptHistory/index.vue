<template>
  <div class="p-6 space-y-6">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Prompt History</h1>

    <n-alert v-if="promptHistoryStore.error" type="error" :title="promptHistoryStore.error" closable />

    <!-- Stats -->
    <div v-if="promptHistoryStore.stats" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <n-card v-for="(val, key) in promptHistoryStore.stats" :key="key" size="small">
        <p class="text-xs text-gray-500 dark:text-gray-400 capitalize">{{ key }}</p>
        <p class="text-xl font-bold text-gray-900 dark:text-white">{{ val }}</p>
      </n-card>
    </div>

    <!-- Filter by module -->
    <div class="flex gap-3 items-center">
      <n-input
        v-model:value="moduleFilter"
        placeholder="Filter by module..."
        clearable
        class="max-w-xs"
        @change="handleFilter"
      />
      <n-button @click="handleFilter">Filter</n-button>
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
const moduleFilter = ref('')

const columns: DataTableColumns<PromptHistoryItem> = [
  {
    title: 'Date',
    key: 'createdAt',
    width: 150,
    render: (row) => new Date(row.createdAt).toLocaleString(),
  },
  {
    title: 'Module',
    key: 'module',
    width: 120,
    render: (row) => h(NTag, { size: 'small', type: 'info' }, () => row.module),
  },
  {
    title: 'Prompt',
    key: 'prompt',
    ellipsis: { tooltip: true },
  },
  {
    title: 'Tokens',
    key: 'tokensUsed',
    width: 80,
  },
  {
    title: '',
    key: 'actions',
    width: 80,
    render: (row) =>
      h(NButton, { size: 'tiny', type: 'error', onClick: () => promptHistoryStore.delete(row.id) }, () => 'Delete'),
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

function handleFilter() {
  promptHistoryStore.fetch({ page: 1, module: moduleFilter.value || undefined })
}

function handlePageChange(page: number) {
  promptHistoryStore.fetch({ page, module: moduleFilter.value || undefined })
}
</script>
