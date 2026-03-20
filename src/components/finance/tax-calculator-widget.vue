<template>
  <n-card title="Quick Tax Calculator">
    <n-form label-placement="top" @submit.prevent="handleCalculate">
      <n-form-item label="Annual Income (฿)">
        <n-input-number
          v-model:value="grossIncome"
          :min="0"
          :step="10000"
          class="w-full"
          placeholder="e.g. 500000"
        />
      </n-form-item>
      <n-form-item label="Deductions (฿)">
        <n-input-number
          v-model:value="deductions"
          :min="0"
          :step="10000"
          class="w-full"
          placeholder="e.g. 100000"
        />
      </n-form-item>
      <n-button type="primary" attr-type="submit" :loading="loading" block>
        Calculate Tax
      </n-button>
    </n-form>
    <div v-if="result" class="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
      <p class="text-sm text-gray-600 dark:text-gray-300">Estimated Tax:</p>
      <p class="text-xl font-bold text-green-700 dark:text-green-400">
        ฿{{ result.taxAmount?.toLocaleString() ?? '-' }}
      </p>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useFinanceStore } from '@/stores/finance'
import type { TaxCalculation } from '@/types/finance.d'

const financeStore = useFinanceStore()
const grossIncome = ref<number | null>(null)
const deductions = ref<number | null>(null)
const loading = ref(false)
const result = ref<TaxCalculation | null>(null)

async function handleCalculate() {
  if (!grossIncome.value) return
  loading.value = true
  try {
    result.value = await financeStore.calculateTax({
      grossIncome: grossIncome.value,
      deductions: deductions.value ?? 0,
    })
  } finally {
    loading.value = false
  }
}
</script>
