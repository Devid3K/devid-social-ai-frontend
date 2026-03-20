<template>
  <n-card title="Transactions">
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
import { NTag } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import type { Transaction } from '@/types/finance.d'
import { TransactionType } from '@/enums'

const props = defineProps<{
  transactions: Transaction[]
  loading?: boolean
  total?: number
  page?: number
  pageSize?: number
}>()

defineEmits<{
  (e: 'page-change', page: number): void
}>()

const columns: DataTableColumns<Transaction> = [
  {
    title: 'Date',
    key: 'date',
    render: (row) => new Date(row.date ?? row.createdAt ?? '').toLocaleDateString(),
  },
  { title: 'Description', key: 'description' },
  {
    title: 'Type',
    key: 'type',
    render: (row) =>
      h(NTag, { type: row.type === TransactionType.INCOME ? 'success' : 'error', size: 'small' }, () => row.type),
  },
  {
    title: 'Amount (฿)',
    key: 'amount',
    render: (row) => `฿${(row.amount ?? 0).toLocaleString()}`,
  },
]

const pagination = computed(() => ({
  page: props.page ?? 1,
  pageSize: props.pageSize ?? 20,
  itemCount: props.total ?? props.transactions.length,
  showSizePicker: false,
}))
</script>
