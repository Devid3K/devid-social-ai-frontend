<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between flex-wrap gap-3">
      <h1 class="text-2xl font-bold text-gray-900">การเงิน</h1>
      <div class="flex gap-2">
        <n-button @click="showAddModal = true">+ เพิ่มรายการ</n-button>
        <n-button type="primary" @click="$router.push({ name: ROUTE_NAMES.TAX_CALCULATOR })">
          คำนวณภาษี
        </n-button>
      </div>
    </div>

    <n-alert v-if="financeStore.error" type="error" :title="financeStore.error" closable />

    <!-- Summary cards -->
    <div v-if="financeStore.summary" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <n-card size="small">
        <p class="text-xs text-gray-500">รายรับทั้งหมด</p>
        <p class="text-xl font-bold text-green-600">฿{{ financeStore.summary.totalIncome?.toLocaleString() ?? 0 }}</p>
      </n-card>
      <n-card size="small">
        <p class="text-xs text-gray-500">รายจ่ายทั้งหมด</p>
        <p class="text-xl font-bold text-red-500">฿{{ financeStore.summary.totalExpense?.toLocaleString() ?? 0 }}</p>
      </n-card>
      <n-card size="small">
        <p class="text-xs text-gray-500">กำไรสุทธิ</p>
        <p class="text-xl font-bold text-rose-400">฿{{ financeStore.summary.netProfit?.toLocaleString() ?? 0 }}</p>
      </n-card>
      <n-card size="small">
        <p class="text-xs text-gray-500">รายการทั้งหมด</p>
        <p class="text-xl font-bold text-gray-900">{{ financeStore.summary.totalTransactions ?? 0 }}</p>
      </n-card>
    </div>

    <!-- Filter -->
    <div class="flex gap-3 items-center flex-wrap">
      <n-select
        v-model:value="typeFilter"
        :options="typeOptions"
        placeholder="ประเภท"
        clearable
        class="w-40"
        @update:value="handleTypeChange"
      />
      <n-date-picker
        v-model:value="dateRange"
        type="daterange"
        clearable
        @update:value="handleDateChange"
      />
    </div>

    <!-- Chart placeholder -->
    <IncomeChart :data="financeStore.list" />

    <!-- Transactions table -->
    <TransactionTable
      :transactions="financeStore.list"
      :loading="financeStore.loading"
      :total="financeStore.total"
      :page="financeStore.page"
      :page-size="financeStore.limit"
      @page-change="handlePageChange"
      @delete="handleDelete"
    />

    <!-- Add Transaction Modal -->
    <n-modal v-model:show="showAddModal" preset="card" title="เพิ่มรายการใหม่" class="max-w-md">
      <n-form :model="newTx" label-placement="top">
        <n-form-item label="ประเภท">
          <n-select
            v-model:value="newTx.type"
            :options="[
              { label: 'รายรับ', value: 'income' },
              { label: 'รายจ่าย', value: 'expense' },
              { label: 'ค่าคอมมิชชั่น', value: 'commission' },
            ]"
          />
        </n-form-item>
        <n-form-item label="จำนวน (บาท)">
          <n-input-number v-model:value="newTx.amount" :min="0" class="w-full" />
        </n-form-item>
        <n-form-item label="รายละเอียด">
          <n-input v-model:value="newTx.description" />
        </n-form-item>
        <n-form-item label="หมวดหมู่">
          <n-select
            v-model:value="newTx.category"
            :options="categoryOptions"
            clearable
          />
        </n-form-item>
        <n-form-item label="วันที่">
          <n-date-picker v-model:value="newTx.transactionDate" type="date" class="w-full" />
        </n-form-item>
        <n-button type="primary" block :loading="financeStore.loading" @click="handleAddTransaction">
          บันทึก
        </n-button>
      </n-form>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useFinanceStore } from '@/stores/finance'
import { ROUTE_NAMES } from '@/constants/routes'
import IncomeChart from '@/components/finance/income-chart.vue'
import TransactionTable from '@/components/finance/transaction-table.vue'

const financeStore = useFinanceStore()
const showAddModal = ref(false)
const typeFilter = ref<string | null>(null)
const dateRange = ref<[number, number] | null>(null)

const typeOptions = [
  { label: 'รายรับ', value: 'income' },
  { label: 'รายจ่าย', value: 'expense' },
  { label: 'ค่าคอม', value: 'commission' },
]

const categoryOptions = [
  { label: 'Brand Deal', value: 'brand_deal' },
  { label: 'Ad Revenue', value: 'ad_revenue' },
  { label: 'Merchandise', value: 'merchandise' },
  { label: 'Subscription', value: 'subscription' },
  { label: 'อื่นๆ', value: 'other' },
]

const newTx = ref({
  type: 'income' as string,
  amount: 0,
  description: '',
  category: null as string | null,
  transactionDate: Date.now(),
})

onMounted(async () => {
  await Promise.all([financeStore.fetch(), financeStore.fetchSummary()])
})

function buildDateParams() {
  if (!dateRange.value) return {}
  return {
    startDate: new Date(dateRange.value[0]).toISOString(),
    endDate: new Date(dateRange.value[1]).toISOString(),
  }
}

function handleTypeChange() {
  financeStore.fetch({ page: 1, type: typeFilter.value ?? undefined, ...buildDateParams() })
}

function handleDateChange() {
  financeStore.fetch({ page: 1, type: typeFilter.value ?? undefined, ...buildDateParams() })
}

function handlePageChange(page: number) {
  financeStore.fetch({ page, type: typeFilter.value ?? undefined, ...buildDateParams() })
}

async function handleDelete(id: number) {
  await financeStore.delete(id)
  await financeStore.fetchSummary()
}

async function handleAddTransaction() {
  await financeStore.create({
    type: newTx.value.type as any,
    amount: newTx.value.amount,
    description: newTx.value.description,
    category: newTx.value.category,
    transactionDate: new Date(newTx.value.transactionDate).toISOString(),
  } as any)
  showAddModal.value = false
  newTx.value = { type: 'income', amount: 0, description: '', category: null, transactionDate: Date.now() }
  await financeStore.fetchSummary()
}
</script>
