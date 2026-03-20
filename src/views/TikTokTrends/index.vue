<template>
  <div class="p-6 space-y-6">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">TikTok Trending Products</h1>

    <n-alert v-if="trendStore.error" type="error" :title="trendStore.error" closable />

    <!-- Data table -->
    <n-card>
      <n-data-table
        :columns="columns"
        :data="trendStore.tiktokProducts"
        :loading="trendStore.loading"
        :pagination="pagination"
        :bordered="false"
        size="small"
        @update:page="handlePageChange"
      />
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { computed, h, onMounted } from 'vue'
import { NTag } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { useTrendStore } from '@/stores/trend'
import type { TikTokProduct } from '@/types/trend.d'
import ViralScoreBadge from '@/components/common/viral-score-badge.vue'

const trendStore = useTrendStore()

const columns: DataTableColumns<TikTokProduct> = [
  { title: '#', key: 'rank', width: 60 },
  { title: 'Product Name', key: 'productName', ellipsis: { tooltip: true } },
  { title: 'Category', key: 'category', width: 120 },
  {
    title: 'Sales',
    key: 'sales',
    width: 100,
    render: (row) => (row.sales ?? 0).toLocaleString(),
  },
  {
    title: 'Revenue (฿)',
    key: 'revenue',
    width: 120,
    render: (row) => `฿${(row.revenue ?? 0).toLocaleString()}`,
  },
  {
    title: 'Viral Score',
    key: 'viralScore',
    width: 110,
    render: (row) =>
      row.viralScore != null
        ? h(ViralScoreBadge, { score: row.viralScore })
        : '-',
  },
  {
    title: 'Tags',
    key: 'hashtags',
    render: (row) =>
      (row.hashtags ?? [])
        .slice(0, 3)
        .map((tag: string) => h(NTag, { size: 'tiny', type: 'info', class: 'mr-1' }, () => `#${tag}`)),
  },
]

const pagination = computed(() => ({
  page: trendStore.page,
  pageSize: trendStore.limit,
  itemCount: trendStore.total,
  showSizePicker: false,
}))

onMounted(() => {
  trendStore.fetchTikTokProducts()
})

function handlePageChange(page: number) {
  trendStore.fetchTikTokProducts({ page })
}
</script>
