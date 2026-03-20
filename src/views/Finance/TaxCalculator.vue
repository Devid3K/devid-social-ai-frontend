<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center gap-3">
      <n-button quaternary circle @click="$router.back()">
        <template #icon>
          <n-icon>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
          </n-icon>
        </template>
      </n-button>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Thai Income Tax Calculator</h1>
    </div>

    <n-alert v-if="financeStore.error" type="error" :title="financeStore.error" closable />

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Calculator form -->
      <n-card title="Income Details">
        <n-form
          :model="formData"
          label-placement="top"
          @submit.prevent="handleCalculate"
        >
          <n-form-item label="Annual Gross Income (฿)">
            <n-input-number
              v-model:value="formData.grossIncome"
              :min="0"
              :step="10000"
              class="w-full"
              placeholder="500000"
            />
          </n-form-item>

          <n-form-item label="Employment Expense Deduction (฿)">
            <n-input-number
              v-model:value="formData.employmentDeduction"
              :min="0"
              :max="100000"
              :step="1000"
              class="w-full"
              placeholder="Auto-calculated (50% max 100,000)"
            />
          </n-form-item>

          <n-form-item label="Personal Deduction (฿)">
            <n-input-number
              v-model:value="formData.personalDeduction"
              :min="0"
              :step="10000"
              class="w-full"
              placeholder="60000"
            />
          </n-form-item>

          <n-form-item label="Other Deductions (฿)">
            <n-input-number
              v-model:value="formData.otherDeductions"
              :min="0"
              :step="10000"
              class="w-full"
              placeholder="0"
            />
          </n-form-item>

          <n-button
            type="primary"
            attr-type="submit"
            block
            :loading="financeStore.loading"
          >
            Calculate Tax
          </n-button>
        </n-form>
      </n-card>

      <!-- Results -->
      <div class="space-y-4">
        <n-card v-if="financeStore.taxCalculation" title="Tax Calculation Result">
          <div class="space-y-3">
            <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
              <span class="text-sm text-gray-600 dark:text-gray-400">Gross Income</span>
              <span class="font-medium">฿{{ (financeStore.taxCalculation as any).grossIncome?.toLocaleString() ?? 0 }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
              <span class="text-sm text-gray-600 dark:text-gray-400">Total Deductions</span>
              <span class="font-medium text-green-600">-฿{{ (financeStore.taxCalculation as any).totalDeductions?.toLocaleString() ?? 0 }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
              <span class="text-sm text-gray-600 dark:text-gray-400">Taxable Income</span>
              <span class="font-medium">฿{{ (financeStore.taxCalculation as any).taxableIncome?.toLocaleString() ?? 0 }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
              <span class="text-sm text-gray-600 dark:text-gray-400">Tax Rate</span>
              <span class="font-medium">{{ (financeStore.taxCalculation as any).taxRate ?? 0 }}%</span>
            </div>
            <div class="flex justify-between py-3 bg-red-50 dark:bg-red-900/20 rounded-lg px-3">
              <span class="font-semibold text-gray-900 dark:text-white">Estimated Tax</span>
              <span class="text-xl font-bold text-red-600">
                ฿{{ (financeStore.taxCalculation as any).taxAmount?.toLocaleString() ?? 0 }}
              </span>
            </div>
            <div class="flex justify-between py-2">
              <span class="text-sm text-gray-600 dark:text-gray-400">Net Income After Tax</span>
              <span class="font-semibold text-green-600">
                ฿{{ (financeStore.taxCalculation as any).netIncome?.toLocaleString() ?? 0 }}
              </span>
            </div>
          </div>
        </n-card>

        <n-card title="Thai Progressive Tax Rates (2024)" size="small">
          <n-data-table :columns="taxBracketColumns" :data="taxBrackets" :bordered="false" size="small" />
        </n-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { DataTableColumns } from 'naive-ui'
import { useFinanceStore } from '@/stores/finance'

const financeStore = useFinanceStore()

const formData = ref({
  grossIncome: null as number | null,
  employmentDeduction: null as number | null,
  personalDeduction: 60000,
  otherDeductions: null as number | null,
})

const taxBracketColumns: DataTableColumns = [
  { title: 'Taxable Income (฿)', key: 'range' },
  { title: 'Rate', key: 'rate' },
]

const taxBrackets = [
  { range: '0 - 150,000', rate: '0%' },
  { range: '150,001 - 300,000', rate: '5%' },
  { range: '300,001 - 500,000', rate: '10%' },
  { range: '500,001 - 750,000', rate: '15%' },
  { range: '750,001 - 1,000,000', rate: '20%' },
  { range: '1,000,001 - 2,000,000', rate: '25%' },
  { range: '2,000,001 - 5,000,000', rate: '30%' },
  { range: '5,000,001+', rate: '35%' },
]

async function handleCalculate() {
  if (!formData.value.grossIncome) return
  const totalDeductions =
    (formData.value.employmentDeduction ?? Math.min(formData.value.grossIncome * 0.5, 100000)) +
    (formData.value.personalDeduction ?? 60000) +
    (formData.value.otherDeductions ?? 0)

  await financeStore.calculateTax({
    grossIncome: formData.value.grossIncome,
    deductions: totalDeductions,
  })
}
</script>
