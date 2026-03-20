<template>
  <n-card title="Platform Comparison">
    <n-data-table
      :columns="columns"
      :data="tableData"
      :loading="loading"
      :bordered="false"
      size="small"
    />
  </n-card>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import type { DataTableColumns } from 'naive-ui'
import { Platform } from '@/enums'
import PlatformIcon from '@/components/common/platform-icon.vue'

const props = defineProps<{
  data?: Record<string, unknown>[]
  loading?: boolean
}>()

const columns: DataTableColumns = [
  {
    title: 'Platform',
    key: 'platform',
    render: (row) =>
      h(PlatformIcon, { platform: row.platform as Platform, showLabel: true }),
  },
  { title: 'Followers', key: 'followers' },
  { title: 'Views', key: 'views' },
  { title: 'Revenue (฿)', key: 'revenue' },
  { title: 'Engagement %', key: 'engagement' },
]

const tableData = computed(() => props.data ?? [])
</script>
