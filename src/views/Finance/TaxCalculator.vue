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
      <h1 class="text-2xl font-bold text-gray-900">คำนวณภาษีเงินได้บุคคลธรรมดา</h1>
    </div>

    <n-alert v-if="financeStore.error" type="error" :title="financeStore.error" closable />

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Calculator form -->
      <n-card title="ข้อมูลรายได้">
        <n-form :model="formData" label-placement="top" @submit.prevent="handleCalculate">
          <n-form-item label="รายได้รวมทั้งปี (฿)">
            <n-input-number
              v-model:value="formData.grossIncome"
              :min="0"
              :step="10000"
              class="w-full"
              placeholder="500,000"
            />
          </n-form-item>

          <n-form-item label="ค่าใช้จ่ายหักเงินได้ (฿) — 50% สูงสุด 100,000">
            <n-input-number
              v-model:value="formData.employmentDeduction"
              :min="0"
              :max="100000"
              :step="1000"
              class="w-full"
              placeholder="คำนวณอัตโนมัติ"
            />
          </n-form-item>

          <n-form-item label="ลดหย่อนส่วนตัว (฿)">
            <n-input-number
              v-model:value="formData.personalDeduction"
              :min="0"
              :step="10000"
              class="w-full"
              placeholder="60,000"
            />
          </n-form-item>

          <n-form-item label="ลดหย่อนอื่นๆ (฿)">
            <n-input-number
              v-model:value="formData.otherDeductions"
              :min="0"
              :step="10000"
              class="w-full"
              placeholder="0"
            />
          </n-form-item>

          <n-button type="primary" attr-type="submit" block :loading="financeStore.loading">
            คำนวณภาษี
          </n-button>
        </n-form>
      </n-card>

      <!-- Results -->
      <div class="space-y-4">
        <n-card v-if="taxResult" title="ผลการคำนวณ">
          <div class="space-y-3">
            <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
              <span class="text-sm text-gray-500">รายได้รวม</span>
              <span class="font-medium">฿{{ taxResult.grossIncome?.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
              <span class="text-sm text-gray-500">หักค่าใช้จ่าย</span>
              <span class="font-medium text-blue-600">-฿{{ taxResult.deductions?.employment?.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
              <span class="text-sm text-gray-500">หักลดหย่อนส่วนตัว</span>
              <span class="font-medium text-blue-600">-฿{{ taxResult.deductions?.personal?.toLocaleString() }}</span>
            </div>
            <div v-if="taxResult.deductions?.other" class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
              <span class="text-sm text-gray-500">หักลดหย่อนอื่นๆ</span>
              <span class="font-medium text-blue-600">-฿{{ taxResult.deductions?.other?.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
              <span class="text-sm text-gray-500">รายได้สุทธิ (เงินได้พึงประเมิน)</span>
              <span class="font-medium">฿{{ taxResult.taxableIncome?.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
              <span class="text-sm text-gray-500">อัตราภาษีเฉลี่ย</span>
              <span class="font-medium">{{ taxResult.effectiveRate }}%</span>
            </div>
            <div class="flex justify-between py-3 bg-red-50 dark:bg-red-900/20 rounded-lg px-3">
              <span class="font-semibold text-gray-900">ภาษีที่ต้องชำระ</span>
              <span class="text-xl font-bold text-red-600">
                ฿{{ taxResult.taxAmount?.toLocaleString() }}
              </span>
            </div>
            <div class="flex justify-between py-3 bg-green-50 dark:bg-green-900/20 rounded-lg px-3">
              <span class="font-semibold text-gray-900">เงินได้หลังหักภาษี</span>
              <span class="text-xl font-bold text-green-600">
                ฿{{ taxResult.netIncome?.toLocaleString() }}
              </span>
            </div>
          </div>

          <!-- Bracket breakdown -->
          <div v-if="taxResult.brackets?.length" class="mt-4">
            <h4 class="text-sm font-semibold mb-2 text-gray-700">รายละเอียดขั้นภาษี</h4>
            <div v-for="(b, i) in taxResult.brackets" :key="i" class="flex justify-between text-xs py-1 text-gray-500">
              <span>฿{{ b.min.toLocaleString() }} - {{ b.max ? `฿${b.max.toLocaleString()}` : 'ขึ้นไป' }} ({{ (b.rate * 100).toFixed(0) }}%)</span>
              <span class="font-medium">฿{{ b.taxAmount.toLocaleString() }}</span>
            </div>
          </div>
        </n-card>

        <n-card title="อัตราภาษีเงินได้แบบขั้นบันได (2024)" size="small">
          <n-data-table :columns="taxBracketColumns" :data="taxBrackets" :bordered="false" size="small" />
        </n-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { DataTableColumns } from 'naive-ui'
import { useFinanceStore } from '@/stores/finance'

const financeStore = useFinanceStore()

const formData = ref({
  grossIncome: null as number | null,
  employmentDeduction: null as number | null,
  personalDeduction: 60000,
  otherDeductions: null as number | null,
})

const taxResult = computed(() => financeStore.taxCalculation)

const taxBracketColumns: DataTableColumns = [
  { title: 'เงินได้สุทธิ (฿)', key: 'range' },
  { title: 'อัตรา', key: 'rate' },
]

const taxBrackets = [
  { range: '0 - 150,000', rate: '0% (ยกเว้น)' },
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
  await financeStore.calculateTax({
    grossIncome: formData.value.grossIncome,
    employmentDeduction: formData.value.employmentDeduction ?? undefined,
    personalDeduction: formData.value.personalDeduction ?? undefined,
    otherDeductions: formData.value.otherDeductions ?? undefined,
  })
}
</script>
