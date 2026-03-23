<template>
  <n-card title="รายการทั้งหมด">
    <n-data-table
      :columns="columns"
      :data="transactions"
      :loading="loading"
      :pagination="pagination"
      :bordered="false"
      size="small"
      @update:page="$emit('page-change', $event)"
    />
  </n-card>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import { NTag, NButton } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import type { Transaction } from '@/types/finance.d'

const props = defineProps<{
  transactions: Transaction[]
  loading?: boolean
  total?: number
  page?: number
  pageSize?: number
}>()

const emit = defineEmits<{
  (e: 'page-change', page: number): void
  (e: 'delete', id: number): void
}>()

const typeTagMap: Record<string, 'success' | 'error' | 'info' | 'warning'> = {
  income: 'success',
  expense: 'error',
  commission: 'info',
  withdrawal: 'warning',
  transfer: 'default' as any,
}

const typeLabel: Record<string, string> = {
  income: 'รายรับ',
  expense: 'รายจ่าย',
  commission: 'ค่าคอม',
  withdrawal: 'ถอนเงิน',
  transfer: 'โอน',
}

const columns: DataTableColumns<Transaction> = [
  {
    title: 'วันที่',
    key: 'transactionDate',
    width: 120,
    render: (row) => new Date(row.transactionDate ?? row.createdAt).toLocaleDateString('th-TH'),
  },
  {
    title: 'รายละเอียด',
    key: 'description',
    ellipsis: { tooltip: true },
    render: (row) => row.description ?? '-',
  },
  {
    title: 'หมวด',
    key: 'category',
    width: 120,
    render: (row) => row.category ?? '-',
  },
  {
    title: 'ประเภท',
    key: 'type',
    width: 100,
    render: (row) =>
      h(NTag, { type: typeTagMap[row.type] ?? 'default', size: 'small' }, () => typeLabel[row.type] ?? row.type),
  },
  {
    title: 'จำนวน (฿)',
    key: 'amount',
    width: 120,
    render: (row) => {
      const amount = Number(row.amount ?? 0)
      const color = row.type === 'expense' ? 'text-red-500' : 'text-green-600'
      return h('span', { class: `font-medium ${color}` }, `฿${amount.toLocaleString()}`)
    },
  },
  {
    title: '',
    key: 'actions',
    width: 60,
    render: (row) =>
      h(NButton, { size: 'tiny', type: 'error', quaternary: true, onClick: () => emit('delete', row.id) }, () => 'ลบ'),
  },
]

const pagination = computed(() => ({
  page: props.page ?? 1,
  pageSize: props.pageSize ?? 20,
  itemCount: props.total ?? props.transactions.length,
  showSizePicker: false,
}))
</script>
