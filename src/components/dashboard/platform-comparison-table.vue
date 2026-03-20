<template>
  <n-card title="เปรียบเทียบแพลตฟอร์ม">
    <n-data-table
      :columns="columns"
      :data="tableData"
      :loading="loading"
      :bordered="false"
      size="small"
      :pagination="false"
    />
  </n-card>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import type { DataTableColumns } from 'naive-ui'
import { Platform } from '@/enums'
import { formatNumber, formatCurrency } from '@/utils/format'
import PlatformIcon from '@/components/common/platform-icon.vue'

const props = defineProps<{
  data?: Record<string, unknown>[]
  loading?: boolean
}>()

const columns: DataTableColumns = [
  {
    title: 'แพลตฟอร์ม',
    key: 'platform',
    render: (row) =>
      h(PlatformIcon, { platform: row.platform as Platform, showLabel: true }),
  },
  {
    title: 'ผู้ติดตาม',
    key: 'followers',
    align: 'right',
    render: (row) => h('span', {}, formatNumber(Number(row.followers ?? 0))),
  },
  {
    title: 'ยอดเข้าชม',
    key: 'views',
    align: 'right',
    render: (row) => h('span', {}, formatNumber(Number(row.views ?? 0))),
  },
  {
    title: 'Engagement %',
    key: 'engagement',
    align: 'right',
    render: (row) => h('span', {}, `${Number(row.engagement ?? 0).toFixed(2)}%`),
  },
  {
    title: 'รายได้',
    key: 'revenue',
    align: 'right',
    render: (row) => h('span', { class: 'text-green-600 dark:text-green-400 font-medium' }, formatCurrency(Number(row.revenue ?? 0))),
  },
]

const tableData = computed(() => props.data ?? [])
</script>
