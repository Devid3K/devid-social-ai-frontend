<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between flex-wrap gap-3">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Finance</h1>
      <n-button type="primary" @click="$router.push({ name: ROUTE_NAMES.TAX_CALCULATOR })">
        Tax Calculator
      </n-button>
    </div>

    <n-alert v-if="financeStore.error" type="error" :title="financeStore.error" closable />

    <!-- Summary cards -->
    <div v-if="financeStore.summary" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <n-card size="small">
        <p class="text-xs text-gray-500 dark:text-gray-400">Total Income</p>
        <p class="text-xl font-bold text-green-600">฿{{ (financeStore.summary as any).totalIncome?.toLocaleString() ?? 0 }}</p>
      </n-card>
      <n-card size="small">
        <p class="text-xs text-gray-500 dark:text-gray-400">Total Expense</p>
        <p class="text-xl font-bold text-red-500">฿{{ (financeStore.summary as any).totalExpense?.toLocaleString() ?? 0 }}</p>
      </n-card>
      <n-card size="small">
        <p class="text-xs text-gray-500 dark:text-gray-400">Net Profit</p>
        <p class="text-xl font-bold text-indigo-600">฿{{ (financeStore.summary as any).netProfit?.toLocaleString() ?? 0 }}</p>
      </n-card>
      <n-card size="small">
        <p class="text-xs text-gray-500 dark:text-gray-400">Transactions</p>
        <p class="text-xl font-bold text-gray-900 dark:text-white">{{ financeStore.total }}</p>
      </n-card>
    </div>

    <!-- Chart -->
    <IncomeChart :data="financeStore.list" />

    <!-- Transactions table -->
    <TransactionTable
      :transactions="financeStore.list"
      :loading="financeStore.loading"
      :total="financeStore.total"
      :page="financeStore.page"
      :page-size="financeStore.limit"
      @page-change="handlePageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useFinanceStore } from '@/stores/finance'
import { ROUTE_NAMES } from '@/constants/routes'
import IncomeChart from '@/components/finance/income-chart.vue'
import TransactionTable from '@/components/finance/transaction-table.vue'

const financeStore = useFinanceStore()

onMounted(async () => {
  await Promise.all([financeStore.fetch(), financeStore.fetchSummary()])
})

function handlePageChange(page: number) {
  financeStore.fetch({ page })
}
</script>
